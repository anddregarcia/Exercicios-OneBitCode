let cartas = []
let sair = false

do
{
    let baralho = ""
    for (let i = 0; i < cartas.length; i++) 
    {
        baralho += cartas[i] + ", " 
    }

    let opcao = prompt(
        "1 - Adicionar uma carta\n" + 
        "2 - Puxar uma carta\n" + 
        "3 - Sair\n\n" + 
        "Baralho atual: " + baralho
    )

    switch (opcao) {
        case "1":
            const novaCarta = prompt("Informe a nova carta: ")

            if (novaCarta === "" || novaCarta === null)
            {
                alert("Informe uma carta válida.")
                break;
            }

            cartas.unshift(novaCarta)
            break;
        
        case "2":
            const cartaRetirada = cartas.shift()

            alert("Carta retirada: " + cartaRetirada)
            break;
        
        case "3":
            sair = true
            break;

        default:
            break;
    }
    
} while (!sair)