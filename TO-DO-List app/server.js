const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');  // Import CORS middleware
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes

// MongoDB connection
const dbURI = process.env.MONGODB_URI || 'mongodb+srv://MohyJake:Mr.Mohan21@cluster0.0cbge23.mongodb.net/todoApp';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Task schema and model
const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    description: String,
    deadline: String
});
const Task = mongoose.model('Task', taskSchema);

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add a new task
app.post('/add-task', (req, res) => {
    const { taskName, description, deadline } = req.body;
    
    const newTask = new Task({ taskName, description, deadline });
    newTask.save()
        .then(() => res.status(201).send('Task added successfully!'))
        .catch(err => res.status(500).send('Error adding task: ' + err));
});


// Fetch all tasks
app.get('/tasks', (req, res) => {
    Task.find()
        .then(tasks => res.json(tasks))
        .catch(err => res.status(500).send('Error fetching tasks: ' + err));
});

// Fetch a single task by ID
app.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id)
        .then(task => res.json(task))
        .catch(err => res.status(500).send('Error fetching task: ' + err));
});


// Update a task
app.put('/update-task/:id', (req, res) => {
    const { taskName, description, deadline } = req.body;
    
    Task.findByIdAndUpdate(req.params.id, { taskName, description, deadline }, { new: true })
        .then(updatedTask => {
            if (!updatedTask) {
                return res.status(404).send('Task not found');
            }
            res.send('Task updated successfully!');
        })
        .catch(err => res.status(500).send('Error updating task: ' + err));
});

// Delete a task
app.delete('/delete-task/:id', (req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(deletedTask => {
            if (!deletedTask) {
                return res.status(404).send('Task not found');
            }
            res.send('Task deleted successfully!');
        })
        .catch(err => res.status(500).send('Error deleting task: ' + err));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
