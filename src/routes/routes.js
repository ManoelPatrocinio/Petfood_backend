const express = require('express')
const router = express.Router();

const Petshops = require("../app/models/petshop");
const Products = require("../app/models/product");

// retorna todas as petshops
router.get('/petshops',async(req,res) =>{
    try{
        const petshops = await Petshops.find();

        res.json({ error: false, petshops });
        
    }catch(err){
        res.json({ error: true, message: err.message });
    }
})

//petshop expecificada pelo id
router.get("/petshop/:id", async (req, res) => {
  try {
    const petshop = await Petshops.findById(req.params.id);
    const products = await Products.find({
        petshop_id:petshop._id
    }).populate('petshop_id','recipient_id'); 

    res.json({ error: false, petshop:{...petshop._doc, products} });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// rota para o campo de busca 
router.post("/search", async (req, res) => {
  const { Datasearch } = req.body;
  const query = new RegExp([Datasearch], "i"); //adiciona espressão regular semelhante ao "like" para buscar por string
  let retorno;
  try {
    const petshop = await Petshops.findOne({ nome: { $regex: query } });
    if (petshop) {
      res.json({ error: false, petshop: { ...petshop._doc } });
    }else if (!petshop) {
      const products = await Products.find({ nome: { $regex: query } });
      res.json({ error: false, products });
    } else {
      res.json({ error: true, message: "Item não encontrado" });
    }
    

    
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});



module.exports = router;