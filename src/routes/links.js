const express=require('express');
const router =express.Router();

const pool=require('../database')

const {isLoggedIn}=require('../lib/auth');

router.get('/add',isLoggedIn,(req,res)=>{
    res.render('links/add.hbs');
});


router.post('/add',isLoggedIn,async (req,res)=>{
    const {title,url,description}=req.body;
    const newlink={
        title,
        url,
        description,
        user_id:req.user.id
    };
    pool.query('INSERT INTO links set ?', [newlink]);
    req.flash('success','Link saved successfuly');
    res.redirect('/links');
});

router.get('/',isLoggedIn,async(req,res)=>{
    const links = await pool.query('SELECT * FROM links where user_id=?',[req.user.id]);
    res.render('links/list.hbs' , {links});
});

router.get('/delete/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?',[id]);
    req.flash('success','Link deleted successfuly');
    res.redirect('/links');
});

router.get('/edit/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const datos=await pool.query('SELECT * FROM links where ID= ?',[id]);
    res.render('links/edit.hbs' , {datos : datos[0]});
});

router.post('/edit/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const { title,description,url}=req.body;
    const newLink={
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? where id= ?',[newLink ,id]);
    req.flash('success','Link updated successfuly');
    res.redirect('/links');
});

module.exports=router;