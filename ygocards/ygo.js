const request = require('request-promise-native');
const sprintf = require('sprintf-js').sprintf;
const fs = require('fs');

// Base web request paramters
var baseUrl = 'https://yugipedia.com/api.php?action=ask&query=[[Class 1::Official]] '
.concat('[[English name::~%1$s*]]|?Passcode')
.concat('|?Lore|?Card_image|?Card_type|?Primary_type|?Property')
.concat('|limit=%2$s|offset=%3$s|sort=English name&format=json');
var baseLimit = 2500;

// List of characters used in english name search query
const alphanumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// "Lock" each alphanumeric character until all the web requests are done
var locks = { count: 0, length: alphanumeric.length, total: 0, files: {} };

// Missing printouts values and duplicate printout values
var missing = {};
var printValues = {};

// Final file name
const fileName = "ygo.json";

/**
 * Map printsouts into a new object with printout names and values
 * @param {Object} printouts Query params results array
 * @param {String} printKey Printouts key index
 * @param {String} resultKey Query results key index (card name)
 */
const mapPrintouts = function(printouts, printKey, resultKey) {
    let prints = printouts[printKey];
    let ob = new Object();

    // Check printout is array and if it's not empty
    if(typeof prints != "undefined"
    && prints != null
    && prints.length != null
    && prints.length > 0) {
        // The expected value should be at 0
        // remove spaces from key and convert to lower case
        let print = prints[0];
        printKey = printKey.toLocaleLowerCase().replace(/\ /g, '');
        
        // If it's null, set missing print
        if(typeof print == "undefined"
        || print == null) {
            if(typeof missing[printKey] == "undefined"
            || missing[printKey] == null) {
                missing[printKey] = 0;
            }

            console.log(sprintf("%1$s printout %2$s empty", resultKey, printKey));
            missing[printKey] = missing[printKey] + 1;
            return ob;
        }

        // If it's not an array, but an object, try the "fulltext" property (card type case)
        if(typeof prints[0] == "object"
        && prints[0] != null) {
            // Check for null or undefined and add to missing
            if(typeof prints[0].fulltext == "undefined"
            || prints[0].fulltext == null) {

                if(typeof missing[printKey] == "undefined"
                || missing[printKey] == null) {
                    missing[printKey] = 0;
                }

                console.log(sprintf("%1$s fulltext printout %2$s empty", resultKey, printKey));
                missing[printKey] = missing[printKey] + 1;
                return ob;
            }
            // Otherwise, set new print
            print = prints[0].fulltext;
        }

        // Remove quote and wiki stuff
        print = print.replace(/\'/g, "");
        print = print.replace(/\"/g, "");
        print = print.replace(/\[\[([^\]]*)\|([^\]]*)\]\]/g, "$2");
        print = print.replace(/\[/g, "");
        print = print.replace(/\]/g, "");
        ob[printKey] = print;


        // Add print key if it's not on printouts values object
        if(typeof printValues[printKey] == "undefined"
        || printValues[printKey] == null) {
            printValues[printKey] = { duplicate: false };
        }

        // If the value is alredy on object, set to duplicate and set the value to duplicate
        if(typeof printValues[printKey][print] != "undefined"
        && printValues[printKey][print] != null) {
            printValues[printKey].duplicate = true;
            printValues[printKey][print] = true;
        // Otherwise, set the value as used (once)
        } else {
            printValues[printKey][print] =  false;
        }
    }
    else {
        // If the printout is undefined or it's not an array, set missing
        if(typeof missing[printKey] == "undefined"
        || missing[printKey] == null) {
            missing[printKey] = 0;
        }
        console.log(sprintf("%1$s printout array %2$s empty", resultKey, printKey));
        missing[printKey] = missing[printKey] + 1;
    }
    return ob;
}

/**
 * Write an array of cards to and file, create if it's the first output
 * @param {String} fileName Card query file name
 * @param {Array} cards Array of cards
 * @param {Bool} first Is the first output cards
 */
const writeCards = function(fileName, cards, first) {
    if(first)
        fs.writeFileSync(fileName, "");
    
    str = "";
    for (let index = 0; index < cards.length; index++) {
        const element = cards[index];
        
        if(!first)
            str = str.concat(",");
        else
            first = false;
        str = str.concat(JSON.stringify(element));
    }

    fs.appendFileSync(fileName, str);
}

/**
 * Do a web request to the wiki page, fetching the cards given a begin char, limit and offset
 * The request continues to call itself until the "query-continue-offset" is null
 * @param {String} char Alphanumeric character for search query filter
 * @param {Integer} limit Query limit
 * @param {Integer} offset Query offset
 */
const getCard = function(char, limit, offset) {
    // Web request options, get url from base, given paramters
    let url = sprintf(baseUrl, char, limit, offset).replace(/\ /g, "%20");
    let opt = {
        url: url,
        method: 'GET',
        json: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    // Make web request
    request(opt)
        .then((body) => {
            // Get query results
            let results = body.query.results;
            // Map results to an array of cards, with query attribute and value
            let data =
                Object.keys(results).map((resultKey) => {
                    // All the attributes are in the printouts object, transform into an object of attr-value
                    let printouts = results[resultKey].printouts;
                    return Object.assign({'name': resultKey, token: true}, Object.keys(printouts).map(function(printKey) {
                        return mapPrintouts(printouts, printKey, resultKey);
                    // Reduce all attributes into a single object
                    }).reduce((final, current) => {
                        return Object.assign(final, current);
                    }));
                });
            // Check if it's the last query (continue is missing)
            last = true;
            if(typeof body['query-continue-offset'] != "undefined"
            && body['query-continue-offset'] != null)
                last = false;
            
            // Add array length to total, then write cards
            locks.files[char].total = locks.files[char].total + data.length;
            writeCards(char.concat(".json"), data, offset == 0);
            
            // If it's not the last query, make the request again
            // Otherwise, unlock the file and end
            if(!last)
                getCard(char, limit, body['query-continue-offset']);
            else
                locks.files[char].completed = true;
        })
        // If returns an error, print the error and finish
        .catch((error) => {
            console.log(">>> Error making web request");
            if(typeof error == "object")
                console.log(JSON.stringify(error));
            else
                console.log(error);
            locks.files[char].completed = true;
            locks.files[char].total = locks.files[char].total + data.length;
        });
}


// Start all promises given array of characters (alphanumeric)
for (let index = 0; index < alphanumeric.length; index++) {
    let element = alphanumeric[index];
    locks.files[element] = {
        complete: false,
        write: false,
        total: 0
    }
    getCard(element, baseLimit, 0);
}

// Set an interval to check if all promises finished
var id = setInterval(mergeFiles, 1000);
function mergeFiles() {
    let keys = Object.keys(locks.files);
    for (let index = 0; index < keys.length; index++) {
        const element = locks.files[keys[index]];
        // If the promise finished and it was not yet written, copy file to fileName
        if(element.completed == true && element.write == false) {
            element.write = true;

            // Check if total is 0, unlink the file and step over
            // Also, set the max number of actual char to minus one
            if(element.total == 0) {
                fs.unlinkSync(keys[index].concat(".json"));
                locks.length--;
                continue;
            }
            
            if(locks.count == 0)
                fs.writeFileSync(fileName, "[");
            else
                fs.appendFileSync(fileName, ",");

            locks.count = locks.count + 1;
            
            // Copy the data to the final file
            let data = fs.readFileSync(keys[index].concat(".json"));
            fs.appendFileSync(fileName, data);
            fs.unlinkSync(keys[index].concat(".json"));

            locks.total = locks.total + element.total;
            console.log(sprintf(">>> %1$s completed with %2$s cards", keys[index], element.total));
        }
    }
    // If all files are copied, finish and check results
    if(locks.count >= locks.length) {
        fs.appendFileSync(fileName, "]");
        console.log(sprintf(">>> >>> All completed with %1$s cards", locks.total));

        // If any printout is missing, log the missing keys
        if(Object.keys(missing).length > 0) {
            console.log(">>> >>> Missing prints found");
            Object.keys(missing).forEach((missingKey) =>
                console.log(sprintf(">>> Missing %1$s of type %2$s", missing[missingKey], missingKey)));
        }
        
        // Log the printout values found, and check any duplicate
        Object.keys(printValues).forEach((printKey) => {
            console.log(sprintf(">>> >>> Found values at %1$s printout", printKey));
            if(printValues[printKey].duplicate) {
                let count = 0;
                // Print any duplicates and the count
                Object.keys(printValues[printKey]).forEach((valueKey) => {
                    if(printValues[printKey][valueKey]
                    && valueKey != "duplicate") {
                        console.log(sprintf("Duplicate value %1$s at %2$s", valueKey, printKey));
                        count++;
                    }
                });
                console.log(sprintf(">>> Found %1$s duplicate keys at %2$s printout", count, printKey));
            }
        });
        // Clear interval and end program
        clearInterval(id);
    }
}