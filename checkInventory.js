enteredBarCode = "";



function clear_Barcode(event)
{
   enteredBarCode = "";
   document.getElementById("barcode_textArea").value = "";
   document.getElementById("qty_textArea").value = "";
   event.preventDefault();
}


function getItemfromDB(enteredBarCode)
{
   console.log('inside getItemfromDB')
   return new Promise ((resolve, reject) =>
   {
      console.log('before db all')

      let values;

      let db = SQL_GB.dbOpen(dbPath);
      var statement = db.prepare('SELECT * FROM inventory WHERE barCode IS ?', [enteredBarCode]);

      try {
         if (statement.step()) {
            values = [statement.getAsObject()]
            let columns = statement.getColumnNames()
            console.log("Values: ", values);
            // return _rowsFromSqlDataObject({values: values, columns: columns})
         } else {
            console.log('No data found for id =', enteredBarCode);
            document.getElementById("price_textArea_Inventory").value = "No Entry";
         }
      } catch (error) {
         console.log(error.message)
      } finally {
         SQL_GB.dbClose(db, dbPath)
      }
         //    reject(error);
         // else
         //    resolve(data);

      // });
       resolve(values);
   });
}


function check_Inventory_Enter(event)
{
   console.log(event.keyCode);
   while(event.keyCode != 13)
   {
      if(event.keyCode == 8)
      {
         enteredBarCode = enteredBarCode.slice(0, -1);
         break;
      }
      else
      {
         var keyValue = event.keyCode;
         if(keyValue >= 96 && keyValue <= 105)
         {
            keyValue -= 48;
         }
         enteredBarCode += String.fromCharCode(keyValue);
         console.log(enteredBarCode);
         break;
      }
   }
   if (event.keyCode == 13)
   {
      // var table = document.getElementById("sales_table").getElementsByTagName('tbody')[0];

      enteredBarCode = parseInt(enteredBarCode);
      getItemfromDB(enteredBarCode).then(data =>
      {
         if(data.length != 0)
         {
            var entry_Found = true;
            document.getElementById("price_textArea_Inventory").value = data[0].sellingPrice;
            insertInStockCheck(data[0]);
            // updateInventoryInQty(enteredBarCode);
         }
         else
         {
            alert("Entry Not Found");
         }
         clear_Barcode(event);

      }) . catch(err => {
         clear_Barcode(event);
         console.log("Error", err);
      })
   }

}function insertInStockCheck(item_Details_1)
{
   let db = SQL_GB.dbOpen(dbPath);

   console.log("Inserting in Purchase table");

   db.exec('INSERT into inventory_check(barCode , \
                                 date, \
                                 description, \
                                 landingPrice, \
                                 sellingPrice, \
                                 quantity, \
                                 partyName, \
                                 withBox) \
                                 values (?, ?, ?, ?, ?, ?, ?, ?)',
                                 [item_Details_1.barCode,
                                  item_Details_1.date,
                                  item_Details_1.description,
                                  item_Details_1.landingPrice,
                                  item_Details_1.sellingPrice,
                                  item_Details_1.qty,
                                  item_Details_1.partyName,
                                  item_Details_1.withBox],
                                  function(err)
   {
      if(err)
      {
         alert("Failed to update the database");
         console.log(err);
      }
      else {
         console.log("Updated");
      }
   });

   SQL_GB.dbClose(db, dbPath);

}

function updateInventoryInQty(add_barCode)
{
   return new Promise ((resolve, reject) =>
   {
      let values;

      let db = SQL_GB.dbOpen(dbPath);

      var statement = db.prepare('SELECT * FROM inventory WHERE barCode = ?',[add_barCode]);
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


function check_Inventory()
{
   console.log("Button Input");
   clear_Barcode(event);

}
