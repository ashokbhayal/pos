var csv = require('csv-parser')
var json2csv = require('json2csv');
const initSqlJs = require('sql.js');
const fs = require('fs')
const results = [];

var dbPath = './inventory.db'

var SQL_GB;

var shop_Inital = ['E', 'V', 'I', 'M', 'A', 'L', 'S', 'T', 'O', 'R'];

initSqlJs({
 // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
 // You can omit locateFile completely when running in node
 locateFile: file => `./node_modules/sql.js/dist/sql-wasm.wasm`
}).then(SQL=>{

  SQL_GB = SQL;


  let createDb = function (dbPath) {

    // Create a database.
    let db = new SQL.Database()

    console.log("Database created");

    result = db.exec("CREATE TABLE IF NOT EXISTS inventory(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT  , \
                                             date TEXT(255,0) NOT NULL, \
                                             barCode INTEGER NOT NULL, \
                                             description TEXT(255,0) NOT NULL, \
                                             landingPrice INTEGER NOT NULL, \
                                             sellingPrice INTEGER NOT NULL, \
                                             quantity INTEGER NOT NULL, \
                                             partyName TEXT(255,0) NOT NULL, \
                                             withBox INTEGER NOT NULL)")

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
}).then( () =>{
   start_TableEntry()
})

.catch(err=>{
  console.log(err)
})

function start_TableEntry()
{
   console.log("Start the entry");
   fs.createReadStream('Book111_July_5_2021.csv')
     .pipe(csv({ separator: '\t' }))
     .on('data', (data) => {
        // var decoded_Val = "";
        // var decoded_NumVal;
        // while(data.landingPrice != "")
        // {
        //    // console.log("Landing Value ", data.landingPrice);
        //    var landin_Char = data.landingPrice.slice(0,1);
        //    data.landingPrice = data.landingPrice.substring(1);
        //    decoded_NumVal = shop_Inital.indexOf(landin_Char);
        //    decoded_Val += decoded_NumVal.toString();
        //    // console.log(decoded_Val, "And data is ", data.landingPrice);
        // }
        // console.log(decoded_Val);
        results.push(data)
      })
     .on('end', () => {
        // var result = json2csv({ data: results, fields: Object.keys(dataArray[0]) });
        // fs.writeFileSync(fileName, result);
        // console.log(results.landingPrice);
        insert_inDB(results);
     });
}




function insert_inDB(results)
{
  let db = SQL_GB.dbOpen(dbPath);
  for(idx = 0; idx < results.length; idx++)
  {
     db.exec('INSERT into inventory(barCode , \
                                    date, \
                                    description, \
                                    landingPrice, \
                                    sellingPrice, \
                                    quantity, \
                                    partyName, \
                                    withBox) \
                                    values (?, ?, ?, ?, ?, ?, ?, ?)',
                                    [results[idx].barCode,
                                     results[idx].date,
                                     results[idx].description,
                                     results[idx].landingPrice,
                                     results[idx].sellingPrice,
                                     results[idx].quantity,
                                     results[idx].partyName,
                                     results[idx].withBox],
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
 }
 SQL_GB.dbClose(db ,dbPath);

}
