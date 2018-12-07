# taxi-service-shard
# Get started

1. Download project with **git clone https://github.com/YaroslavGrushko/taxi-service-shard.git**  command  
***launch mongo cluster:***
2. navigate to *shard-test* 
3. run mongo cluster with **docker-compose up**  
4. open new cmd in *shard-test* and configure mongo cluster with **sh init.sh**  
5. push data to db and launch sharding with **sh initData.sh**  
*Mongo cluster is Ok now!*   
***launch emulation of "taxis" service (Uber like:))***  
6. open cmd in *taxi-service-test* folder and type **docker-compose build** to build images of sercvice servers  
7. run service with **docker-compose up** command  
*"taxi" service is Ok now:)*
