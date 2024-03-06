const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/BillingController');
const Middleware = require('../controllers/Middleware'); 


// Define routes for appointments
router.post('/customers/:id/billing',Middleware, BillingController.CreateBill);
router.put('/customers/billing/:id', BillingController.UpdateBill);


module.exports = router;
