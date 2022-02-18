const initSqlJs = require('sql.js');
const fs = require('fs')

var dbPath = './inventory.db'
var stockPath = './inventory_check.db'

var SQL_GB;
initSqlJs({
  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
  // You can omit locateFile completely when running in node
  locateFile: file => `./node_modules/sql.js/dist/sql-wasm.wasm`
}).then(SQL=>{

   SQL_GB = SQL;

   let createDB1 = function(stockPath) {

      let db1 = new SQL.Database()

      console.log("Database created");

      db1.exec("CREATE TABLE  IF NOT EXISTS inventory_check(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT  , \
                                                    date TEXT(255,0) NOT NULL, \
                                                    barCode INTEGER NOT NULL, \
                                                    description TEXT(255,0) NOT NULL, \
                                                    landingPrice INTEGER NOT NULL, \
                                                    sellingPrice INTEGER NOT NULL, \
                                                    quantity INTEGER NOT NULL, \
                                                    partyName TEXT(255,0) NOT NULL, \
                                                    withBox INTEGER NOT NULL);",
                                                    function(err)
                                                    {
                                                       if(err)
                                                       {
                                                          console.log(err);
                                                       }
                                                       console.log("Table created");

                                                    })
   }


   let createDb = function (dbPath) {

     // Create a database.
     let db = new SQL.Database()

     console.log("Database created");

     result = db.exec("CREATE TABLE  IF NOT EXISTS inventory(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT  , \
                                              date TEXT(255,0) NOT NULL, \
                                              barCode INTEGER NOT NULL, \
                                              description TEXT(255,0) NOT NULL, \
                                              landingPrice INTEGER NOT NULL, \
                                              sellingPrice INTEGER NOT NULL, \
                                              quantity INTEGER NOT NULL, \
                                              partyName TEXT(255,0) NOT NULL, \
                                              withBox INTEGER NOT NULL)")

    db.exec('CREATE TABLE IF NOT EXISTS purchase(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT  , \
                                                 date TEXT(255,0) NOT NULL, \
                                                 barCode INTEGER NOT NULL, \
                                                 description TEXT(255,0) NOT NULL, \
                                                 landingPrice INTEGER NOT NULL, \
                                                 sellingPrice INTEGER NOT NULL, \
                                                 quantity INTEGER NOT NULL, \
                                                 partyName TEXT(255,0) NOT NULL, \
                                                 withBox INTEGER NOT NULL)')

    db.exec('CREATE TABLE IF NOT EXISTS sales(id INTEGER PRIMARY KEY AUTOINCREMENT, \
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


       db.exec('CREATE TABLE IF NOT EXISTS settlement_pending(id INTEGER PRIMARY KEY AUTOINCREMENT, \
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

       db.exec('CREATE TABLE IF NOT EXISTS settlement_done(id INTEGER PRIMARY KEY AUTOINCREMENT, \
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

       db.exec('CREATE TABLE IF NOT EXISTS exchange(id INTEGER PRIMARY KEY AUTOINCREMENT, \
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

       // db.exec("CREATE TABLE  IF NOT EXISTS inventory_check(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT  , \
       //                                                date TEXT(255,0) NOT NULL, \
       //                                                barCode INTEGER NOT NULL, \
       //                                                description TEXT(255,0) NOT NULL, \
       //                                                landingPrice INTEGER NOT NULL, \
       //                                                sellingPrice INTEGER NOT NULL, \
       //                                                quantity INTEGER NOT NULL, \
       //                                                partyName TEXT(255,0) NOT NULL, \
       //                                                withBox INTEGER NOT NULL);",
       //                                                function(err)
       //                                                {
       //                                                   if(err)
       //                                                   {
       //                                                      console.log(err);
       //                                                   }
       //                                                   console.log("Table created");
       //
       //                                                })

     if (Object.keys(result).length === 0 &&
       typeof result.constructor === 'function' &&
       SQL.dbClose(db, dbPath)) {
       console.log('Created a new database.')
     } else {
       console.log('model.initDb.createDb failed.')
     }
   }


   SQL.dbOpen = function (databaseFileName) {
     try {
       const val = new SQL.Database(fs.readFileSync(databaseFileName))
       return val

     } catch (error) {
       console.log("Can't open database file.", error.message)
       return null
     }
   }

   SQL.dbClose = function (databaseHandle, databaseFileName) {
  try {
    let data = databaseHandle.export()
    let buffer = Buffer.alloc(data.length, data)
    fs.writeFileSync(databaseFileName, buffer)
    databaseHandle.close()
    return true
  } catch (error) {
    console.log("Can't close database file.", error)
    return null
    }
   }
   console.log(dbPath);
   db = SQL.dbOpen(dbPath);
   if (db === null) {
      console.log('db is null')
    /* The file doesn't exist so create a new database. */
     createDb(dbPath)
  }

  stock_dB = SQL.dbOpen(stockPath);
  if(stock_dB === null)
  {
     console.log("DB not found");
     createDB1(stockPath)
  }

})
.catch(err=>{
   console.log(err)
})


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
   {
      var selling_Price_Temp = document.getElementById("SP_price_textArea").value;
      selling_Price = parseInt(selling_Price_Temp);
   }
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

   // Add own price without roundoff
   if(selling_Price_Temp != null)
      selling_Price = parseInt(selling_Price_Temp);

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
      console.log(data[0]);
      prev_barCode = data[0].barCode;
      next_barCode = (prev_barCode + 1);
      insert_inDB(item_Details);
      print_StickerFn(item_Details, next_barCode);

      document.getElementById("price_textArea").value = "";
      document.getElementById("qty_textArea").value = "";
      document.getElementById("SP_price_textArea").value = "";

      document.getElementById("print_Sticker").disabled = true;
      setTimeout(function() {
         document.getElementById("print_Sticker").disabled = false;
      }, 2000);

   }) .catch(err => {
      // Assuming first entry
      console.log("First Entry");
      next_barCode = ++ barCode_DefaultVal;
      insert_inDB(item_Details);
      print_StickerFn(item_Details, next_barCode);
   });

   coded_Inital = [];
};


// Insert new entry at the end of the barcode
function insert_inDB(item_Details)
{
   let db = SQL_GB.dbOpen(dbPath);

   db.exec('INSERT into inventory(barCode , \
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
      else {
         console.log("Updated");
      }
   })

   db.exec('INSERT into purchase(barCode , \
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
      else {
         console.log("Updated");
      }
   })

   SQL_GB.dbClose(db ,dbPath);

}


// Get the last entry to append new item inventory
function getLastEntry()
{
   return new Promise ((resolve, reject) =>
   {
      let values;

      let db = SQL_GB.dbOpen(dbPath);

      var statement = db.prepare('SELECT * FROM inventory ORDER BY id DESC LIMIT 1');

      try {
         if (statement.step()) {
            values = [statement.getAsObject()]
            let columns = statement.getColumnNames()
            console.log("Values: ", values, "Columns ", columns);
            // return _rowsFromSqlDataObject({values: values, columns: columns})
         } else {
            console.log('Error')
         }
      } catch (error) {
         console.log('Error ', error.message)
      } finally {
         SQL_GB.dbClose(db, dbPath)
      }

      resolve(values);
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



function insertObject(arr, obj) {

    // append object
    arr.push(obj);

    console.log(arr);
}


function add_Inventory_Qty()
{
   var add_barCode;
   var add_qty;
   var new_Qty = 0;
   add_barCode = parseInt(document.getElementById("add_BarCode_textArea").value);
   add_qty = parseInt(document.getElementById("add_Qty_textArea").value);

   if((add_barCode != "") && (add_qty != ""))
   {
      // let statement;

      console.log("Adding Qty");
      var item_Details_1 = new Object();

      updateInventoryInQty(add_barCode).then(data =>
      {
         console.log("Updated Entry Successfully ");

         document.getElementById("add_Qty_textArea").value = "";
         document.getElementById("add_BarCode_textArea").value = "";

         // item_Details_1 = data;

         new_Qty = (data.quantity + add_qty);

         let db = SQL_GB.dbOpen(dbPath);
         db.run('UPDATE inventory SET quantity=? WHERE barCode=?',[new_Qty, add_barCode]);
         SQL_GB.dbClose(db, dbPath);

         setTimeout(insertInPurchase(data, add_qty), 100);

      }). catch(e =>
      {
         console.log(e);
      })

      // let db = SQL_GB.dbOpen(dbPath);
      //
      // var statement = db.prepare('SELECT * FROM inventory WHERE barCode = ?',[add_barCode]);
      // if (statement.step())
      // {
      //    item_Details = statement.getAsObject();
      //    // console.log(item_Details);
      //    // console.log(item_Details.getAsObject().landingPrice);
      //    //
      //    // db = SQL_GB.dbOpen(dbPath);
      //    //
      //    //
      //    // SQL_GB.dbClose(db ,dbPath);
      //    //
      //    // document.getElementById("add_Qty_textArea").value = '';
      //    // document.getElementById("add_BarCode_textArea").value = '';
      // }
      //
      // new_Qty = (item_Details.quantity + add_qty);
      //
      // SQL_GB.dbClose(db, dbPath);
      //
      // // let db = SQL_GB.dbOpen(dbPath);
      // console.log(item_Details);
      // insertInPurchase(item_Details);
      //
      // db.run('UPDATE inventory SET quantity=? WHERE barCode=?',[new_Qty, add_barCode]);
      //
      // SQL_GB.dbClose(db, dbPath);

   }
}


function insertInPurchase(item_Details_1, add_qty)
{
   item_Details_1.quantity = add_qty;

   let db = SQL_GB.dbOpen(dbPath);

   console.log("Inserting in Purchase table", item_Details_1);

   db.exec('INSERT into purchase(barCode , \
                                 date, \
                                 description, \
                                 landingPrice, \
                                 sellingPrice, \
                                 quantity, \
                                 partyName, \
                                 withBox) \
                                 values (?, ?, ?, ?, ?, ?, ?, ?)',
                                 [item_Details_1.barCode,
                                  item_Details_1.date,
                                  item_Details_1.description,
                                  item_Details_1.landingPrice,
                                  item_Details_1.sellingPrice,
                                  item_Details_1.qty,
                                  item_Details_1.partyName,
                                  item_Details_1.withBox],
                                  function(err)
   {
      if(err)
      {
         alert("Failed to update the database");
         console.log(err);
      }
      else {
         console.log("Updated");
      }
   })

   SQL_GB.dbClose(db, dbPath);

}



function updateInventoryInQty(add_barCode)
{
   return new Promise ((resolve, reject) =>
   {
      let values;

      let db = SQL_GB.dbOpen(dbPath);

      var statement = db.prepare('SELECT * FROM inventory WHERE barCode = ?',[add_barCode]);
      try {
         if (statement.step())
         {
            console.log(statement.getAsObject());
            item_Details = statement.getAsObject();
            resolve(item_Details);
         }
         else {
           console.log('Error')
           reject();
        }
      }
      finally{
         SQL_GB.dbClose(db, dbPath);
      }
   });
}
