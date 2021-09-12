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
    await pool.query('INSERT INTO links set ?', [newlink]);
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
    const grupos = await pool.query('SELECT * FROM grupo where id_user=?',[req.user.id]);
    res.render('links/edit.hbs' , {datos : datos[0],grupos});
});

router.post('/edit/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
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
    await pool.query('UPDATE links set ? where id= ?',[newlink ,id]);
    console.log(newlink);
    req.flash('success','Link updated successfuly');
    res.redirect('/links');
});

//grupos
router.get('/group/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const links = await pool.query('SELECT * FROM links where user_id=? and table_id = ?',[req.user.id,id]);
    res.render('links/list-group.hbs' , {links});
});
router.get('/delete-group/:id_table',isLoggedIn,async(req,res)=>{
    const {id_table} = req.params;
    await pool.query('DELETE FROM links WHERE id_table = ?',[id_table]);
    await pool.query('DELETE FROM grupo WHERE id_table = ?',[id_table]);
    req.flash('success','group deleted successfuly');
    res.redirect('/links');
});
router.get('/edit-group/:id_table',isLoggedIn,async(req,res)=>{
    const {id_table} = req.params;
    const datos=await pool.query('SELECT * FROM grupo where id_table= ?',[id_table]);
    res.render('links/edit-group.hbs' , {datos : datos[0]});
});
router.post('/edit-group/:id_table',isLoggedIn,async(req,res)=>{
    const {id_table} = req.params;
    const {title_table}=req.body;
    await pool.query('UPDATE grupo set title_table=? where id_table= ?',[title_table ,id_table]);
    req.flash('success','group name updated successfuly');
    res.redirect('/links');
});
router.get('/add-group',isLoggedIn,async(req,res)=>{
    res.render('links/add-group.hbs');
});
router.post('/add-group',isLoggedIn,async(req,res)=>{
    const {title_table}=req.body;
    await pool.query('INSERT INTO grupo (title_table, id_user) VALUES (?, ?)', [title_table,req.user.id]);
    res.redirect('/links');
});




module.exports=router;