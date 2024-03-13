const Customer = require('../models/CustomerModel');
const Product = require('../models/ProductModel');

exports.CreateBill= async (req, res) => {
  const userId = req.user.id;
    const customerId = req.params.id; // Use "_id" as the parameter name
    let billingData = req.body;
    
    try {

     
      const customer = await Customer.findOne({ _id:customerId}); // Use "_id" to find the customer
      if (!customer) {
        console.log('Customer not found for _id:', customerId);
        return res.status(404).json({ error: 'Customer not found.' });
      }


      billingData = {
        ...billingData,
        createdBy: userId,
         // Assuming createdByModel should be 'User' for userId
      };
  
  
      // Add the new appointment to the customer's appointments array
      customer.billing.push(billingData);
  
      // Save the updated customer document
      await customer.save();
  
      for (const item of billingData.items) {
        const product = await Product.findOne({ itemName: item.itemName });
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
  
        // Subtract the quantity sold from the stock
        product.stock -= item.quantity;
  
        // Save the updated product document
        await product.save();
      }
  
      res.status(201).json('Billing data saved successfully for the customer');
    } catch (error) {
      console.error('Error saving billing data:', error.message);
      console.log('_id:', customerId);
      res.status(500).json({ error: 'Error saving billing data.' });
    }
  };
  
  // exports.UpdateBill= async (req, res) => {
  //   const userId = req.user.id;
  //   const propertyId = req.params.id;
  //   const billId = req.params.billId;
  //   const updatedData = req.body;
  
  //   try {

  //     console.log('propertyId:', propertyId);
  //       console.log('updatedData:', updatedData);
  //       const { createdBy,  ...updateFields } = updatedData;

  //     const updatedProperty = await Customer.findByIdAndUpdate(
  //       propertyId,
  //       updateFields,
  //       { new: true }
  //     );
  
  //     if (!updatedProperty) {
  //       return res.status(404).json({ error: 'Customer not found.' });
  //     }
  
  //     res.status(200).json({ message: 'Customer updated successfully.' });
  //   } catch (error) {
  //     console.error('Error updating customer:', error);
  //     res.status(500).json({ error: 'Internal server error.' });
  //   }
  // };

  // exports.UpdateBill = async (req, res) => {
  //   const userId = req.user.id;
  //   const propertyId = req.params.id;
  //   const billId = req.params.billId;
  //   const updatedData = req.body;
  
  //   try {
  //     console.log('propertyId:', propertyId);
  //     console.log('updatedData:', updatedData);
  //     console.log('billId:', billId);
  
  
  //     // Exclude createdBy from updateFields
  //     const { createdBy, billing, ...updateFields } = updatedData;
  
  //     // Find the original document
  //     const originalDocument = await Customer.findById(propertyId);
  
  //     // Check if the document exists
  //     if (!originalDocument) {
  //       return res.status(404).json({ error: 'Customer not found.' });
  //     }
  
  //     // Find the billing object with the specified billId
  //     const updatedBilling = billing.map(bill => {
  //       if (bill._id === billId) {
  //         // If the billing object matches the billId, update createdBy field with userId
  //         return { ...bill, createdBy: userId };
  //       } else {
  //         return bill;
  //       }
  //     });
  
  //     // Perform the update
  //     const updatedProperty = await Customer.findByIdAndUpdate(
  //       propertyId,
  //       { ...updateFields, billing: updatedBilling },
  //       { new: true }
  //     );
  
  //     if (!updatedProperty) {
  //       return res.status(404).json({ error: 'Customer not found.' });
  //     }
  
  //     res.status(200).json({ message: 'Customer updated successfully.' });
  //   } catch (error) {
  //     console.error('Error updating customer:', error);
  //     res.status(500).json({ error: 'Internal server error.' });
  //   }
  // };
  

//   exports.UpdateBill = async (req, res) => {
//     const userId = req.user.id;
//     const propertyId = req.params.id;
//     const billId = req.params.billId;
//     const updatedData = req.body;
  
//     try {
//         console.log('propertyId:', propertyId);
//         console.log('updatedData:', updatedData);
//         console.log('billId:', billId);
  
//         // Find the original document
//         const originalDocument = await Customer.findById(propertyId);
  
//         // Check if the document exists
//         if (!originalDocument) {
//             return res.status(404).json({ error: 'Customer not found.' });
//         }
        
//         // Get the billing array from updatedData
//         const billingArray = updatedData.billing;
        
//         // Find the billing object with the specified billId
//         const updatedBilling = originalDocument.billing.map(bill => {
//             if (bill._id === billId) {
//                 // If the billing object matches the billId, update createdBy field with userId
//                 const updatedBill = billingArray.find(item => item._id === billId);
//                 if (updatedBill) {
//                     return { ...bill, ...updatedBill, createdBy: userId };
//                 } else {
//                     return bill;
//                 }
//             } else {
//                 return bill;
//             }
//         });
  
//         // Perform the update
//         const updatedProperty = await Customer.findByIdAndUpdate(
//             propertyId,
//             { billing: updatedBilling },
//             { new: true }
//         );
  
//         if (!updatedProperty) {
//             return res.status(404).json({ error: 'Customer not found.' });
//         }
  
//         res.status(200).json({ message: 'Customer updated successfully.' });
//     } catch (error) {
//         console.error('Error updating customer:', error);
//         res.status(500).json({ error: 'Internal server error.' });
//     }
// };


exports.UpdateBill = async (req, res) => {
    const customerId = req.params.id;
    const billId = req.params.billId;
    const updatedData = req.body;
    const userId = req.user.id; // Assuming userId is accessible from req.user.id
 console.log(req.body);
    try {
        // Find the customer by customerId
        const customer = await Customer.findById(customerId );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const billingObject = customer.billing.id(billId);
        
        if (!billingObject) {
            return res.status(404).json({ message: 'Billing object not found' });
        }

        // Update the createdBy field to userId
        billingObject.createdBy = userId;

        // Update other fields with the provided updatedData
        Object.assign(billingObject, updatedData);

        // Save the updated customer object
        await customer.save();

        res.status(200).json({ message: 'Billing object updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
