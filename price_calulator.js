const sqlite3 = require('sqlite3').verbose();

var print_StickerFn = require('./print_Sticker');


var shop_Inital = ['E', 'V', 'I', 'M', 'A', 'L', 'S', 'T', 'O', 'R'];
var coded_Inital = [];
var party_Name;
var description;
var item_Details = new Object();
var lastEntry = new Object();
var prev_barCode = 0;
var next_barCode = 0;
var barCode_DefaultVal = 5000;

var lastEntryFlg = false;

var date = new Date;


// Calculate the price and initate print
function price_calulator()
{
   var price;
   var landing_Price;
   var selling_Price;
   var qty;
   var withBox;
   var purchase_date = [];

   var idx;

   purchase_date = date.getDate().toString(10);
   purchase_date = purchase_date.concat(" ");
   purchase_date = purchase_date.concat(date.toLocaleString('default', {month: 'short'}));
   purchase_date = purchase_date.concat(" ");
   purchase_date = purchase_date.concat(date.getFullYear().toString(10));
   console.log(date.toLocaleString('default', {month: 'short'}));


   price = document.getElementById("price_textArea").value;
   price = parseInt(price);
   console.log("Price is " + price);
   if(isNaN(price))
   {
      alert("Plese enter valid number");
      return;
   }

   qty =document.getElementById("qty_textArea").value;
   qty = parseInt(qty);
   console.log("Qty is " + qty);

   if(isNaN(qty))
   {
      alert("Plese enter valid quantity");
      return;
   }

   party_Name = document.getElementById("party_textArea").value;
   description = document.getElementById("item_desc").value;
   if((party_Name | description) == null)
      alert("Enter Party Name or Description")

   price *= 1.05;

   landing_Price = price * 1.2;
   landing_Price = parseInt(landing_Price);

   if(document.getElementById("SP_price_textArea").value != "")
      selling_Price = document.getElementById("SP_price_textArea").value;
   else
   {
      selling_Price = landing_Price * 1.7;
      selling_Price = parseInt(selling_Price);
   }

   var lastVal = 0;
   lastVal = selling_Price % 10;
   if(lastVal != 0)
   {
       var addVal = 10 - lastVal;
       if(lastVal >= 1 && lastVal <= 4)
          selling_Price -= lastVal;
       else
          selling_Price += addVal;
   }

   console.log("Landing cost is " + landing_Price);

   withBox = document.getElementById("withBoxCB");
   if(withBox.checked == true)
      item_Details.withBox = 1;
   else
      item_Details.withBox = 0

   console.log(item_Details.withBox);

   item_Details.date = purchase_date;
   item_Details.description = description;
   item_Details.partyName = party_Name;
   item_Details.landingPrice = landing_Price;
   item_Details.sellingPrice = selling_Price;
   item_Details.qty = qty;

   console.log(item_Details);

   for(idx = 0; landing_Price > 0; idx++)
   {
      var value = (landing_Price % 10);
      coded_Inital[idx] = shop_Inital[value];
      // coded_Inital = coded_Inital.concat(shop_Inital[value]);
      landing_Price = parseInt((landing_Price / 10));
   }

   coded_Inital = coded_Inital.reverse();
   coded_Inital = coded_Inital.join("");

   item_Details.codedInital = coded_Inital;

   coded_Inital = coded_Inital.concat(" ");
   coded_Inital = coded_Inital.concat(party_Name);
   console.log(coded_Inital);

   //updateDB();
   getLastEntry().then(data =>
   {
      console.log("Resolved promise ", data);
      // console.log(data[0]);
      prev_barCode = data[0].barCode;
      next_barCode = ++prev_barCode;
      insert_inDB(item_Details);
      print_StickerFn(item_Details, next_barCode);
   }) .catch(err => {
      // Assuming first entry
      next_barCode = ++ barCode_DefaultVal;
      insert_inDB(item_Details);
      print_StickerFn(item_Details, next_barCode);
   });

   coded_Inital = [];
};


let db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});


// Create DB if not found
db.run('CREATE TABLE IF NOT EXISTS inventory(id INTEGER PRIMARY KEY AUTOINCREMENT, \
                                             date TEXT NOT NULL, \
                                             barCode INTEGER NOT NULL, \
                                             description TEXT NOT NULL, \
                                             landingPrice INTEGER NOT NULL, \
                                             sellingPrice INTEGER NOT NULL, \
                                             quantity INTEGER NOT NULL, \
                                             partyName TEXT NOT NULL, \
                                             withBox INTEGET NOT NULL);',
                                             function(err)
                                             {
                                                if(err)
                                                {
                                                   console.log(err);
                                                }
                                                console.log("Table created");

                                             })

db.run('CREATE TABLE IF NOT EXISTS sales(id INTEGER PRIMARY KEY AUTOINCREMENT, \
                                             date TEXT NOT NULL, \
                                             time TEXT NOT NULL, \
                                             barCode INTEGER NOT NULL, \
                                             description TEXT NOT NULL, \
                                             landingPriceperPC INTEGER NOT NULL, \
                                             sellingPriceperPC INTEGER NOT NULL, \
                                             quantity INTEGER NOT NULL, \
                                             partyName TEXT NOT NULL);',
                                             function(err)
                                             {
                                                if(err)
                                                {
                                                   console.log(err);
                                                }
                                                console.log("Table created");

                                             })

db.run('CREATE TABLE IF NOT EXISTS settlement_pending(id INTEGER PRIMARY KEY AUTOINCREMENT, \
                                                      date TEXT NOT NULL, \
                                                      time TEXT NOT NULL, \
                                                      description TEXT NOT NULL, \
                                                      landingPrice INTEGER NOT NULL, \
                                                      billingAmount INTEGER NOT NULL);',
                                                      function(err)
                                                      {
                                                         if(err)
                                                         {
                                                            console.log(err);
                                                         }
                                                         console.log("Table created");

                                                      })

db.run('CREATE TABLE IF NOT EXISTS settlement_done(id INTEGER PRIMARY KEY AUTOINCREMENT, \
                                                      date TEXT NOT NULL, \
                                                      time TEXT NOT NULL, \
                                                      description TEXT NOT NULL, \
                                                      landingPrice INTEGER NOT NULL, \
                                                      billingAmount INTEGER NOT NULL, \
                                                      paidAmount INTEGER NOT NULL , \
                                                      paidBy TEXT NOT NULL);',
                                                      function(err)
                                                      {
                                                         if(err)
                                                         {
                                                            console.log(err);
                                                         }
                                                         console.log("Table created");

                                                      })

db.run('CREATE TABLE IF NOT EXISTS exchange(id INTEGER PRIMARY KEY AUTOINCREMENT, \
                                                      date TEXT NOT NULL, \
                                                      time TEXT NOT NULL, \
                                                      incomingBarCode INTEGER NOT NULL, \
                                                      outgoingBarCode INTEGER NOT NULL, \
                                                      amountPaid INTEGER NOT NULL);',
                                                      function(err)
                                                      {
                                                         if(err)
                                                         {
                                                            console.log(err);
                                                         }
                                                         console.log("Table created");

                                                      })

// Insert new entry at the end of the barcode
function insert_inDB()
{
   db.run('INSERT into inventory(barCode , \
                                 date, \
                                 description, \
                                 landingPrice, \
                                 sellingPrice, \
                                 quantity, \
                                 partyName, \
                                 withBox) \
                                 values (?, ?, ?, ?, ?, ?, ?, ?)',
                                 [next_barCode,
                                  item_Details.date,
                                  item_Details.description,
                                  item_Details.landingPrice,
                                  item_Details.sellingPrice,
                                  item_Details.qty,
                                  item_Details.partyName,
                                  item_Details.withBox],
                                  function(err)
   {
      if(err)
      {
         alert("Failed to update the database");
         console.log(err);
      }
   })

   // db.all('SELECT * FROM inventory', function(err, rows)
   // {
   //    if(err)
   //    {
   //       console.log("Error " + err);
   //    }
   //    rows.forEach((item) => {
   //       console.log("Item stored in DB is ", item);
   //    });
   // })
}


// Get the last entry to append new item inventory
function getLastEntry()
{
   return new Promise ((resolve, reject) =>
   {
      db.all('SELECT * FROM inventory ORDER BY id DESC LIMIT 1', (err, data) =>
      {
         if(err)
            reject(err);
         else
            resolve(data);

      });
   });
}

// close the database connection
function close_DB()
{
   db.close((err) => {
     if (err) {
       return console.error(err.message);
     }
     console.log('Close the database connection.');
   });
}



function test_Btn()
{
   document.getElementById("price_textArea").value = 01;
   document.getElementById("party_textArea").value = "AB";
   document.getElementById("qty_textArea").value = 10;
   document.getElementById("item_desc").value = "Shirt";

   price_calulator();
}



// Add sale in sale DB
// function updateSaleinDB(sale_list_Entry)
// {
//    console.log("In updateSaleinDB ", sale_list_Entry);
//    db.run('INSERT into sales(barCode , \
//                                  date, \
//                                  description, \
//                                  landingPrice, \
//                                  sellingPrice, \
//                                  quantity, \
//                                  partyName) \
//                                  values (?, ?, ?, ?, ?, ?, ?)',
//                                  [sale_list_Entry.barCode,
//                                   sale_list_Entry.date,
//                                   sale_list_Entry.description,
//                                   sale_list_Entry.landingPrice,
//                                   sale_list_Entry.sellingPrice,
//                                   sale_list_Entry.qty,
//                                   sale_list_Entry.partyName],
//                                   function(err)
//    {
//       if(err)
//       {
//          alert("Failed to update the database");
//          console.log(err);
//       }
//    })
// }

// Function called from sales.js to update DB
// function priceCalculator_UpdateDB(sale_list)
// {
//    for(var idx = 0; idx < sale_list.length; idx++)
//    {
//       sale_list_Entry = sale_list[idx];
//
//       console.log("In priceCalculator_UpdateDB ",sale_list_Entry);
//       getEntryFromDB(sale_list_Entry).then(data =>
//       {
//          updateInvtinDB(data).then (()=>
//          {
//             console.log(data);
//             sale_list_Entry.description = data[0].description;
//             sale_list_Entry.barCode = data[0].barCode;
//             sale_list_Entry.sellingPrice = data[0].sellingPrice;
//             sale_list_Entry.landingPrice = data[0].landingPrice;
//             sale_list_Entry.partyName = data[0].partyName;
//             sale_list_Entry.date = 1234;
//             sale_list_Entry.qty = 1;
//             updateSaleinDB(sale_list_Entry);
//          }) .catch(err =>
//          {
//             console.log(err);
//          });
//
//       }) .catch(err =>
//       {
//          console.log(err);
//       })
//    }
// }
