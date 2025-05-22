export default class Card
{
    constructor(name, type, description)
    {
        this.name = name;
        this.type = type;
        this.description = description;
    }

    cardsEffect()
    {
    }

    toString()
    {
        return this.name + " " + this.description;
    }
}