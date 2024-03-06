const Customer = require('../models/CustomerModel');

const Register = require('../models/RegisterModel'); // Import the Register model

const path = require('path');
exports.CreateCustomer= async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, dob,email, phone, address,createdByModel } = req.body;
      const newCustomer = new Customer({
        name,
        dob,
        email,
        phone,
        address,
        profilePhoto: req.file ? req.file.path : null,
        createdBy:userId,
        createdByModel,
        
    });
      await newCustomer.save();
      res.status(201).json(newCustomer);
    } catch (error) {
      console.error('Error saving customer data:', error);
      res.status(500).json({ error: 'Error saving customer data' });
    }
  };
  
 

//   exports.ReadCustomer = async (req, res) => {
//     try {
//       const customers = await Customer.find().populate('createdBy', 'username');
//       res.json(customers);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//       res.status(500).json({ error: 'Error fetching customers' });
//     }
// };




// exports.ReadCustomer = async (req, res) => {
//   try {
//     // Populate the 'createdBy' field to get the referenced user or employee
//     const customers = await Customer.find().populate({
//       path: 'createdBy',
//     });
    
//     // Map over the customers array to handle the population based on createdByModel
//     const populatedCustomers = customers.map(customer => {
//       if (customer.createdBy && customer.createdByModel === 'Register') {
//         return {
//           ...customer.toObject(),
//           createdBy: customer.createdBy.username || 'Unknown'
//         };
//       } else if (customer.createdBy && customer.createdByModel === 'Employee') {
//         return {
//           ...customer.toObject(),
//           createdBy: customer.createdBy.employeeName || 'Unknown'
//         };
//       } else {
//         return {
//           ...customer.toObject(),
//           createdBy: 'Unknown'
//         };
//       }
//     });
    

//     console.log('Populated customers:', populatedCustomers);


//     res.json(populatedCustomers);
//   } catch (error) {
//     console.error('Error fetching customers:', error);
//     res.status(500).json({ error: 'Error fetching customers' });
//   }
// };


exports.ReadCustomer = async (req, res) => {
  try {
    // Populate the 'createdBy' field to get the referenced user or employee
    const customers = await Customer.find().populate({
      path: 'createdBy',
    }).populate({
      path: 'billing.createdBy'
    });
    
    // Map over the customers array to handle the population based on createdByModel
    const populatedCustomers = customers.map(customer => {
      if (customer.createdBy && customer.createdByModel === 'Register') {
        return {
          ...customer.toObject(),
          createdBy: customer.createdBy.username || 'Unknown'
        };
      } else if (customer.createdBy && customer.createdByModel === 'Employee') {
        return {
          ...customer.toObject(),
          createdBy: customer.createdBy.employeeName || 'Unknown'
        };
      } else {
        return {
          ...customer.toObject(),
          createdBy: 'Unknown'
        };
      }
    });

    // Additional logic to populate createdBy for billing entries
    const populatedCustomersWithBilling = populatedCustomers.map(customer => {
      const populatedBilling = customer.billing.map(bill => {
        let createdBy;
        if (bill.createdBy) {
          if (bill.createdByModel === 'Register') {
            createdBy = bill.createdBy.username || 'Unknown';
          } else if (bill.createdByModel === 'Employee') {
            createdBy = bill.createdBy.employeeName || 'Unknown';
          }
        } else {
          createdBy = 'Unknown';
        }
    
        return {
          ...bill,
          createdBy: createdBy
        };
      });
    
      return {
        ...customer,
        billing: populatedBilling
      };
    });
    

    // console.log('Populated customers:', populatedCustomersWithBilling);

    res.json(populatedCustomersWithBilling);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Error fetching customers' });
  }
};




  exports.UpdateCustomer= async(req,res)=>{
    const id = req.params.id;
    const updatedCustomerData = req.body;
  
    try{
      const updatedCustomer = await Customer.findByIdAndUpdate(
        id,
        updatedCustomerData,
        {new: true}
      );
      if(!updatedCustomer){
        return res.status(404).json({error: 'Customer not found'});
      }
      res.status(200).json({message:'customer updated successfully',customer: updatedCustomer});
    }catch (error){
      console.log("error",error);
     res.status(500).json({error: 'An error occured while updating the customer'}) 
    }
  }
  
  