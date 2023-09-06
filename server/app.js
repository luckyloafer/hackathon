require('dotenv').config();
const express = require('express');
const app = express();
require('./db/conn');
const router  = require('./routers/router');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(router);
app.use("/uploads", express.static("./uploads"));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});



io.on("connection", (socket) => {
    //console.log(socket.id);

    socket.on('join_room', (data) => {
        console.log("join_room - ", data)
        socket.join(data);
        
    })

    socket.on('send_message', (data) => {
        console.log( "send_message received in server - ",data.room)
        socket.to(data.room).emit('received_message', data);
    })

    socket.on('auctionStarted',(data)=>{
        console.log("auctionStarted received in server- ",data);
        const to = data;
        socket.to(data).emit(data,data);
    })
    socket.on('disconnecting', () => {
        const rooms = Object.keys(socket.rooms);
        rooms.forEach((room) => {
            if (room !== socket.id) {
                console.log(`User ${socket.id} disconnected from room ${room}`);
                // Your custom logic here for handling user disconnection from the room
            }
        });
    });
})
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log('server is running');
})