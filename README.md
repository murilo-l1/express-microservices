# Description

This project consists of five microservices written using Express.js and MongoDB. Through this project, I learned about routes, streaming endpoints, HTTP verbs and statuses, and other general API concepts. I followed along with the [freeCodeCamp Backend Course](https://www.freecodecamp.org/learn/back-end-development-and-apis/#mongodb-and-mongoose).

---

# Technologies Used

- Node.js
- Express.js
- MongoDB
- Multer

---

# Microservices Explained

### File Metadata

Using the Multer library, this microservice allows the user to upload a file and then returns a JSON object with its metadata (name, extension, size, etc.).

### Exercise Tracker

This microservice performs CRUD operations on an exercise form with fields for username, description, duration, and date. Users can access a log of their saved exercises by passing their unique ID.
- Model creation with Mongoose
- Integrated exercises with usernames to access the log endpoint
- Created queries to filter logs by query parameters

### URL Shortener

This microservice allows the user to pass a URL, checks the hostname, and then generates a unique 'shortened ID' to redirect to the original URL.

### Date

This microservice lets users access the '/api/date' endpoint to see the date passed as a parameter in the request or the current date. 
- Learned about the built-in Date interface in JavaScript and Unix timestamps

### Whoami

This microservice allows users to access the '/api/whoami' endpoint to get a JSON response describing the system characteristics by accessing the headers of the request.
