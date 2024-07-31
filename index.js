require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const generalRouter = require("./routers/general");
const postsRouter = require("./routers/posts");

const app = express();
const port = process.env.APP_PORT ?? process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
app.use("/static", express.static("static"));

app.use("/", generalRouter);
app.use("/p", postsRouter);

app.listen(port, () => {
  if(process.env.NODE_ENV === 'production') {
    console.log(`Server On with TiDB ${port}`)
  }
  console.log(`Server On http://localhost:${port}`);
});
