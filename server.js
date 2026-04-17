const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// LOGIN (simple)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

// ADD PRODUCT
app.post("/add", async (req, res) => {
  const { data, error } = await supabase.from("products").insert([req.body]);
  if (error) return res.send(error);
  res.send(data);
});

// SEARCH
app.get("/search/:value", async (req, res) => {
  const value = req.params.value;

  const { data } = await supabase
    .from("products")
    .select("*")
    .or(`serial_number.eq.${value},product_number.eq.${value},model_number.eq.${value}`);

  res.send(data);
});

// UPDATE
app.put("/update/:id", async (req, res) => {
  const { data } = await supabase
    .from("products")
    .update(req.body)
    .eq("id", req.params.id);

  res.send(data);
});

app.listen(3000, () => console.log("Server running"));