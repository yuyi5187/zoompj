import express from "express";
import WebSocket from "ws";
import http from "http";
import path from 'path';

const _dirname=path.resolve();

const app=express();

app.set("view engine", "pug");
app.set("views", _dirname+"/src/public/views");
app.use("/public", express.static(_dirname+"/src/public"));
app.get("/", (req,res)=> res.render("home"));
app.get("/*", (req,res)=> res.redirect("/"));

const handleListen=()=> console.log(`Listening on http://localhost:3000`);
//app.listen(3000, handleListen);
const server= http.createServer(app);
const wss= new WebSocket.Server({server});

/*function handleConnection(socket){
    console.log(socket);
} 
wss.on("connection", handleConnection);*/
wss.on("connection", (socket)=>{
    //console.log(socket);
    console.log("Connected to Browser ✔");
    socket.on("close", ()=> 
            console.log("DisConnected to Browser ❌"));
    socket.send("hello!!");
})

server.listen(3000,handleListen);