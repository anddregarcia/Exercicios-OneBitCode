const palavra = prompt("Digite uma palavra:")

let palavraInvertida = ""

for(let i = palavra.length - 1; i >= 0 ; i--)
{
    palavraInvertida += palavra[i]
}

if (palavra.replace(" ", "") === palavraInvertida.replace(" ", ""))
{
    alert("A palavra " + palavra + " é um palíndromo.")
}
else
(
    alert("A palavra '" + palavra + "' não é um palíndromo. Palavra invertida: '" + palavraInvertida + "'")
)