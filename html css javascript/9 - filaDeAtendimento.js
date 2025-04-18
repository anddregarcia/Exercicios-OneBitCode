let listaDePacientes = []

let sair = false

do
{
    let pacientes = ""

    if (listaDePacientes.length === 0)
    {
        pacientes = "A lista está vazia."
    }
    else
    {
        for(let i = 0; i < listaDePacientes.length; i++)
        {
            pacientes += (i + 1) + "º " + listaDePacientes[i] + "\n"
        }
    }

    let opcao = prompt(
        "1 - Adicionar novo paciente\n" +
        "2 - Atender paciente\n" + 
        "3 - Sair" + "\n\n" + 
        "Lista de pacientes:\n" + pacientes 
    )

    switch (opcao)
    {
        case "1": 
            const nome = prompt("Digite o nome do paciente:")
            if (nome === "" || nome === null)
            {
                alert("Nome inválido, é necessário informar o nome.")
                break
            }
            
            listaDePacientes.push(nome)
            break
        case "2": 
            if (listaDePacientes.length > 0)
            {
                const pacienteAtendido = listaDePacientes.shift()
                alert("O paciente " + pacienteAtendido + " será atendido.")            
            }
            else
            {
                alert("Não há pacientes para atender.")
            }
            break
        case "3":
            alert("Saindo do sistema.")
            sair = true
            break
        default:
            alert("Opção inválida!")
    }

} while (!sair)