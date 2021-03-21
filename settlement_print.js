const ipcRenderer = require("electron").ipcRenderer;
// module.exports = sales_print_tableAppend

ipcRenderer.on("fill_settlement_Print", (content,data) =>
{
   var table = document.getElementById("settlement_PrintTable").getElementsByTagName('tbody')[0];

   console.log("In settlement");
   console.log(data);

   clear_Table();

   var total_landingPrice = 0;
   var total_sellingPrice = 0;
   var total_AmountRcvd = 0;

   var datetime = new Date();

   var add_Date = document.getElementById("data_p");
   add_Date.innerHTML = "";
   add_Date.innerHTML = "Date: ";
   add_Date.innerHTML += datetime.getDate();
   add_Date.innerHTML += "/";
   add_Date.innerHTML += (datetime.getMonth()+1);
   add_Date.innerHTML += "/";
   add_Date.innerHTML += datetime.getFullYear();

   settlement_list = data;

   for(idx = 0; idx < settlement_list.length; idx ++)
   {
      // const { description, id, sellingPrice, barCode, Selling_quantity } = sale_list[idx];

      const {timeStr, landingPrice, billingAmount, paidAmount, paidBy} = settlement_list[idx];

      var row = document.createElement('tr');

      //* use a create table row function,
      //* which takes data and returns element
      const time_td = document.createElement("td")

      const landing_Price_td = document.createElement("td")
      // landing_Price_td.setAttribute("name", "name_qty");

      const billingAmount_td = document.createElement("td")

      const paidAmount_td = document.createElement("td")
      const paidBy_td = document.createElement("td")

      // sp.setAttribute("name", "sp");

      row.setAttribute("id", idx);

      // Description of product
      time_td.textContent = timeStr
      time_td.style.textAlign = "left"

      // Quantity
      landing_Price_td.textContent = landingPrice;
      landing_Price_td.style.textAlign = "center"

      // Rate
      billingAmount_td.textContent = billingAmount;
      billingAmount_td.style.textAlign = "center"

      // Selling Price
      paidAmount_td.textContent = paidAmount;
      paidAmount_td.style.textAlign = "center"

      paidBy_td.textContent = paidBy;
      paidBy_td.style.textAlign = "right"

      row.append(time_td, landing_Price_td, billingAmount_td, paidAmount_td, paidBy_td)
      table.append(row)

      if(parseInt(paidAmount) == 0)
         continue;
      total_landingPrice += parseInt(landingPrice);
      total_sellingPrice += parseInt(billingAmount);
      total_AmountRcvd += parseInt(paidAmount);
   }

   document.getElementById("landing_Price_th_Val").textContent = total_landingPrice;
   document.getElementById("selling_Price_th_Val").textContent = total_sellingPrice;
   document.getElementById("paidAmount_th_val").textContent = total_AmountRcvd;

   ipcRenderer.send("printSettlement");

});



function clear_Table()
{
   var elmtTable = document.getElementById('settlement_PrintTable');
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
         elmtTable.deleteRow(x);
      }
   }


}
