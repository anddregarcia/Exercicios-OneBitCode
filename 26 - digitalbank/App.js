const User = require("./User")
const Loan = require("./Loan")

module.exports = class App{
    
    static #dataBase = []
    
    static findUser(email){
        return this.#dataBase.find((el) => el.email === email)
    }

    static getDataBase(){
        return this.#dataBase
    }

    static createUser(fullname, email){
        if (!this.findUser(email)){
            this.#dataBase.push(new User(fullname, email))
        }else{
            console.log("email já está sendo utilizado por outro usuário.")
        }
    }

    static doDeposit(email, amount){
        const user = this.findUser(email)
        if (!this.findUser(email)){
            console.log("Usuário não encontrado.")
            return
        }
        user.account.doDeposit(amount)
    }

    static doTransfer(emailFrom, emailTo, amount){
        const userFrom = this.findUser(emailFrom)
        const userTo = this.findUser(emailTo)
        if (!userFrom || !userTo){
            console.log("Usuário não encontrado.")
            return
        }
        userFrom.account.doTransfer(userFrom, userTo, amount)
    }

    static doLoan(email, amount, installmentsQuantity){
        const user = this.findUser(email)
        if (!user){
            console.log("Usuário não encontrado.")
            return
        }
        user.account.doLoan(amount, installmentsQuantity)
    }

    static changeLoanFee(newFeePercentage) {
        Loan.fee = newFeePercentage
    }

}