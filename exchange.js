
function exchange()
{
   const incomingBarCode = document.getElementById("incmg_BarCode").value;
   const outgoingBarCode = document.getElementById("otgng_BarCode").value;
   const exchangeAmount = parseInt(document.getElementById("exch_Amount").value);

   getItemfromDBforExchange(incomingBarCode).then(ingData =>
   {
      console.log("Incoming Barcode Found ", ingData);
      getItemfromDBforExchange(outgoingBarCode).then(otgData =>
      {
         ingData[0].quantity++;
         otgData[0].quantity--;
         console.log("OutGoing Barcode Found");
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
               console.log(data1);
               db.run('INSERT into exchange(date, \
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
      console.log('before db all')
      db.all('SELECT * FROM inventory WHERE barCode=?', [enteredBarCode], (error, data) =>
      {
         console.log(data)
         if(error)
            reject(error);
         else
            resolve(data);

      });
   });
}


function updateExchgInvtinDB(data)
{
   var qty = data[0].quantity;
   var barcode = data[0].barCode;

   return new Promise ((resolve, reject) =>
   {
      db.run('UPDATE inventory SET quantity = ? WHERE barCode = ?', [qty, barcode],
      function (err)
      {
         if(err)
         {
            reject(err);
         }
         else
            resolve();
      })
   })
}
