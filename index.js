import express, { request, response } from "express";
import mysql2 from "mysql2"
import cors from "cors"

const app = express()


app.use(express.json())
app.use(cors())


app.get("/filmes", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_GabrielScuoteguazzzaEnzoMarques"

    sql.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data)
    })
})

app.post("/adicionar-filme", (request, response) => {
    const { nomeDoFilme, genero, duracao, classificacao } = request.body

    const insertCommand = "INSERT INTO filmes_GabrielScuoteguazzzaEnzoMarques(nomeDoFilme, genero, duracao, classificacao) VALUES (?, ?, ?, ?)"

    sql.query(insertCommand, [nomeDoFilme, genero, duracao, classificacao], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.status(201).json({
            message: "Filme Adicionado!"
        })
    })
})


app.put("/editar-filme/:id", async (request, response) => {
    const { id } = request.params
    const { nomeDoFilme, genero, duracao, classificacao } = request.body

    const updateCommand = "UPDATE filmes_GabrielScuoteguazzzaEnzoMarques SET nomeDoFilme = ?, genero = ?, duracao = ?, classificacao = ? WHERE id = ?"
    sql.query(updateCommand, [nomeDoFilme, genero, duracao, classificacao, id], (error) => {
        if (error) {
            console.log(error)
            return
        }
        response.json({
            message: "Filme alterado com sucesso"
        })
    })
})

app.delete("/apagar-filme/:id", (request, response) => {
        const { id } = request.params

        const deleteCommand = "DELETE FROM filmes_GabrielScuoteguazzzaEnzoMarques WHERE id=?"

        sql.query(deleteCommand, [id], (error) => {
            if (error) {
                console.log(error)
                return
            }

            response.json({
                message:"Filme apagado!"
            })
        })

})

app.listen(3955, () => {
    console.log("Servidor rodando na ports 3955")
})

const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    database: "alunos_filmes03TA",
    user: "alunos",
    password: "senhaAlunos"
})