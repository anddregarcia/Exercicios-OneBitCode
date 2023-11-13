module.exports = class ProductPantry {
    constructor(product, quantity, musthave = false, pantry){
        this.id = 0
        this.product = product
        this.quantity = quantity
        this.musthave = musthave
        this.pantry = pantry
    }

    replenishPantry(productList){ //this method take a List of ProductPrice to refill the pantry with the quantities

    }
}