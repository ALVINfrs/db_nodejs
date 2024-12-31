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
});

// Route utama untuk menampilkan data
app.get("/", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, result) => {
    if (err) throw err;

    const users = JSON.parse(JSON.stringify(result));
    console.log("Hasil database ->", users);

    res.render("index", { users: users, title: "DAFTAR MURID KELAS" });
  });
});

// Route untuk menambahkan data
app.post("/tambah", (req, res) => {
  const insertSql = `INSERT INTO mahasiswa (Nama, kelas) VALUES ('${req.body.Nama}', '${req.body.kelas}')`;

  db.query(insertSql, (err, result) => {
    if (err) {
      console.error("Error saat menambahkan data:", err);
      return res.send("Error saat menambahkan data.");
    }

    res.redirect("/");
  });
});

// Route untuk menghapus data
app.get("/delete/:id", (req, res) => {
  const deleteSql = `DELETE FROM mahasiswa WHERE ID=${req.params.id}`;

  db.query(deleteSql, (err, result) => {
    if (err) {
      console.error("Error saat menghapus data:", err);
      return res.send("Error saat menghapus data.");
    }

    res.redirect("/");
  });
});

// Route untuk menampilkan form edit
app.get("/edit/:id", (req, res) => {
  const sql = `SELECT * FROM mahasiswa WHERE ID=${req.params.id}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error saat mengambil data:", err);
      return res.send("Error saat mengambil data.");
    }

    const user = JSON.parse(JSON.stringify(result))[0];
    res.render("edit", { user: user, title: "Edit Data Murid" });
  });
});

// Route untuk memperbarui data
app.post("/update/:id", (req, res) => {
  const updateSql = `UPDATE mahasiswa SET Nama='${req.body.Nama}', kelas='${req.body.kelas}' WHERE ID=${req.params.id}`;

  db.query(updateSql, (err, result) => {
    if (err) {
      console.error("Error saat memperbarui data:", err);
      return res.send("Error saat memperbarui data.");
    }

    res.redirect("/");
  });
});

// Menjalankan server di port 8000
app.listen(8000, () => {
  console.log("Server ready on port 8000...");
});
