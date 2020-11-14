const electron = require('electron')
// Importing BrowserWindow from Main
const BrowserWindow = electron.remote.BrowserWindow;

var printSticker_Btn = document.getElementById('printSticker_Btn');

var options = {
    preview: true,
    silent: true,
    printBackground: false,
    //deviceName: 'Canon LBP2900',
    deviceName: 'TSC TTP-244 Pro',
   //  pageSize: {
   //    height: 140000,
   //    width: 70000
   // },
    color: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
}

printSticker_Btn.addEventListener('click', (event) => {
    let win = BrowserWindow.getFocusedWindow();
    // let win = BrowserWindow.getAllWindows()[0];

    win.webContents.print(options, (success, failureReason) => {
        if (!success) console.log(failureReason);

        console.log('Print Initiated');
        console.log(options);
        //console.log(win);
    });
});




// Found from stackoverFlow

import {app, BrowserWindow, Menu, ipcMain, shell} from "electron";
const os = require("os");
const fs = require("fs");
const path = require("path");

let mainWindow: Electron.BrowserWindow = undefined;
let workerWindow: Electron.BrowserWindow = undefined;

async function createWindow() {

    mainWindow = new BrowserWindow();
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
        // close worker windows later
        mainWindow = undefined;
    });

    workerWindow = new BrowserWindow();
    workerWindow.loadURL("file://" + __dirname + "/worker.html");
    // workerWindow.hide();
    workerWindow.webContents.openDevTools();
    workerWindow.on("closed", () => {
        workerWindow = undefined;
    });
}

// retransmit it to workerWindow
ipcMain.on("printPDF", (event: any, content: any) => {
    console.log(content);
    workerWindow.webContents.send("printPDF", content);
});
// when worker window is ready
ipcMain.on("readyToPrintPDF", (event) => {
    const pdfPath = path.join(os.tmpdir(), 'print.pdf');
    // Use default printing options
    workerWindow.webContents.printToPDF({}).then((data) {
        fs.writeFile(pdfPath, data, function (error) {
            if (error) {
                throw error
            }
            shell.openItem(pdfPath)
            event.sender.send('wrote-pdf', pdfPath)
        })
    }).catch((error) => {
       throw error;
    })
});




<head>
</head>
<body>
    <button id="btn"> Save </button>
    <script>
        const ipcRenderer = require("electron").ipcRenderer;

        // cannot send message to other windows directly https://github.com/electron/electron/issues/991
        function sendCommandToWorker(content) {
            ipcRenderer.send("printPDF", content);
        }

        document.getElementById("btn").addEventListener("click", () => {
            // send whatever you like
            sendCommandToWorker("<h1> hello </h1>");
        });
    </script>
</body>





<head> </head>
<body>
    <script>
        const ipcRenderer = require("electron").ipcRenderer;

        ipcRenderer.on("printPDF", (event, content) => {
            document.body.innerHTML = content;

            ipcRenderer.send("readyToPrintPDF");
        });
    </script>
</body>
