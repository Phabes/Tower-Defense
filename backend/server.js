const express = require("express");
const cors = require("cors");
const fs = require("fs");
// const { levels } = require("./levels");
const PORT = process.env.PORT || 4000;

const app = express();

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
  if(!data)
    res.status(301).send();
  res.status(200).send();
})
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
