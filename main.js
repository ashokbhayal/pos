//const { app, BrowserWindow } = require('electron')

const {app, BrowserWindow, Menu, ipcMain, shell} = require("electron");
// const os = require("os");
// const fs = require("fs");
// const path = require("path");



let mainWindow = undefined;
let printWindow = undefined;
app.allowRendererProcessReuse = false;


var Inventory_printOptions = {
    preview: false,
    silent: true,
    printBackground: true,
    //deviceName: 'Canon LBP2900',
    // deviceName:'Canon G3010 series',
   // deviceName: 'TSC TTP-244 Pro',
    deviceName: 'SNBC TVSE LP 46 NEO BPLE',
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
  mainWindow.maximize();
  // mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {

      // close worker windows later
      mainWindow = undefined;
      printWindow.close();
      salesPrintWindow.close();
      settlementPrintWindow.close();
      exchangePrintWindow.close();
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
  salesPrintWindow.hide();
  salesPrintWindow.webContents.openDevTools();
  salesPrintWindow.on("closed", () => {
     salesPrintWindow = undefined;
  });

  //Settlement print window
  settlementPrintWindow = new BrowserWindow({
     width: 800,
     height: 600,
     webPreferences: {
        nodeIntegration: true
     }
  })
  settlementPrintWindow.loadFile("./settlement_print.html");
  settlementPrintWindow.hide();
  settlementPrintWindow.webContents.openDevTools();
  settlementPrintWindow.on("closed", () => {
     settlementPrintWindow = undefined;
  });

  //Settlement print window
  exchangePrintWindow = new BrowserWindow({
     width: 800,
     height: 600,
     webPreferences: {
        nodeIntegration: true
     }
  })
  exchangePrintWindow.loadFile("./exchange_print.html");
  exchangePrintWindow.hide();
  exchangePrintWindow.webContents.openDevTools();
  exchangePrintWindow.on("closed", () => {
     exchangePrintWindow = undefined;
  });

}

// retransmit it to printWindow
ipcMain.on("fillLabelinfo", (event, data) => {
    // console.log(event, data);
    printWindow.webContents.send("fillLabelinfo", data);
});

// when label print window is ready
ipcMain.on("printLabel", (event, data) => {
   console.log("In printLabel IPC ", data);
   if((data.withBox) == 0)
      Inventory_printOptions.copies = Math.ceil((data.qty/2));
   else
      Inventory_printOptions.copies = data.qty;

    console.log("Print Values ", Inventory_printOptions);

    printWindow.webContents.print(Inventory_printOptions, (success, failureReason) => {
      if (!success)
         console.log(failureReason);
    });
});


ipcMain.on("fill_Estimate_Print", (event, data) => {
    console.log("Trigerred Event ", data);
       salesPrintWindow.webContents.send("fill_Estimate_Print", data);
})

ipcMain.on("fill_settlement_Print", (event, data) => {
    console.log("Trigerred Event ", data);
    settlementPrintWindow.webContents.send("fill_settlement_Print", data);
})

ipcMain.on("fill_Exchange_Print", (event, data) => {
    // console.log("Trigerred Event ", data);
       exchangePrintWindow.webContents.send("fill_Exchange_Print", data);
})

// Print Estimate window is ready
ipcMain.on("printEstimate", (event) => {
    salesPrintWindow.webContents.print(sales_printOptions, (success, failureReason) => {
      if (!success)
         console.log(failureReason);
    });
});


ipcMain.on("printSettlement", (event) => {
    settlementPrintWindow.webContents.print(sales_printOptions, (success, failureReason) => {
      if (!success)
         console.log(failureReason);
    });
});


ipcMain.on("fill_Estimate_Total", (event, data) => {
    console.log("Trigerred Event ", data);
    salesPrintWindow.webContents.send("add_Estimate_Total", data);
})

ipcMain.on("printExchange", (event) => {
    exchangePrintWindow.webContents.print(sales_printOptions, (success, failureReason) => {
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
