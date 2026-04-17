const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ADD
app.post("/add", async (req, res) => {
  const { data, error } = await supabase.from("products").insert([req.body]);
  if (error) return res.status(500).send(error);
  res.send(data);
});

// GET ALL
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(500).send(error);
  res.send(data);
});

// SEARCH
app.get("/search/:value", async (req, res) => {
  const v = req.params.value;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`serial_number.ilike.%${v}%,product_number.ilike.%${v}%,model_number.ilike.%${v}%`);

  if (error) return res.status(500).send(error);
  res.send(data);
});

// UPDATE
app.put("/update/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(500).send(error);
  res.send(data);
});

app.listen(3000, () => console.log("Server running"));
