const carro1 = prompt("Digite o nome do primeiro carro:")
const entrada1 = prompt("Velocidade do carro " + carro1)

const carro2 = prompt("Digite o nome do primeiro carro:")
const entrada2 = prompt("Velocidade do carro " + carro2)

const velocidade1 = parseFloat(entrada1)
const velocidade2 = parseFloat(entrada2)

if (velocidade1 === velocidade2)
{
    alert("O " + carro1 + " e o " + carro2 + "tem a mesma velocidade.")
}
else if (velocidade1 > velocidade2)
{
    alert("O " + carro1 + " é mais rápido que o " + carro2 + ".")
}
else
{
    alert("O " + carro2 + " é mais rápido que o " + carro1 + ".")
}