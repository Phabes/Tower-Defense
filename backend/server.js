const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require('body-parser')
// const { levels } = require("./levels");
const PORT = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json())
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.get("/levels/getLevels", (req, res) => {
  try{
    const data = fs.readFileSync("./levels.json", "utf8")
    res.status(200).json(data);
  }catch (err){
    res.status(301).json({ err });
  }
});

app.post("/levels/newLevel" ,(req, res)=>{
  const data = req.body;
  const f = fs.readFileSync("./levels.json", "utf8")
  const levels = JSON.parse(f)
  if(!data)
    res.status(401).send();
  levels.levels.push(data)
  fs.writeFileSync("./levels.json",JSON.stringify(levels),err=>{
    res.status(501).send();
  })
  res.status(200).send();
})
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
