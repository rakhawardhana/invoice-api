var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "invoices.db" 

// - customer: id, name


// admin_id integer not null, foreign key (admin_id) REFERENCES admin(id))

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        // db.run('select * from invoices', (err1, result) => {

        //     console.log(err, 'sini')
        // })
        // - admin: id, name, email, password
        db.run(`create table IF NOT EXISTS admin (id integer primary key autoincrement, 
            username varchar(50) not null unique, email varchar(50) not null unique, 
            password varchar(366) not null)`,
            (err) => {
                if(err) {
                    console.log(err)
                }
        });  
        
        // - Product : id, product name, product slug, price per item
        // db.run(`create table IF NOT EXISTS products (id integer primary key autoincrement, slug varchar(50), name varchar(50) not null, price bigint, stock integer)`,
        //     (err) => {
        //         if(err) {
        //             console.log(err)
        //         }
        // });  

        // - Invoice : id, total_price, 
        db.run(`create table IF NOT EXISTS invoices (id integer primary key autoincrement, invoice_number integer, admin_username varchar(50) not null, due_date date, total integer, admin_id integer not null, foreign key (admin_id) REFERENCES admin(id))`,
            (err) => {
                if(err) {
                    console.log(err)
                }
        });  

        // - invoice Items: id, invoice_id, product_id, qty, price, 
        db.run(`create table IF NOT EXISTS invoice_items (id integer primary key autoincrement, invoice_id integer, item_name varchar(50), quantity integer, subtotal integer, foreign key (invoice_id) references invoices(id));`,
             (err) => {
                     if(err) {
                         console.log(err)
                     }
 
             });  
        
    }
});


module.exports = db
