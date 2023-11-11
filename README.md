# Employee Management API

This API is designed to facilitate employee management in companies. It provides features such as employee management, salary management, leave management, and others. The API is built using Node.js technology and MongoDB database.

## Getting Started

Follow the steps below to run the project locally:

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Change to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create an .env file and fill it with variables according to .env.example

### Running the Project

```bash
npm start
```

The API will be running at `http://localhost:3000` by default.

## API Documentation

### Authentication

#### Register a new user

- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Description:** Create a new user, and only the HR role can access.
- **Request Body:**

  ```json
  {
    "email": "hr@example.com",
    "password": "password123",
    "role": "hr",
    "nik": 1234526474736353,
    "name": "John Doe",
    "birth": "1990-01-01",
    "gender": "male",
    "address": "123 Main Street",
    "phone": "123456789013",
    "entry_date": "2021-01-01",
    "image_profile": "profile.jpg"
  }
  ```

- **Response:** `201 OK`

#### Login

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Login user to get a token.
- **Request Body:**

  ```json
  {
    "email": "hr@example.com",
    "password": "password123"
  }
  ```

- **Response:** `200 OK`

### Users

#### Get all users

- **Endpoint:** `/user`
- **Method:** `GET`
- **Description:** Return a list of users.
- **Response:** `200 OK`

#### Create a new user

- **Endpoint:** `/user`
- **Method:** `POST`
- **Description:** Create a new user, and only the HR role can access.
- **Request Body:**

  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123",
    "role": "employee",
    "nik": 1234566474736353,
    "name": "John Doe",
    "birth": "1990-01-01",
    "gender": "male",
    "address": "123 Main Street",
    "phone": "123456789019",
    "entry_date": "2021-01-01",
    "image_profile": "profile.jpg"
  }
  ```

- **Response:** `201 OK`

...

(Continue the documentation for other endpoints like `/user/{id}`, `/salary`, `/vacation`, `/employee-review`, `/division`, `/attendance`, etc.)

## Note

- Replace `<repository-url>` and `<project-directory>` with your actual repository URL and project directory.
- Make sure to replace `<your-mongodb-uri>` and `<your-jwt-secret>` with your MongoDB connection URI and a secret key for JWT.
