module.exports = print_StickerFn;
const ipcRenderer = require("electron").ipcRenderer;

var hdrName = document.getElementsByClassName("shopName");
var landingPrice = document.getElementsByClassName("landing_Price");
var art_no =  document.getElementsByClassName("art_no");
var mrp_p = document.getElementsByClassName("mrp_p");

function clearClassVal()
{
   var idx = 0;

   for(idx; idx < document.getElementsByClassName("shopName").length; idx++)
      hdrName[idx].innerHTML = "";

   for(idx = 0; idx < document.getElementsByClassName("art_no").length; idx++)
      art_no[idx].innerHTML = "ART NO: ";

   for(idx = 0; idx < document.getElementsByClassName("mrp_p").length; idx++)
      mrp_p[idx].innerHTML = "MRP: ";

}

ipcRenderer.on("printLabel", (content,data) =>
{
   var idx = 0;

   clearClassVal();

   for(idx; idx < document.getElementsByClassName("shopName").length; idx++)
   {
      hdrName[idx].innerHTML = "AAIJI GARMENT";
   }

   for(idx = 0; idx < document.getElementsByClassName("art_no").length; idx++)
   {
      art_no[idx].innerHTML += data.codedInital + " " + data.partyName;
   }

   for(idx = 0; idx < document.getElementsByClassName("mrp_p").length; idx++)
   {
      mrp_p[idx].innerHTML += data.sellingPrice;
   }

   console.log(data);
});


function print_StickerFn(item_Details)
{
   ipcRenderer.send("printLabel", item_Details);
}
