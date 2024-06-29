const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// PESQUISAR FOTO POR ID
router.get("/:cod", (req, res, next) => {
  const cod = req.params.cod;
  mysql.getConnection((err, conn) => {
    if (err) return res.status(500).send({ error: err });

    const query = 'SELECT * FROM foto WHERE Cod = ?';
    conn.query(query, [cod], (err, results) => {
      conn.release();
      if (err) return res.status(500).send({ error: err });

      if (results.length === 0) return res.status(404).
      send({ mensagem: "Foto não encontrada" });

      res.status(200).send({ laboratorio: results[0] });
    });
  });
});

// CONSULTAR TODAS AS FOTOS
router.get("/", (req, res, next) => {
  mysql.getConnection((err, conn) => {

    if (err) return res.status(500).send({ error: err });

    const query = `
      SELECT 
      *
      FROM laboratorio;
    `;
    conn.query(query, (err, results) => {
      conn.release();
      if (err) return res.status(500).send({ error: err });

      res.status(200).send({ laboratorios: results });
    });
  });
});

module.exports = router;