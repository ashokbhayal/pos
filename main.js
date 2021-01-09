//const { app, BrowserWindow } = require('electron')

const {app, BrowserWindow, Menu, ipcMain, shell} = require("electron");
// const os = require("os");
// const fs = require("fs");
// const path = require("path");



let mainWindow = undefined;
let printWindow = undefined;
app.allowRendererProcessReuse = false;


var Inventory_printOptions = {
    preview: true,
    silent: true,
    printBackground: false,
    //deviceName: 'Canon LBP2900',
    deviceName: 'TSC TTP-244 Pro',
   //deviceName: 'EPSON TM-T82 Receipt',
   //  pageSize: {
   //    height: 140000,
   //    width: 70000
   // },
    color: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
}



var sales_printOptions = {
    preview: true,
    silent: true,
    margin: '0 0 0 0',
    printBackground: false,
    deviceName: 'EPSON TM-T82 Receipt',
    color: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1
}

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

  //Sticker Print window
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

  //Sales print window
  salesPrintWindow = new BrowserWindow({
     width: 800,
     height: 600,
     webPreferences: {
        nodeIntegration: true
     }
  })
  salesPrintWindow.loadFile("./salesPrint.html");
  salesPrintWindow.webContents.openDevTools();
  salesPrintWindow.on("closed", () => {
     salesPrintWindow = undefined;
  });

}

// retransmit it to printWindow
ipcMain.on("fillLabelinfo", (event, data) => {
    console.log(event, data);
    printWindow.webContents.send("fillLabelinfo", data);
});

// when worker window is ready
ipcMain.on("printLabel", (event) => {
    printWindow.webContents.print(Inventory_printOptions, (success, failureReason) => {
      if (!success)
         console.log(failureReason);
    });
});


ipcMain.on("fill_Estimate_Print", (event, data) => {
    console.log("Trigerred Event ", data);
    salesPrintWindow.webContents.send("fill_Estimate_Print", data);
})


// Print Estimate window is ready
ipcMain.on("printEstimate", (event) => {
    salesPrintWindow.webContents.print(sales_printOptions, (success, failureReason) => {
      if (!success)
         console.log(failureReason);
    });
});


ipcMain.on("fill_Estimate_Total", (event, data) => {
    console.log("Trigerred Event ", data);
    salesPrintWindow.webContents.send("add_Estimate_Total", data);
})


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
