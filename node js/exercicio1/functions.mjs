import fs from "node:fs"

export function createFile(text) {
    fs.writeFileSync("meuarquivo.txt", text, (error) => {
        if (error)
        {
            console.log("Error ao escrever arquivo: ", error.message)
        }
    })
}

export function showFile()
{
    fs.readFileSync("meuarquivo.txt", "utf-8", (error, content) => {
        if (error)
        {
            console.log("Erro ao ler o arquivo", error.message)
        }
        else
        {
            console.log(content);
        }
    })
}