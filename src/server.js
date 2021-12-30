import express from "express";
//import WebSocket from "ws";
import http from "http";
import path from 'path';
import SocketIO from "socket.io";

const _dirname=path.resolve();
const app=express();

app.set("view engine", "pug");
app.set("views", _dirname+"/src/public/views");
app.use("/public", express.static(_dirname+"/src/public"));
app.get("/", (req,res)=> res.render("home"));
app.get("/*", (req,res)=> res.redirect("/"));

const handleListen=()=> console.log(`Listening on http://localhost:3000`);
const httpServer= http.createServer(app);
const wsServer=SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("enter_room", (msg, done)=> {
        console.log(msg);
        setTimeout(()=>{
            done();
        }, 10000);
    });
})

/*const wss= new WebSocket.Server({server});

function onSocketClose(){
    console.log("DisConnected to Browser ❌");
}
function onSocketMessage(message){
    console.log(message.toString('utf8'));
}

const sockets=[];

wss.on("connection", (socket)=>{
    //console.log(socket);
    sockets.push(socket);
    socket["nickname"]="Anon";
    console.log("Connected to Browser ✔");
    socket.on("close", onSocketClose);
    socket.on("message", (msg)=>{
        const message=JSON.parse(msg);
        //console.log(parsed, message.toString('utf8'));
        switch(message.type){
            case "new_message":
                //각 브라우저를 aSocket으로 인식하고 메세지를 보낸다
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":
                //console.log(message.payload);
                socket["nickname"]=message.payload;
        }
        
    });
    //socket.send("hello!!");
});
*/
httpServer.listen(3000,handleListen);



