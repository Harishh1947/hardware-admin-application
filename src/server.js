const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(express.static("public"));

// 🔐 Supabase (replace with your key)
const supabase = createClient(
  "https://ikfgqjxxwicfoaayuunq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmdxanh4d2ljZm9hYXl1dW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzkxMzksImV4cCI6MjA5MjAxNTEzOX0.7aNY1v2FMRCxxDeEr04-8d3jnVkArFYlJ9TK65W-X40"
);

// ================= ADD =================
app.post("/add", async (req, res) => {
  try {
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

    // Generate custom ID
    const customId = `CZSKLM${inserted.id}`;

    const { error: updateError } = await supabase
      .from("products")
      .update({ custom_id: customId })
      .eq("id", inserted.id);

    if (updateError) {
      console.log("CUSTOM ID ERROR:", updateError);
      return res.status(500).json(updateError);
    }

    // ✅ IMPORTANT: return correct format for frontend
    res.json({
      success: true,
      data: { ...inserted, custom_id: customId }
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= GET ALL =================
app.get("/products", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("GET ERROR:", error);
      return res.status(500).json(error);
    }

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
    console.log("UPDATE:", req.params.id, req.body);

    const { data, error } = await supabase
      .from("products")
      .update(req.body)
      .eq("id", req.params.id)
      .select();

    if (error) {
      console.log("UPDATE ERROR:", error);
      return res.status(500).json(error);
    }

    res.json({
      success: true,
      data
    });

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

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
