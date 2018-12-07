# taxi-service-shard
# Get started

1. git clone   
**launch mongo cluster:**
2. **cd shard-test** 
3. run mongo cluster **docker-compose up**  
4. open cmd in mongo-test and configure mongo cluster **sh init.sh**  
5. push data to db and launch sharding with **sh initData.sh**  
**launch emulation of "taxis" service (Uber like:))**  
6. open cmd in *taxi-service* folder and type **docker-compose build** to build images of sercvice servers  
7. run service with **docker-compose up** command
8. watch logs and be happy:)
