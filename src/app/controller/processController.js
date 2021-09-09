// o usuario precisa estar autemticado para ter acessar ou dar continuidade

const express = require("express");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

const createSplitTransaction = require("../../services/pagarme").createSplitTransaction;

router.use(authMiddleware);


router.post("/purchase", async (req, res) => {
  try {
    const transaction = await createSplitTransaction(req.body);

    res.json(transaction);
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = (app) => app.use("/checked", router);
