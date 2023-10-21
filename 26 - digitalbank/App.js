const Account = require("./Account")
const User = require("./User")

module.export = class App{
    
    static #dataBaseAccount = []
    
    constructor(){

    }

    static #findUser(email){
        return this.#dataBaseAccount.find((el) => el.userOwner.email === email)
    }

    static #createUser(fullname, email){
        if (!this.#findUser(email)){
            this.#createUser(fullname, email)
        }else{
            console.log("email já está sendo utilizado por outro usuário.")
        }
    }

    static createAccount(user){       
        this.#dataBaseAccount.push(new Account(user))
    }
}


