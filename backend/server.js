const express = require("express");
const cors = require("cors");
const { levels } = require("./levels");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.get("/levels", (req, res) => {
  res.status(200).json({ levels });
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
