const express = require("express");
const mysql = require("mysql");
const BodyParser = require("body-parser");
const app = express();

// Middleware untuk parsing body dari form
app.use(BodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");

// Koneksi ke database
const db = mysql.createConnection({
  host: "localhost",
  database: "database_mahasiswa",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected...");

  // Query untuk mendapatkan semua data mahasiswa
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, result) => {
    if (err) throw err;

    const users = JSON.parse(JSON.stringify(result));
    console.log("Hasil database ->", users);

    // Route untuk menampilkan halaman utama dengan data mahasiswa
    app.get("/", (req, res) => {
      res.render("index", { users: users, title: "DAFTAR MURID KELAS" });
    });
  });
});

// Route untuk menambahkan data mahasiswa baru
app.post("/tambah", (req, res) => {
  const insertSql = `INSERT INTO mahasiswa (Nama, kelas) VALUES ('${req.body.Nama}', '${req.body.kelas}')`;

  // Menambahkan data ke database
  db.query(insertSql, (err, result) => {
    if (err) {
      console.error("Error saat menambahkan data:", err);
      return res.send("Error saat menambahkan data.");
    }

    // Setelah insert, lakukan SELECT ulang untuk mendapatkan data terbaru
    const sql = "SELECT * FROM mahasiswa";
    db.query(sql, (err, result) => {
      if (err) throw err;

      const users = JSON.parse(JSON.stringify(result));
      console.log("Hasil database setelah update ->", users);

      // Render kembali halaman dengan data terbaru
      res.render("index", { users: users, title: "DAFTAR MURID KELAS" });
    });
  });
});

// Menjalankan server di port 8000
app.listen(8000, () => {
  console.log("Server ready on port 8000...");
});
