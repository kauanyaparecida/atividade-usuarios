const express = require('express');
const app = express()
const mysql = require("mysql2/promise")
app.use(express.json())

const poll = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "admin",
    database: "usuarios_api",
    waitForConnections: true,
})

app.get("/usuarios", async (req, res) => {
    const [usuario] = await poll.execute("SELECT * FROM usuario")
    return res.json(usuario)
})

app.post("/usuarios", async (req, res) => {
    const {email, senha } = req.body
   if(!email || !senha) {
    return res.status(400).json({error: "Email e senha são obrigatórios"})
   }
   
    const [usuario] = await poll.execute("INSERT INTO usuario (email, senha) VALUES (?, ?)",
         [email, senha])
    return res.status(201).json({ id: usuario.insertId, email, senha })
})
 app.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params
    await poll.execute("DELETE FROM usuario WHERE id = ?", [id])
    return res.status(204).send()
 })

 app.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params
    const { email, senha } = req.body
    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" })
    }

    await poll.execute(
        "UPDATE usuario SET email = ?, senha = ? WHERE id = ?",
        [email, senha, id]
    )
    return res.status(200).json({ id, email })
 })


app.listen(3000, () => console.log("API no ar :D"))  
