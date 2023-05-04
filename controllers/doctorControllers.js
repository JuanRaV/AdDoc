
const formLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: "Login"
    })
}

const formSignup = (req,res)=>{
    res.render('auth/signup',{
        pagina: "SignUp"
    })
}
export{
    formLogin,
    formSignup 
}