const Petshop = require("../app/models/petshop");
const Product = require("../app/models/product");
const petshopsInfos = require("./dataBase.json");
const createRecipient = require("../services/pagarme").createRecipient;
require("../data/database");

// add os petshops e produtos do arquivo petfood.json no BD
const addPetshopAndProduct = async () => {
  try {
    //percorre o arquivo e insere cada petshop por vez na variavel petshop
    for (let petshop of petshopsInfos) {
      const newPetshop = await new Petshop(petshop).save(); // inseri as petshops no bd
     
        await Product.insertMany(
          petshop.produtos.map((p) => ({ ...p, petshop_id: newPetshop._id })) //inseri o id da petshop no registo do produto
        );
  
     
    }

    console.log("final do script: addPetshopAndProduct");
  } catch (error) {
    console.log(error.message);
  }
};

addPetshopAndProduct();
