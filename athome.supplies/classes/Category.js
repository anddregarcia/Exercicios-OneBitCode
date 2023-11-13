module.exports = class Category{
    constructor(name, itemsList = []){
        this.id = 0
        this.name = name
        this.itemsList = itemsList
    }
}