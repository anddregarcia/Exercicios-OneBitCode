class User {
    constructor(fullname, email, password){
        this.fullname   = fullname
        this.email      = email
        this.password   = password
        this.isLogged   = false
    }

    login(email, password){

        if(this.email === email && this.password === password)
        {
            this.isLogged = true
        }
        else
        {
            this.isLogged = false
        }

        console.log(this.isLogged)
    }
}

const user = new User("André Garcia", "anddregarcia@gmail.com", "123456")
user.login("anddregarcia@gmail.com", "789456")
user.login("anddregarcia@gmailcom", "123456")
user.login("anddregarcia@gmail.com", "123456")
console.log(user)

class Product{
    constructor(name, description, price){
        this.name           = name
        this.description    = description
        this.price          = price
        this.inStock        = 0
    }

    addToStock(quantity){
        this.inStock =+ quantity
        console.log(`O total em estoque agora é ${ this.inStock }`)
    }

    calculateDiscount(percentDiscount){
        //console.log(`O valor com desconto é ${ this.price - (this.price * (percentDiscount / 100)) }`)
        return this.price - (this.price * (percentDiscount / 100))
    }
}

const product = new Product("Mouse", "Mouse Microsoft Preto", 80)
product.addToStock(100)
console.log(product.calculateDiscount(50))
console.log(product)