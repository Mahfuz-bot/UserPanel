# User Authentication API

This project provides a RESTful API for user authentication and account management, built with Node.js and Express. It includes functionalities for user signup, login, logout, token management, password updates, and account detail management.

## Features

- **User Signup**: Create a new user with first name, last name, email, and password.
- **User Login**: Authenticate users with email and password. Generates access and refresh tokens.
- **User Logout**: Log out a user by clearing the stored refresh token.
- **Token Refresh**: Refresh expired access tokens with a valid refresh token.
- **Update Account Details**: Update the user's first name, last name, and email.
- **Change Password**: Update the user's password.
- **Get Current User**: Retrieve the current user's details.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **bcrypt**: Library for hashing passwords.
- **jsonwebtoken**: Used for generating and verifying JSON Web Tokens (JWTs).

