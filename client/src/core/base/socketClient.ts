import {connect, io, Socket} from "socket.io-client"


class SocketClient {
    private socket: Socket
    
    constructor() {
        this.connect()
    }
    public connect() {
        this.socket = io("https://server-giy5.onrender.com", {
            transports: ["websocket", "polling", "flashsocket"],
            secure: false
        })
        console.log("Connect socket server ...")
    }
    public getSocket(){
        return this.socket
    } 
    
    
    
}

export default new SocketClient()