const Installment = require("./Installment")

module.exports = class Loan {

    static #fee = 1.05

    constructor(amount, installmentsQuantity){
        this.amount = amount
        this.creationDate = Date()
        this.installments = this.#generateInstallments(installmentsQuantity)  
    }

    get fee(){
        return Loan.#fee
    }

    static set fee(newFee){
        Loan.#fee = 1 + (newFee / 100)
    }

    #generateInstallments(n){
        const installments = []
        for (let i = 0; i < n; i++) {
            installments.push(new Installment((this.amount * Loan.#fee) / n, i + 1))
        }

        return installments
    }
}