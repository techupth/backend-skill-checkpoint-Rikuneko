[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/QXUFrH5k)
# An Express Server Template

# Question API

## Introduction

This is a simple Question API built with Express.js and PostgreSQL. The API allows users to create, read, update, and delete questions. It also includes validation middleware to ensure that the data being processed is valid.

## Features

- Create a new question
- Retrieve all questions
- Retrieve a question by its ID
- Update a question by its ID
- Delete a question by its ID
- Search for questions by title and/or category

## Installation

To get started with this project, follow the instructions below:

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/question-api.git
    cd question-api
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the database:
    - Create a PostgreSQL database.
    - Update the `connectionPool` in `utils/db.mjs` with your database connection details.

4. Run the migrations to create the necessary tables:
    ```sh
    npx knex migrate:latest
    ```

5. Start the server:
    ```sh
    npm start
    ```

## Endpoints

### Create a Question

- **URL:** `/questions`
- **Method:** `POST`
- **Description:** Create a new question.
- **Request Body:**
    ```json
    {
        "title": "Question title",
        "description": "Question description",
        "category": "Question category"
    }
    ```
- **Responses:**
    - `201 Created` - Question created successfully.
    - `400 Bad Request` - Missing or invalid request data.
    - `500 Internal Server Error` - Database connection error.

### Retrieve All Questions

- **URL:** `/questions`
- **Method:** `GET`
- **Description:** Retrieve all questions.
- **Query Parameters:**
    - `title` (optional): Filter questions by title.
    - `category` (optional): Filter questions by category.
- **Responses:**
    - `200 OK` - Returns a list of questions.
    - `500 Internal Server Error` - Database connection error.

### Retrieve a Question by ID

- **URL:** `/questions/:questionId`
- **Method:** `GET`
- **Description:** Retrieve a question by its ID.
- **Responses:**
    - `200 OK` - Returns the requested question.
    - `404 Not Found` - Question not found.
    - `500 Internal Server Error` - Database connection error.

### Update a Question by ID

- **URL:** `/questions/:questionId`
- **Method:** `PUT`
- **Description:** Update a question by its ID.
- **Request Body:**
    ```json
    {
        "title": "Updated title",
        "description": "Updated description",
        "category": "Updated category"
    }
    ```
- **Responses:**
    - `200 OK` - Question updated successfully.
    - `400 Bad Request` - Missing or invalid request data.
    - `404 Not Found` - Question not found.
    - `500 Internal Server Error` - Database connection error.

### Delete a Question by ID

- **URL:** `/questions/:questionId`
- **Method:** `DELETE`
- **Description:** Delete a question by its ID.
- **Responses:**
    - `200 OK` - Question deleted successfully.
    - `404 Not Found` - Question not found.
    - `500 Internal Server Error` - Database connection error.

## Middleware

### validateCreateQuestionData

This middleware validates the data for creating and updating questions. It ensures that the `title`, `description`, and `category` fields are present and valid.

## Database

The database schema includes a `questions` table with the following columns:

- `id` (UUID) - Primary key
- `title` (TEXT) - Title of the question
- `description` (TEXT) - Description of the question
- `category` (TEXT) - Category of the question
- `created_at` (TIMESTAMP) - Timestamp when the question was created
- `updated_at` (TIMESTAMP) - Timestamp when the question was last updated

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
