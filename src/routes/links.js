const express=require('express');
const router =express.Router();

const pool=require('../database')

const {isLoggedIn}=require('../lib/auth');

router.get('/add',isLoggedIn,async(req,res)=>{
    const grupos = await pool.query('SELECT * FROM grupo where id_user=?',[req.user.id]);
    res.render('links/add.hbs',{grupos});
});


router.post('/add',isLoggedIn,async (req,res)=>{
    const {title,url,description,table_id}=req.body;
    let newlink={};
    if(table_id==''){
        newlink={
            title,
            url,
            description,
            user_id:req.user.id
            
        };
    }else{
        newlink={
            title,
            url,
            description,
            user_id:req.user.id,
            table_id
        };
    }
    console.log(newlink);
    pool.query('INSERT INTO links set ?', [newlink]);
    req.flash('success','Link saved successfuly');
    res.redirect('/links');
});

router.get('/',isLoggedIn,async(req,res)=>{
    const links = await pool.query('SELECT * FROM links where user_id=? and table_id IS null',[req.user.id]);
    const grupos = await pool.query('SELECT * FROM grupo where id_user=?',[req.user.id]);
    res.render('links/list.hbs' , {links,grupos});
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

//grupos
router.get('/group/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const links = await pool.query('SELECT * FROM links where user_id=? and table_id = ?',[req.user.id,id]);
    res.render('links/list-group.hbs' , {links});
});


module.exports=router;