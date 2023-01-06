// const sqlite3 = require('sqlite3').verbose();
// const db = require('better-sqlite3')
// const $ = require('jquery');
// var sales_print_tableAppend = require('./salesPrint');
// const jsonfile = require('jsonfile');
// const fs = require('fs');
const ipcRenderer = require("electron").ipcRenderer;

var enteredBarCode = "";
var sale_list = [];
var subTotal = 0;
var discount = 0;
var grandTotal = 0;
var total_t = {};
var test_Var = 0;
const unsettled_file = './unsettled.json';

// get data from db
// store into global array`
// loop through array and show the table
// 1-n rows
// index, name
// delete -> extract name, and id
// delete from database
// on sucess delete from array, and repaint the dom

var subtotal_ValID = document.getElementById("subtotal_th_val");

// window.addEventListener('load',function(){

// })


// document.getElementById("content").innerHTML='<object type="text/html" data="home.html" ></object>';

// if (window.location.href == 'file:///C:/POS/pos/sales.html') {
//     console.log("this is index page ", String(window.location.href = '../'));
// }
const table_addDelHandler = document.getElementById('sales_table');
table_addDelHandler.addEventListener('click',handleDelete)

function reset_total()
{
   subTotal = 0;
   discount = 0;
   grandTotal = 0;
}


function reset_idx()
{
   for(idx1 = 0; idx1 < sale_list.length; idx1++)
   {
      sale_list[idx1].index = idx1;
   }
}

// Handle when an item is deleted from the list
function handleDelete(){
   const {classList, name} = event.target
   if( !classList.value.includes("row-delete") ){
      return
   }

   let removeVal = Number(name);

   // Reduce the quantity
   sale_list.forEach((item) =>
   {
      if(item.index == removeVal)
      {
         if(item.Selling_quantity > 1)
            item.Selling_quantity--;
         else
            sale_list = sale_list.filter((item) => item.index !== removeVal)
      }
   });

   // reset_total();
   reset_idx();
   clear_Table(table_addDelHandler);
   makeEntryInTable();
   calculateSubTotal();
}


// This function is  called when there is change in discount drop down
function add_subTotal(sel)
{

   var idx = sel.options[sel.selectedIndex].value;
   console.log(idx);
   if(sel.options[sel.selectedIndex].text == "Yes")
   {
      sale_list[idx].discount = 1;
      console.log("Yes Discount");
   }
   else if(sel.options[sel.selectedIndex].text == "No")
   {
      sale_list[idx].discount = 0;
      console.log("No Discount");
   }

   calculateSubTotal();
}

function calculateSubTotal()
{
   // Reset the total before calculating the full value
   reset_total();

   for (idx = 0; idx < sale_list.length; idx++)
   {
      subTotal += (sale_list[idx].sellingPrice * sale_list[idx].Selling_quantity);
      console.log("subTotal is ", subTotal);

      if(sale_list[idx].discount == 1)
      {
         discount += (sale_list[idx].sellingPrice * 0.1 * sale_list[idx].Selling_quantity);
         console.log("Discount ", discount, "and ", sale_list[idx].sellingPrice * 0.1);
      }
   }

   // grandTotal = subTotal - discount;

   grandTotal = subTotal;

   total_t.subTotal = subTotal;
   total_t.discount = discount;
   total_t.grandTotal = grandTotal;

   document.getElementById("subtotal_th_val").textContent = subTotal;
   document.getElementById("discount_td_val").textContent = discount;
   document.getElementById("total_th_val").textContent = grandTotal;

   ipcRenderer.send("fill_Estimate_Total", total_t);

}

function enter_Content(event)
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
      var table = document.getElementById("sales_table").getElementsByTagName('tbody')[0];

      enteredBarCode = parseInt(enteredBarCode);

      getItemfromDB(enteredBarCode).then(data =>
      {
         if(data.length != 0)
         {
            var entry_Found = true;

            var sellingItemDetails = data[0];
            sellingItemDetails.Selling_quantity = 1;

            // Check for same entry
            if(sale_list.length != 0)
            {
               for(idx = 0; idx < sale_list.length; idx++)
               {
                  console.log(sellingItemDetails.barCode);
                  if(sale_list[idx].barCode == sellingItemDetails.barCode)
                  {
                     // Entry found and increase the quantity
                     sale_list[idx].Selling_quantity++;
                     entry_Found = true;
                     break;
                  }
                  else
                     entry_Found = false;
               }
            }
            else
               sale_list.push(sellingItemDetails);

            // Enter new item if not found
            if(entry_Found == false)
            {
               sale_list.push(sellingItemDetails);
            }
            console.log(sale_list);

            // 1) Clear and Re-Enter the components of the table from first
            // 2) Increase qty if same qty found
            // 3) Reset Total
            // 4) Calcualte Total
            // 5) Settle
            clear_Table(table).then(function()
            {
               //Table is not present, no point in searching using id on page
               var  tempVal = 'B';
               tempVal += sellingItemDetails.barCode;
               tempVal = String(tempVal);

               makeEntryInTable();
               calculateSubTotal();
             }
           );
         }
         else
         {
            alert("Entry Not Found");
         }

         // Clear the barcode textara once entry is done
         clear_Barcode(event);

      }) .catch(err => {
         clear_Barcode(event);
         console.log("Error ", err);
      });
   }
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
            console.log("Values: ", values, "Columns ", columns);
            // return _rowsFromSqlDataObject({values: values, columns: columns})
         } else {
            console.log('model.getPeople', 'No data found for person_id =', pid)
         }
      } catch (error) {
         console.log('model.getPeople', error.message)
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


function __updateUndoneSettlement()
{
   var total_landingPrice = 0;

   console.log(date);

   date = new Date;

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
   console.log("Time is ", time_Str);

   if(sale_list.length == 0)
      return;

   for(item of sale_list)
   {
      total_landingPrice += (item.landingPrice * item.Selling_quantity);
   }

   // Billing amount is adjusted to subTotal to
   // avoid confusion during settelemt
   // var total_sellingPrice = grandTotal;
   var total_sellingPrice = subTotal;
   var salesTable_Str = JSON.stringify(sale_list);

   let db = SQL_GB.dbOpen(dbPath);

   db.exec('INSERT into settlement_pending(date, \
                                          time, \
                                          description, \
                                          landingPrice, \
                                          billingAmount) \
                                          values (?, ?, ?, ?, ?)',
                                          [dateStr,
                                           time_Str,
                                           salesTable_Str,
                                           total_landingPrice,
                                           total_sellingPrice],
                                           function(err)
   {
      if(err)
      {
         alert("Failed to update the database");
         console.log(err);
      }
      else {
         total_landingPrice = 0;
      }
   })

   SQL_GB.dbClose(db ,dbPath);

   //priceCalculator_UpdateDB(sale_list);
}

function sales_print()
{
   // Update the settlement
   __updateUndoneSettlement();
   ipcRenderer.send("fill_Estimate_Print", sale_list);

   document.getElementById("sales_Button").disabled = true;
   setTimeout(function() {
      document.getElementById("sales_Button").disabled = false;
   }, 3000);
}

function clear_Barcode(event)
{
   enteredBarCode = "";
   document.getElementById("price_textArea").value = "";
   event.preventDefault();
}



function new_Sale()
{
   var table = document.getElementById("sales_table").getElementsByTagName('tbody')[0];
   sale_list = [];
   calculateSubTotal();
   clear_Table(table);

   document.getElementById("newSale_Button").disabled = true;
   setTimeout(function() {
      document.getElementById("newSale_Button").disabled = false;
   }, 3000);

}



// TODO: Fix the button, table is not clearing properly
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



function makeEntryInTable()
{
   var table = document.getElementById("sales_table").getElementsByTagName('tbody')[0];

   for(idx = 0; idx < sale_list.length; idx ++)
   {
      const { description, id, sellingPrice, barCode, Selling_quantity } = sale_list[idx];

      sale_list[idx].index = idx;

      var row = document.createElement('tr') ;

      //* use a create table row function,
      //* which takes data and returns element
      const desc = document.createElement("td")

      const qty = document.createElement("td")
      qty.setAttribute("name", "name_qty");

      const sp = document.createElement("td")
      sp.setAttribute("name", "sp");

      const delContainer = document.createElement('td')
      const delButton = document.createElement("button")

      const dropDownContainer = document.createElement('td')
      const dropDownSel = document.createElement("select")
      dropDownSel.setAttribute("onchange", "add_subTotal(this)")
      const optionYes = document.createElement("option")
      const optionNo = document.createElement("option")

      optionYes.text = "Yes";
      optionYes.value = idx;

      optionNo.text = "No";
      optionNo.value = idx;

      sale_list[idx].discount = 1;
      console.log(sale_list);

      //TODO: change ID to barcode
      // "B"+String(barCode)
      row.setAttribute("id", idx);

      // Discount Yes or No
      dropDownSel.setAttribute("class", "mdb-select md-form")
      // dropDownBtn.setAttribute("data-toggle", "collapse");
      // dropDownBtn.setAttribute("data-target", "#table");
      dropDownContainer.style.textAlign = "right"
      dropDownSel.add(optionYes);
      dropDownSel.add(optionNo);
      // dropDownBtn.setAttribute("")
      dropDownContainer.appendChild(dropDownSel);

      // Description of product
      desc.textContent = description
      desc.style.textAlign = "left"

      // Delete Button
      delButton.setAttribute("class","btn btn-primary row-delete")
      delButton.name = idx;
      delButton.textContent = "DELETE"
      delContainer.appendChild(delButton)
      delContainer.style.textAlign = "center"

      // Quantity
      qty.textContent = Selling_quantity;
      qty.style.textAlign = "center"

      // Selling Price
      sp.textContent = sellingPrice
      sp.style.textAlign = "right"

      row.append( desc, qty, sp, delContainer, dropDownContainer)
      table.append(row)
   }
}
