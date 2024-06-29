const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;


// FAZER LOGIN NO SISTEMA
router.post("/", (req, res, next) => {
  const {email,senha}= req.body;
  console.log(req.body);
  mysql.getConnection((err, conn) => {
    if (err) return res.status(500).send({ error: err });

    const query = 'SELECT * FROM usuario WHERE emailUsuario = ? AND senhaUsuario = ?';
    conn.query(query, [email, senha], (err, results) => {
      conn.release();
      if (err) return res.status(500).send({ error: err });

      if (results.length === 0) return res.status(401).send({ mensagem: "Falha na autenticação" });

      res.status(200).send({ mensagem: "Autenticado com sucesso", usuario: results[0] });
    });
  });
});
router.post("/cadastro", (req, res, next) => {

  const {
    nome,
    email,
    senha,
    confSenha,
    idCargo
  } = req.body;

  if (senha !== confSenha) {
    return res.status(400).send({ mensagem: "As senhas não coincidem" });
  }

  mysql.getConnection((err, conn) => {
   
    if (err) return res.status(500).send({ error: err });

    const queryCheck = 'SELECT * FROM usuario WHERE emailUsuario = ?';
    conn.query(queryCheck, [email], (err, results) => {
      if (err) {
        conn.release();
        console.log("passei no 2º erro 500 ")
        return res.status(500).send({ error: err });
      }

      if (results.length > 0) {
        conn.release();
        return res.status(409).send({ mensagem: "Usuário já cadastrado" });
      }

      const queryInsert = 'INSERT INTO usuario (nomeUsuario, emailUsuario, senhaUsuario, Id_Cargo) VALUES (?, ?, ?, ?)';
      conn.query(queryInsert, [nome, email, senha, idCargo], (err, results) => {
        conn.release();
      
        if (err) return res.status(500).send({ error: err });
       
        res.status(201).send({
          mensagem: "Usuário cadastrado com sucesso",
          usuario: {
            idUsuario: results.insertId,
            nomeUsuario: nome,
            emailUsuario: email,
            Id_Cargo: idCargo
          }
        });
      });
    });
  });
});
router.get("/", (req, res, next) => {
  

  mysql.getConnection((err, conn) => {
    if (err) return res.status(500).send({ error: err });

    const query = 'SELECT * FROM usuario ';
    conn.query(query,(err, results) => {
      conn.release();
      if (err) return res.status(500).send({ error: err });

      if (results.length === 0) return res.status(401).send({ mensagem: "Falha na autenticação" });

      res.status(200).send({ mensagem: "Autenticado com sucesso", usuarios: results });
    });
  });
});
router.get("/:id", (req, res, next) => {
  const {id} = req.params;

  mysql.getConnection((err, conn) => {
    if (err) return res.status(500).send({ error: err });

    const query = 'SELECT * FROM usuario where idUsuario=?';
    conn.query(query,[id],(err, results) => {
      conn.release();
      if (err) return res.status(500).send({ error: err });

      if (results.length === 0) return res.status(401).send({ mensagem: "Falha na autenticação" });

      res.status(200).send({ mensagem: "Lista de usuários", usuario: results[0] });
    });
  });
});




module.exports = router;
