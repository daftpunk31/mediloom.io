import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import profileController from '../controller/profile.js';
import * as userController from '../controller/mainController.js';
import authenticate from '../middleware/sessionActiveAuthenticate.js';

const router = express.Router();
import bodyParser from 'body-parser';
import { log } from 'console';
router.use(bodyParser.urlencoded({ extended: true }));


// Replicate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// router.post('/login', authController.login);

// all the routes after this middleware are protected and can only be accessed if the user is logged in.

// router.use(authenticate);
// router.get('/profile',profileController.profile);

router.get('/', (req, res) => {
  if (req.session.user) {
    res.render('displayStuffPage.ejs', { user: req.session.user}); // Render EJS template with user details
  } else {
    res.render('displayStuffPage.ejs', { user: null }); // Render template with no user details
  }
});
//This route is used to diplay any sort of error.
router.get('/errorDisplay',(req,res)=>{
  const message = req.query.message || req.session.message || null;
    req.session.message = null; // Clear the session message after use
    res.render('errorDisplayPage.ejs', { message });
})

// This route displays the registration page
router.get('/registerPage',(req,res)=>{
  const message = req.query.message || req.session.message || null;
    req.session.message = null; // Clear the session message after use
    res.render('register.ejs', { message });
})

// This route displays the login page
// router.get('/loginPage',(req,res)=>{
//   // console.log(req.session);
//   const message = req.query.message || req.session.message || null;
//     req.session.message = null; // Clear the session message after use
//     res.render('login.ejs', { message });
// })

router.get('/loginPage', (req, res) => {
  res.redirect('/login');
});





// This route is used to give permission to doctor to access patient's files as soon as he (doctor) logs in.
router.get('/doctorDocumentAccessPermission',authenticate,(req,res)=>{
  if(req.session.role === "Doctor/Medical Professional"){
  const message = req.query.message || req.session.message || null;
    req.session.message = null; // Clear the session message after use
  res.render('doctorAccessPermissionPage.ejs',{ message })
  }
  else{
    res.status(403).send('Invalid Access'); // Return status code 403 and message
  }
});

// After a doctor logs in and gets permission from the patient, this route is used to display the doctor dashboard
router.get('/doctorDashboard',authenticate,(req,res)=>{
  if(req.session.role === "Doctor/Medical Professional"){
    const message = req.query.message || req.session.message || null;
      req.session.message = null;
  res.render('doctorDashboardPage.ejs',{message})
  }
  else{
    res.status(403).send('Invalid Access'); // Return status code 403 and message
  }
});

// After a hospital admin logs in, this route is used to display the hospital admin dashboard
router.get('/adminDashboard', authenticate, (req,res)=>{
  if(req.session.role === "Hospital Admin"){
    const message = req.query.message || req.session.message || null;
      req.session.message = null; // Clear the session message after use
  res.render('adminDashboard.ejs',{ message });
  }
  else{
    res.status(403).send('Invalid Access'); // Return status code 403 and message
  }
});

// After a civilian logs in, this route is used to display the document access page
router.get('/documentAccess', authenticate, (req, res) => {
  if(req.session.role === "Civilian"){
    const message = req.query.message || req.session.message || null;
      req.session.message = null; // Clear the session message after use
  res.render('documentAccessPage.ejs',{ message });
  }
  else{
    res.status(403).send('Invalid Access'); // Return status code 403 and message
  }
});

// After a policymaker logs in, this route is used to display the visualizations page
// router.get('/vizualizations', authenticate, (req, res) => {
//   if(req.session.role === "Policymaker"){
//     const message = req.query.message || req.session.message || null;
//       req.session.message = null; // Clear the session message after use
//   res.render('finalViz.ejs',{ message });
//   }
//   else{
//     res.status(403).send('Invalid Access'); // Return status code 403 and message
//   }
// });

// router.get('/visualizations', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../client/build/index.html'));
// });

// router.get('/dashboard', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../client/build/index.html'));
// });

// router.get('/api/data', (req, res) => {
//   res.json({ message: 'Hello from the backend!' });
// });


// router.get('/doctorDocAccessPage',(req,res)=>{
//   // console.log(req.session);
//   res.render('doctor_doc_access_page.ejs')});


// // Fallback route for React
// router.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../client/build/index.html'));
// });
  
router.post('/logoutUser', authenticate, userController.logoutUser);

router.post("/generate-otp",userController.sendOtpMessage);

router.post("/verify-otp", userController.verifyOtp);

router.post('/registerUser', userController.registerUser);

router.post('/loginUser', userController.loginUser);

router.post('/sendCustomTemplateMessage', userController.sendCustomTemplateMessage);


export default router;