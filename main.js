//const { app, BrowserWindow } = require('electron')

const {app, BrowserWindow, Menu, ipcMain, shell} = require("electron");
// const os = require("os");
// const fs = require("fs");
// const path = require("path");

var printOptions = {
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


let mainWindow = undefined;
let printWindow = undefined;
app.allowRendererProcessReuse = false;

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile("./sales.html");
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {

      // close worker windows later
      mainWindow = undefined;
      printWindow.close();
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
  printWindow.hide();
  printWindow.webContents.openDevTools();
  printWindow.on("closed", () => {
      printWindow = undefined;
  });
}

// retransmit it to printWindow
ipcMain.on("fillLabelinfo", (event, data) => {
    console.log(event, data);
    printWindow.webContents.send("fillLabelinfo", data);
});

// when worker window is ready
ipcMain.on("printLabel", (event) => {
    printWindow.webContents.print(printOptions, (success, failureReason) => {
      if (!success)
         console.log(failureReason);
    });
});


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
