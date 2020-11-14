//const { app, BrowserWindow } = require('electron')

const {app, BrowserWindow, Menu, ipcMain, shell} = require("electron");
// const os = require("os");
// const fs = require("fs");
// const path = require("path");

let mainWindow = undefined;
let workerWindow = undefined;

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile("./index.html");
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
      // close worker windows later
      mainWindow = undefined;
  });

  //Print window
  printWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  printWindow.loadFile("./printWindow_Temp.html");
  // workerWindow.hide();
  printWindow.webContents.openDevTools();
  printWindow.on("closed", () => {
      printWindow = undefined;
  });
}

// retransmit it to workerWindow
ipcMain.on("printLabel", (event, data) => {
    console.log(event, data);
    printWindow.webContents.send("printLabel", data);
});
// when worker window is ready
// ipcMain.on("readyToPrintPDF", (event) => {
//     const pdfPath = path.join(os.tmpdir(), 'print.pdf');
//     // Use default printing options
//     workerWindow.webContents.printToPDF({}).then((data) {
//         fs.writeFile(pdfPath, data, function (error) {
//             if (error) {
//                 throw error
//             }
//             shell.openItem(pdfPath)
//             event.sender.send('wrote-pdf', pdfPath)
//         })
//     }).catch((error) => {
//        throw error;
//     })
// });


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
