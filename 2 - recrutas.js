const nomeRecruta = prompt("Digite o nome do Recruta: ")
const sobrenome = prompt("Digite o sobrenome do Recruta: ")
const campoEstudo = prompt("Qual é o campo de estudo do Recruta? ")
const anoNascimento = prompt("Qual é o ano de nascimento do Recruta? ")

alert(
    "Recruta cadastrado com sucesso!\n" +
    "Nome: " + nomeRecruta + " " + sobrenome + "\n" +
    "Campos de estudo: " + campoEstudo + "\n" + 
    "Idade: " + (2023 - anoNascimento)
)