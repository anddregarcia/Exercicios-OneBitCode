module.exports = class Product {
    constructor(params){//(name, brand, volume, unitMeasurement, item){
        this.id = 0
        this.name = params.name
        this.brand = params.brand
        this.volume = params.volume
        this.unitMeasurement = params.unitMeasurement
        this.item = params.item
        this.isVegan = params.isVegan
    }
}