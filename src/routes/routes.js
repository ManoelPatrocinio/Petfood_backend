const express = require('express')
const router = express.Router();

const Petshops = require("../models/petshop");
const Products = require("../models/product");
const createSplitTransaction = require('../services/pagarme').createSplitTransaction;


router.get('/petshops',async(req,res) =>{
    try{
        const petshops = await Petshops.find();

        res.json({ error: false, petshops });
        
    }catch(err){
        res.json({ error: true, message: err.message });
    }
})

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

router.post("/purchase", async (req, res) => {
  try {
    const transaction = await createSplitTransaction(req.body);

    res.json(transaction);
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});


module.exports = router;