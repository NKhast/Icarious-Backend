const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors');

const { addUser, deleteUser, getUser, getGroupUser } = require('./user')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    socket.on('join', ({ name, group}, callback) => {
        const { error, user} = addUser({id: socket.id, name, group})

        if(error) return callback(error)


        socket.emit('message', {user: 'admin', text: `${user.name} Welcome to the group: ${user.group}`})
        socket.broadcast.to(user.group).emit('message', {user: 'admin', text: `${user.name}, has joined`})

        socket.join(user.group)

        io.to(user.group).emit('groupData', { group: user.group, users: getGroupUser(user.group) })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.group).emit('message', { user: user.name, text: message})
        io.to(user.group).emit('groupData', { group: user.group, users: getGroupUser(user.group) })
        callback()
    })

    socket.on('disconnect', () => {
        const user = deleteUser(socket.id)

        if(user){
            io.to(user.group).emit('message', { user: 'admin', text: `${user.name} has left the group`})
        }
    })
})

app.use(cors())
app.use(router)

server.listen(PORT, () => console.log(`The server is running on port ${PORT}`))