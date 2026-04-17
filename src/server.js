const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  "https://ikfgqjxxwicfoaayuunq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmdxanh4d2ljZm9hYXl1dW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzkxMzksImV4cCI6MjA5MjAxNTEzOX0.7aNY1v2FMRCxxDeEr04-8d3jnVkArFYlJ9TK65W-X40"
);

// ADD
app.post("/add", async (req, res) => {
  console.log("ADD BODY:", req.body);

  const { data, error } = await supabase
    .from("products")
    .insert([req.body])
    .select();

  if (error) {
    console.log("ADD ERROR:", error);
    return res.status(500).json(error);
  }

  res.json(data);
});

// GET ALL
app.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  console.log("GET ERROR:", error);

  if (error) return res.status(500).json(error);

  res.json(data);
});

// UPDATE
app.put("/update/:id", async (req, res) => {
  console.log("UPDATE ID:", req.params.id);
  console.log("UPDATE BODY:", req.body);

  const { data, error } = await supabase
    .from("products")
    .update(req.body)
    .eq("id", req.params.id)
    .select();

  if (error) {
    console.log("UPDATE ERROR:", error);
    return res.status(500).json(error);
  }

  res.json(data);
});

app.listen(3000, () => console.log("Server running"));
