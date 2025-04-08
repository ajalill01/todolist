require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./back-end/routes/auth-routes');
const taskRoutes = require('./back-end/routes/task-routes');
const connectToDb = require('./back-end/database/db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// Registering routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', authRoutes);
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test route is working!' });
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
