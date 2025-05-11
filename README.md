# Census API
An Express.js application for managing census participants, with data persisted in a MySql database. Authenticated admin users can perform CRUD operations on participant record, including persnal, work and home details.

## Table of Contents
- Prerequisites
- Environment Variables
- Installation
- Running locally 
- API Endpoints
- Testing with Postman
- Deployement

## Prerequisites
- Node.js and npm
- a MySQL database (We are using Aiven MySQL)
- Render account for deployement 

## Environment Variables
Create a .env file in the project root with the following keys
DB_USERNAME= avnadmin
DB_PASSWORD= UaTbY40PdaV_nGaz-JU
DATABASE_NAME= censusdb
DB_HOST= mysql-1fc83aaf-anasthedeveloper7-d722.h.aivencloud.com
DB_PORT= 24783
DIALECT=mysql
PORT= 3000

## Installation
### Clone the repo
git clone  https://github.com/<your-username>/SD-assignement.git
cd SD-assignement
### Install dependencies
npm install

## Running Locally
### Start the server
node app.js
- The server listens on http://localhost:3000 by default
- On first run, it will automatically sync the database schema and seed and admin user:
      - Username: admin  
      - Password: P4ssword

## API Endpoints

All routes require Basic Authentication (admin / P4ssword).

| Method | Path                              | Description                                     |
| ------ | --------------------------------- | ----------------------------------------------- |
| POST   | `/participants/add`               | Create a new participant (body: JSON)           |
| GET    | `/participants`                   | List all participants with work & home details  |
| GET    | `/participants/details`           | List all participants’ personal details         |
| GET    | `/participants/details/:email`    | Personal details for one participant            |
| GET    | `/participants/work/:email`       | Work details for one participant                |
| GET    | `/participants/home/:email`       | Home details for one participant                |
| PUT    | `/participants/:email`            | Update a participant (body same as POST)        |
| DELETE | `/participants/:email`            | Delete a participant                            |

Request and Response
- All payloads and responses use JSend format
- Request with invalid input return status  400 and Jsend fail.
- Unauthorized requests return status 401
- Server errors return status 500 with Jsend error.

## Testing with Postman 
1. import the provided Postman collection (postman_collection.json)
2. Set collection level Basic Auth:
   - Username: admin
   - Password: P4ssword
3. Execute each request in order
    1. Add Participant (POST/participants/add)
    2. List Participants (GET/participants)
    3. All details (GET/participants/details)
    4. One Detail (GET/participants/details/:email)
    5. Work Detal (GET/participants/work/:email)
    6. Home Detail (GET/participants/home/:email)
    7. Update participant (PUT/participants/:email)
    8. Delete Participant (DELETE/participans/:email)

## Deployement
1. Push your code to GitHub.
2. In Render:
   - Create a new Web Service.
   - Connect your GitHub repo.
   - Set build command: npm install
   - Set start command: node app.js
   - Add environement varibales (from your .env file)
3. Deploy and note the live URL: https://sd-assignement.onrender.com
