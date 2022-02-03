const express = require('express');
const router = express.Router();

router.get('/login', function(req, res, next) {
    res.render('auth/login', {
      title: 'login page',
      layout: 'auth' 
  });
  });

router.get('/register', function(req, res, next) {
    res.render('auth/register', {
      title: 'register page',
      layout: 'auth' 
  });
  });


router.get('/logout', function(req, res, next) {
    req.session.isAuthen = false,
    res.redirect("/auth/login")
  });

router.post("/login" , function(req, res, next){
    req.session.isAuthen =true
    
    req.session.save((err)=>{
      if(err){
        throw new Error
      }
      res.redirect("/admin")

    })
})

module.exports = router;