import Card from "./Card.js";
import { game } from "./index.js";

export default class LuckCard extends Card
{
    constructor(name, type, description, action, amount, position)
    {
        super(name, type, description);
        this.action = action;
        this.amount = amount;
        this.position = position;
    }

    cardsEffect(player)
    {
        return new Promise(resolve => {
            switch(this.action)
            {
                case "goToStart":
                    player.cellPosition = 1;
                    resolve();
                break;

                case "goToJail":
                    player.cellPosition = 11;
                    player.remainingTurnInJail = 3;
                    resolve();
                break;

                case "goTo":
                    player.cellPosition = this.position;
                    resolve();
                break;

                case "addMoney":
                    player.money += this.amount;
                    resolve();
                break;

                case "subMoney":
                    player.money -= this.amount;
                    resolve();
                break;

                case "anniversary":
                    for(let i = 0; i < game.players.length; i++)
                    {
                        if(game.players[i] != player)
                        {
                            game.players[i].money -= this.amount;
                            player.money += this.amount;
                        }
                    }
                    resolve();
                break;

                case "getOutOfJail":
                    player.getAwayFromJailCard++;
                    resolve();
                break;

                default:
                    resolve();
                break;
            }
        });
    }

    toString()
    {
        return this.name + " " + this.description;
    }
}