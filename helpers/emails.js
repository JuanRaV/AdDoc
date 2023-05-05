import nodemailer from 'nodemailer'

const emailRegistro = async(data)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      const{name,email,token} = data
      //Sending email
      await transport.sendMail({
        from:"AdDoc.com",
        to: email,
        subject:'Confirm your account at AdDoc',
        text:'Confirm your account at AdDoc',
        html:`
            <p>Hi ${name}! confirm your account at AdDoc</p>
            <p>Your account is ready, you only need to confirm it on the next link: 
                <a href="${process.env.BACKEND_URL}:${process.env.PORT??3000}/confirm/${token}">Confirm Account</a>
            </p>
            <p>If you didn't create this account ignore the email</p>
        `
      })
}

const emailOlvidePassword = async(data)=>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const{name,email,token} = data
    //Sending email
    await transport.sendMail({
      from:"AdDoc.com",
      to: email,
      subject:'Change your password at AdDoc',
      text:'Change your password at AdDoc',
      html:`
          <p>Hi ${name}! change your password at AdDoc</p>
          <p>Follow the next link to generate a new password: 
              <a href="${process.env.BACKEND_URL}:${process.env.PORT??3000}/forget-password/${token}">Reset Password</a>
          </p>
          <p>If you didn't request this ignore the email</p>
      `
    })
}

export {emailRegistro,emailOlvidePassword}