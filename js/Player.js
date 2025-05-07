export default class Player
{
    constructor(id,name, color)
    {
        this.id = id
        this.name = name;
        this.color = color;
    }

    init()
    {
        this.money = 1500;
        this.getAwayFromJailCard = 0;
        this.cellPosition = 1;
        this.remainingTurnInJail = 0;
    }

    toString()
    {
        return this.name + " " + this.money;
    }
}