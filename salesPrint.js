const ipcRenderer = require("electron").ipcRenderer;
// module.exports = sales_print_tableAppend

ipcRenderer.on("fill_Estimate_Print", (content,data) =>
{

   clear_Table();

   var datetime = new Date();

   var add_Date = document.getElementById("data_p");
   add_Date.innerHTML = "";
   add_Date.innerHTML = "Date: ";
   add_Date.innerHTML += datetime.getDate();
   add_Date.innerHTML += "/";
   add_Date.innerHTML += (datetime.getMonth()+1);
   add_Date.innerHTML += "/";
   add_Date.innerHTML += datetime.getFullYear();

   var add_Time = document.getElementById("time_p");
   add_Time.innerHTML = "";
   add_Time.innerHTML = "Time: ";
   add_Time.innerHTML += datetime.getHours();
   add_Time.innerHTML += ":";
   add_Time.innerHTML += (datetime.getMinutes());
   add_Time.innerHTML += ":";
   add_Time.innerHTML += datetime.getSeconds();

   console.log("Found this data", data);
   var table = document.getElementById("sales_PrintTable").getElementsByTagName('tbody')[0];

   console.log("Display table ", table);
   sale_list = data;

   for(idx = 0; idx < sale_list.length; idx ++)
   {
      const { description, id, sellingPrice, barCode, Selling_quantity } = sale_list[idx];

      console.log(sale_list[idx]);

      sale_list[idx].index = idx;

      var row = document.createElement('tr') ;

      //* use a create table row function,
      //* which takes data and returns element
      const desc = document.createElement("td")

      const qty = document.createElement("td")
      qty.setAttribute("name", "name_qty");

      const rate = document.createElement("td")

      const sp = document.createElement("td")
      sp.setAttribute("name", "sp");

      row.setAttribute("id", idx);

      // Description of product
      desc.textContent = description
      desc.style.textAlign = "left"

      // Quantity
      qty.textContent = Selling_quantity;
      qty.style.textAlign = "center"

      // Rate
      rate.textContent = sellingPrice;
      rate.style.textAlign = "center"

      // Selling Price
      sp.textContent = (sellingPrice * Selling_quantity);
      sp.style.textAlign = "right"

      row.append( desc, qty, rate, sp)
      table.append(row)

      print_Sales()

      // ipcRenderer.send("printEstimate");
      // sleep(1000);
      // console.log("Printing estimate again");
      // ipcRenderer.send("printEstimate");

      // calculateSubTotal(idx);

   }

});


ipcRenderer.on("add_Estimate_Total", (content,data) =>
{
   console.log("Total Content is ", data);
   document.getElementById("subtotal_th_val").textContent = data.subTotal;
   document.getElementById("discount_td_val").textContent = data.discount;
   document.getElementById("total_th_val").textContent = data.grandTotal;
})


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function print_Sales()
{
   const print_Count = 2;
   for(var idx = 0; idx <print_Count; idx++)
   {
      ipcRenderer.send("printEstimate");
      console.log("Printing ", idx, "st  page");
      await sleep(2000);
   }

}


function clear_Table()
{
   var elmtTable = document.getElementById('sales_PrintTable');
   var tableRows = elmtTable.getElementsByTagName('tr');
   var rowCount = tableRows.length;

   console.log("ElmtTable is ", elmtTable);
   console.log("table rows ", tableRows);
   console.log("Rowcount is ", rowCount);

   if(rowCount > 1)
   {
      for (var x = rowCount - 1; x > 0; x--)
      {
         console.log("Deleting row");
         // elmtTable.parentNode.removeChild(tableRows[x]);

         elmtTable.deleteRow(x);
      }
   }


}
