export class Character {

    #pointsOfLife = 0
    #attackPower = 0
    #defensePower = 0

    constructor(name)
    {
        this.name = name
    }

    setPointsOfLife(points)
    {
        this.#pointsOfLife = points
    }

    setAttackPower(points)
    {
        this.#attackPower = points
    }

    setDefensePower(points)
    {
        this.#defensePower = points
    }

    getPointsOfLife()
    {
        return this.#pointsOfLife
    }

    getAttackPower()
    {
        return this.#attackPower
    }

    getDefensePower()
    {
        return this.#defensePower
    }

    performAttack(aimCharacter)
    {
        if (aimCharacter.getDefensePower() - this.#attackPower < 0){
            aimCharacter.setPointsOfLife(aimCharacter.getPointsOfLife() + aimCharacter.getDefensePower() - this.#attackPower)
        }
    }
}