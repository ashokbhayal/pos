const ipcRenderer = require("electron").ipcRenderer;

function load_Settlement()
{
   var table = document.getElementById("settlement_table").getElementsByTagName('tbody')[0];
   var total_landingPrice = 0;
   var total_sellingPrice = 0;
   var description_str;

   clear_Table(table);

   get_UnsettledEntry().then ((data)=>
   {
      console.log("Unsettled Entries are ", data);
      data.forEach(element => {
         const {date, time, landingPrice, billingAmount} = element;

         description_str = JSON.parse(element.description);
         console.log(description_str);

         var row = document.createElement('tr') ;

         const date_tr = document.createElement("td")
         const time_tr = document.createElement("td")
         const landingPrice_tr = document.createElement("td")
         const billingAmount_tr = document.createElement("td")
         const paidAmount_tr = document.createElement("td")
         const paidby_Container_tr = document.createElement("td")
         const description_tr = document.createElement("td")

         description_tr.textContent = element.description;
         description_tr.style.display = "none";

         date_tr.textContent = date;
         date_tr.style.textAlign = "left";

         time_tr.textContent = time;
         time_tr.style.textAlign = "left";

         description_str.forEach(item => {
            console.log(item);
            total_landingPrice += (item.landingPrice * item.Selling_quantity);
            // total_sellingPrice += (item.sellingPrice * item.Selling_quantity);
         });

         landingPrice_tr.textContent = total_landingPrice;
         landingPrice_tr.style.textAlign = "center";

         billingAmount_tr.textContent = billingAmount;
         billingAmount_tr.style.textAlign = "center";

         const paidAmount_tr_textArea = document.createElement("textarea");
         paidAmount_tr_textArea.classList.add("param_textarea");
         paidAmount_tr_textArea.classList.add("form-control");
         paidAmount_tr_textArea.setAttribute("rows", "1");
         // paidAmount_tr_textArea.setAttribute("resize", "none");

         paidAmount_tr.appendChild(paidAmount_tr_textArea);

         paidby_Container_Sel = document.createElement("select");
         paidby_Container_Sel.setAttribute("id", 'paidBy_DropDown');
         const optionCash = document.createElement("option")
         const optionCard = document.createElement("option")
         const optionGpay = document.createElement("option")

         optionCash.text = "CASH";
         optionCard.text = "CARD";
         optionGpay.text = "GPAY";

         paidby_Container_Sel.add(optionCash);
         paidby_Container_Sel.add(optionCard);
         paidby_Container_Sel.add(optionGpay);

         paidby_Container_tr.appendChild(paidby_Container_Sel);

         row.append( date_tr, time_tr, landingPrice_tr, billingAmount_tr, paidAmount_tr, paidby_Container_tr ,description_tr)
         table.append(row)

         total_landingPrice = 0;
         total_sellingPrice = 0;
      });
   }) .catch(err =>
   {
      console.log(err);
   });
}



async function complete_Settlement()
{
   var table = document.getElementById("settlement_table").getElementsByTagName('tbody')[0];

   var dateStr;
   var timeStr;
   var landingPrice;
   var billingAmount;
   var paidAmount;
   var paidById;
   var paidBy;
   var settlement_description;
   var settlementList = [];
   var settlementObj = {};

   console.log(table.rows.length);

   for(idx = 1; idx < table.rows.length; idx++)
   {
      paidAmount = table.rows[idx].cells[4].getElementsByTagName('textarea')[0].value;
      console.log("Paid amount is ",paidAmount);

      if(paidAmount != "")
      {
         dateStr = table.rows[idx].cells[0].textContent;
         timeStr = table.rows[idx].cells[1].textContent;
         landingPrice = table.rows[idx].cells[2].textContent;
         billingAmount = table.rows[idx].cells[3].textContent;

         // settlementObj.paidAmount = paidAmount;
         // settlementObj.timeStr = timeStr;
         // settlementObj.landingPrice = landingPrice;
         // settlementObj.billingAmount = billingAmount;

         paidById = document.getElementById('paidBy_DropDown');
         paidBy = paidById.options[paidById.selectedIndex].text

         // settlementObj.paidBy = paidBy;
         //
         // settlementList.push(settlementObj);

         settlement_description = table.rows[idx].cells[6].textContent;

         console.log(dateStr, timeStr, landingPrice, billingAmount, paidAmount, settlement_description);

         let db = SQL_GB.dbOpen(dbPath);

         if(paidAmount == 0)
         {
            console.log("Entered Zero");
            db.run('DELETE FROM settlement_pending WHERE time=?', [timeStr]);
            SQL_GB.dbClose(db ,dbPath);
            continue;
         }
         db.exec('INSERT into settlement_done(date, \
                                             time, \
                                             description, \
                                             landingPrice, \
                                             billingAmount, \
                                             paidAmount, \
                                             paidBy) \
                                             values (?, ?, ?, ?, ?, ?, ?)',
                                             [dateStr,
                                              timeStr,
                                              settlement_description,
                                              landingPrice,
                                              billingAmount,
                                              paidAmount,
                                              paidBy],
                                              function(err)
         {
            if(err)
            {
               alert("Failed to update the database");
               console.log(err);
            }
         })

         console.log("Inserting in ");

         // Delete from settlement
         db.run('DELETE FROM settlement_pending WHERE time=?', [timeStr]);

         dateStr = table.rows[idx].cells[0].textContent;
         timeStr = table.rows[idx].cells[1].textContent;
         settlement_description = table.rows[idx].cells[6].textContent;
         var item_Description = JSON.parse(settlement_description);

         for(idx1 = 0; idx1 < item_Description.length; idx1++)
         {
            db.exec('INSERT into sales(date, \
                                      time, \
                                      barCode, \
                                      description, \
                                      landingPriceperPC, \
                                      sellingPriceperPC, \
                                      quantity, \
                                      partyName) \
                                      values (?, ?, ?, ?, ?, ?, ?, ?)',
                                      [dateStr,
                                       timeStr,
                                       item_Description[idx1].barCode,
                                       item_Description[idx1].description,
                                       item_Description[idx1].landingPrice,
                                       item_Description[idx1].sellingPrice,
                                       item_Description[idx1].Selling_quantity,
                                       item_Description[idx1].partyName],
                                       function(err)
             {
               if(err)
               {
                  alert("Failed to update the database");
                  console.log(err);
               }
            })

            await getEntryFromDB(item_Description[idx1]).then(data =>
            {
               data[0].quantity -= item_Description[idx1].Selling_quantity;
               db.run('UPDATE inventory SET quantity=? WHERE barCode=?',[data[0].quantity, data[0].barCode]);
               console.log(item_Description[idx1]);
            })
         }
         SQL_GB.dbClose(db ,dbPath);
      }
      else
         console.log("Not entered Amount");
   }
   // ipcRenderer.send("fill_settlement_Print", settlementList);
   clear_Table(table);
}



function insertObject(arr, obj)
{
    arr.push(obj);
    console.log(arr);
}



function get_UnsettledEntry()
{
   return new Promise ((resolve, reject) =>
   {
      let values = [];

      let db = SQL_GB.dbOpen(dbPath);

      db.each('SELECT * FROM settlement_pending ORDER BY id', function(row)
      {
         insertObject(values, row);
         console.log(row);
      })

      SQL_GB.dbClose(db, dbPath)

      console.log(values);

      resolve(values);
   });
}



// Receive the entry from DB
async function getEntryFromDB(sale_list_Entry)
{
   return new Promise ((resolve, reject) =>
   {
      let values;

      let db = SQL_GB.dbOpen(dbPath);

      var statement = db.prepare('SELECT * FROM inventory WHERE barCode = ?',[sale_list_Entry.barCode]);

      try {
         if (statement.step()) {
            values = [statement.getAsObject()]
            let columns = statement.getColumnNames()
            console.log("Values: ", values, "Columns ", columns);
            // return _rowsFromSqlDataObject({values: values, columns: columns})
         } else {
            console.log('Error ', 'No data found for person_id =', pid)
         }
      } catch (error) {
         console.log('Error ', error.message)
      } finally {
         console.log("Closing DB");
         SQL_GB.dbClose(db, dbPath)
      }

      resolve(values);

   })
}


// The table must be sent as object rather than ID
function clear_Table(table_object)
{
   return new Promise(function(resolve, reject)
   {
      var getTable = table_object;
      var rowCount = getTable.rows.length;

      if(rowCount > 1)
      {
         for (var i = rowCount - 1; i > 0; i--)
            getTable.deleteRow(i);
      }
      else
      {
         console.log("Nothing to clear except header");
      }

      // Need to send a resolve
      resolve(1);
   });
}
