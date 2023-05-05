const admin = (req,res)=>{
    res.render('dashboard/admin',{
        pagina: "Dashboard",
        barra:true
    })
}

export{
    admin
}