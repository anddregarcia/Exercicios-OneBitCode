let vagas = []
let sair = false

const Menu = function () 
{
    return "1 - Lista vagas disponíveis\n" +
    "2 - Criar uma nova vaga\n" +
    "3 - Visualizar uma vaga\n" +  
    "4 - Inscrever um candidato em uma vaga\n" +
    "5 - Excluir uma vaga\n" +
    "X - Sair"
}

const ExibirVagas = function () 
{
    if (vagas.length === 0)
    {
        return "Não há vagas para listar."
    }

    return vagas.reduce
        (function(prev, curr) 
            {
                return prev + "Índice: " + curr.indice + " - Vaga: " + curr.nome + " - Inscritos: " + curr.nomeCandidatos.length + "\n" 
            } , ""
        )
}

const ExibirVagasDetalhado = function () 
{
    if (vagas.length === 0)
    {
        return "Não há vagas para listar."
    }
    
    return vagas.reduce
        (
            function(prev, curr) 
            {
                return prev + 
                    "Índice: " + curr.indice + 
                    " - Vaga: " + curr.nome + 
                    " - Inscritos: " + curr.nomeCandidatos.length +
                    " - Candidatos: " + curr.nomeCandidatos.reduce(
                                            function(prevC, currC)
                                            {
                                                return prevC + currC + ","
                                            }, ""
                                        ) + "\n"
            } , ""
        )
}

const EncontrarIndiceVaga = function (indiceEscolhido)
{
    const indiceEncontrado = vagas.reduce(
        function(prev, curr, idx)
        {
            return curr.indice == indiceEscolhido ? idx : prev
        }, -1)

    console.log(indiceEncontrado)

    return indiceEncontrado
}

const MaxIndice = function()
{
    return vagas.reduce
        (function(prev, curr) 
            { 
                return prev > curr.indice ? prev : curr.indice
            }, 0
        ) + 1 //max + 1
}

do {
    
    const opcao = prompt(Menu())

    switch (opcao) {
        case "1":
            alert(ExibirVagas())
            break;
            
        case "2":
            const vaga = {}

            vaga.indice = MaxIndice()
            vaga.nome = prompt("Qual o nome da vaga?")
            vaga.descricao = prompt("Digite a descrição da vaga?")
            vaga.dataLimite = prompt("Quando a vaga expira?")
            vaga.nomeCandidatos = []

            vagas.push(vaga)

            break;
        case "3":

            alert(ExibirVagasDetalhado())

            break;
        case "4":
            
            if (vagas.length === 0)
            {
                alert("Não há vagas disponíveis.")
                break;
            }

            const indiceEscolhido = prompt("Vagas disponíveis:\n" + 
                                            ExibirVagas() + 
                                           "\nEm qual vaga deseja adicionar o candidato?")
            
            const arrayIndice = EncontrarIndiceVaga(indiceEscolhido)

            if (arrayIndice === -1)
            {
                alert("Índice não encontrado.")
                break;
            }
            
            vagas[arrayIndice].nomeCandidatos.push(prompt("Digite o nome do candidato:"))
            
            break;

        case "5":

            const indiceExcluir = prompt("Vagas disponíveis:\n" + 
                                            ExibirVagas() + 
                                           "\nQual vaga deseja excluir?")
            
            const arrayIndiceExcluir = EncontrarIndiceVaga(indiceExcluir)

            if (arrayIndiceExcluir === -1)
            {
                alert("Índice não encontrado.")
                break;
            }
            
            vagas.splice(arrayIndiceExcluir, 1)

            break;
            
        case "X":
        case "x":
            sair = true
            break;
        
        default:
            alert("Opção inválida! Saindo do sistema...")
            sair = true
            break;
    }

} while (!sair);