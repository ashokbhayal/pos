const sqlite3 = require('sqlite3').verbose();
var print_StickerFn = require('./print_Sticker');


var shop_Inital = ['E', 'V', 'I', 'M', 'A', 'L', 'S', 'T', 'O', 'R'];
var coded_Inital = [];
var party_Name;
var description;
var item_Details = new Object();

var date = new Date;


var counter = 0;

function price_calulator()
{
   var price;
   var landing_Price;
   var selling_Price;
   var qty;
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


   landing_Price = price * 1.2;
   landing_Price = parseInt(landing_Price);

   selling_Price = landing_Price * 1.7;
   selling_Price = parseInt(selling_Price);

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

   insert_inDB(item_Details);
   print_StickerFn(item_Details);

   coded_Inital = [];
};


let db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.run('CREATE TABLE IF NOT EXISTS inventory(id INTEGER PRIMARY KEY AUTOINCREMENT, \
                                             date TEXT NOT NULL, \
                                             barCode INTEGER NOT NULL, \
                                             description TEXT NOT NULL, \
                                             landingPrice INTEGER NOT NULL, \
                                             sellingPrice INTEGER NOT NULL, \
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

function insert_inDB()
{
   db.run('INSERT into inventory(barCode , \
                                 date, \
                                 description, \
                                 landingPrice, \
                                 sellingPrice, \
                                 quantity, \
                                 partyName) \
                                 values (?, ?, ?, ?, ?, ?, ?)',
                                 [counter,
                                  item_Details.date,
                                  item_Details.description,
                                  item_Details.landingPrice,
                                  item_Details.sellingPrice,
                                  item_Details.qty,
                                  item_Details.partyName],
                                  function(err)
   {
      if(err)
      {
         alert("Failed to update the database");
         console.log(err);
      }
   })

   db.all('SELECT * FROM inventory', function(err, rows)
   {
      if(err)
      {
         console.log("Error " + err);
      }
      rows.forEach((item) => {
         console.log("Item stored in DB is ", item);
      });
   })
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
