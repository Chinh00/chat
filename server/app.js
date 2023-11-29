const express = require('express')
const http = require("http");
const app = express();
const port = 4000
const fs = require('fs');
const server = http.createServer(app);
const cors = require("cors")
const socketIo = require("socket.io")(server);

const path = require('path');
const connectionIpAddress = {}
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())
socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
    console.log("New client connected" + socket.id);
    
    
    connectionIpAddress[socket.id] = socket.request.connection.remoteAddress
    console.log(socket.request.connection.remoteAddress)
    socketIo.emit("updateTotalUser", socketIo.engine.clientsCount)
    socketIo.emit("updateInfoUser", connectionIpAddress)
    socket.on("sendFile", async function (name, data) {
        await fs.writeFileSync("./public/" + name, data)
        socket.emit("sendFileServer", path.join(__dirname, 'public', name) )
    })
    
    
    
    

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