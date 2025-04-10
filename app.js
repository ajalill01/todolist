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



const port = process.env.PORT || 5000;

// Connect to the database
connectToDb();

// Start the server
app.listen(port, () => {
    console.log(`Server now is running on ${port}.`);
});
