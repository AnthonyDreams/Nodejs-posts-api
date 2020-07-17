# Node.js, Express and AWS Project Structure 

# Features
- Fundamental of Express: routing, middleware, sending response and more
- Fundamental of Dynamodb: Data models, data validation and middleware
- RESTful API including pagination and sorting
- CRUD operations with dynamodb
- Security: encryption, sanitization and more
- Error handling
- Enviroment variables
- handling error outside Express
- Catching Uncaught Exception

# Project Structure
- server.js : Responsible of starting the server.
- app.js : Configure everything that has to do with Express application. 
- config.env: for Enviroment Varaiables
- routes -> postRoutes.js: The goal of the route is to guide the request to the correct handler function which will be in one of the controllers
- controllers -> postController.js: Handle the application request, interact with models and send back the response to the client 
- models -> postModel.js: (Business logic) related to business rules, how the business works and business needs ( Creating new user in the database, checking if the user password is correct, validating user input data)
