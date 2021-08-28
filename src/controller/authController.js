const express  = require("express");
const User     = require("../models/clients") 
const bcrypt   = require("bcryptjs")
const jwt      = require("jsonwebtoken")
const authConfig = require("../config/auth.json")

const router = express.Router();

// criar um token para o user, que inspira em 1 dia
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.yourSecret,{
        expiresIn:86400
    })
}

router.post("/register", async (req, res) => {
    const {email} =  req.body;

    try {
      //verificr se o usuário esta casdastrado  
      if(await User.findOne({email}))  
        return res.json({ error: true, message: 'Usuário já cadastrado' });
      
      const user = await User.create(req.body);
      return res.send({user, token:generateToken({id: user.cpf})})
      user.cpf = undefined //para que não retorne o cpf na  resposta da rota
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
});

router.post("/login", async (req, res) => {
    const {email,cpf} =  req.body;
    console.log("dados recebido:",req.body)

    //busca no bd e verifica se o user exist
    const user = await User.findOne({email}).select('+cpf')

    if(!user){
      return res.json({ error: true, message: 'Usuário não cadastrado'  }).status(400);
      // res.status(400).send({ error: true, message: 'Usuário não cadastrado' });
  
    }
    

    //compara a senha informado com a registado no bd
    if(!await bcrypt.compare(cpf.toString (), user.cpf)){
      return res.json({ error: true, message: 'Senha inválida'  }).status(400);

    }    

    // user.cpf = undefined  

    // criar um token para o user, que inspira em 1 dia
    const token = jwt.sign({cpf: user.cpf}, authConfig.yourSecret,{
        expiresIn:86400
    })

    //se tudo ok
    res.send({
        user, 
        token:generateToken({cpf: user.cpf})
    })  
})
module.exports = app => app.use('/auth',router)