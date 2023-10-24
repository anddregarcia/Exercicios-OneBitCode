const Address = require("../classes/address")
const City = require("../classes/city")
const Country = require("../classes/country")
const Item = require("../classes/item")
const Market = require("../classes/market")
const Product = require("../classes/Product")
const ProductPrice = require("../classes/productPrice")
const Shop = require("../classes/shop")
const State = require("../classes/state")
const UnitMeasurement = require("../classes/unitMeasurement")
const Repository = require("../repository/repository")

const brasil = new Country("Brasil")
const saoPaulo = new State("São Paulo", brasil)
const piracicaba = new City("Piracicaba", saoPaulo)

const centro = new Address("", "", "Centro", piracicaba)
const vilaRezende = new Address("", "", "Vila Rezende", piracicaba)

const assai = new Market("Assaí", centro)
const pagueMenos = new Market("Pague Menos", vilaRezende)

const pacoteKg = new UnitMeasurement("Pacote Kg", "PctKg")

const arroz = new Item("arroz")
const arrozBrotoLegal = new Product("arroz", "broto legal", 1, pacoteKg, arroz)

const feijao = new Item("feijao")
const feijaoBrotoLegal = new Product("feijao", "broto legal", 1, pacoteKg, feijao)

const productPriceListAssai = []
const compraAssai2410 = new Shop(productPriceListAssai, assai, new Date())
const arrozBLAssai2410 = new ProductPrice(arrozBrotoLegal, 5.80, new Date(), compraAssai2410)
const feijaoBLAssai2410 = new ProductPrice(feijaoBrotoLegal, 8.80, new Date(), compraAssai2410)
productPriceListAssai.push(arrozBLAssai2410, feijaoBLAssai2410)
compraAssai2410.productList = productPriceListAssai 

const productPriceListPagueMenos = []
const compraPagueMenos2410 = new Shop(productPriceListPagueMenos, pagueMenos, new Date())
const arrozBLPagueMenos2410 = new ProductPrice(arrozBrotoLegal, 6.80, new Date(), compraPagueMenos2410)
const feijaoBLPagueMenos2410 = new ProductPrice(feijaoBrotoLegal, 7.80, new Date(), compraPagueMenos2410)
productPriceListPagueMenos.push(arrozBLPagueMenos2410, feijaoBLPagueMenos2410)
compraPagueMenos2410.productList = productPriceListPagueMenos 

Repository.Add(brasil)
Repository.Add(saoPaulo)
Repository.Add(piracicaba)
Repository.Add(centro)
Repository.Add(vilaRezende)
Repository.Add(assai)
Repository.Add(pagueMenos)
Repository.Add(pacoteKg)
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

arroz.name = "Arroz"
Repository.Update(arroz)

feijao.name = "Feijão"
Repository.Update(feijao)

const bolacha = new Item("bolacha")
Repository.Add(bolacha)

bolacha.name = "Bolacha"
Repository.Update(bolacha)
Repository.Delete(bolacha)


console.log(Repository.GetTable(Address.name))
console.log(Repository.GetTable(City.name))
console.log(Repository.GetTable(Country.name))
console.log(Repository.GetTable(Item.name))
console.log(Repository.GetTable(Market.name))
console.log(Repository.GetTable(Product.name))
console.log(Repository.GetTable(ProductPrice.name))
console.log(Repository.GetTable(Shop.name))
console.log(Repository.GetTable(State.name))
console.log(Repository.GetTable(UnitMeasurement.name))