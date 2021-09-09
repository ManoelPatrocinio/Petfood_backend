const express      = require("express");
const User         = require("../models/clients") 
const bcrypt       = require("bcryptjs")
const crypto       = require("crypto") // token de recuperação de senha
const jwt          = require("jsonwebtoken")
const authConfig   = require("../../config/auth.json")
const mailer       = require('../../modules/mailer')

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

router.post('/forgot_password', async(req,res) =>{
  const {email} = req.body;

  try {
    const user = await User.findOne({email})

    if(!user){
      return res.json({ error: true, message: 'Usuário não cadastrado'  }).status(400);  
    } 

    const token  = crypto.randomBytes(20).toString('hex')// gera um token de 20 caracteres
    const now = new Date() // regata a hora da requisição de recuperção de senha
    now.setHours(now.getHours() + 1) // adicionar uma hora, que será o tempo de expiração do token

    await User.findByIdAndUpdate(user.id,{
      '$set':{
        passwordResertToken: token,
        passwordResertExpires: now, 
      }
    })
    mailer.sendMail({
      to:email,
      from: 'petfoodSuport@gmail.com',
      template:'auth/forgot_password',
      context: {token},
    }, (err) =>{
      if(err){
        console.log(err)
        return res.json({ error: true, message: 'Não foi possivel enviar um email de recuperação '  }).status(400);
      }

      return res.json({ error: false, message: 'foi enviado um email de recuperação '  }).status(200);
    })
  } catch (error) {
    console.log(error)
    res.json({ error: true, message: 'Erro na recuperação da senha, tente novamente'  }).status(400);
  }

})


router.post('/reset_password', async(req,res) =>{
  const {email,token,password} = req.body

  try {
    const user = await User.findOne({email}).select('+passwordResertToken passwordResertExpires')

    if(!user){
      return res.json({ error: true, message: 'Usuário não cadastrado'  }).status(400);  
    }
    
    if(token !== user.passwordResertToken){
      return res.json({ error: true, message: 'Token inválido'  }).status(400);  
    }

    const now = new Date();
    if(now > user.passwordResertExpires){
      return res.json({ error: true, message: 'Token expirado'  }).status(400);  
    }

    //se todo ok, salva a nova senha
    user.password = password;
    await user.save()

    res.json({ error: true, message: 'Sua senha foi auterada com sucesso' }).status(200);

  } catch (error) {
    console.log(error)
    res.json({ error: true, message: 'Não foi possivel recuperação da senha, tente novamente'  }).status(400);
  }

})
module.exports = app => app.use('/auth',router)