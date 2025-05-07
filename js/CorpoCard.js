import Card from "./Card.js";
import { game } from './index.js';
import PropertyCell from './PropertyCell.js';
import StartCell from "./StartCell.js";
import TaxesCell from "./TaxesCell.js";

export default class CorpoCard extends Card
{
    constructor(name, type, description, action, amount)
    {
        super(name, type, description);
        this.action = action;
        this.amount = amount;
    }

    cardsEffect()
    {
        switch (this.action)
        {
            case "inflation":
                game.board.cells.forEach(cell => {
                    if (cell instanceof PropertyCell) {
                        cell.price += Math.floor(cell.price * 0.1); // Increase price by 10%
                    }
                });
                console.log("Inflation applied: All property prices increased by 10%");
            break;

            case "deflation":
                game.board.cells.forEach(cell => {
                    if (cell instanceof PropertyCell) 
                    {
                        cell.price -= Math.floor(cell.price * 0.1); 
                    }
                });
                console.log("Deflation applied: All property prices decreased by 10%");
            break

            case "increaseSalary":
                game.board.cells[0].amount += this.amount;
            break;

            case "decreaseSalary":
                game.board.cells[0].amount -= this.amount;
            break;

            case "increaseTax":
                for(let i = 0; i < game.board.cells.length; i++)
                {
                    if(game.board.cells[i] instanceof TaxesCell)
                    {
                        game.board.cells[i].amount += this.amount;
                    }
                }
            break;

            case "decreaseTax":
                for(let i = 0; i < game.board.cells.length; i++)
                {
                    if(game.board.cells[i] instanceof TaxesCell)
                    {
                        game.board.cells[i].amount -= this.amount;
                    }
                }
            break;

            case "stockMarketCrash":
                for(let i = 0; i < game.board.cells.length; i++)
                {
                    if(game.board.cells[i] instanceof PropertyCell)
                    {
                        game.board.cells[i].price += this.amount;
                        game.board.cells[i].rent = game.board.cells[i].rent/2; 
                    }
                    if(game.board.cells[i] instanceof TaxesCell)
                    {
                        game.board.cells[i].amount += this.amount; 
                    }
                    if(game.board.cells[i] instanceof StartCell)
                    {
                        game.board.cells[i].amount -= this.amount; 
                    }
                }
            break;

            case "stockMarketBoom":
                for(let i = 0; i < game.board.cells.length; i++)
                {
                    if(game.board.cells[i] instanceof PropertyCell)
                    {
                        game.board.cells[i].price -= this.amount;
                        game.board.cells[i].rent = game.board.cells[i].rent + 15; 
                    }
                    if(game.board.cells[i] instanceof TaxesCell)
                    {
                        game.board.cells[i].amount -= this.amount; 
                    }
                    if(game.board.cells[i] instanceof StartCell)
                    {
                        game.board.cells[i].amount += this.amount; 
                    }
                }
            break;
        }
    }

    toString()
    {
        return this.name + " " + this.description;
    }
}