import { Character } from "./Character.js";

export class Warrior extends Character {
    
    #shieldForce = 0
    #position = ""

    setShieldForce(points){
        this.#shieldForce = points
    }

    getShieldForce(){
        return this.#shieldForce
    }

    changePosition(position){
        this.#position = position
    }

    getPosition(){
        return this.#position
    }

    performAttack(aimCharacter){
        if(this.#position === "Attack")
        {
            super.performAttack(aimCharacter)
        }
    }

    getDefensePower(){
        if(this.#position === "Defense")
        {
            return super.getDefensePower() + this.#shieldForce
        }
        else
        {
            return super.getAttackPower()
        }
    }

}