import { Character } from "./Character.js";

export class Thief extends Character{
    performAttack(aimCharacter){
        if (aimCharacter.getDefensePower() - this.getAttackPower() < 0){
            aimCharacter.setPointsOfLife((aimCharacter.getPointsOfLife() + aimCharacter.getDefensePower() - this.getAttackPower()) * 2)
        }
    }
}