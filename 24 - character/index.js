import { Warrior } from "./Warrior.js";
import { Thief } from "./Thief.js";
import { Mage } from "./Mage.js";

const warrior = new Warrior("Warrior")
const mage = new Mage("Mage")
const thief = new Thief("Thief")

warrior.setAttackPower(20)
warrior.setDefensePower(10)
warrior.setPointsOfLife(100)
warrior.setShieldForce(2)
warrior.changePosition("Defense")

mage.setAttackPower(17)
mage.setDefensePower(12)
mage.setPointsOfLife(100)
mage.setMagePower(3)

thief.setAttackPower(16)
thief.setDefensePower(8)
thief.setPointsOfLife(150)

console.log(warrior)
console.log(mage)
console.log(thief)

warrior.changePosition("Attack")
warrior.performAttack(mage)

console.log(mage)

warrior.changePosition("Defense")
mage.performAttack(warrior)

console.log(warrior)

mage.performCure(mage)

console.log(mage)