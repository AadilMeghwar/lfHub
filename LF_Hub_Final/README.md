# LF Hub – Lost and Found Hub

## 📌 Project Title

**LF Hub – Lost and Found Hub**

## 📖 Project Description

LF Hub is a web-based Lost and Found Management System designed to help users report, search, and manage lost and found items.

The main purpose of LF Hub is to provide a centralized platform where users can report lost items and report items they have found. Users can browse available items, manage their own reports, receive notifications, and manage their profiles.

The system uses a React.js frontend, Node.js and Express.js backend, and a database for storing user and item information.

---

## ✨ Features

* User Registration and Login
* User Authentication
* Dashboard
* Browse Lost and Found Items
* Report Lost Items
* Report Found Items
* View Personal Items
* Update Item Information
* Delete Items
* Fetch Items from Database
* CRUD Operations
* User Profile
* Notifications
* REST API communication between frontend and backend
* Persistent database storage
* Responsive and user-friendly interface

---

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite
* Axios / Fetch API for API communication

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* SQLite

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

---

# 📂 Project Structure

```text
LF_Hub_Final/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── database/
│   ├── package.json
│   └── ...
│
├── README.md
└── ...
```

> Note: Folder names may vary depending on the final project structure.

---

# 💻 Frontend Setup

## Step 1: Install Node.js

Make sure Node.js is installed on your computer.

Check the installation using:

```bash
node -v
```

and:

```bash
npm -v
```

If both commands return a version number, Node.js and npm are installed successfully.

---

## Step 2: Open the Frontend Folder

Open the project in Visual Studio Code and navigate to the frontend folder.

```bash
cd frontend
```

If your project uses a different frontend folder name, navigate to that folder instead.

---

## Step 3: Install Frontend Dependencies

Run:

```bash
npm install
```

This will install all required packages listed in `package.json`.

---

## Step 4: Start the Frontend

Run:

```bash
npm run dev
```

Vite will start the development server.

The terminal will provide a local URL similar to:

```text
http://localhost:5173
```

Open this URL in your browser.

---

# ⚙️ Backend Setup

## Step 1: Open a New Terminal

Keep the frontend server running and open another terminal in VS Code.

Navigate to the backend directory:

```bash
cd backend
```

---

## Step 2: Install Backend Dependencies

Run:

```bash
npm install
```

This installs the required backend packages.

---

## Step 3: Start the Backend Server

Run:

```bash
npm start
```

If the project uses a development script, you can use:

```bash
npm run dev
```

The backend server will start on its configured port.

For example:

```text
http://localhost:5000
```

---

# 🗄️ Database Setup

LF Hub uses **SQLite** as its database.

SQLite does not require a separate database server such as MySQL or MongoDB.

The database is stored locally as a database file.

### Database initialization

After setting up the backend:

1. Make sure the backend dependencies are installed.
2. Make sure the database configuration is correct.
3. Start the backend server.
4. The application will connect to the SQLite database.
5. Required tables can then be created/initialized according to the project's database setup.

The database stores information such as:

* User accounts
* Lost items
* Found items
* Item descriptions
* Item status
* Other application-related data

---

# 🔐 Environment Variables

If environment variables are required, create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
DATABASE_URL=./database/database.sqlite
```

If the project contains other environment variables, add them to the `.env` file according to the backend configuration.

### Important

Do not upload sensitive information such as:

* Passwords
* API keys
* Secret keys
* Private credentials

to GitHub.

The `.env` file should normally be included in `.gitignore`.

---

# 🚀 Complete Step-by-Step Run Instructions

Follow these steps to run the complete project.

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### 2. Open the Project

```bash
cd LF_Hub_Final
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Start Frontend

```bash
npm run dev
```

Keep this terminal running.

### 5. Open a New Terminal

Navigate to the backend:

```bash
cd backend
```

### 6. Install Backend Dependencies

```bash
npm install
```

### 7. Configure Environment Variables

Create the `.env` file if required and add the required configuration.

### 8. Start Backend

```bash
npm start
```

or:

```bash
npm run dev
```

### 9. Open the Application

Open the frontend URL displayed by Vite, for example:

```text
http://localhost:5173
```

The LF Hub application should now be running.

---

# 🔄 CRUD Operations

LF Hub implements the four basic CRUD operations.

### Create

Users can create new lost or found item reports.

```text
POST /api/items
```

### Read

The application fetches and displays items from the database.

```text
GET /api/items
```

### Update

Users can modify information about their reported items.

```text
PUT /api/items/:id
```

### Delete

Users can delete their reported items.

```text
DELETE /api/items/:id
```

> API routes may differ depending on the final backend implementation.

---

# 🔌 Backend API

The frontend communicates with the backend through REST APIs.

The general communication flow is:

```text
React Frontend
      ↓
HTTP Request
      ↓
Express.js API
      ↓
Backend Logic
      ↓
SQLite Database
      ↓
API Response
      ↓
React Frontend
```

For example, when a user creates a lost-item report:

```text
User enters item information
          ↓
React form
          ↓
POST API request
          ↓
Express.js backend
          ↓
SQLite database
          ↓
Data saved successfully
          ↓
Response returned to frontend
          ↓
New item displayed
```

---

# 🖥️ Main Application Screens

The application contains the following major screens:

### Login

Allows existing users to access their accounts.

### Registration

Allows new users to create an account.

### Dashboard

Provides the main navigation and overview of the application.

### Browse Items

Displays available lost and found items.

### Report Lost

Allows users to report an item they have lost.

### Report Found

Allows users to report an item they have found.

### My Items

Allows users to view and manage their reported items.

### Notifications

Displays relevant notifications to the user.

### Profile

Allows users to view and manage their profile information.

---



# 📦 Requirements

Before running LF Hub, make sure the following software is installed:

* Node.js
* npm
* Visual Studio Code
* Git
* Modern web browser

No separate database server is required if SQLite is used locally.

---

# 👨‍💻 GitHub Repository

The complete source code of LF Hub is maintained in a GitHub repository.

The repository contains:

* Frontend source code
* Backend source code
* Database configuration
* Package configuration
* README documentation


# 👥 Project Purpose

LF Hub is developed to make the process of reporting and finding lost items easier, faster, and more organized.

Instead of relying on manual announcements or informal communication, users can use a centralized digital platform to report and manage lost and found items.

