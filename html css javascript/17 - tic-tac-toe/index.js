let gameBoard = []
let gameBoardElement = []
let turn = "P1"

const column = 3
const line = 3
let hits = 0
const totalHits = 9

const player1Symbol = "X"
const player2Symbol = "O"

let boardIntitialized = false

let playerWinner = ""

function initializeBoard ()
{
    const boardDiv = document.getElementById("game_board")
    console.log(gameBoard)
    for (var i = 0; i < line; i++)
    {
        gameBoard[i] = []
        gameBoardElement[i] = []
        for (var j = 0; j < column; j++)
        {
            gameBoard[i][j] = 0
            
            const pos = document.createElement("input")
            pos.type = "button"
            pos.id = "pos" + i + j
            pos.className = "position"
            pos.setAttribute("data-value", i + "x" + j)
            
            gameBoardElement[i][j] = pos

            pos.addEventListener("click", function()
            {
                //debugger;
                if (pos.value!="" || playerWinner != "")
                {
                    return
                }

                hits++
                
                if (hits == totalHits)
                {
                    const start_game = document.getElementById("start_game_play")
                    start_game.value = "Recomeçar"
                    start_game.dataset.value = "restart"
                }
                
                if (turn == "P1")
                {
                    pos.value = player1Symbol
                    turn = "P2"

                    document.getElementById("player_1").classList.toggle("playing")
                    document.getElementById("player_2").classList.toggle("playing")

                    gameBoard[pos.dataset.value[0]][pos.dataset.value[2]] = player1Symbol
                }
                else if (turn == "P2")
                {
                    pos.value = player2Symbol
                    turn = "P1"

                    document.getElementById("player_1").classList.toggle("playing")
                    document.getElementById("player_2").classList.toggle("playing")

                    gameBoard[pos.dataset.value[0]][pos.dataset.value[2]] = player2Symbol
                }
                
                playerWinner = checkVictory()
                
                if (playerWinner != "")
                {
                    console.log(playerWinner)
                    
                    const start_game = document.getElementById("start_game_play")
                    start_game.dataset.value = "restart"
                    
                    if (playerWinner === "P1")
                    {
                        document.getElementById("player_1").classList.remove("playing")
                        document.getElementById("player_1").classList.add("winner")
                        
                        document.getElementById("player_2").classList.remove("playing")

                        start_game.value = "Jogador 1 ganhou! Recomeçar."
                    }
                    else if (playerWinner === "P2")
                    {
                        document.getElementById("player_2").classList.remove("playing")
                        document.getElementById("player_2").classList.add("winner")
                        
                        document.getElementById("player_1").classList.remove("playing")

                        start_game.value = "Jogador 2 ganhou! Recomeçar."
                    }
                }

            })
            
            boardDiv.appendChild(pos)
        }
    }
    
    console.log(gameBoard)

    return true
}

function initializeFields()
{
    const playersDiv = document.getElementById("players")
    
    const player1 = document.createElement("input")
    player1.id = "player_1"
    player1.name = "player_1"
    player1.placeholder = "Jogador 1"
    
    playersDiv.appendChild(player1)

    const player2 = document.createElement("input")
    player2.id = "player_2"
    player2.name = "player_2"
    player2.placeholder = "Jogador 2"

    playersDiv.appendChild(player2)

    const startGameDiv = document.getElementById("start_game_div")

    const startGame = document.createElement("input")
    startGame.id = "start_game_play"
    startGame.type = "button"
    startGame.value = "Iniciar Jogo"
    startGame.setAttribute("data-value", "initial")

    startGame.addEventListener("click", function(ev) {
        if (ev.currentTarget.dataset.value === "initial")
        {
            initializeGame(ev)
        }
        else if (ev.currentTarget.dataset.value === "restart")
        {
            destroyAll()
            initializeFields()
        }

    })
    
    startGameDiv.appendChild(startGame)
}

function initializeGame(ev)
{
    const player1 = document.getElementById("player_1")
    const player2 = document.getElementById("player_2")
    
    if (player1.value === "")
    {
        alert("Informe o nome do Jogador 1!")
        player1.focus()
        return
    }

    if (player2.value === "")
    {
        alert("Informe o nome do Jogador 2!")
        player2.focus()
        return
    }

    if (!boardIntitialized)
    {
        player1.disabled = true
        player2.disabled = true

        turn = drawPlayer()

        let playerBegin = ""
        
        if (turn === "P1")
        {
            player1.classList.add("playing")
            playerBegin = "Jogador 1 começa."
        }
        else if (turn == "P2")
        {
            player2.classList.add("playing")
            playerBegin = "Jogador 2 começa."
        }

        boardIntitialized = initializeBoard()

        ev.currentTarget.value = "Vamos jogar!!! " + playerBegin

    }

    ev.currentTarget.dataset.value = "playing"
}

function destroyAll()
{
    const players_div = document.getElementById("players")
    const start_game_div = document.getElementById("start_game_div")
    const board_div = document.getElementById("game_board")

    while (players_div.firstChild)
        players_div.removeChild(players_div.firstChild)

    while (start_game_div.firstChild)
        start_game_div.removeChild(start_game_div.firstChild)

    while (board_div.firstChild)
        board_div.removeChild(board_div.firstChild)

    hits = 0
    boardIntitialized = false
    playerWinner = ""

}

function checkVictory()
{
    let victory = ""

    if (gameBoard[0][0] === gameBoard[1][0] && gameBoard[0][0] === gameBoard[2][0] && gameBoard[0][0] != 0)
    {
        victory = gameBoard[0][0]
        gameBoardElement[0][0].classList.replace("position", "match")
        gameBoardElement[1][0].classList.replace("position", "match")
        gameBoardElement[2][0].classList.replace("position", "match")
    }    
    
    if (gameBoard[0][1] === gameBoard[1][1] && gameBoard[0][1] === gameBoard[2][1] && gameBoard[0][1] != 0)
    {
        victory = gameBoard[0][1]
        gameBoardElement[0][1].classList.replace("position", "match")
        gameBoardElement[1][1].classList.replace("position", "match")
        gameBoardElement[2][1].classList.replace("position", "match")
    }
    
    if (gameBoard[0][2] === gameBoard[1][2] && gameBoard[0][2] === gameBoard[2][2] && gameBoard[0][2] != 0)
    {
        victory = gameBoard[0][2]
        gameBoardElement[0][2].classList.replace("position", "match")
        gameBoardElement[1][2].classList.replace("position", "match")
        gameBoardElement[2][2].classList.replace("position", "match")
    }

    if (gameBoard[0][0] === gameBoard[0][1] && gameBoard[0][0] === gameBoard[0][2] && gameBoard[0][0] != 0)
    {
        victory = gameBoard[0][0]
        gameBoardElement[0][0].classList.replace("position", "match")
        gameBoardElement[0][1].classList.replace("position", "match")
        gameBoardElement[0][2].classList.replace("position", "match")
    }

    if (gameBoard[1][0] === gameBoard[1][1] && gameBoard[1][0] === gameBoard[1][2] && gameBoard[1][0] != 0)
    {
        victory = gameBoard[1][0]
        gameBoardElement[1][0].classList.replace("position", "match")
        gameBoardElement[1][1].classList.replace("position", "match")
        gameBoardElement[1][2].classList.replace("position", "match")
    }

    if (gameBoard[2][0] === gameBoard[2][1] && gameBoard[2][0] === gameBoard[2][2] && gameBoard[2][0] != 0)
    {
        victory = gameBoard[2][0]
        gameBoardElement[2][0].classList.replace("position", "match")
        gameBoardElement[2][1].classList.replace("position", "match")
        gameBoardElement[2][2].classList.replace("position", "match")
    }

    if (gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2] && gameBoard[0][0] != 0)
    {
        victory = gameBoard[0][0]
        gameBoardElement[0][0].classList.replace("position", "match")
        gameBoardElement[1][1].classList.replace("position", "match")
        gameBoardElement[2][2].classList.replace("position", "match")
    }

    if (gameBoard[0][2] === gameBoard[1][1] && gameBoard[0][2] === gameBoard[2][0] && gameBoard[0][2] != 0)
    {
        victory = gameBoard[0][2]
        gameBoardElement[0][2].classList.replace("position", "match")
        gameBoardElement[1][1].classList.replace("position", "match")
        gameBoardElement[2][0].classList.replace("position", "match")
    }
    
    if (victory === player1Symbol)
        victory = "P1"
    else if (victory === player2Symbol)
        victory = "P2"
    
    return victory 

    /*
    if (gameBoard[0][0] === ((gameBoard[1][0] === gameBoard[2][0]) || 
                             (gameBoard[0][1] === gameBoard[0][2]) ||
                             (gameBoard[1][1] === gameBoard[2][2])))
    {                   
        victory = gameBoard[0][0]
    }
    
    if (gameBoard[1][1] === ((gameBoard[0][1] === gameBoard[2][1]) || 
                             (gameBoard[1][0] === gameBoard[1][2])))
    {
        victory = gameBoard[1][1]
    }   
    
    if (gameBoard[2][2] === ((gameBoard[0][2] === gameBoard[1][2]) ||
                             (gameBoard[2][0] === gameBoard[2][1])))
    {
        victory = gameBoard[2][0]
    }*/
}

function initialize()
{
    initializeFields()
}

function drawPlayer()
{
    const P1 = Math.floor(Math.random() * 101);
    const P2 = Math.floor(Math.random() * 101);

    console.log(P1);
    console.log(P2);

    if (P1 > P2)
    {
        return "P1"
    }

    return "P2"

}

initialize()