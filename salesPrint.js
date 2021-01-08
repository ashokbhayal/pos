const ipcRenderer = require("electron").ipcRenderer;
// module.exports = sales_print_tableAppend

ipcRenderer.on("fill_Estimate_Print", (content,data) =>
{
   var datetime = new Date();

   var add_Date = document.getElementById("data_p");
   add_Date.innerHTML += datetime.getDate();
   add_Date.innerHTML += "/";
   add_Date.innerHTML += (datetime.getMonth()+1);
   add_Date.innerHTML += "/";
   add_Date.innerHTML += datetime.getFullYear();

   console.log("Found this data", data);
   var table = document.getElementById("sales_PrintTable").getElementsByTagName('tbody')[0];

   console.log("Display table ", table);
   sale_list = data;

   for(idx = 0; idx < sale_list.length; idx ++)
   {
      const { description, id, sellingPrice, barCode } = sale_list[idx];

      console.log(sale_list[idx]);

      sale_list[idx].index = idx;

      var row = document.createElement('tr') ;

      //* use a create table row function,
      //* which takes data and returns element
      const desc = document.createElement("td")

      const qty = document.createElement("td")
      qty.setAttribute("name", "name_qty");

      const sp = document.createElement("td")
      sp.setAttribute("name", "sp");

      row.setAttribute("id", idx);

      // Description of product
      desc.textContent = description
      desc.style.textAlign = "left"

      // Quantity
      qty.textContent = 1;
      qty.style.textAlign = "center"

      // Selling Price
      sp.textContent = sellingPrice
      sp.style.textAlign = "right"

      row.append( desc, qty, sp)
      table.append(row)

      ipcRenderer.send("printEstimate");

      // calculateSubTotal(idx);

   }

});


ipcRenderer.on("add_Estimate_Total", (content,data) =>
{
   console.log("Total Content is ", data);
   document.getElementById("subtotal_th_val").textContent = data.subTotal;
   document.getElementById("discount_td_val").textContent = data.discount;
   document.getElementById("total_th_val").textContent = data.grandTotal;

   document.getElementById("discount_Note").innerText = "You saved Rs: ";
   document.getElementById("discount_Note").innerText +=  data.discount;

})


async function print_Sales()
{
   for(idx = 0; idx <1; idx++)
   {
      ipcRenderer.send("printEstimate", sale_list);
      // await sleep(1000);
   }

}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
