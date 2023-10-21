import { Character } from "./Character.js";

export class Mage extends Character{

    #magePower = 0

    setMagePower(points)
    {
        this.#magePower = points
    }

    getMageOfLife()
    {
        return this.#magePower
    }

    performAttack(aimCharacter){
        if (aimCharacter.getDefensePower() - this.getAttackPower() < 0){
            aimCharacter.setPointsOfLife(aimCharacter.getPointsOfLife()  + aimCharacter.getDefensePower() - (this.getAttackPower() + this.#magePower))
        }
    }

    performCure(aimCharacter){
        aimCharacter.setPointsOfLife(aimCharacter.getPointsOfLife() + (this.#magePower * 2))
    }
}