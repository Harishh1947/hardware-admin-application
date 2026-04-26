const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ Supabase
const supabase = createClient(
  "https://ikfgqjxxwicfoaayuunq.supabase.co",
  "YOUR_SUPABASE_KEY"
);

// ================= ADD =================
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

  const inserted = data[0];

  // ✅ create custom ID
  const customId = `CZSKLM${inserted.id}`;

  const { error: updateError } = await supabase
    .from("products")
    .update({ custom_id: customId })
    .eq("id", inserted.id);

  if (updateError) {
    console.log("CUSTOM ID ERROR:", updateError);
    return res.status(500).json(updateError);
  }

  // ✅ IMPORTANT: return ARRAY (matches your old UI)
  res.json([
    { ...inserted, custom_id: customId }
  ]);
});

// ================= GET ALL =================
app.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  console.log("GET ERROR:", error);

  if (error) return res.status(500).json(error);

  res.json(data);
});

// ================= GET BY CUSTOM ID =================
app.get("/product/:custom_id", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("custom_id", req.params.custom_id);

  if (error) return res.status(500).json(error);

  res.json(data);
});

// ================= UPDATE =================
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

// ================= DELETE =================
app.delete("/delete/:id", async (req, res) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json(error);

  res.send({ message: "Deleted successfully" });
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
