const mongoose = require('mongoose');
const purchaseProductSchema = new mongoose.Schema({
    purchaseDate: String,
    billNumber: String,
    supplier: String,
    purchaseType: String,
    NoOfProducts: String,
    companyName:String,
   
    
    tableData: [{
      product: String,
      quantity: String,
      cp: String,
      expiryDate: String,
     
    }]
      
  
  
  });
  
  module.exports = mongoose.model('PurchaseProduct', purchaseProductSchema);
  