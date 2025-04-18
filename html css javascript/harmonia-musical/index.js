let siglas = ['Ct', 'D', 'E', 'F', 'G', 'A', 'B', 'C']
let intervalo = [0, 1, 1, 0.5, 1, 1, 1, 0.5]

let siglasCromaticoSustenidos = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
let siglasCromaticoBemois = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

let i = 0
let escalaMaiorC = []
let listaAscendentes = []
let listaBemois = []

const QUINTO_GRAU = "QUINTO_GRAU"
const QUARTO_GRAU = "QUARTO_GRAU"

const todasAsEscalas = []

let grauDictionary = [  {key: 1, value: "I"},
                        {key: 2, value: "II"},
                        {key: 3, value: "III"},
                        {key: 4, value: "IV"},
                        {key: 5, value: "V"},
                        {key: 6, value: "VI"},
                        {key: 7, value: "VII"},
                        {key: 8, value: "VIII"} ]

//primeiramente é criado o campo harmônico de Dó, pois ele será usado como base/início para os demais campos harmônicos
function carregarEscalaMaiorC() 
{
    siglas.forEach( (nota) => {

        escalaMaiorC.push( 
        {
            nota: nota,
            grau: ++i,
            intervalo: intervalo[siglas.findIndex((x) => x === nota)]
        })
    })
}

carregarEscalaMaiorC() //chamada para criação do campo harmônico de Dó

//essa função vai carregar os demais campos harmônicos de forma recursiva, montando próximo campos harmônico a partir de Dó através do
//seu quinto grau, colocando um ascendente ao sétimo grau
function carregarEscala(nota, tipo)
{
    let index = siglas.findIndex((x) => x === nota.replace("#", "").replace("b", ""))
    let escalaMaior = []
    
    let grau = 0

    let notaAnterior = ""

    for (let i = index; i < 7; i++) 
    {
        grau++
        escalaMaior.push(montarEscalaMaior(i, grau, notaAnterior, tipo))
        notaAnterior = escalaMaior[escalaMaior.length-1].nota
    }
    
    for (let i = 0; i <= index; i++) 
    {
        grau++
        if (i === 0)
        {
            escalaMaior.push(montarEscalaMaior(7, grau, notaAnterior, tipo))
            notaAnterior = escalaMaior[escalaMaior.length-1].nota
        }
        else
        {
            escalaMaior.push(montarEscalaMaior(i, grau, notaAnterior, tipo))
            notaAnterior = escalaMaior[escalaMaior.length-1].nota
        }
    }

    if (tipo === QUINTO_GRAU){
        carregarEscalaMaiorDasQuintas(escalaMaior) //sustenidos
    }
    else if (tipo === QUARTO_GRAU){
        carregarEscalaMaiorDasQuartas(escalaMaior) //bemóis
    }
}

//Aqui está a regra que monta os campos harmónicos a partir do quinto grau, adicionano # ao sétimo grau
function montarEscalaMaior(index, grau, notaAnterior, tipo)
{
    const element = siglas[index]
    let tonica = ""
    
    if (grau===1)
    {
        tonica = "t"
    }

    if (tipo === QUINTO_GRAU)
    {
        if (grau===7)
        {
            listaAscendentes.push(element)
        }        

        let notaComAsc = listaAscendentes.find((x) => x === element.replace("#", ""))

        let nota = ""
        if (notaComAsc)
        {
            nota = notaComAsc + "#" + tonica
        }
        else
        {
            nota = element + tonica
        }

        return { 
            nota: nota,
            grau: grau,
            intervalo: verificaIntervalosSustenidos(nota, notaAnterior)
            }
    }
    else if (tipo === QUARTO_GRAU)
    {
        if (grau===4)
        {
            listaBemois.push(element)
        }            
        
        let notaComAsc = listaBemois.find((x) => x === element.replace("b", ""))

        let nota = ""
        if (notaComAsc)
        {
            nota = notaComAsc + "b" + tonica
        }
        else
        {
            nota = element + tonica
        }            
        
        return { 
            nota: nota,
            grau: grau,
            intervalo: verificaIntervalosBemois(nota, notaAnterior)
            }
    }

}

//essa função identifica qual é o quinto grau de cada campo harmônico e passa esse quinto grau para as funções que vão carregar o campo
//harmônico completo
function carregarEscalaMaiorDasQuintas(escala)
{    
    let ch = escalaMaiorC //se não for passando um campo harmônico, a função assume o campo harmônico de Dó como inicial
    
    if (escala)
    {
        ch = escala
    }
    todasAsEscalas.push(ch)
    
    let proxQuintoGrau = ch.reduce((prev, curr) => {
        return curr.grau === 5 ? curr.nota : prev
    }, "") //identifica qual é o quinto grau do campo harmônico recebido
    
    if (proxQuintoGrau==="G#") 
    {
        return
        //regra para parar a recursão, se chegarmos no campo harmônico de G# devemos interromper, pois aqui é outra regra que vigora
    }
    
    carregarEscala(proxQuintoGrau, QUINTO_GRAU)
}

function carregarEscalaMaiorDasQuartas(escala)
{    
    let ch = escalaMaiorC //se não for passando um campo harmônico, a função assume o campo harmônico de Dó como inicial
    
    if (escala)
    {
        ch = escala
    }
    todasAsEscalas.push(ch) 
    
    let proxQuartoGrau = ch.reduce((prev, curr) => {
        return curr.grau === 4 ? curr.nota : prev
    }, "") //identifica qual é o quinto grau do campo harmônico recebido
    
    if (proxQuartoGrau==="Fb") 
    {
        return
        //regra para parar a recursão, se chegarmos no campo harmônico de G# devemos interromper, pois aqui é outra regra que vigora
    }
    
    carregarEscala(proxQuartoGrau, QUARTO_GRAU)
}

function verificaIntervalosSustenidos(nota1, nota2)
{
    if (nota2==="")
        return 0
    if (nota1==="E#")
        nota1 = "F"
    if (nota1==="B#")
        nota1 = "C"
    if (nota2==="E#")
        nota2 = "F"
    if (nota2==="B#")
        nota2 = "C"

    let idxNota1 = parseFloat(siglasCromaticoSustenidos.findIndex((x) => x === nota1.replace('t', '')))
    let idxNota2 = parseFloat(siglasCromaticoSustenidos.findIndex((x) => x === nota2.replace('t', '')))

    let intervalo = 0

    if (idxNota1 < idxNota2)
    {
        intervalo = idxNota1 - idxNota2 + 12
    }
    else
    {
        intervalo = idxNota1 - idxNota2
    }

    return intervalo * 0.5
}

function verificaIntervalosBemois(nota1, nota2)
{
    if (nota2==="")
        return 0
    if (nota1==="Fb")
        nota1 = "E"
    if (nota1==="Cb")
        nota1 = "B"
    if (nota2==="Fb")
        nota2 = "E"
    if (nota2==="Cb")
        nota2 = "B"

    let idxNota1 = parseFloat(siglasCromaticoBemois.findIndex((x) => x === nota1.replace('t', '')))
    let idxNota2 = parseFloat(siglasCromaticoBemois.findIndex((x) => x === nota2.replace('t', '')))

    let intervalo = 0

    if (idxNota1 < idxNota2)
    {
        intervalo = idxNota1 - idxNota2 + 12
    }
    else
    {
        intervalo = idxNota1 - idxNota2
    }

    return intervalo * 0.5
}

carregarEscalaMaiorDasQuintas()
carregarEscalaMaiorDasQuartas()

console.log(todasAsEscalas)

function ExibirCampoHarmonico()
{
    let divCampoHarmonico = document.getElementById("campos_harmonicos_maiores")

    todasAsEscalas.forEach((element) => {
    
        let tabela = document.createElement("table")
        
        let linhaCab = document.createElement("tr")
        let linhaGrau = document.createElement("th")
        let linhaNota = document.createElement("th")
        let linhaIntervalo = document.createElement("th")

        linhaGrau.innerText = "Grau"
        linhaNota.innerText = "Nota"
        linhaIntervalo.innerText = "Intervalo"

        linhaCab.append(linhaGrau, linhaNota, linhaIntervalo)

        tabela.appendChild(linhaCab)
        
        element.forEach((itemElement) => {
            
            let grau = grauDictionary[grauDictionary.findIndex((x) => x.key === itemElement.grau)].value
            
            let linha = document.createElement("tr")
            let linhaDadoGrau = document.createElement("td")
            let linhaDadoNota = document.createElement("td")
            let linhaDadoIntervalo = document.createElement("td")

            linha.id = itemElement.nota
            linhaDadoGrau.innerText = grau 
            linhaDadoNota.innerText = itemElement.nota 
            linhaDadoIntervalo.innerText = itemElement.intervalo
            

            linha.append(linhaDadoGrau, linhaDadoNota, linhaDadoIntervalo)

            tabela.appendChild(linha)

        })

        divCampoHarmonico.appendChild(tabela)

    })

}

ExibirCampoHarmonico()

const main = document.querySelector("main")
const root = document.querySelector(":root")

document.getElementById("themeSwitcher").addEventListener("click", function () {
    if (main.dataset.theme === "dark") {
      root.style.setProperty("--bg-color", "#f1f5f9")
      root.style.setProperty("--font-color", "#212529")
      root.style.setProperty("--table-border-color", "#212529")
      main.dataset.theme = "light"
    } else if (main.dataset.theme === "light") {
      root.style.setProperty("--bg-color", "#212529")
      root.style.setProperty("--font-color", "#f1f5f9")
      root.style.setProperty("--table-border-color", "#f3ef00")
      main.dataset.theme = "dark"
    }
  })