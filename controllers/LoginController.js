const Register = require('../models/RegisterModel');
const Employee = require('../models/EmployeeModel');
const jwt = require('jsonwebtoken');

exports.CreateLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists in the registers collection
        let user = await Register.findOne({ username });
        let userRole = '';

        if (!user) {
            // If not found, check if the user exists in the employees collection
            user = await Employee.findOne({ username });

            if (!user) {
                // If not found in either collection, return error
                return res.status(400).json({ error: 'User does not exist' });
            }

            // If found in employees collection, check isActive field
            userRole = 'employee';
            if (!user.isActive) {
                return res.status(400).json({ error: 'Employee is not active' });
            }
        } else {
            // If found in registers collection, verify password
            userRole = 'register';
            if (user.password !== password) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
        }

        // If user is found and credentials are correct, generate token
        let payload = {
            user: {
                id: user.id,
                role: userRole
            }
        };

        jwt.sign(payload, 'jwtSecret', { expiresIn: 3600000 }, (err, token) => {
            if (err) throw err;
            return res.status(200).json({
                token,
                message: 'Login Successful'
            });
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
}
