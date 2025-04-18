let continua = false
let qtdDinheiro = 0

qtdDinheiro = parseFloat(prompt("Qual é a quantidade inicial de dinheiro disponível?"))

let opcao = ""

do
{
    opcao = prompt(
        "Você deseja Adicionar(A) ou Subtrair(S) dessa quantidade? Para sair digite X.\nA quantidade atual é " + qtdDinheiro
        )

    continua = opcao !== "X"

    if (opcao === "A")
    {
        var soma = parseFloat(prompt("Quanto você deseja adicionar?"))
        qtdDinheiro += soma
    }
    else if (opcao === "S")
    {
        var subtrai = parseFloat(prompt("Quanto você deseja subtrair?"))
        qtdDinheiro -= subtrai
    }

} while (continua)