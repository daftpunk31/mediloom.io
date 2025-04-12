import crypto from 'crypto';
import UserDAO from '../dao/userDAO.js';
import * as whatsappServices from '../api_services/whatsappService.js';

export const registerUser = async (req, res) => {
    try {
        // console.log('Request body:', req.body);
        const { firstname, phone, aadhar, email, password,gender,birthdate,role,hospitalID } = req.body;
        // console.log('username:', username);
        // console.log('email:', email);
        // console.log('password:', password);

        // Validate the role
        const validRoles = ["Civilian", "Doctor/Medical Professional", "Hospital Admin", "Policymaker"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({success:false, message: "Invalid role selected" });
        }
        // Check if the user already exists
        const existingUser = await UserDAO.getUserByEmail(email,role);

        if (existingUser) {
            return res.status(400).json({success:false, message: 'User already exists' });
        }

        else{
        const newUser = await UserDAO.createUser(firstname,phone,aadhar, email, password,role,hospitalID,gender,birthdate);

        if (!newUser) {
            return res.status(500).json({success:false, message: 'Error creating user' });
        }

        req.session.user = newUser; // Store user ID in session
        req.session.role = role; // Store user role in session
        // console.log('New user created:', newUser);
        // console.log('SessionID details:', req.sessionID);
        // console.log('Session user details:', req.session.user);
        // console.log('Session user role details:', req.session.role);

        if(role=="Civilian"){
        await whatsappServices.sendCustomTemplateMessage(phone, firstname);
        }

        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({success:false, message: "Error clearing cookie after registration" });
            }
            res.clearCookie('sessionID'); // Use the same name as in your session configuration
            return res.status(200).json({success:true, message: 'User registered successfully', user: newUser });
        });
        }
    } catch (error) {
      console.error("Error during user registration:", error); // Log actual error

        return res.status(500).json({ success: false, message: 'Error registering the user' });
    }
};

export const loginUser = async (req, res) => {
    try {
        // const { email, password } = req.body;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        const hospitalID = req.body.hospitalID;

        // console.log('email:', email);
        // console.log('password:', password);

        const user = await UserDAO.getUserByEmail(email,role);

        if (!user) {
            req.session.message = 'Please register before logging in';

            return res.status(404).json({ success: false, message: 'Account Not Found. Please register.' })

            // return res.redirect('/registerPage'); // Redirect to the registration page
        }

        const isPasswordValid = await UserDAO.verifyPassword(user.password, password);

        if (!isPasswordValid) {
            req.session.message = 'Wrong Password';
            // return res.redirect('/loginPage');
            return res.status(400).json({ success: false, message: 'Wrong Password' })
        }

        req.session.user = user; // Store user ID in session
        req.session.user.role = role; // Store user role in session
        req.session.user.hospitalID = hospitalID; // Store user role in session
        console.log('Session details:', req.session);

        // console.log('SessionID:', req.sessionID);

        // console.log('User logged in:', req.session.user);

        // console.log('User role:', req.session.user.role);

        // res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });

        if (role === "Hospital Admin") {
            req.session.message = 'Hospital Admin login successful';

            return res.status(200).json({ success: true, message: 'Hospital Admin login successful' })

            // res.redirect("/adminDashboard");

        }
        else if(role === "Doctor/Medical Professional"){
            req.session.message = 'Doctor login successful';

            return res.status(200).json({ success: true, message: 'Doctor login successful' })
            // res.redirect("/doctorDocumentAccessPermission");
        }
        else if(role === "Civilian"){
            req.session.message = 'Civilian login successful';

            return res.status(200).json({ success: true, message: 'Civilian login successful' })
            // res.redirect("/documentAccess");
        }
        else if(role === "Policymaker"){
            req.session.message = 'Policymaker login successful';


            return res.status(200).json({ success: true, message: 'Policymaker login successful' })
            // res.redirect("/vizualizations");
        }
    } catch (error) {
        req.session.message = 'Error logging in. Try after sometime';

        return res.status(500).json({ success: false, message: 'Error during login' })
            // return res.redirect('/errorDisplay');
    }
};


export const logoutUser = async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                req.session.message = "Error logging out. Don't worry your session will expire automatically in 30 mins";
            return res.redirect('/errorDisplay');
            }
            // Clear the session cookie
            res.clearCookie('sessionID'); // Use the same name as in your session configuration

            // Redirect to login page or send a success response
            res.redirect('/loginPage'); // Redirect to login page
        });

}

export const sendCustomTemplateMessage = async (req, res) => {
    try {
        const { phoneNumber, customerName } = req.body;

        // Call the WhatsApp service to send the message
        await whatsappServices.sendCustomTemplateMessage(phoneNumber, customerName);

        res.status(200).json({ message: 'Custom WhatsApp message template sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send custom WhatsApp message template', error: error.message });
    }
};


export function generateSecureSixDigit() {
  return crypto.randomInt(100000, 1000000); // Range: 100000 - 999999
}

export const sendOtpMessage = async (req, res) => {
    try {
        // console.log('Person details:', req.session.user);
        // console.log('Request body apt:', req.body.apt);
        // console.log('Session ID:', req.sessionID);
        console.log('Session details:', req.session);
        // console.log('Session user details:', req.session.user);
        if(req.session.user.role =="Doctor/Medical Professional"){
            const aadhar = req.body.aadharNumber;
        // console.log('Session before setting OTP:', req.session);

        // const slicedPhoneNumber = String(phoneNumber).slice(2);

        const existingCivilian = await UserDAO.getCivilianByAadhar(String(aadhar));

        if(!existingCivilian) {
            req.session.message = "This Aadhar number is not registered with us. Please Ask the patient to register with us";

            return res.status(404).json({ success: false, message: 'Paitent Not Registered' })
            // return res.redirect('errorDisplay'); // Redirect to the registration page
        }
        if (!req.session.patient_detials) {
            req.session.patient_detials = {}; // Initialize the object if it doesn't exist
        }
        
        req.session.patient_detials.first_name = existingCivilian.first_name;
        req.session.patient_detials.aadhar = existingCivilian.aadhar;
        req.session.patient_detials.phone = existingCivilian.phone;
        req.session.patient_detials.email = existingCivilian.email;
        
        console.log('Patient details:', req.session.patient_detials);

        // console.log('Existing civilian:', existingCivilian);
        
        const otp = generateSecureSixDigit(); // Store OTP in session

        req.session.otp = otp;
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ message: 'Failed to save session' });
            }
            console.log('Session saved successfully:');

            // console.log('Session saved successfully:', req.session);
        });

        // console.log('Generated OTP:', req.session.otp);

        // console.log('Session after setting OTP:', req.session);
        // Call the WhatsApp service to send the message

        await whatsappServices.sendOtpMessage(existingCivilian.phone, otp);

        // console.log('Session ID:', req.sessionID);

        // console.log('Session details after whatsapp otp sent:', req.session);

        // res.status(200)
        return res.status(200).json({ success: true, message: 'WhatsApp OTP sent successfully' });
        }
        else if(req.session.user.role == "Civilian"){
            const phone = req.session.user.phone;
            console.log('user phone number:', phone);
            const existingCivilian = await UserDAO.getCivilianByPhone(String(phone));
            if(!existingCivilian) {
                req.session.message = "This Phone number is not registered with us. Please  to register with us first.";
                return res.status(404).json({ success: false, message: 'Paitent Not Registered' })
            }
            if (!req.session.patient_detials) {
                req.session.patient_detials = {}; // Initialize the object if it doesn't exist
            }
            
            req.session.patient_detials.first_name = existingCivilian.first_name;
            req.session.patient_detials.aadhar = existingCivilian.aadhar;
            req.session.patient_detials.phone = existingCivilian.phone;
            req.session.patient_detials.email = existingCivilian.email;
            
            console.log('Patient details:', req.session.patient_detials);
            const otp = generateSecureSixDigit(); // Store OTP in session
            req.session.otp = otp;
            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.status(500).json({ message: 'Failed to save session' });
                }
                console.log('Session saved successfully:');
                // console.log('Session saved successfully:', req.session);
            });
            await whatsappServices.sendOtpMessage(existingCivilian.phone, otp);
            return res.status(200).json({ success: true, message: 'WhatsApp OTP sent successfully' });
        }


        // else if(req.session.role == "Civilian"){
        //     res.redirect('/documentAccessPage');
        // }
    } catch (error) {
        console.error('Error sending WhatsApp OTP:', error);
        return res.status(500).json({success:false, message: 'Failed to send Whatsapp OTP', error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        // Combine the OTP inputs from the request body
        const userOtp = req.body.otp;
        // console.log(userOtp, "User OTP");

        // console.log('Session ID:', req.sessionID);

        // Retrieve the original OTP from the session
        // console.log('Session details:', req.session);
        // console.log('Session details:', req.session.user);
        console.log('Session OTP details:', req.session.otp);
        const originalOtp = req.session.otp;
        console.log(originalOtp, "Original OTP");

        // Compare the user-provided OTP with the original OTP
        if (String(userOtp) === String(originalOtp)) {
            return res.status(200).json({ success: true, message: 'OTP verified successfully' });
            // res.redirect("/doctorDashboard");
        } else {
            req.session.message = "Incorrect OTP. Please try again.";
            return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
            // return res.redirect('/doctorDocumentAccessPermission');
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ success:false, message: "Error during verifying OTP", error: error.message });
    }
};

export const documentsInfoFetch = async (req, res) => {
    try {
        const patientAadhar = req.session.patient_detials.aadhar;

        const records = await UserDAO.fetchDocumentsINFObyAadhar(patientAadhar);

        // console.log('Files', records);

        const filteredRecords = records.map(record => ({
            id: record.record_id,
            type: record.type,
            name: record.file_name
        }));
        
        return res.status(200).json({ success: true, message: 'Documents fetched successfully', documents: filteredRecords });
    }
    catch (error) {
        console.error("Error fetching documents:", error);
        return res.status(500).json({ success: false, message: 'Error fetching documents' });

    }
}

export const documentFetch = async (req, res) => {
    try{
        // console.log('Request Params:', req.params); // Debugging
        const {fileId} = req.params;
        if (!fileId) {
            console.error('File ID is missing');
            return res.status(400).json({ success: false, message: 'File ID is required' });
        }
        // console.log('File ID:', fileId);
        const aadhar = req.session.patient_detials.aadhar;
        // console.log('Aadhar:', aadhar);

        const result = await UserDAO.fetchDocument(fileId,aadhar);

        if (!result) {
            console.error('Document not found');
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        const documentData = {
            location: result.file_location,
            name: result.file_name,
            type: result.type,
        };

        // console.log('Document data:', documentData);

        return res.status(200).json({ success: true, message: 'Document fetched successfully', document: documentData });
    }
    catch{
        return res.status(500).json({ success: false, message: 'Error fetching document' });

    }
}