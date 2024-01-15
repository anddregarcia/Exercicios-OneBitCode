module.exports = class ProductPrice {
    constructor(params){//(product, value, quantity, date, shop){
        this.id = 0
        this.product = params.product
        this.value = params.value
        this.quantity = params.quantity
        this.date = params.date
        this.shop = params.shop
    }
}