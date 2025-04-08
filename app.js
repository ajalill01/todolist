require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./back-end/routes/auth-routes');
const taskRoutes = require('./back-end/routes/task-routes');
const connectToDb = require('./back-end/database/db');
const authMiddleware = require('./back-end/middleware/auth-middleware');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.use(express.static(path.join(__dirname, 'front-end')));

// Registering routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', authRoutes);
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test route is working!' });
});


app.get('/welcome', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'welcome.html'));  // Serve the welcome page if logged in
});

app.get('/todo', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'todo.html'));  // Serve the todo page
});

// Routes for signup/login
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'signup.html'));  // Serve the signup page
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'index.html'));  // Serve the login page
});



// Log the routes before starting the server
const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));

const port = process.env.PORT || 5000;

// Connect to the database
connectToDb();

// Start the server
app.listen(port, () => {
    console.log(`Server now is running on ${port}.`);
});
