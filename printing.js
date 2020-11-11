let {BrowserWindow} = require('electron')
const fs = require('fs')
const ptp = require('pdf-to-printer')

let mainWindow = BrowserWindow.getCurrentWebContents();

var pdfOpts = {
  marginsType: 1,
  pageSize: {
    height: 25400,
    width: 101600
  }
};

const optionsPDF = {
printer: "Canon LBP2900"
};

function printKar()
{
   console.log("this file is loaded");
   //mainWindow.loadURL(`file://${__dirname}/printing.html`)

   mainWindow.webContents.on('did-finish-load', function() {
   mainWindow.webContents.printToPDF(pdfOpts, function(error, data)
   {
      if (error)
         throw error;

      fs.writeFile('./pdf/PDF_test.pdf', data, function(error)
      {
         if (error)
            throw error;

         console.log('Write PDF successfully.');
         console.log('Printng the Pdf');
         ptp.print("./pdf/PDF_test.pdf", optionsPDF)
            .then(console.log)
            .catch(console.error);
      });
   });
})
}
