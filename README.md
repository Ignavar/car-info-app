# car-info-app
full stack web application where users can view information on models of various brands
admin account can add new brands, models and information related to them 

# getting-started 
adjust REACT_APP_API_URL value in docker compose.yaml to the ip address of your machine you can 
find that in linux by running hostname -I and using ipconfig on windows you will require docker 
and docker compose to run this app. cd into the frontend directory and run docker build -t 3000:3000 car-info/frontend .
then cd into the backend directory and run docker build -t 5000:5000 car-info/backend .
finally cd into root directory and run docker compose up to start the app you can access in through 
any device o your local network by typing YOUR_IP_ADDRESS:3000 into the browser (YOUR_IP_ADDRESS is 
the ip address of the host machine where you are running the 
docker images).
