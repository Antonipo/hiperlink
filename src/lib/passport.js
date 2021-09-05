const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool=require('../database');
const helpers = require('../lib/helpers');

//para el login
passport.use('local.login',new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    
    const rows = await pool.query('SELECT*FROM users WHERE username= ?',[username]);
    if(rows.length>0){
        const user=rows[0];
        const validPassword= await helpers.matchPasword(password,user.password);
        if(validPassword){
            done(null,user,req.flash('success','Welcome '+user.username));

        }else{
            done(null,false,req.flash('message','Incorrect Password'));
        }
    }else{
        return done(null,false,req.flash('message','the username does not exists'));
    }
}));


//para el signup
passport.use('local.signup',new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    const { fullname }=req.body
    const newUser={
        username,
        password,
        fullname
    };

    const rows = await pool.query('SELECT*FROM users WHERE username= ?',[username]);
    if(rows.length>0){
        return done(null,false,req.flash('message','the username alredy exists'));
    }else{
    ///esto es el original
    newUser.password=await helpers.encryptPasword(password);
    const result = await pool.query('INSERT INTO users SET ?',[newUser]);
    newUser.id=result.insertId;
    return done(null,newUser);
    //aqui termina el original
    }
}));

passport.serializeUser((user,done) =>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    const row = await pool.query('SELECT*FROM users where id=?',[id]);
    done(null,row[0]);
});