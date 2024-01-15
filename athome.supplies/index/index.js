const Address = require("../classes/address")
const Category = require("../classes/category")
const City = require("../classes/city")
const Country = require("../classes/country")
const Item = require("../classes/item")
const Market = require("../classes/market")
const Pantry = require("../classes/Pantry")
const Product = require("../classes/Product")
const ProductPantry = require("../classes/ProductPantry")
const ProductPrice = require("../classes/productPrice")
const Shop = require("../classes/shop")
const State = require("../classes/state")
const UnitMeasurement = require("../classes/unitMeasurement")
const Repository = require("../repository/repository")

/*//não consegui fazer isso funcionar... as promises eram todas executadas no fim da execução, e os arrays não eram carregados
async function LoadData(){
    return await Repository.LoadArrayDataBase()
}

const p = LoadData()

Promise.all([p])
*/

//

/*console.log(Repository.GetTable(Address.name))
console.log(Repository.GetTable(Category.name))
console.log(Repository.GetTable(City.name))
console.log(Repository.GetTable(Country.name))
console.log(Repository.GetTable(Item.name))
console.log(Repository.GetTable(Market.name))
console.log(Repository.GetTable(Pantry.name))
console.log(Repository.GetTable(Product.name))
console.log(Repository.GetTable(ProductPantry.name))
console.log(Repository.GetTable(ProductPrice.name))
console.log(Repository.GetTable(Shop.name))
console.log(Repository.GetTable(State.name))
console.log(Repository.GetTable(UnitMeasurement.name))

const brasil = new Country("Brasil")
const saoPaulo = new State("São Paulo", brasil)
const piracicaba = new City("Piracicaba", saoPaulo)

const centro = new Address("", "", "Centro", piracicaba)
const vilaRezende = new Address("", "", "Vila Rezende", piracicaba)

const assai = new Market("Assaí", centro)
const pagueMenos = new Market("Pague Menos", vilaRezende)
*/
const pacoteKg = new UnitMeasurement({name: "Pacote Kg", abbreviation: "PctKg"})
/*
const comida = new Category("Comida")
const almocoEjanta = new Category("Almoço/Janta")

const brotoLegal = new Brand("broto legal", false)

const arroz = new Item("arroz", [comida, almocoEjanta])
const arrozBrotoLegal = new Product("arroz", brotoLegal, 1, pacoteKg, arroz, true)

const feijao = new Item("feijao", [comida, almocoEjanta])
const feijaoBrotoLegal = new Product("feijao", brotoLegal, 1, pacoteKg, feijao, true)

comida.itemsList.push(arroz)
comida.itemsList.push(feijao)

almocoEjanta.itemsList.push(arroz)
almocoEjanta.itemsList.push(feijao)

const productPriceListAssai = []
const compraAssai2410 = new Shop(productPriceListAssai, assai, new Date())
const arrozBLAssai2410 = new ProductPrice(arrozBrotoLegal, 5.80, 2, new Date(), compraAssai2410)
const feijaoBLAssai2410 = new ProductPrice(feijaoBrotoLegal, 8.80, 1, new Date(), compraAssai2410)
productPriceListAssai.push(arrozBLAssai2410, feijaoBLAssai2410)
compraAssai2410.productList = productPriceListAssai 

const productPriceListPagueMenos = []
const compraPagueMenos2410 = new Shop(productPriceListPagueMenos, pagueMenos, new Date())
const arrozBLPagueMenos2410 = new ProductPrice(arrozBrotoLegal, 6.80, 1, new Date(), compraPagueMenos2410)
const feijaoBLPagueMenos2410 = new ProductPrice(feijaoBrotoLegal, 7.80, 2, new Date(), compraPagueMenos2410)
productPriceListPagueMenos.push(arrozBLPagueMenos2410, feijaoBLPagueMenos2410)
compraPagueMenos2410.productList = productPriceListPagueMenos 

Repository.Add(brasil)
Repository.Add(saoPaulo)
Repository.Add(piracicaba)
Repository.Add(centro)
Repository.Add(vilaRezende)
Repository.Add(assai)
Repository.Add(pagueMenos)*/
Repository.Add(pacoteKg)/*
Repository.Add(comida)
Repository.Add(almocoEjanta)
Repository.Add(arroz)
Repository.Add(feijao)
Repository.Add(arrozBrotoLegal)
Repository.Add(feijaoBrotoLegal)
Repository.Add(arrozBLAssai2410)
Repository.Add(arrozBLPagueMenos2410)
Repository.Add(feijaoBLAssai2410)
Repository.Add(feijaoBLPagueMenos2410)
Repository.Add(compraAssai2410)
Repository.Add(compraPagueMenos2410)

const pantryList = []
const pantry = new Pantry(pantryList)

const pantryArroz = new ProductPantry(arroz, 1, true, pantry)
const pantryFeijao = new ProductPantry(feijao, 1, true, pantry)

Repository.Add(pantryArroz)
Repository.Add(pantryFeijao)

pantryList.push(pantryArroz, pantryFeijao)

pantry.productPantryList = pantryList

Repository.Add(pantry)

arroz.name = "Arroz"
Repository.Update(arroz)

feijao.name = "Feijão"
Repository.Update(feijao)

const bolacha = new Item("bolacha")
Repository.Add(bolacha)

bolacha.name = "Bolacha"
Repository.Update(bolacha)
Repository.Delete(bolacha)
*/
/*console.log(Repository.GetTable(Address.name))
console.log(Repository.GetTable(Category.name))
console.log(Repository.GetTable(City.name))
console.log(Repository.GetTable(Country.name))
console.log(Repository.GetTable(Item.name))
console.log(Repository.GetTable(Market.name))
console.log(Repository.GetTable(Pantry.name))
console.log(Repository.GetTable(Product.name))
console.log(Repository.GetTable(ProductPantry.name))
console.log(Repository.GetTable(ProductPrice.name))
console.log(Repository.GetTable(Shop.name))
console.log(Repository.GetTable(State.name))*/
console.log(Repository.GetTable(UnitMeasurement.name))

console.log(Repository.ArrayDatabase)
