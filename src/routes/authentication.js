const express=require('express');
const router =express.Router();

const passport = require('passport')

//para asegurar links por el login
const {isLoggedIn,isNotLoggedIn}=require('../lib/auth');

router.get('/signup',isNotLoggedIn,(req,res)=>{
    res.render('auth/signup.hbs');
});
//router.post('/signup',(req,res)=>{
//    passport.authenticated('local.signup',{
//        successRedirect:'/profile',
//        failureRedirect :'/singup',
//        failureFlash: true
//    });

//    res.send('received');
//});
//esto es lo mismo que arriba pero mas rápido
/*esto es el verdadero
*/
router.post('/signup',isNotLoggedIn,passport.authenticate('local.signup',{
        successRedirect:'/profile',
        failureRedirect :'/signup',
        failureFlash: true
}));
/*
router.post('/signup',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local.signup',{
        successRedirect:'/profile',
        failureRedirect:'/signup',
        failureFlash:true
    })(req,res,next);
});*/
//lo de arriba es el cambio



router.get('/profile', isLoggedIn ,(req,res)=>{
    res.render('profile.hbs');
});

router.get('/login',isNotLoggedIn,(req,res)=>{
    res.render('auth/login.hbs');
});

router.post('/login',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local.login',{
        successRedirect:'/profile',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/logout',isLoggedIn,(req,res)=>{
    req.logOut();
    res.redirect('/login')
});



module.exports=router;