const express = require('express');

// Create an instance of the Express application
const app = express();
const port = 4000;

// Middleware to parse incoming JSON data in the request body 
// This is essential for handling data sent with POST and PUT requests.
app.use(express.json());

// -------------------------------------------------------------
// 1. IN-MEMORY DATABASE (Simulated Data Store)
// This array simulates a database table for users.
// -------------------------------------------------------------
let users = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
];

let nextId = 4; // Counter to assign unique IDs to new users

// -------------------------------------------------------------
// API Interaction Guide Route (Home Route: '/')
// This sends HTML instructions to the browser when the user visits the root URL.
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Express CRUD API Guide</title>
        <style>
            body { font-family: sans-serif; margin: 40px; background-color: #f7f9fc; color: #333; }
            h1 { color: #1e40af; }
            h3 { color: #4338ca; border-bottom: 2px solid #e0e7ff; padding-bottom: 5px; margin-top: 25px; }
            code { background-color: #eee; padding: 2px 5px; border-radius: 4px; font-weight: bold; }
            ul { list-style: none; padding-left: 0; }
            li { margin-bottom: 10px; border-left: 4px solid #93c5fd; padding-left: 10px; }
            .method-get { color: #16a34a; font-weight: bold; }
            .method-post { color: #f97316; font-weight: bold; }
            .method-put { color: #ca8a04; font-weight: bold; }
            .method-delete { color: #dc2626; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>Express CRUD Operations API</h1>
        <p>This server manages users and runs on port ${port}.</p>
        <p>Use an API testing tool (like Postman or cURL) or the browser's developer console (for GET) to interact with these endpoints:</p>

        <h3>1. READ (Retrieve Data)</h3>
        <ul>
            <li><span class="method-get">GET</span> <code>/users</code>: Get a list of all users.</li>
            <li><span class="method-get">GET</span> <code>/users/:id</code>: Get a specific user by ID (e.g., <code>/users/1</code>).</li>
        </ul>

        <h3>2. CREATE (Add Data)</h3>
        <ul>
            <li><span class="method-post">POST</span> <code>/users</code>: Add a new user. Send JSON: <code>{"name": "New User", "email": "new@example.com"}</code></li>
        </ul>

        <h3>3. UPDATE (Modify Data)</h3>
        <ul>
            <li><span class="method-put">PUT</span> <code>/users/:id</code>: Update an existing user. Send JSON with fields to change: <code>{"name": "Updated Name"}</code></li>
        </ul>

        <h3>4. DELETE (Remove Data)</h3>
        <ul>
            <li><span class="method-delete">DELETE</span> <code>/users/:id</code>: Delete a user by ID.</li>
        </ul>
    </body>
    </html>
  `);
});

// -------------------------------------------------------------
// CRUD ROUTE HANDLERS
// -------------------------------------------------------------

// R: READ - Get All Users (GET /users)
app.get('/users', (req, res) => {
  // Returns the entire list of users as JSON
  res.json(users);
});

// R: READ - Get User by ID (GET /users/:id)
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (user) {
    res.json(user);
  } else {
    // Send 404 Not Found error
    res.status(404).send({ message: `User with ID ${id} not found.` });
  }
});

// C: CREATE - Add a New User (POST /users)
app.post('/users', (req, res) => {
  const newUser = {
    id: nextId++,
    name: req.body.name,
    email: req.body.email
  };

  if (!newUser.name || !newUser.email) {
    // Send 400 Bad Request if data is missing
    return res.status(400).send({ message: 'Name and email are required for a new user.' });
  }

  users.push(newUser);
  // Send 201 Created status and the new user object
  res.status(201).json(newUser);
});

// U: UPDATE - Update Existing User (PUT /users/:id)
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex !== -1) {
    // Update only the fields provided in the request body
    users[userIndex] = {
      ...users[userIndex], 
      name: req.body.name || users[userIndex].name, 
      email: req.body.email || users[userIndex].email
    };
    res.json(users[userIndex]);
  } else {
    // Send 404 Not Found error
    res.status(404).send({ message: `User with ID ${id} not found.` });
  }
});

// D: DELETE - Delete a User (DELETE /users/:id)
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = users.length;
  
  // Filter out the user to delete
  users = users.filter(u => u.id !== id);

  if (users.length < initialLength) {
    // Send 204 No Content status for successful deletion
    res.status(204).send();
  } else {
    // Send 404 Not Found error
    res.status(404).send({ message: `User with ID ${id} not found.` });
  }
});

// -------------------------------------------------------------
// START SERVER
// -------------------------------------------------------------
app.listen(port, () => {
  console.log(`\nCRUD Server is running on: http://localhost:${port}`);
  console.log('Use an API client to test the endpoints under /users\n');
});
