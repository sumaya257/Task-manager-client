# Task Manager

A simple and efficient Task Manager web application that allows users to manage tasks with features such as task creation, editing, and deletion. The application uses a backend with MongoDB, Express, and Node.js, while the frontend is built with React, Vite, and TailwindCSS.

## Live Link
You can try the live version of the application at:  
[Task Manager - Live](https://task-manager-12d3d.web.app/)

## Features
- Create and manage tasks
- Drag and Drop Tasks
- Edit existing tasks
- Delete tasks
- Responsive design optimized for mobile and desktop

## Technologies Used

### Frontend:
- React (v19.0.0)
- Vite (for fast builds)
- TailwindCSS (for styling)
- DaisyUI (UI components built on top of TailwindCSS)
- Axios (for API requests)
- React Router DOM (for navigation)
- React Query (for data fetching and state management)
- Firebase (for user authentication)

### Backend:
- Node.js
- Express.js
- MongoDB (for database management)

## Installation Steps

### Frontend:
1. Clone the repository:
   git clone https://github.com/sumaya257/Task-manager-client.git
   
Navigate to the frontend directory:
2. cd task-manager
3. Install dependencies:
4. npm install
Run the development server:
5. npm run dev

### Backend:
1. Clone the backend repository:
git clone https://github.com/sumaya257/Task-manager-server.git

Navigate to the backend directory:
2. cd task-manager-backend
3. Install dependencies:
4. npm install
Start the backend server:
5. npm start/ nodemon index.js

## Dependencies

### Frontend:
@tailwindcss/vite - TailwindCSS integration for Vite
@tanstack/react-query - React Query for state management
axios - Promise-based HTTP client for the browser and Node.js
firebase - Firebase for user authentication
react-dnd - React drag-and-drop library
react-router-dom - React routing
sweetalert2 - For showing alerts and notifications

### Backend:
express - Fast, unopinionated web framework for Node.js
mongodb - NoSQL database
