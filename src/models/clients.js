const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")

const cliente = new Schema({
    name:{
        type:String,
        require:true
    }, 
    email:{
        type:String,
        require:true
    },  
    phone:{
        type:Number,
        require:true
    },  
    cpf:{
        type:String,
        require:true,
        select:false,  //para que o cpf não aparece em buscar comuns  
    },  
    created_at:{
        type:Date,
        default: Date.now
    },  
              


});

//encriptação da senha antes de Salva 

cliente.pre('save', async function(next){
    //define qual objeto terá o valor encriptado e quantos rounds
    const hash = await bcrypt.hash(this.cpf,10)

    this.cpf = hash
    next()
})

module.exports = mongoose.model('Clientes',cliente)