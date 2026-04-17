const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  "https://ikfgqjxxwicfoaayuunq.supabase.co",
  "YOUR_ANON_PUBLIC_KEY_HERE"
);

// Add product
app.post("/add", async (req, res) => {
  const { data, error } = await supabase.from("products").insert([req.body]);

  if (error) {
    return res.status(500).json({ error });
  }

  res.json(data);
});

// Get all products
app.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return res.status(500).json({ error });
  }

  res.json(data);
});

// Update product
app.put("/update/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) {
    return res.status(500).json({ error });
  }

  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
