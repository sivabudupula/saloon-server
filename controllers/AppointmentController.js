const Customer = require('../models/CustomerModel');

// exports.CreateAppointment= async (req, res) => {
//   const { _id } = req.params; // Use "_id" as the parameter name
//   const appointmentData = req.body;

//   try {
//     const customer = await Customer.findOne({ _id }); // Use "_id" to find the customer
//     if (!customer) {
//       console.log('Customer not found for _id:', _id);
//       return res.status(404).json({ error: 'Customer not found.' });
//     }

//     // Add the new appointment to the customer's appointments array
//     customer.appointments.push(appointmentData);

//     // Save the updated customer document
//     await customer.save();

//     console.log('Appointment data saved successfully:', appointmentData);

//     res.status(201).json(appointmentData);
//   } catch (error) {
//     console.error('Error saving appointment data:', error.message);
//     console.log('_id:', _id);
//     res.status(500).json({ error: 'Error saving appointment data.' });
//   }
// };

exports.CreateAppointment = async (req, res) => {
  const customerId = req.params.id; // Correctly access customerId
  const appointmentData = req.body;
 console.log(req.params.id);
  try {
    const customer = await Customer.findOne({ _id: customerId }); // Use "_id" to find the customer
    if (!customer) {
      console.log('Customer not found for _id:', customerId);
      return res.status(404).json({ error: 'Customer not found.' });
    }

    // Add the new appointment to the customer's appointments array
    customer.appointments.push(appointmentData);

    // Save the updated customer document
    await customer.save();

    // console.log('Appointment data saved successfully:', appointmentData);

    res.status(201).json(appointmentData);
  } catch (error) {
    console.error('Error saving appointment data:', error.message);
    console.log('customerId:', customerId);
    res.status(500).json({ error: 'Error saving appointment data.' });
  }
};

  exports.UpdateAppointment= async (req, res) => {
    console.log(req.body);
    const customerId = req.params.id;
    
    const appntId = req.params.appntId;
    const updatedData = req.body;
  
    try {
      // Find the customer by customerId
      const customer = await Customer.findById(customerId );

      if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
      }

      const appointmentObject = customer.appointments.id(appntId);
      
      if (!appointmentObject) {
          return res.status(404).json({ message: 'Appointment object not found' });
      }

      // Update the createdBy field to userId
      // appointmentObject.createdBy = userId;

      // Update other fields with the provided updatedData
      Object.assign( appointmentObject,updatedData);

      // Save the updated customer object
      await customer.save();

      res.status(200).json({ message: 'Appointment object updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
  };


  exports.DeleteAppointment= async (req, res) => {
    const customerId = req.params.customerId;
    const appointmentId = req.params.appointmentId;
  
    try {
      // Find the customer by ID
      const customer = await Customer.findById(customerId);
  
      if (!customer) {
        // If the customer with the given ID was not found
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      // Find the appointment within the customer's appointments
      const appointmentIndex = customer.appointments.findIndex((appt) => appt._id.toString() === appointmentId);
  
      if (appointmentIndex === -1) {
        // If the appointment with the given ID was not found within the customer's appointments
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      // Remove the appointment from the customer's appointments array
      customer.appointments.splice(appointmentIndex, 1);
  
      // Save the updated customer data
      await customer.save();
  
      // If the appointment was successfully deleted
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  