var db = require("../connection/database.js")

// admin create new invoice
exports.createInvoice = async (req, res, next)  => {
    const data = req.body
    var sqlCreateInvoice = "INSERT INTO invoices(invoice_number, admin_username, due_date, admin_id, total) VALUES (?, ?, ?, ?, ?)"
    var sqlCreateInvoiceItem = "INSERT INTO invoice_items(invoice_id, item_name, quantity, subtotal) VALUES (?, ?, ?, ?, ?)"
    await db.run(sqlCreateInvoice, [req.body.invoice_number, req.body.admin_username, req.body.due_date, parseInt(data.admin_id), (parseInt(req.body.subtotal) * parseInt(req.body.quantity))], async function(err, row){
        if (err){
            await res.status(400).json({"error": err.message})
        }

        await db.run(sqlCreateInvoiceItem, [this.lastID, req.body.item_name, req.body.quantity, req.body.subtotal], (err2, result2) => {
            if(err2){
                console.log(err2, [this.lastID, req.body.item_name, parseInt(req.body.quantity), parseInt(req.body.subtotal)])
                res.send(err2)
            }            
            res.send(result2)
        })
    })
}

exports.createInvoiceItem = (req, res, next)  => {

    var sqlInsertInvoiceItem = "INSERT INTO invoice_items(invoice_id, item_name, quantity, subtotal) VALUES (?, ?, ?, ?, ?)"
    var sqlGetInvoice = `select total from invoices where id = ?`
    var sqlUpdateTotalInvoice = `update invoices SET total = ? where id = ?`

    db.run(sqlInsertInvoiceItem, [req.body.invoice_id, req.body.item_name, req.body.quantity, req.body.subtotal], (err1, result) => {
        if(err1){
            res.send(err1)
        }            
    
        db.all(sqlGetInvoice, req.body.invoice_id, (err2, resultGetInvoice) => {
            if(err2){
                res.send(err2)
            }          
            
            db.run(sqlUpdateTotalInvoice, resultGetInvoice, req.body.invoice_id, (err3, result) => {
                if(err3){
                    res.send(err3)
                }     
                res.send(result)
            })
        })

    })
    // })
}

// admin edit invoice
exports.editInvoice = (req, res, next) => {
    const sql = `update invoices SET due_date = ? where id = ?`
    const paramsId = req.params.id    
   
    db.run(sql, req.body.due_date, paramsId, (err, result) => {
        if(err){
            console.log(err)
            res.send(err)
        }
        res.send(result)
    })
}

exports.editInvoiceItem = (req, res, next)  => {
    var sqlInsertInvoiceItem = "update invoice_items set item_name = ?, quantity = ?, subtotal = ? where id = ?"
    var sqlGetInvoiceTotal = `select total from invoices where id = ?`
    var sqlUpdateTotalInvoice = `update invoices SET total = ? where id = ?`

    let paramsInvoiceItemId = req.params.id

    db.run(sqlInsertInvoiceItem, req.body.item_name, req.body.quantity, req.body.subtotal, paramsInvoiceItemId, (err1, result) => {
        if(err1){
            res.send(err1)
        }            
    
        db.all(sqlGetInvoiceTotal, result.data.id, (err2, resultGetInvoice) => {

            let invoiceId = result.data.id
            if(err2){
                res.send(err2)
            }          
            
            db.run(sqlUpdateTotalInvoice, resultGetInvoice + (req.body.subtotal * req.body.quantity), invoiceId, (err3, result) => {
                if(err3){
                    res.send(err3)
                }     
                res.send(result)
            })
        })

    })
    // })
}

exports.revokeInvoice = (req, res, next) => {
    const sql = 'delete from invoices where id = ?'
    const sql2 = 'delete from invoice_items where invoice_id = ?'
    const paramsId = req.params.id
    db.all(sql,paramsId, (err, result) => {
        if(err){
            console.log(err)
        }
        db.all(sql2, paramsId, (err2, result2) => {
            if(err2){
                res.send(err2)
            }            
            res.send(result2)
        })
    })
}

// get by id 
exports.getInvoiceDetail = (req, res, next) => {
    const sql = 'select * from invoices where id = ?'
    const sqlItem = 'select * from invoice_items where invoice_id = ?'

    let paramsId = req.params.id
    let invoiceDetail = {}

    db.all(sql, paramsId, (err, result) => {

        if(err){
            console.log(err)
        }

        invoiceDetail = result
        

        db.all(sqlItem, paramsId, (err, result) => {
            invoiceDetail['items'] = result
            res.send(invoiceDetail)
        })
    })
}



// get by admin
exports.getByAdmin = (req, res, next) => {
    const sql = 'select * from invoices where admin_id = ?'
    let paramsId = req.params.id
    db.all(sql, paramsId, (err, result) => {
        if(err){
            console.log(err)
        }
        console.log(result, 'sonp')
        res.send(result)
    })
}