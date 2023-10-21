module.exports = class Transfer{
    constructor(userSender, userReceiver, amount){
        this.userSender = userSender
        this.userReceiver = userReceiver
        this.amount = amount
        this.creationDate = Date()
    }
}