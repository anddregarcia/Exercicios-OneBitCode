module.exports = class Item {
    constructor(params){//(name, categoriesList){
        this.id = 0
        this.name = params.name
        this.categoriesList = params.categoriesList
    }
}