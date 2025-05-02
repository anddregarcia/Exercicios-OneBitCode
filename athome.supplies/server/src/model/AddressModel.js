module.exports = class Address {
    constructor(params){//(street, number, neighborhood, city){
        this.id = 0
        this.street = params.street 
        this.number = params.number
        this.neighborhood = params.neighborhood
        this.city = params.city
    }
}