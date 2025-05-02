module.exports = class ProductPantry {
    constructor(params){//(product, quantity, musthave = false, pantry){
        this.id = 0
        this.product = params.product
        this.quantity = params.quantity
        this.musthave = params.musthave
        this.pantry = params.pantry
    }

    replenishPantry(productList){ //this method take a List of ProductPrice to refill the pantry with the quantities

    }
}