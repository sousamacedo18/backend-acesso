const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// PESQUISAR COMENTÁRIO POR ID da foto
router.get("/:cod", (req, res, next) => {
  const cod = req.params.cod;
  mysql.getConnection((err, conn) => {
    if (err) return res.status(500).send({ error: err });

    const query = 'SELECT * FROM comentario WHERE cod_foto = ?';
    conn.query(query, [cod], (err, results) => {
      conn.release();
      if (err) return res.status(500).send({ error: err });

      if (results.length === 0) return res.status(404).send({ mensagem: "Comentário não encontrado" });

      res.status(200).send({ comentario: results[0] });
    });
  });
});


// Salvar um novo comentário
router.post("/", (req, res, next) => {
  const {idfoto, id , textcomentario} = req.body;

  mysql.getConnection((err, conn) => {
    if (err) return res.status(500).send({ error: err });

    const query = 'INSERT INTO comentario (cod_foto, cod_usuario, texto_comentario, data_hora_comentario) VALUES (?, ?, ?, ?)';
    conn.query(query, [idfoto, id, textcomentario, "CURDATE()"], (err, results) => {
      conn.release();
      if (err) return res.status(500).send({ error: err });

      res.status(201).send({ mensagem: "Comentário salvo com sucesso!", cod_comentario: results.insertId });
    });
  });
});


module.exports = router;
