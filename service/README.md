# Manager Service
This is the backend of the system. This readme is under construction.

## Running tests and checkstyle
If you want to run the tests or checkstyles, before you need to install the dependencies, to do it just run the following
```
npm install
```
you will need npm installed on your machine.
### Running tests
To run the tests just type
```
npm run test
```
and it will look for all the tests under tests/ folder.
### Checkstyle
If you want to use eslint checkstyle just run
```
npm run lint
```

## Structure
In this section we will explain all the code structure and decisions. This is a beta version of the final explanation.

### **etc**
Here we store our config files

### **src**
This folder is responsable for holding the source code to the server. I took the approach of dividing the core logic of the server on three layers (Controller, Service, Repository), that i will explain below with the other files/folders. \
\
Another thing to note is that we are using depency injection on our server. We made this choice so we could have more control over our application and make the testing an easyer process.

- #### Controller (layer 1)
    -   This folder contains all the logic that is reponsable for handling requests, both to receive and reply to them. He is also responsable to make field validations and pass the data to *Service* formated in a way that *node.js* will understand.

- #### Service (layer 2)
    -   Here we have all the bussiness logic of our server, the codes that represent the core of the functionality.

- #### Repository (layer 3)
    -   This section of our structure holds the code that is reponsable for talking with exterior data, such as databases or another microservice or source of information.

This are the core folders of our server, the rest are helpers and i will explain them bellow.
___
- #### Error
    -   This folder will hold all our customized errors.
- #### Middleware
    -   Here we will have all our middlewares, right now we have only cors middleware, but we will have authentication too.
- #### Models
    -   Here we stored our mongo models, that are used to make contact with our database.
- #### Provider
    -   This folder holds the application depency injection and creation.
- #### Routes
    - Here we save the routes of our server, that will be exported on the Routes.js file inside *src* root
- #### Utils
    -   Here we can save all the code that has the responsability to change data or information in a way that it can be used on different places
