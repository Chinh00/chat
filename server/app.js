const express = require('express')
const http = require("http");
const app = express();
const port = 4000
const server = http.createServer(app);
const cors = require("cors")
const socketIo = require("socket.io")(server);

const connectionIpAddress = {}


app.use(cors())
socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
    console.log("New client connected" + socket.id);
    
    
    connectionIpAddress[socket.id] = socket.handshake.address
    socketIo.emit("updateTotalUser", socketIo.engine.clientsCount)
    socketIo.emit("updateInfoUser", connectionIpAddress)
    
    
    

    socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
        
        socketIo.emit("sendDataServer", socket.handshake.address, data);// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
    })

    socket.on("disconnect", () => {
        delete connectionIpAddress[socket.id]
        socketIo.emit("updateTotalUser", socketIo.engine.clientsCount)
        socketIo.emit("updateInfoUser", connectionIpAddress)
    });
});


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})