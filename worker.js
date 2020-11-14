const ipcRenderer = require("electron").ipcRenderer;

ipcRenderer.on("printLabel", (content,data) => {
   document.body.innerHTML = data.name;
   // 
   // hello.name = "This is name";
   // hello.age = "This is age";
   // hello.number = 20;

   //ipcRenderer.send("readyToPrintPDF");
});
