module.exports = class Shop {
    //this class will take the list of ProductPrice that were bought in a certain date
    constructor(productList, market, date){
        this.id = 0
        this.productList = productList
        this.market = market
        this.date = date
    }
}