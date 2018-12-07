#!/usr/bin/bash
## include --upsert if adding to a prexistitng collection
mongoimport -d taxisService -c clients --type csv --file /mydata/London_postcodes.csv --headerline