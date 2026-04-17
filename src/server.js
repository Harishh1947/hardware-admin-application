const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  "https://ikfgqjxxwicfoaayuunq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmdxanh4d2ljZm9hYXl1dW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzkxMzksImV4cCI6MjA5MjAxNTEzOX0.7aNY1v2FMRCxxDeEr04-8d3jnVkArFYlJ9TK65W-X40"
);

// ADD PRODUCT
app.post("/add", async (req, res) => {
  const { data, error } = await supabase.from("products").insert([req.body]);
  if (error) return res.status(500).send(error);
  res.send(data);
});

// GET ALL PRODUCTS
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
  if (error) return res.status(500).send(error);
  res.send(data);
});

// UPDATE PRODUCT (FULL EDIT)
app.put("/update/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(500).send(error);
  res.send(data);
});

app.listen(3000, () => console.log("Server running on port 3000"));
