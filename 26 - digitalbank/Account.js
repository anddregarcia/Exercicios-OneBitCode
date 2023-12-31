const Deposit = require("./Deposit")
const Transfer = require("./Transfer")
const Loan = require("./Loan")

module.exports = class Account {
    
    #balance = 0
    
    constructor(userOwner){
        this.userOwner = userOwner
        this.depositList = []
        this.loanList = []
        this.transferDidList = []
        this.transferReceivedList = []
    }

    doDeposit(amount){
        this.#balance += amount

        const deposit = new Deposit(amount, Date())
        this.depositList.push(deposit)
    }

    doTransfer(sender, receiver, amount){

        if (sender === receiver)
        {
            console.log("Tranferências para si mesmo não são permitidas.")
            return 
        }
        
        const transfer = new Transfer(sender, receiver, amount)
        if (receiver === this.userOwner){
            this.transferReceivedList.push(transfer)
            sender.account.transferDidList.push(transfer)
            this.#balance += amount
        }
        else if (sender === this.userOwner){
            this.transferDidList.push(transfer)
            receiver.account.transferReceivedList.push(transfer)
            this.#balance -= amount
        }
    }

    doLoan(amount, installmentsQuantity){
        const loan = new Loan(amount, installmentsQuantity)
        this.loanList.push(loan)
    }

    get balance(){
        return this.#balance
    }

}