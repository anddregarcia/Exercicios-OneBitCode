let listaImovel = []

let sair = false

do {
    
    const opcao = prompt(
        "Quantidade de imóveis cadastrados: " + listaImovel.length + "\n\n" + 
        "1 - Adicionar novo imóvel\n" +
        "2 - Exibir imóveis salvos\n" + 
        "X - Sair"
    ) 

    switch (opcao) {
        case "1":
            
            const nomeProprietario = prompt("Informe o nome do proprietario: ")
            const qtdQuartos = prompt("Informe a quantidade de quartos: ")
            const qtdBanheiros = prompt("Informe a quantidade de banheiros: ")
            const possuiGaragem = prompt("O imóvel possui garegem? (Sim/Não)")

            let imovel = {
                quartos: qtdQuartos,
                banheiros: qtdBanheiros,
                proprietario: nomeProprietario,
                garagem: possuiGaragem
            }
            
            listaImovel.push(imovel)
                
            break;
        case "2" :
            
            let imoveisCadastrados = ""    

            for (let i = 0; i < listaImovel.length; i++) {
                imoveisCadastrados += "Imóvel " + (i + 1) + "\n" +
                " - Nome Proprietário: " + listaImovel[i].proprietario + "\n" + 
                " - Quantidade de quartos: " + listaImovel[i].quartos + "\n" + 
                " - Quantidade de banheiros: " + listaImovel[i].banheiros + "\n" + 
                " - Possui garagem: " + listaImovel[i].garagem + "\n" +
                " -----------------------------------------------------------------\n" 
            }
            
            alert(imoveisCadastrados)

            break;

        case "X":
            sair = true
            break;
        default:
            alert("Opção inválida")
            break;
    }


} while (!sair);