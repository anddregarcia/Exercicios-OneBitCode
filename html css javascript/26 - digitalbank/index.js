const App = require("./App.js")

App.createUser("André Garcia", "andre@email.com")
App.createUser("Mariana Garcia", "mariana@email.com")
App.createUser("Miguel Garcia", "miguel@email.com")

App.doDeposit("andre@email.com", 200)
App.doTransfer("andre@email.com", "mariana@email.com", 20)

App.changeLoanFee(2)

App.doLoan("miguel@email.com", 20000, 12)

console.log(App.findUser("andre@email.com").account.depositList)
console.log(App.findUser("andre@email.com").account.transferDidList)
console.log(App.findUser("mariana@email.com").account.transferReceivedList)
console.log(App.findUser("miguel@email.com").account.loanList)
console.log(App.findUser("miguel@email.com").account.loanList[0].installments)