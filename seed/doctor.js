import bcrypt from 'bcrypt'

const doctor = [
    {
        name: "Juan Ramon Ramirez",
        email:"correo@correo.com",
        specialty:"Neuro",
        password: bcrypt.hashSync('password',10),
        verified: 1
    },
    {
        name: "Jose Eduardo Ramirez",
        email:"correo1@correo.com",
        specialty:"Cardio",
        password: bcrypt.hashSync('password',10),
        verified: 1
    },
]

export default doctor