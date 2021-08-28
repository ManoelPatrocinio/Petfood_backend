// autenticação de acesso do cliente

const jwt      = require("jsonwebtoken")
const authConfig = require("../config/auth.json")

module.exports =(req,res,next) => {
    const authHeader = req.headers.authorization;

    // verifica se o token foi informado
    if(!authHeader){
        return res.status(401).send({error:'No token provided'})
    }

    // verifica se o token esta no formato certo
    const parts = authHeader.split(' '); //separa em partes de acordo com o espaço

    if(!parts.lenght === 2)
        return res.status(401).send({erro: 'token error formart'})

    const [scheme, token] = parts;
    
    // verifica se o token começa com a string "Bearer"
    if(! /^Bearer$/i.test(scheme))   
       return res.status(401).send({erro: 'token bad formated'})

    // decoded: id do user com o token esteja correto   
    jwt.verify(token, authConfig.yourSecret, (err, decoded) =>{
        if(err) return res.status(401).send({erro: "token invalid"})

        req.userId = decoded.id

        return next();
    })   
}