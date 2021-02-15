const ipcRenderer = require("electron").ipcRenderer;


ipcRenderer.on("fill_Exchange_Print", (content,data) =>
{

   var datetime = new Date();

   var add_Date = document.getElementById("data_p");
   add_Date.innerHTML = "";
   add_Date.innerHTML = "Date: ";
   add_Date.innerHTML += datetime.getDate();
   add_Date.innerHTML += "/";
   add_Date.innerHTML += (datetime.getMonth()+1);
   add_Date.innerHTML += "/";
   add_Date.innerHTML += datetime.getFullYear();


   document.getElementById("incoming_BarCode").textContent = "";
   document.getElementById("outGoing_BarCode").textContent = "";
   document.getElementById("amount_P").textContent = "";
   document.getElementById("success_Msg_P").textContent = "Exchange Success";

   document.getElementById("incoming_BarCode").textContent = "Incoming Barcode: ";
   document.getElementById("outGoing_BarCode").textContent = "Outgoing Barcode: ";
   document.getElementById("amount_P").textContent = "Amount: ";

   document.getElementById("incoming_BarCode").textContent += data.incmgBarCode;
   document.getElementById("outGoing_BarCode").textContent += data.outgngBarCode;
   document.getElementById("amount_P").textContent += data.Amount;

   print_Exchange_CB()

   // ipcRenderer.send("printExchange");

})

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function print_Exchange_CB()
{
   const print_Count = 2;
   for(var idx = 0; idx <print_Count; idx++)
   {
      ipcRenderer.send("printExchange");
      console.log("Printing ", idx, "st  page");
      await sleep(2000);
   }

}
