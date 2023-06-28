const express = require('express');

const invoiceController = require('../controllers/invoice');
const { checkAdmin } = require('../middleware/authorization')
const authenticationMiddleware = require('../middleware/authentication')

const router = express.Router();

// create invoice and one invoice item
router.post('/create-invoice', authenticationMiddleware, checkAdmin, invoiceController.createInvoice); 

// add invoice-item to invoices
router.post('/create-invoice-item', authenticationMiddleware, checkAdmin, invoiceController.createInvoiceItem); 

//edit invoice
router.patch('/edit-invoice/:id', authenticationMiddleware, checkAdmin, invoiceController.editInvoice)

//edit invoice item
router.patch('/edit-invoice-item/:id', authenticationMiddleware, checkAdmin, invoiceController.editInvoiceItem)

// delete invoice
router.delete('/delete-invoice/:id', authenticationMiddleware, checkAdmin, invoiceController.revokeInvoice)

//get invoice detail
router.get('/invoice/:id', authenticationMiddleware, checkAdmin, invoiceController.getInvoiceDetail)

//get invoice that created by admin
router.get('/invoice-all/:id', authenticationMiddleware, checkAdmin, invoiceController.getByAdmin)




module.exports = router;
