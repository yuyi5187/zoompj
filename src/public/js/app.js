const socket=io();

const welcome=document.getElementById("welcome");
const form=welcome.querySelector("form");

function handleRoomSubmint(event){
    event.preventDefault();
    const input=form.querySelector("input");
    socket.emit("enter_room", {payload:input.value}, ()=>{
        console.log("Server is done!");
    });
    input.value=""
}

form.addEventListener("submit", handleRoomSubmint);