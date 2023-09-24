let teamList = []

function Main()
{
    ClearFields()
    RefreshTeamList()
}

function AddPlayer()
{
    const position = document.getElementById('position').value
    const number = document.getElementById('number').value
    const name = document.getElementById('name').value

    const confirmation = confirm("Deseja escalar o jogador " + name + " camisa " + number + " na posição " + position + "?")
    
    if (confirmation)
    {
        teamList.push(
            {
                position,
                number,
                name
            }
        )

        ClearFields()
        RefreshTeamList()   
    }
}

function RemovePlayer()
{
    const number = document.getElementById('numberRemove').value

    if (number == '')
    {
        alert("Informe o número da camisa!")
        return;
    }

    const idxToRemove = teamList.reduce(
        function(prev, curr, idx)
        {
            return curr.number == number ? idx : prev
        }, -1)

    const confirmation = confirm("Deseja remover o jogador " + teamList[idxToRemove].name + " camisa " + teamList[idxToRemove].number + " da posição " + teamList[idxToRemove].position + "?")
    
    if (confirmation)
    {
        teamList.splice(idxToRemove, 1)
    
        ClearFields()
        RefreshTeamList()
    }
}

function RemoveAllPlayers()
{
    teamList.splice(0, teamList.length)
    ClearFields()
    RefreshTeamList()
}

function ClearFields()
{
    document.getElementById('position').value = ""
    document.getElementById('number').value = ""
    document.getElementById('name').value = ""  
    document.getElementById('numberRemove').value = ""
    
    document.getElementById('position').focus()
}

function RefreshTeamList()
{
    const teamListEl = document.getElementById("teamList")
    
    while (teamListEl.firstChild)
    {
        teamListEl.removeChild(teamListEl.firstChild)
    }

    if (teamList.length > 0)
    {
        teamList.forEach(element => {
            const playerItem =  document.createElement('li')
            playerItem.id = "player-" + element.number
            playerItem.innerText = element.position + ": " + element.name + "(" + element.number + ")"
            teamListEl.appendChild(playerItem)
        });
    }
    else
    {
        const playerItem =  document.createElement('li')
        playerItem.id = "player-0"
        playerItem.innerText = "Nenhum jogador escalado"
        
        teamListEl.appendChild(playerItem)
    }

}