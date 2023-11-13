const Address       = require("../classes/Address")
const Category      = require("../classes/Category")
const City          = require("../classes/City")
const Country       = require("../classes/Country")
const Item          = require("../classes/Item")
const Market        = require("../classes/Market")
const ProductPantry = require("../classes/ProductPantry")
const Product       = require("../classes/product")
const ProductPrice  = require("../classes/ProductPrice")
const Shop          = require("../classes/Shop")
const State         = require("../classes/State")
const UnitMeasurement = require("../classes/UnitMeasurement")
const Pantry = require("../classes/Pantry")

module.exports = class Repository {
    
    static #ADDRESS = []
    static #CATEGORY = []
    static #CITY = []
    static #COUNTRY = []
    static #ITEM = []
    static #MARKET = []
    static #PANTRY = []
    static #PRODUCT = []
    static #PRODUCT_PANTRY = []
    static #PRODUCT_PRICE = []
    static #SHOP = []
    static #STATE = []
    static #UNIT_MEASUREMENT = []

    static #tables = [
        {class: Address.name         , table: "ADDRESS"},
        {class: Category.name        , table: "CATEGORY"},
        {class: City.name            , table: "CITY"},
        {class: Country.name         , table: "COUNTRY"},
        {class: Item.name            , table: "ITEM"},
        {class: Market.name          , table: "MARKET"},
        {class: Pantry.name          , table: "PANTRY"},
        {class: Product.name         , table: "PRODUCT"},
        {class: ProductPantry.name   , table: "PRODUCT_PANTRY"},
        {class: ProductPrice.name    , table: "PRODUCT_PRICE"},
        {class: Shop.name            , table: "SHOP"},
        {class: State.name           , table: "STATE"},
        {class: UnitMeasurement.name , table: "UNIT_MEASUREMENT"},
    ]

    static #arrays = [
        {class: Address.name         , table: this.#ADDRESS},
        {class: Category.name        , table: this.#CATEGORY},
        {class: City.name            , table: this.#CITY},
        {class: Country.name         , table: this.#COUNTRY},
        {class: Item.name            , table: this.#ITEM},
        {class: Market.name          , table: this.#MARKET},
        {class: Pantry.name          , table: this.#PANTRY},
        {class: ProductPantry.name   , table: this.#PRODUCT_PANTRY},
        {class: Product.name         , table: this.#PRODUCT},
        {class: ProductPrice.name    , table: this.#PRODUCT_PRICE},
        {class: Shop.name            , table: this.#SHOP},
        {class: State.name           , table: this.#STATE},
        {class: UnitMeasurement.name , table: this.#UNIT_MEASUREMENT},
    ]

    static #databasetype = "array" 

    static #getTable(objectClassName){
        if(this.#databasetype==="array"){
            return this.#arrays.find((el) => el.class === objectClassName).table
        }
    }

    static GetTable(objectClassName){
        return this.#getTable(objectClassName)
    }

    static GenerateNewId (objectClassName) {
        if(this.#databasetype==="array"){
            
            const arr = this.#getTable(objectClassName)
            
            if (arr.length === 0)
                return 1
            
            const maxId = arr.sort((a, b) => a.id - b.id).reverse()[0].id;
            
            return maxId + 1
        }

        return 0
    }

    static Get(objectClassName, id){
        if(this.#databasetype==="array"){
            const arr = this.#getTable(objectClassName)

            if (arr.length === 0)
                return null

            const reg = arr.find((el) => el.id === id)

            return reg
        }

        return null
    }
    
    static Add(object){
        if(this.#databasetype==="array"){
            const arr = this.#getTable(object.constructor.name)
            
            object.id = this.GenerateNewId(object.constructor.name)

            arr.push(object)

            return object
        }
    }

    static Update(object){
        if(this.#databasetype==="array"){
            const arr = this.#getTable(object.constructor.name)

            const idx = arr.findIndex((el) => el.id === object.id)

            arr[idx] = object
        }
    }

    static Delete(object){
        if(this.#databasetype==="array"){
            const arr = this.#getTable(object.constructor.name)

            const idx = arr.findIndex((el) => el.id === object.id)

            arr.splice(idx, 1)
        }
    }

    static get ArrayDatabase() {
        return Repository.#arrays
    }
}