import PropertyCell from "./PropertyCell.js";
import StartCell from "./StartCell.js";
import LuckCell from "./LuckCell.js";
import CorpoCell from "./CorpoCell.js";
import JailCell from "./JailCell.js";
import ParkCell from "./ParkCell.js";
import TaxesCell from "./TaxesCell.js";
import StationCell from "./StationCell.js";
import UtilityCell from "./UtilityCell.js";
import LuckCard from "./LuckCard.js";
import CorpoCard from "./CorpoCard.js";
import Cell from "./Cell.js";


export default class Board
{
    constructor()
    {
        this.cells = [];
        this.luckDeck = [];
        this.corpoDeck = [];
        this.discardedLuck = [];
        this.discardedCorpo = [];
    }
    
    async init()
    {
        try 
        {
            const cell_fetch = await fetch('./json/cell.json');
            const cells_parsed = await cell_fetch.json();

            for (var i = 0; i < cells_parsed.length; i++)
            {
                var cell = cells_parsed[i];
                const cellDiv = document.createElement('div');
                cellDiv.id = 'cell' + cell.id;
                let cellObject;

                switch(cell.type)
                {
                    case "property":
                        cellObject = new PropertyCell(cell.id, cell.name, cell.description,cell.color, cell.price, cell.rent);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        const colorBanner = document.createElement('div');
                        colorBanner.className = 'color-banner';
                        colorBanner.className += ' ' + cell.color;
                        cellDiv.innerText = cell.name;
                        cellDiv.innerText += '\n\n\n' + cell.price +"₵";
                        cellDiv.appendChild(colorBanner);
                    break;

                    case "start":
                        cellObject = new StartCell(cell.id, cell.name, cell.amount);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        cellDiv.innerText = cell.name;
                        break;

                    case "luck":
                        cellObject = new LuckCell(cell.id, cell.name, this);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        cellDiv.innerText = cell.name;
                        break;

                    case "corpo":
                        cellObject = new CorpoCell(cell.id, cell.name, this);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        cellDiv.innerText = cell.name;
                        break;

                    case "jail":
                        cellObject = new JailCell(cell.id, cell.name);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        cellDiv.innerText = cell.name;
                        break;

                    case "parking":
                        cellObject = new ParkCell(cell.id, cell.name);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        cellDiv.innerText = cell.name;
                        break;

                    case "tax":
                        cellObject = new TaxesCell(cell.id, cell.name, cell.amount);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        cellDiv.innerText = cell.name;
                        cellDiv.innerText += '\n\n\n' + cell.amount +"₵";
                        break;

                    case "station":
                        cellObject = new StationCell(cell.id, cell.name, cell.rent, 200);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        cellDiv.innerText = cell.name;
                        cellDiv.innerText += '\n\n\n' + 200 + "₵";
                        break;

                    case "utility":
                        cellObject = new UtilityCell(cell.id, cell.name, 150);
                        this.cells.push(cellObject);
                        cellDiv.className = 'cell';
                        cellDiv.innerText = cell.name;
                        break;
                }

                if (cellObject) {
                    cellDiv.addEventListener('click', () => cellObject.show());
                }

                document.getElementById('board').appendChild(cellDiv);
            }
            console.log(this.cells.length);

            const card_fetch = await fetch('./json/card.json');
            const cards_parsed = await card_fetch.json();

            for(var i = 0; i < cards_parsed.length; i++)
            {
                var card = cards_parsed[i];
                switch(card.type)
                {
                    case "luck":
                        this.luckDeck.push(new LuckCard(card.name, card.type, card.description, card.action, card.amount, card.position));
                    break;

                    case "corpo":
                        this.corpoDeck.push(new CorpoCard(card.name, card.type, card.description, card.action, card.amount));
                    break;
                }
            }

            this.shuffleDeck(this.luckDeck);
            this.shuffleDeck(this.corpoDeck);

            console.log(this.luckDeck);
            console.log(this.corpoDeck);
        } 
        catch(error) 
        {
            console.error('Error loading cells:', error);
        }       
    }

    drawCard(deck)
    {
        if (deck === this.luckDeck && this.luckDeck.length === 0)
        {
            this.luckDeck = [...this.discardedLuck];
            this.discardedLuck = [];
            this.shuffleDeck(this.luckDeck);
            deck = this.luckDeck;
            console.log(this.luckDeck);
        }
        else if (deck === this.corpoDeck && this.corpoDeck.length === 0)
        {
            this.corpoDeck = [...this.discardedCorpo];
            this.discardedCorpo = [];
            this.shuffleDeck(this.corpoDeck);
            deck = this.corpoDeck;
            console.log(this.corpoDeck);
        }

        let card = deck.pop();
        return card;
    }

    shuffleDeck(deck)
    {
        for (var i = deck.length - 1; i > 0; i--)
        {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    }

    updateCellBoard()
    {
        //TODO correction du bug de la mise a jour du board
        this.cells.forEach(cell => {
            const cellDiv = document.getElementById('cell' + cell.id);
            if (!cellDiv) return;

            switch(cell.constructor.name) {
                case "PropertyCell":
                    cellDiv.innerText = `${cell.name}\n\n\n${cell.price}₵`;
                    break;

                case "StartCell":
                break;
                case "LuckCell":
                break;
                case "CorpoCell":
                break;
                case "JailCell":
                break;
                case "ParkCell":
                    cellDiv.innerText = cell.name;
                break;

                case "TaxesCell":
                    cellDiv.innerText = `${cell.name}\n\n\n${cell.amount}₵`;
                    break;

                case "StationCell":
                    cellDiv.innerText = `${cell.name}\n\n\n200₵`;
                    break;

                case "UtilityCell":
                    cellDiv.innerText = cell.name;
                    break;
            }
        });
    }

    toString()
    {
        return this.cells;
    }
}