// const sqlite3 = require('sqlite3').verbose();
const $ = require('jquery');

var enteredBarCode = "";
var itemData = {};
var sale_list = [];
var subTotal = 0;
var discount = 0;
var grandTotal = 0;

// get data from db
// store into global array`
// loop through array and show the table
// 1-n rows
// index, name
// delete -> extract name, and id
// delete from database
// on sucess delete from array, and repaint the dom

var subtotal_ValID = document.getElementById("subtotal_th_val");

window.addEventListener('load',function(){
   const table = document.getElementById('sales_table');
   table.addEventListener('click',handleDelete)
})

function handleDelete(){
   const {classList, name} = event.target
   // console.log(classList)
   if( !classList.value.includes("row-delete") ){
      return
   }
   let barCode = Number(name)
   console.log('barcode',barCode)
}


function add_subTotal(sel)
{
   console.log(sale_list);

   var idx = sel.options[sel.selectedIndex].value;
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

   subTotal = 0;
   discount = 0;
   grandTotal = 0;

   for(idx1 = 0; idx1 < sale_list.length; idx1++)
   {
      calculateSubTotal(idx1);
   }
   //console.log(sel.options[sel.selectedIndex].text);
   //console.log(sel.options[sel.selectedIndex].value);

}

function calculateSubTotal(idx)
{
   subTotal += sale_list[idx].sellingPrice;
   console.log("subTotal is ", subTotal);

   if(sale_list[idx].discount == 1)
   {
      discount += (sale_list[idx].sellingPrice * 0.1);
      console.log("Discount ", discount, "and ", sale_list[idx].sellingPrice * 0.1);
   }

   grandTotal = subTotal - discount;

   document.getElementById("subtotal_th_val").textContent = subTotal;
   document.getElementById("discount_td_val").textContent = discount;
   document.getElementById("total_th_val").textContent = grandTotal;
}

function enter_Content(event)
{
   console.log(event.keyCode);
   while(event.keyCode != 13)
   {
      if(event.keyCode == 8)
      {
         console.log("Entered backspace");
         enteredBarCode = enteredBarCode.slice(0, -1);
         break;
      }
      else
      {
         enteredBarCode += String.fromCharCode(event.keyCode);
         console.log(enteredBarCode);
         break;
      }
   }
   if (event.keyCode == 13)
   {
      var table = document.getElementById("sales_table").getElementsByTagName('tbody')[0];

      // var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

      enteredBarCode = parseInt(enteredBarCode);

      getItemfromDB(enteredBarCode).then(data =>
      {
         if(data.length != 0)
         {
            //const { description, id, sellingPrice, barCode } = data[0];

            const { description, id, sellingPrice, barCode } = data[0];
            data[0] = { description, id, sellingPrice, barCode };
            sale_list.push(data[0]);

            var rowCount = table.rows.length;
            for (var i = rowCount - 1; i > 0; i--)
            {
                table.deleteRow(i);
            }

            const getEntryFromTable = document.getElementById(barCode);
            if(getEntryFromTable == null)
            {
               makeEntryInTable();
            }
            else {
               updateEntryInTable();
            }

            subTotal = 0;
            discount = 0;

            // TODO: Uncomment later
            // const getEntryFromTable = document.getElementById(barCode);
            // console.log(getEntryFromTable);
            //
            // if(getEntryFromTable == null)
            // {
            //    // sale_list.push(data[0]);
            //    // console.log(sale_list);
            //
            //    var row = document.createElement('tr') ;
            //
            //    //* use a create table row function,
            //    //* which takes data and returns element
            //    const desc = document.createElement("td")
            //
            //    const qty = document.createElement("td")
            //    qty.setAttribute("name", "name_qty");
            //
            //    const sp = document.createElement("td")
            //    sp.setAttribute("name", "sp");
            //
            //    const delContainer = document.createElement('td')
            //    const delButton = document.createElement("button")
            //
            //    const dropDownContainer = document.createElement('td')
            //    const dropDownSel = document.createElement("select")
            //    dropDownSel.setAttribute("onchange", "add_subTotal(0, this.value)")
            //    const optionYes = document.createElement("option")
            //    const optionNo = document.createElement("option")
            //
            //    // total_ob.subTotal = sellingPrice;
            //    // total_ob.discount = (sellingPrice-(sellingPrice * 0.1));
            //    // total_ob.total = total_ob.subTotal - total_ob.discount;
            //
            //    optionYes.text = "Yes";
            //    optionYes.value = (sellingPrice-(sellingPrice * 0.1));
            //
            //    optionNo.text = "No";
            //    optionNo.value = sellingPrice;
            //
            //    console.log(optionYes, optionNo);
            //
            //    row.setAttribute("id", barCode);
            //
            //    // Discount Yes or No
            //    dropDownSel.setAttribute("class", "mdb-select md-form")
            //    // dropDownBtn.setAttribute("data-toggle", "collapse");
            //    // dropDownBtn.setAttribute("data-target", "#table");
            //    dropDownContainer.style.textAlign = "right"
            //    dropDownSel.add(optionYes);
            //    dropDownSel.add(optionNo);
            //    // dropDownBtn.setAttribute("")
            //    dropDownContainer.appendChild(dropDownSel);
            //
            //    // Description of product
            //    desc.textContent = description
            //    desc.style.textAlign = "left"
            //
            //    // Delete Button
            //    delButton.setAttribute("class","btn btn-primary row-delete")
            //    delButton.name = barCode
            //    delButton.textContent = "DELETE"
            //    delContainer.appendChild(delButton)
            //    delContainer.style.textAlign = "center"
            //
            //    // Quantity
            //    qty.textContent = 1;
            //    qty.style.textAlign = "center"
            //
            //    // Selling Price
            //    sp.textContent = sellingPrice
            //    sp.style.textAlign = "right"
            //
            //
            //    row.append( desc, qty, sp, delContainer, dropDownContainer)
            //    table.append(row)
            // }
            // else
            // {
            //    console.log(getEntryFromTable.getElementsByName("name_qty"));
            //    var incCnt = parseInt(document.getElementsByName("name_qty")[0].textContent);
            //    incCnt = incCnt + 1;
            //    document.getElementsByName("name_qty")[0].textContent = incCnt;
            //
            //    var incSP = parseInt(getEntryFromTable.getElementsByClassName("sp")[0].textContent)
            // }

            // add_subTotal(sellingPrice, dropDownSel.value);
            // var row = table.insertRow(-1);
            //
            // // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
            // var cell1 = row.insertCell(0);
            // var cell2 = row.insertCell(1);
            // var cell3 = row.insertCell(2);
            // var cell4 = row.insertCell(3);
            //
            // console.log("Received ", data);
            // // Add some text to the new cells:
            // cell1.innerHTML = data[0].description;
            // cell2.innerHTML = data[0].id;
            // cell3.innerHTML = data[0].sellingPrice;
            // cell4.innerHTML = data[0].barCode;
            //
            // cell3.style.textAlign = "right";
            // cell2.style.textAlign = "center";
            //
            // subtotal_Val = parseInt(subtotal_ValID.innerHTML);
            // if(isNaN(subtotal_Val))
            //    subtotal_Val = 0;
            // console.log(subtotal_Val);
            //
            // subtotal_Val += data[0].sellingPrice;
            // subtotal_ValID.innerHTML = subtotal_Val;
            //
            clear_Barcode(event);
         }
         else
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

function sales_print()
{
   console.log(getEntryFromTable.getElementsByName("name_qty"));
   var incCnt = parseInt(document.getElementsByName("name_qty")[0].textContent);
   incCnt = incCnt + 1;
   document.getElementsByName("name_qty")[0].textContent = incCnt;

   var incSP = parseInt(getEntryFromTable.getElementsByClassName("sp")[0].textContent)
}

function clear_Barcode(event)
{
   enteredBarCode = "";
   document.getElementById("price_textArea").value = "";
   event.preventDefault();
}


function removeItem() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = 00005050;//document.getElementById("myInput");
  //filter = input.value.toUpperCase();
  table = document.getElementById("sales_table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    console.log(td);
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}



function updateEntryInTable()
{

}


function makeEntryInTable()
{
   var table = document.getElementById("sales_table").getElementsByTagName('tbody')[0];

   for(idx = 0; idx < sale_list.length; idx ++)
   {
      const { description, id, sellingPrice, barCode } = sale_list[idx];

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
      optionYes.value = idx; //(sellingPrice-(sellingPrice * 0.1));

      optionNo.text = "No";
      optionNo.value = idx;

      sale_list[idx].discount = 1;
      console.log(sale_list);
      //console.log(optionYes, optionNo);

      row.setAttribute("id", barCode);

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
      delButton.name = barCode
      delButton.textContent = "DELETE"
      delContainer.appendChild(delButton)
      delContainer.style.textAlign = "center"

      // Quantity
      qty.textContent = 1;
      qty.style.textAlign = "center"

      // Selling Price
      sp.textContent = sellingPrice
      sp.style.textAlign = "right"

      row.append( desc, qty, sp, delContainer, dropDownContainer)
      table.append(row)

      calculateSubTotal(idx);

   }
}






function enter_Content_test()
{
   var data_Array = [48, 49, 50, 51, 52, 53, 54, 55, 13];
   for(var idx = 0; idx <10; idx++)
   {
      event.keyCode = data_Array[idx];
      enter_Content(event);
   }
}
