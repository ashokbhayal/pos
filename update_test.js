const initSqlJs = require('sql.js');
const fs = require('fs')

var dbPath = './inventory.db'
var SQL_GB;
initSqlJs({
  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
  // You can omit locateFile completely when running in node
  locateFile: file => `./node_modules/sql.js/dist/sql-wasm.wasm`
}).then(SQL=>{

   SQL_GB = SQL;


   let createDb = function (dbPath) {

     // Create a database.
     let db = new SQL.Database()

     // let query = fs.readFileSync(
     // path.join(__dirname, 'db', 'schema.sql'), 'utf8')

     console.log("Database created");
     // let result = db.exec("CREATE TABLE \"people\" ( \
     //          \"person_id\" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
     //          \"first_name\" TEXT(255,0) NOT NULL, \
     //          \"last_name\" TEXT(255,0) NOT NULL)")

     result = db.exec("CREATE TABLE  IF NOT EXISTS inventory(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT  , \
                                              date TEXT(255,0) NOT NULL, \
                                              barCode INTEGER NOT NULL, \
                                              description TEXT(255,0) NOT NULL, \
                                              landingPrice INTEGER NOT NULL, \
                                              sellingPrice INTEGER NOT NULL, \
                                              quantity INTEGER NOT NULL, \
                                              partyName TEXT(255,0) NOT NULL, \
                                              withBox INTEGER NOT NULL)")

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
       console.log('success', val)
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
  else {
     console.log("DB LOCATED");

     var qty = 20;
     var barcode = 5001;
     //
     // var stmt = db.prepare('UPDATE inventory SET quantity=? WHERE barCode=?');
     // stmt.bind([qty, barcode]);
     // db.run(stmt);

     db.run('UPDATE inventory SET quantity=? WHERE barCode=?',[qty, barcode]);

     // console.log(stmt);
     SQL_GB.dbClose(db, dbPath)

  }
})
.catch(err=>{
   console.log(err)
})
