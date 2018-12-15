# !/bin/bash

docker-compose -f config/dockerConfig.yml up -d

docker-compose -f config/dockerConfig.yml logs -f
