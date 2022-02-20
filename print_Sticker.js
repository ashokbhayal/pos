module.exports = print_StickerFn;
const ipcRenderer = require("electron").ipcRenderer;
const JsBarcode = require("JsBarcode");

var hdrName = document.getElementsByClassName("shopName");
var landingPrice = document.getElementsByClassName("landing_Price");
var art_no =  document.getElementsByClassName("art_no");
var mrp_p = document.getElementsByClassName("mrp_p");


function clearClassVal()
{
   var idx = 0;

   // for(idx; idx < document.getElementsByClassName("shopName").length; idx++)
   //    hdrName[idx].innerHTML = "";

   for(idx = 0; idx < document.getElementsByClassName("art_no").length; idx++)
      art_no[idx].innerHTML = "";

   for(idx = 0; idx < document.getElementsByClassName("mrp_p").length; idx++)
      mrp_p[idx].innerHTML = "MRP: ";

}

// JsBarcode("#barcode", "TestCode");

ipcRenderer.on("fillLabelinfo", (content,data) =>
{
   var idx = 0;

   clearClassVal();

   for(idx = 0; idx < document.getElementsByClassName("art_no").length; idx++)
   {
      art_no[idx].innerHTML += data.codedInital + "&nbsp&nbsp" + data.partyName;
   }

   for(idx = 0; idx < document.getElementsByClassName("mrp_p").length; idx++)
   {
      mrp_p[idx].innerHTML += data.sellingPrice;
   }

   JsBarcode("#barcode", ("00000000" + data.barCode).slice(-8), {
     format: "CODE128",
     width: 2,
     height: 30,
     textAlign: "center",
     fontSize: 20,
     font: "Arial",
     fontOptions: "bold",
     displayValue: true,
     margin: 0
   });
   console.log(data);

   ipcRenderer.send("printLabel", data);
   // printWindow.webContents.print(Inventory_printOptions, (success, failureReason) => {
   //    if (!success)
   //       console.log(failureReason);
   // });
});


function getDatafromDB(barCode)
{
   return new Promise ((resolve, reject) =>
   {
      let values;

      let db = SQL_GB.dbOpen(dbPath);

      var statement = db.prepare('SELECT * FROM inventory WHERE barCode = ?',[barCode]);
      try {
         if (statement.step())
         {
            console.log(statement.getAsObject());
            item_Details = statement.getAsObject();
            resolve(item_Details);
         }
         else {
           console.log('Error')
           reject();
        }
      }
      finally{
         SQL_GB.dbClose(db, dbPath);
      }
   });
}


function printExcessSticker()
{
   var coded_Inital = [];
   var barCode;
   barCode = parseInt(document.getElementById("print_BarCode_textArea").value);

   getDatafromDB(barCode).then(data =>
   {
      console.log(data);
      var landing_Price = data.landingPrice;
      for(idx = 0; landing_Price > 0; idx++)
      {
         var value = (landing_Price % 10);
         coded_Inital[idx] = shop_Inital[value];
         // coded_Inital = coded_Inital.concat(shop_Inital[value]);
         landing_Price = parseInt((landing_Price / 10));
      }

      coded_Inital = coded_Inital.reverse();
      coded_Inital = coded_Inital.join("");

      data.codedInital = coded_Inital;
      print_StickerFn(data, barCode);
   });

   document.getElementById("print_BarCode_textArea").value = "";

}


function print_StickerFn(item_Details, next_barCode)
{
   item_Details.barCode = next_barCode;
   ipcRenderer.send("fillLabelinfo", item_Details);
}
