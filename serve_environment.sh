# !/bin/bash

docker-compose -f config/dockerConfig.yml up -d
docker exec config_mongo-database_1 bash -c "mongo < scripts/initializeMongo.js"

docker-compose -f config/dockerConfig.yml logs -f
