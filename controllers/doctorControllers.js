
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

const formForgotPassword = (req,res)=>{
    res.render('auth/forgot-password',{
        pagina: "Forget password?"
    })
}
export{
    formLogin,
    formSignup ,
    formForgotPassword
}