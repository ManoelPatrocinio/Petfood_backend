//sera usado para emportar todos os index.js de uma vez

const fs = require("fs")
const path = require('path')

module.exports = app =>{
    fs
        .readdirSync(__dirname)
        .filter(file =>((file.indexOf('.')) !== 0 &&  (file !== "index.js")))  //filtra os arquivos com começam com '.' ex: .env, e o proprio arq index.js)
        .forEach(file => require(path.resolve(__dirname,file))(app))    // percorre todos os arquivos do controller e add o app a eles

}