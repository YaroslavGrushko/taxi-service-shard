#!/bin/bash

# push data to taxisService db: 
docker-compose exec router sh -c "sh < /mydata/mongo_import.sh"
sleep 20
# enable sharding for taxisService Db
docker-compose exec router sh -c "mongo < /scripts/enSharding/useDb.js"

