# IMDb Clone Backend

This project is a backend application for an IMDb-like website with basic CRUD functionality to manage movies, actors, and producers, along with their relationships. Built with Node.js, Express, and MongoDB, the application is designed to allow flexible management of movie-related data, token-based authentication, and state management with Redux.

## Project Overview

### Entities
- **Actor**: An actor can be associated with multiple movies.
- **Movie**: A movie can feature multiple actors and has one producer.
- **Producer**: A producer can produce multiple movies.

### Features
- **CRUD Operations**: For movies, actors, and producers.
- **Relationships**:
  - Movies have multiple actors and one producer.
  - Actors can act in multiple movies.
  - Producers can produce multiple movies.
- **Additional Screens**:
  - List all movies with details (name, release year, producer, actors).
  - Add a new movie with existing or new actors/producers on the same screen.
  - Edit movie details, including associated actors and producer.
- **State Management**: Uses Redux for managing application state in the frontend.
- **Validation**: Includes custom validation rules for various fields.

### Features
- **React Hooks**: For managing component state and logic in the frontend.
- **Token-Based Authentication**: For secure access to endpoints.
- **Minimal Dependencies**: Focuses on lightweight functionality without excessive third-party modules.

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, Redux for state management


## Database Design

The application uses MongoDB, with schemas designed for data normalization:

### Actor Schema
```javascript
{
  name: String,
  gender: String,
  dob: Date,
  bio: String,
  image:String,
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
}
```
### Producer 
```javascript
{
  name: String,
  gender: String,
  dob: Date,
  bio: String,
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
}
```
### Movie Schema
``` javascript
{
  name: String,
  yearOfRelease: Number,
  plot: String,
  poster: String,
  producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }]
}
```
## Setup and Usage

1.Clone the repository:
```bash
git clone https://github.com/BinoB/IMDB_Clone_Backend
cd IMDB_Clone_Backend
```
2.Install dependencies:
  ```bash
npm install
```
3.Environment Variables: Create a .env file in the root directory with the following variables:
```bash
PORT
MONGO_URI
JWT_SECRET
CLOUDINARY_URL
EMAIL_HOST
EMAIL_USER
EMAIL_PASS
NODE_ENV
```
4.Start the server:
```bash
npm start
```
The server will be running at http://localhost:5000.

