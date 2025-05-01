module.exports = class Shop {
    //this class will take the list of ProductPrice that were bought in a certain date
    constructor(params){//(productList, market, date){
        this.id = 0
        this.productList = params.productList
        this.market = params.market
        this.date = params.date
    }
}