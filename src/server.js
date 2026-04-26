const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  "https://ikfgqjxxwicfoaayuunq.supabase.co",
  "YOUR_SUPABASE_KEY"
);

// ADD
app.post("/add", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([req.body])
      .select();

    if (error) return res.status(500).json(error);

    const inserted = data[0];
    const customId = `CZSKLM${inserted.id}`;

    const { error: updateError } = await supabase
      .from("products")
      .update({ custom_id: customId })
      .eq("id", inserted.id);

    if (updateError) return res.status(500).json(updateError);

    res.json({
      success: true,
      data: { ...inserted, custom_id: customId }
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL
app.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json(error);

  res.json(data);
});

// UPDATE
app.put("/update/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .update(req.body)
    .eq("id", req.params.id)
    .select();

  if (error) return res.status(500).json(error);

  res.json(data);
});

// DELETE
app.delete("/delete/:id", async (req, res) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json(error);

  res.json({ message: "Deleted successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
