const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = config.get("port") || 5000;

const start = async () => {
  try {
    await mongoose.connect(config.get("mongoURI"), {});
    app.listen(PORT, () =>
      console.log(`Server started on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Server Error ", error);
    process.exit(1); // выход из процесса node.js
  }
};

start();
