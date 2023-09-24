const nome1 = prompt("Nome personagem 1: ")
const entradaPoderAtaque = prompt("Poder de ataque do " + nome1 + ": ")
const poderAtaque = parseFloat(entradaPoderAtaque)

const nome2 = prompt("Nome personagem 2: ")
const entradaPontosVida = prompt("Pontos de vida do " + nome2 + ": ")
const pontosVida = parseFloat(entradaPontosVida)

const entradaPoderDefesa = prompt("Poder defesa do " + nome2 + ": ")
const poderDefesa = parseFloat(entradaPoderDefesa)

const entradaPossuiEscudo = prompt("O " + nome2 + " possui escudo (S/N): ")
const possuiEscudo = entradaPossuiEscudo === "S"

let dano = 0;

if (poderAtaque > poderDefesa && !possuiEscudo)
{
    dano = (poderDefesa - poderAtaque) 
}
else if (poderAtaque > poderDefesa && possuiEscudo)
{
    dano = (poderDefesa - poderAtaque) / 2
}
else if (poderAtaque < poderDefesa)
{
    dano = 0
}

let pontosVidaRestante = pontosVida - (dano *-1)

let temEscudo
 
if (possuiEscudo)
{
    temEscudo = "Sim"
}
else
{
    temEscudo = "Não"
}

alert(
    "Personagem " + nome1 + " - " +
    "Poder de ataque: " + poderAtaque + "\n" +
    "Personagem " + nome2 + ":\n" +
    "Pontos de vida: " + pontosVida + "\n" +
    "Poder de defesa: " + poderDefesa + "\n" +
    "Possui escudo: " + temEscudo +
    "O dano causado foi de: " + dano + "\n" +
    "Pontos de vida do " + nome2 + ": " + pontosVidaRestante
)