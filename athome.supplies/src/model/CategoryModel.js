module.exports = class Category{
    constructor(params){//(name, itemsList = []){
        this.id = 0
        this.name = params.name
        this.itemsList = params.itemsList
    }
}