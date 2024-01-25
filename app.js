// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios = require("axios");

const app = express();
const port = 3000;
var ejsData = {
  title: "TRANSLATE",
  result: "",
};

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index", ejsData);
});

app.post("/", async (req, res) => {
  const text = req.body.text;
  const toLanguage = req.body.toLanguages;
  const fromLanguage = req.body.fromlanguages;
  console.log("fromlan = " + fromLanguage);
  console.log("tolan = " + toLanguage);
  if (text !== "" || toLanguage != "") {
    let result = await translate(text, fromLanguage, toLanguage);
    ejsData.result = "Result: " + result;
    console.log(ejsData);
    res.redirect("/");
  }
});

async function translate(text, fromLanguage, toLanguage) {
  if (text !== "") {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${fromLanguage}|${toLanguage}`;
      const response = await axios.get(url);

      if (response.data && response.data.responseData) {
        const translation = response.data.responseData.translatedText;
        console.log("Text = " + text);
        console.log("Result = " + translation);
        return translation;
      } else {
        console.error("Error in API response");
      }
    } catch (error) {
      console.error("Error making API request:", error.message);
    }
  } else {
    console.log("EMPTY");
  }
}

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
