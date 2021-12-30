const socket=io();

const welcome=document.getElementById("welcome");
const form=welcome.querySelector("form");
const room=document.getElementById("room");

room.hidden=true;
let roomName;

function addMessage(messages){
    const ul=room.querySelector("ul");
    const li=document.createElement("li");
    li.innerText=messages;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault(event);
    const input=room.querySelector("input");
    const value=input.value;
    socket.emit("new_message", input.value, roomName, ()=>{
        addMessage(`You: ${value}`);
    });
    input.value="";
}

function showRoom(){
    //console.log(`The backend says: `,msg);
    welcome.hidden=true;
    room.hidden=false;
    const h3=room.querySelector("h3");
    h3.innerText=`Room ${roomName}`;
    const form=room.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmint(event){
    event.preventDefault();
    const input=form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName=input.value;
    input.value="";
}

form.addEventListener("submit", handleRoomSubmint);


socket.on("welcome", ()=>{
    addMessage("someone joined!");
});

socket.on("bye", ()=>{
    addMessage("someone left ㅠㅠ");
});

socket.on("new_message", addMessage);
//(msg)=>{addMessage(msg)} 이므로 addMessage가능