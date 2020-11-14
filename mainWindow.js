 const ipcRenderer = require("electron").ipcRenderer;

 // cannot send message to other windows directly https://github.com/electron/electron/issues/991
 function sendCommandToWorker(content) {
     console.log(content);
     ipcRenderer.send("printLabel", content);
 }

 document.getElementById("btn").addEventListener("click", () => {
     // send whatever you like
     var hello = {}
     hello.name = "This is name";
     hello.age = "This is age";
     hello.number = 20;
     sendCommandToWorker(hello);
 });
