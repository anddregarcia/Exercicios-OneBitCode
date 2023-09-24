const nomeTurista = prompt("Qual é seu nome?")
let cidadesVisitadas = ""

cidadesVisitadas = prompt("Qual cidade você visitou?")

let continua = prompt("Você vistou mais cidades? (S/N)")

while (continua === "S")
{
    cidadesVisitadas += ", " + prompt("Qual cidade você visitou?")

    continua = prompt("Você vistou mais cidades? (S/N)")
}

alert("As cidades visitadas pelo " + nomeTurista + " foram:\n" + cidadesVisitadas)