module.exports = class UnitMeasurement {
    constructor(params){//name, abbreviation){
        this.id = params.id ? params.id : 0
        this.code = params.code
        this.name = params.name
    }
}