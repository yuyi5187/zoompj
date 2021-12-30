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

function publicRooms() {
    const { 
        sockets: { 
            adapter: { sids, rooms },
    },
    } = wsServer;
    const publicRooms=[];
    rooms.forEach((_,key)=>{
        if(sids.get(key)===undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
    //const sids= wsServer.sockets.adapter.sids;
    //const rooms=wsServer.sockets.adapter.rooms;
}

function countRoom(roomName){
   return  wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"]="Anon";
    socket.onAny((event)=>{ //socket안의 event를 살피는 기능
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done)=> {
        //console.log(roomName);
        //user는 기본적으로 방에 들어가 있음 socket.id     
        //console.log(socket.id);
        socket.join(roomName);
        /*console.log(socket.rooms);
        setTimeout(()=>{
            done("hello from the backend"); //front-end에서 실행된 코드는 back-end가 실행시킨 것
        }, 15000);*/ 
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnecting",()=>{
        socket.rooms.forEach((room)=>
        socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
       
    });
    socket.on("disconnect", ()=>{
        wsServer.sockets.emit("room_change",publicRooms());
    });

    socket.on("new_message", (msg, room, done)=>{
        socket.to(room).emit("new_message", `${socket.nickname}:${msg}`);
        done();
    });
    socket.on("nickname", (nickname)=>(socket["nickname"]=nickname));
});

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
