function authenticate(req,res,next){
  if(!req.session || !req.session.user){
    // res.status(401);
    // res.send("Access Denied");
    console.warn('Unauthorized access attempt:', req.originalUrl);
    req.session.message = "No live session found. Please login again.";
            return res.redirect('/loginPage'); // Redirect to the login page
  }
  // console.log('Session details:', req.session.user);
  next();
}

export default authenticate;