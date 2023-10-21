const Account = require("./Account")

module.exports = class User{

    #account

    constructor(fullName, email){
        this.fullName = fullName
        this.email = email
        this.#account = new Account(this)
    }

    get account(){
        return this.#account
    }

}