const Address       = require("../src/model/AddressModel")
const Brand         = require("../src/model/BrandModel")
const Category      = require("../src/model/CategoryModel")
const City          = require("../src/model/CityModel")
const Country       = require("../src/model/CountryModel")
const Item          = require("../src/model/ItemModel")
const Market        = require("../src/model/MarketModel")
const ProductPantry = require("../src/model/ProductPantryModel")
const Product       = require("../src/model/ProductModel")
const ProductPrice  = require("../src/model/ProductPriceModel")
const Shop          = require("../src/model/ShopModel")
const State         = require("../src/model/StateModel")
const UnitMeasurement = require("../src/model/UnitMeasurementModel")
const Pantry = require("../src/model/PantryModel")

module.exports = class Repository {

    static #url = "http://localhost:3000/"    

    static #arrayType = "array"
    static #jsonServerType = "json-server"
    
    static #ADDRESS = []
    static #BRAND = []
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
        {class: Brand.name           , table: "BRAND"},
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
        {classInstace: Address         , class: Address.name         , table: this.#ADDRESS},
        {classInstace: Brand           , class: Brand.name           , table: this.#BRAND},
        {classInstace: Category        , class: Category.name        , table: this.#CATEGORY},
        {classInstace: City            , class: City.name            , table: this.#CITY},
        {classInstace: Country         , class: Country.name         , table: this.#COUNTRY},
        {classInstace: Item            , class: Item.name            , table: this.#ITEM},
        {classInstace: Market          , class: Market.name          , table: this.#MARKET},
        {classInstace: Pantry          , class: Pantry.name          , table: this.#PANTRY},
        {classInstace: ProductPantry   , class: ProductPantry.name   , table: this.#PRODUCT_PANTRY},
        {classInstace: Product         , class: Product.name         , table: this.#PRODUCT},
        {classInstace: ProductPrice    , class: ProductPrice.name    , table: this.#PRODUCT_PRICE},
        {classInstace: Shop            , class: Shop.name            , table: this.#SHOP},
        {classInstace: State           , class: State.name           , table: this.#STATE},
        {classInstace: UnitMeasurement , class: UnitMeasurement.name , table: this.#UNIT_MEASUREMENT},
    ]

    static #databasetype = this.#jsonServerType

    static Get(objectClassName, id){
        if(this.#databasetype===this.#arrayType){
            return this.#GetArray(objectClassName, id)
        }
        else if(this.#databasetype===this.#jsonServerType){
            return this.#GetJsonServer(objectClassName, id)
        }

        return null
    }
    
    static Add(object){
        if(this.#databasetype===this.#arrayType){
            this.#AddArray(object)
        }
        else if(this.#databasetype===this.#jsonServerType){
            this.#AddJsonServer(object)
        }

        return object
    }

    static Update(object){
        if(this.#databasetype===this.#arrayType){
            this.#UpdateArray(object)
        }
        else if(this.#databasetype===this.#jsonServerType){
            this.#UpdateJsonServer(object)
        }

        return object
    }

    static Delete(object){
        if(this.#databasetype===this.#arrayType){
            this.#DeleteArray(object)
        }
        else if(this.#databasetype===this.#jsonServerType){
            this.#DeleteJsonServer(object)
        }
    }

    static async #GetJsonServer(objectClassName, id){
        
        const entityRef = this.#arrays.find((el) => el.class === objectClassName)

        const result = await fetch(this.#url + objectClassName + "/" + id).then(res => res.json())
            
        const entity = new entityRef.classInstace(...result)
        entity.table.push(entity)

        return entity
    }

    static #GetArray(objectClassName, id){
        const arr = this.#getTable(objectClassName)

        if (arr.length === 0)
            return null

        const reg = arr.find((el) => el.id === id)

        return reg
    }

    static async #AddJsonServer(object){
        if (object.id === 0){
            let objClassName = object.constructor.name
            let url = this.#url + objClassName

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: this.#stringfy(object)
            })
        }
        else{
            return this.#UpdateJsonServer(object)
        }

        return object
    }

    static async #AddArray(object){
        if (object.id === 0){
            const arr = this.#getTable(object.constructor.name)
            
            object.id = this.GenerateNewId(object.constructor.name)

            arr.push(object)
        }
        else{
            const idx = arr.findIndex((el) => el.id === object.id)
            if (idx > -1){
                this.#UpdateArray(object)
            }
        }

        return object
    }

    static async #UpdateJsonServer(object){
        let objClassName = object.constructor.name
        let url = this.#url + objClassName

        const response = await fetch(url + objClassName + "/" + object.id, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: this.#stringfy(object)
        })

        return object
    }

    static #UpdateArray(object){
        const arr = this.#getTable(object.constructor.name)

        const idx = arr.findIndex((el) => el.id === object.id)

        arr[idx] = object

        return object
    }

    static async #DeleteJsonServer(object){
        let objClassName = object.constructor.name
        let url = this.#url + objClassName

        const response = await fetch(url + objClassName + "/" + object.id, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            },
            body: this.#stringfy(object)
        })
    }

    static #DeleteArray(object){
        const arr = this.#getTable(object.constructor.name)

        const idx = arr.findIndex((el) => el.id === object.id)

        arr.splice(idx, 1)
    }

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

    static #stringfy(obj)
    {
        let cache = [];
        let str = JSON.stringify(obj, function(key, value) {
          if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        });
        cache = null; // reset the cache
        return str;
    }

    static get ArrayDatabase() {
        return this.#arrays
    }

    static async #FetchDataBase() {    
        //não funciona direito, quando entra aqui o await do fetch não espera a conclusão
        //ou seja, não está sendo possível carregar o array de database assim que o sistema é iniciado
        //pois o "for" é concluído depois que tudo já foi carregado no array, gerando inconsistência 
        for (const entity of this.#arrays){
            
            const result = await fetch(this.#url + entity.class).then(res => res.json())
            
            entity.table.push(new entity.classInstace(...result))
        }

        return await (async () => this.#arrays)()
    }

    static async LoadArrayDataBase(){
        return await this.#FetchDataBase()
    }

}