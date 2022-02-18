// const ipcRenderer = require("electron").ipcRenderer;

function addReturnItem(incomingBarCode, exchangeAmount)
{
   var outgoingBarCode = 0;
   // var amountPaid = exchangeAmount;
   getItemfromDBforExchange(incomingBarCode).then(ingData =>
   {
      ingData[0].quantity++;
      console.log("Incoming Barcode Found ", ingData);
      updateExchgInvtinDB(ingData).then(data =>
      {
         console.log("Successfully updated");
         let db = SQL_GB.dbOpen(dbPath);

         var dateStr = date.getDate().toString(10);
         dateStr = dateStr.concat(" ");
         dateStr = dateStr.concat(date.toLocaleString('default', {month: 'short'}));
         dateStr = dateStr.concat(" ");
         dateStr = dateStr.concat(date.getFullYear().toString(10));
         // console.log(date.toLocaleString('default', {month: 'short'}));

         var time_Str = date.getHours().toString(10);
         time_Str = time_Str.concat(":");
         time_Str = time_Str.concat(date.getMinutes().toString(10));
         time_Str = time_Str.concat(":");
         time_Str = time_Str.concat(date.getSeconds().toString(10));

         db.exec('INSERT into exchange(date, \
                                      time, \
                                      incomingBarCode, \
                                      outgoingBarCode, \
                                      amountPaid) \
                                      values (?, ?, ?, ?, ?)',
                                      [dateStr,
                                       time_Str,
                                       ingData[0].barCode,
                                       outgoingBarCode,
                                       exchangeAmount],
                                       function(err)
            {
                if(err)
                {
                   alert("Failed to update the database");
                   console.log(err);
                }
            })
         SQL_GB.dbClose(db ,dbPath);

         print_Exchange(ingData[0].barCode, outgoingBarCode, exchangeAmount);

         document.getElementById("incmg_BarCode").value = "";
         document.getElementById("otgng_BarCode").value = "";
         document.getElementById("exch_Amount").value = "";

      })
   })
}



function exchange()
{
   const incomingBarCode = parseInt(document.getElementById("incmg_BarCode").value);
   const outgoingBarCode = parseInt(document.getElementById("otgng_BarCode").value);
   const exchangeAmount = parseInt(document.getElementById("exch_Amount").value);

   if(outgoingBarCode == 0)
   {
      // Return
      console.log("Found Zero");
      addReturnItem(incomingBarCode, exchangeAmount);
      return;
   }
   getItemfromDBforExchange(incomingBarCode).then(ingData =>
   {
      console.log("Incoming Barcode Found ", ingData);
      getItemfromDBforExchange(outgoingBarCode).then(otgData =>
      {
         ingData[0].quantity++;
         otgData[0].quantity--;
         console.log("OutGoing Barcode Found", otgData);
         updateExchgInvtinDB(ingData).then(data =>
         {
            var dateStr = date.getDate().toString(10);
            dateStr = dateStr.concat(" ");
            dateStr = dateStr.concat(date.toLocaleString('default', {month: 'short'}));
            dateStr = dateStr.concat(" ");
            dateStr = dateStr.concat(date.getFullYear().toString(10));
            // console.log(date.toLocaleString('default', {month: 'short'}));

            var time_Str = date.getHours().toString(10);
            time_Str = time_Str.concat(":");
            time_Str = time_Str.concat(date.getMinutes().toString(10));
            time_Str = time_Str.concat(":");
            time_Str = time_Str.concat(date.getSeconds().toString(10));

            console.log("Date and time ", dateStr, time_Str, ingData[0].barCode,
            otgData[0].barCode, exchangeAmount);

            updateExchgInvtinDB(otgData).then(data1 =>
            {
               document.getElementById("incmg_BarCode").value = "";
               document.getElementById("otgng_BarCode").value = "";
               document.getElementById("exch_Amount").value = "";

               // console.log(data1);
               let db = SQL_GB.dbOpen(dbPath);

               db.exec('INSERT into exchange(date, \
                                            time, \
                                            incomingBarCode, \
                                            outgoingBarCode, \
                                            amountPaid) \
                                            values (?, ?, ?, ?, ?)',
                                            [dateStr,
                                             time_Str,
                                             ingData[0].barCode,
                                             otgData[0].barCode,
                                             exchangeAmount],
                                             function(err)
                  {
                      if(err)
                      {
                         alert("Failed to update the database");
                         console.log(err);
                      }
                  })
               SQL_GB.dbClose(db ,dbPath);

               print_Exchange(ingData[0].barCode, otgData[0].barCode, exchangeAmount);
            })
        })
     })
  }) .catch(err => {
      console.log("BarCode not Found");
      })
}


function getItemfromDBforExchange(enteredBarCode)
{
   console.log('inside getItemfromDB')
   return new Promise ((resolve, reject) =>
   {
      let values;

      let db = SQL_GB.dbOpen(dbPath);

      console.log('before db all')
      var statement = db.prepare('SELECT * FROM inventory WHERE barCode = ?',[enteredBarCode]);
      try {
         if (statement.step()) {
            values = [statement.getAsObject()]
            let columns = statement.getColumnNames()
            console.log("Values: ", values, "Columns ", columns);
            // return _rowsFromSqlDataObject({values: values, columns: columns})
         } else {
            console.log('Error ', 'No data found')
         }
      } catch (error) {
         console.log('Error ', error.message)
      } finally {
         console.log("Closing DB");
         SQL_GB.dbClose(db, dbPath)
      }

      resolve(values);
   });
}


function updateExchgInvtinDB(data)
{
   var qty = data[0].quantity;
   var barcode = data[0].barCode;

   return new Promise ((resolve, reject) =>
   {
      let db = SQL_GB.dbOpen(dbPath);

      db.run('UPDATE inventory SET quantity = ? WHERE barCode = ?', [qty, barcode],
      function (err)
      {
         if(err)
         {
            reject(err);
         }
      })
      SQL_GB.dbClose(db ,dbPath);
      resolve();

   })
}



function print_Exchange(incmgBarCode, outgngBarCode, Amount)
{
   var data = {};

   data.incmgBarCode = incmgBarCode;
   data.outgngBarCode = outgngBarCode;
   data.Amount = Amount;

   console.log("Calling Print Fn", incmgBarCode, outgngBarCode, Amount);
   ipcRenderer.send("fill_Exchange_Print", data);
}
