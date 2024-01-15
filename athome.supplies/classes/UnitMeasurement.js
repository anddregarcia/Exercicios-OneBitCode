module.exports = class UnitMeasurement {
    constructor(params){//name, abbreviation){
        this.id = params.id ? params.id : 0
        this.name = params.name
        this.abbreviation = params.abbreviation
    }
}