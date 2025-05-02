//Configuração do app Express

const express = require('express')
const path = require('node:path')
const router = require('./routes')

const app = express()

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true}))

app.use(router)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor iniciado!\nRodando em http://localhost:${PORT}/`))