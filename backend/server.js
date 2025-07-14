const express = require("express");
const cors = require("cors");
const app = express();
const urlRoutes = require("./routes/urlRoutes");

app.use(cors());
app.use(express.json());
app.use("/", urlRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
