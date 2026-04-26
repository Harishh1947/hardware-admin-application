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

// ✅ Supabase connection
const supabase = createClient(
  "https://ikfgqjxxwicfoaayuunq.supabase.co",
  "YOUR_SUPABASE_KEY"
);

// ================= ADD =================
app.post("/add", async (req, res) => {
  try {
    console.log("🔥 ADD API HIT");
    console.log("BODY:", req.body);

    // Step 1: insert
    const { data, error } = await supabase
      .from("products")
      .insert([req.body])
      .select();

    if (error) {
      console.log("ADD ERROR:", error);
      return res.status(500).json(error);
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ error: "Insert failed" });
    }

    const inserted = data[0];

    // Step 2: generate custom ID
    const customId = `CZSKLM${inserted.id}`;

    // Step 3: update custom_id
    const { error: updateError } = await supabase
      .from("products")
      .update({ custom_id: customId })
      .eq("id", inserted.id);

    if (updateError) {
      console.log("UPDATE ERROR:", updateError);
      return res.status(500).json(updateError);
    }

    res.json({ ...inserted, custom_id: customId });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed" });
  }
});

// ================= GET ALL =================
app.get("/products", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    console.log("GET ERROR:", error);

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= GET BY CUSTOM ID =================
app.get("/product/:custom_id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("custom_id", req.params.custom_id);

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= UPDATE =================
app.put("/update/:id", async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= DELETE =================
app.delete("/delete/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id);

    if (error) return res.status(500).json(error);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
