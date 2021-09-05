// o usuario precisa estar autemticado para ter acessar ou dar continuidade

const express = require("express")
const authMiddleware = require('../middleware/auth')
const router = express.Router();

router.use(authMiddleware
    )
router.get('/',(req,res) =>{
    res.send({ok:true, user:req.user})
})

module.exports = app => app.use('/projects',router)