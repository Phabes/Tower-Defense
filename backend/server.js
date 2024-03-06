const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

const app = express();

const levels = [
  [
    [
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
    ],
    [
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "path", id: 5 },
      { type: "path", id: 6 },
      { type: "path", id: 7 },
      { type: "path", id: 8 },
      { type: "path", id: 9 },
      { type: "grass" },
      { type: "grass" },
    ],
    [
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "path", id: 4 },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "path", id: 10 },
      { type: "grass" },
      { type: "grass" },
    ],
    [
      { type: "path", id: 0 },
      { type: "path", id: 1 },
      { type: "path", id: 2 },
      { type: "path", id: 3 },
      { type: "grass" },
      { type: "path", id: 13 },
      { type: "path", id: 12 },
      { type: "path", id: 11 },
      { type: "grass" },
      { type: "grass" },
    ],
    [
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "path", id: 14 },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
    ],
    [
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "path", id: 15 },
      { type: "path", id: 16 },
      { type: "path", id: 17 },
      { type: "path", id: 18 },
      { type: "path", id: 19 },
    ],
    [
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
      { type: "grass" },
    ],
  ],
  [
    [{ type: "grass" }, { type: "grass" }, { type: "grass" }],
    [
      { type: "path", id: 0 },
      { type: "path", id: 1 },
      { type: "path", id: 2 },
    ],
    [{ type: "grass" }, { type: "grass" }, { type: "grass" }],
  ],
];

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
