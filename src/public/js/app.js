const messageList=document.querySelector("ul");
const messageForm=document.querySelector("#message");
const nickForm=document.querySelector("#nick")
const socket=new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg={type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open",()=>{
    console.log("Connected to Server ✔");
});

socket.addEventListener("message", (message)=>{
    const li =document.createElement("li");
    li.innerText=message.data;
    messageList.append(li);
});

socket.addEventListener("message", (message)=>{
    console.log("New message: ",message.data);
});

socket.addEventListener("close",()=>{
    console.log("DisConnected to Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    //console.log(input.value);
    socket.send(makeMessage("new_message",input.value));
    const li =document.createElement("li");
    li.innerText=`You: ${input.value}`;
    messageList.append(li);
    input.value="";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input=nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value="";
};



nickForm.addEventListener("submit", handleNickSubmit);
messageForm.addEventListener("submit", handleSubmit);
/*
setTimeout(()=> {
    socket.send("hello from the browser!");
},10000);*/