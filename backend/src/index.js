console.log('Start backend')

const express = require('express')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3030 });

const app = express()

const cors = require('cors');

app.use(cors());
app.use(express.json())

// {user: string, connectedAt: string}
let connectedUsers = []
// {user: string, sendAt: string, message: string}
let messages = []

const broadcastUpdateUsers = () => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('[Users]');
        }
    })
}

const broadcastUpdateMessages = () => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('[Messages]');
        }
    })
}

app.get('/echo', function (req, res) {
    console.log('requested echo')
    res.status(201).json({ message: "Successfully Registered", status: 201 })
})

app.get('/users', function (req, res) {
    res.status(201).json({ users: connectedUsers, status: 201 })
})

app.post('/login', function (req, res) {

    if (!req.body?.name) {
        console.log('Login error', JSON.stringify(req.body));
        return res.status(403).json({ error: 'Invalid user name' })
    }

    if (req.body.name === 'a') {
        return res.status(403).json({ error: 'Forbidden user name' })
    }

    const newUser = {
        name: req.body.name,
        connectedAt: new Date().toISOString()
    }

    const existingUser = connectedUsers.find(x => x.name === newUser.name)

    if (existingUser) {
        return res.status(201).json({ ...existingUser, status: 201 })
    }

    connectedUsers.push(newUser)
    console.log('Login:', newUser.name, 'users:', connectedUsers.length);

    messages.push({
        user: newUser.name,
        sendAt: new Date().toISOString(),
        message: '[Joined] ' + newUser.name
    })

    broadcastUpdateUsers()
    broadcastUpdateMessages()
    res.status(201).json({ ...newUser, status: 201 })
})

app.post('/logout', function (req, res) {

    if (!req.body?.name || req.body.name === 'a') {
        console.log('Logout error', JSON.stringify(req.body));

        return res.status(403).json({ message: 'Invalid name' })
    }

    const userName = req.body.name
    connectedUsers = connectedUsers.filter(x => x.name !== userName)

    console.log('Logout:', userName, 'users:', connectedUsers.length);
    messages.push({
        user: userName,
        sendAt: new Date().toISOString(),
        message: '[Left the chat] ' + userName
    })

    broadcastUpdateUsers()
    broadcastUpdateMessages()
    res.status(201).json({ status: 201 })
})

app.post('/message', function (req, res) {

    if (!req.body?.name) {
        console.log('Unknown user', JSON.stringify(req.body));
        return res.status(404).json({ error: 'Invalid user' })
    }

    const userName = req.body.name
    const existingUser = connectedUsers.find(x => x.name === userName)

    if (!existingUser) {
        console.log('Unknown user', userName);
        return res.status(403).json({ error: 'Unknown user' })
    }

    const message = req.body.message
    if (!message) {
        console.log('Empty message');
        return res.status(422).json({ error: 'Empty message' })
    }

    messages.push({
        user: userName,
        sendAt: new Date().toISOString(),
        message
    })
    console.log('Message:', userName, '->', message);

    broadcastUpdateMessages()
    res.status(201).json({ status: 201 })
})

app.get('/message', function (req, res) {
    res.status(201).json({ messages: messages, status: 201 })
})

wss.on('connection', (ws) => {
    console.log('A new WS client connected.');

    // Event listener for incoming messages
    ws.on('message', (message) => {
        console.log('Received WS message:', message.toString());

        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    // Event listener for client disconnection
    ws.on('close', () => {
        console.log('A WS client disconnected.');
    });
});


console.log('You can use http://127.0.0.1:3000')
app.listen(3000)