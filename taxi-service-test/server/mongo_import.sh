#!/usr/bin/bash
## include --upsert if adding to a prexistitng collection
mongoimport -d taxisService -c clients --type csv --file b:/London_postcodes.csv --headerline