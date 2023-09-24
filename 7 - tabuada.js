let numero = parseFloat(prompt("Digite um número:"))

var tabuada = ""

for(let i = 1; i <=20; i++)
{
    let resultado = numero * i

    tabuada += numero + " x " + i + " = " + resultado + "\n"
}

alert(tabuada)