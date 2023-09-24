function triangulo(objeto) 
{
    console.log(objeto)
    return objeto.base * objeto.altura / 2    
}

function retangulo(objeto) 
{
    return objeto.base * objeto.altura
}

function quadrado(objeto)
{
    return objeto.lado ^ 2
}

function trapezio(objeto)
{
    return (objeto.baseMenor + objeto.baseMaior) * objeto.altura / 2
}

function circulo(objeto) 
{
    const pi = 3.14
    
    return pi * (objeto.raio^2)
}

function promptParseFloat(texto)
{
    return parseFloat(prompt(texto))
}

function exibeResultado(resultado)
{
    alert("Resultado: " + resultado)
}

let sair = false

do
{
    let opcao = prompt(
        "Digite uma opção para efetuar o cálculo:\n" +
        "1 - Triângulo\n" +
        "2 - Retângulo\n" +
        "3 - Quadrado\n" +
        "4 - Trapézio\n" +
        "5 - Círculo\n" +
        "X - Sair"
        )

    let obj = {}

    switch (opcao) {
        case "1":
            
            obj.base = promptParseFloat("Informe a medida da base: ")
            obj.altura = promptParseFloat("Informe a medida da altura: ")

            console.log(obj)

            exibeResultado(triangulo(obj))

            break;
    
        case "2":
            
            obj.base = promptParseFloat("Informe a medida da base: ")
            obj.altura = promptParseFloat("Informe a medida da altura: ")

            exibeResultado(retangulo(obj))

            break;
    
        case "3":

            obj.lado = promptParseFloat("Informe a medida do lado: ")
            
            exibeResultado(quadrado(obj))

            break;
    
        case "4":
            
            obj.baseMenor = promptParseFloat("Informe a medida da base menor: ")
            obj.baseMaior = promptParseFloat("Informe a medida da base maior: ")
            obj.altura = promptParseFloat("Informe a medida da altura: ")

            exibeResultado(trapezio(obj))

            break;
    
        case "5":
            
            obj.raio = promptParseFloat("Informe a medida do raio: ")

            exibeResultado(circulo(obj))

            break;
    
        case "x":
            
            alert("Saindo...")
            sair = true
            break;
    
        default:

            alert("Opção inválida. Saindo...")
            sair = true
            break;
    }

} while (!sair)