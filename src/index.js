require("dotenv").config(); //para poder ler as variaveis do .env
const express = require("express");
const app = express();
const cors = require("cors"); //controle de acesso
const morgan = require("morgan"); //controle das requisições

require("./data/database");

app.set("port", process.env.PORT || 3333);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// para controller de atenticação
require('./app/controller/index')(app)

app.use("/", require("./routes/routes"));

app.listen(app.get("port"), () => {
  console.log("api up on port", process.env.PORT);
});
