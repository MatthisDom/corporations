import Cell from './Cell.js';
import { game } from './index.js';

export default class StationCell extends Cell
{
    constructor(id, name, rent, price)
    {
        super(id, name);
        this.price = price;
        this.owner = null;
        this.serviceFee = 100;
    }

    cellEffect(player)
    {
        return new Promise((resolve) =>
            {
                game.paused = true;
                document.querySelector('main').style.filter = "blur(5px)";
                document.querySelector('header').style.filter = "blur(5px)";
                if (!this.owner && player.money >= this.price) 
                {
                    const alertBox = document.createElement('div');
                    alertBox.className = 'property-box';
                    alertBox.style.padding = '20px';
    
                    const alertText = document.createElement('p');
                    alertText.innerText = `Do you want to buy ${this.name} for ${this.price}$ ?`;
                    alertBox.appendChild(alertText);
    
    
                    const buttonrow = document.createElement('div');
                    alertBox.appendChild(buttonrow);
                    const buyButton = document.createElement('button');
                    buyButton.innerText = 'Buy';
                    buyButton.onclick = () =>
                    {
                        player.money -= this.price;
                        this.owner = player;
                        document.body.removeChild(alertBox);
                        game.updatePlayerMoney(player);
                        game.updatePropertyIndicator();
                        game.paused = false; // Resume the game after the player finishes their action
                        document.querySelector('main').style.filter = "blur(0px)";
                        document.querySelector('header').style.filter = "blur(0px)";
                        resolve();
                    };
                    buttonrow.appendChild(buyButton);
    
                    const cancelButton = document.createElement('button');
                    cancelButton.innerText = 'Cancel';
                    cancelButton.onclick = () => 
                    {
                        document.body.removeChild(alertBox);
                        this.stationTransport(player).then(() =>
                        {
                            game.paused = false; // Resume the game after the player finishes their action
                            resolve();
                        });
                    };
                    buttonrow.appendChild(cancelButton);
    
                    document.body.appendChild(alertBox);
                }
                else if(player.money > this.serviceFee)
                {
                    this.stationTransport(player).then( () => {
                        resolve();
                    });
                }
                else
                {
                    game.paused = false; // Resume the game after the player finishes their action
                    document.querySelector('main').style.filter = "blur(0px)";
                    document.querySelector('header').style.filter = "blur(0px)";
                    resolve();
                }
            });    
    }

    countOwnedStations(player)
    {
        return game.board.cells.filter(cell => cell instanceof StationCell && cell.owner === player).length;
    }

    stationTransport(player)
    {
        return new Promise((resolve) => {

            const alertBox = document.createElement('div');
            alertBox.className = 'property-box';
            alertBox.style.padding = '20px';

            const alertText = document.createElement('p');
            alertText.innerText = `Would you move to another station?`;
            alertBox.appendChild(alertText);

            const buttonrow = document.createElement('div');
            alertBox.appendChild(buttonrow);

            for (let i = 0; i < game.board.cells.length; i++)
            {
                if (game.board.cells[i] instanceof StationCell && game.board.cells[i].id !== player.cellPosition)
                {
                    const transportButton = document.createElement('button');
                    transportButton.innerText = game.board.cells[i].name;
                    transportButton.onclick = () =>
                    {
                        if(this.owner && this.owner !== player && player.money >= this.serviceFee)
                        {
                            player.money -= this.serviceFee + (25 * this.countOwnedStations(this.owner));
                            this.owner.money += this.serviceFee + (25 * this.countOwnedStations(this.owner));
                            game.updatePlayerMoney(player);
                            game.updatePlayerMoney(this.owner);
                            player.cellPosition = game.board.cells[i].id;
                            document.querySelector('main').style.filter = "blur(0px)";
                            document.querySelector('header').style.filter = "blur(0px)";
                            game.updatePlayerPosition(player, this.id).then(() => 
                            {
                                resolve();
                            });
                        }
                        else if(this.owner && this.owner === player)
                        {
                            player.money -= this.serviceFee/2;
                            game.updatePlayerMoney(player);
                            player.cellPosition = game.board.cells[i].id;
                            document.querySelector('main').style.filter = "blur(0px)";
                            document.querySelector('header').style.filter = "blur(0px)";
                            game.updatePlayerPosition(player, this.id).then(() => 
                            {
                                resolve();
                            });
                        }
                        else
                        {
                            player.money -= this.serviceFee;
                            game.updatePlayerMoney(player);
                            player.cellPosition = game.board.cells[i].id;
                            document.querySelector('main').style.filter = "blur(0px)";
                            document.querySelector('header').style.filter = "blur(0px)";
                            game.updatePlayerPosition(player, this.id).then(() => 
                            {
                                resolve();
                            });
                        }
                        document.body.removeChild(alertBox);
                    };
                    buttonrow.appendChild(transportButton);
                }
            }

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.onclick = () => 
            {
                document.body.removeChild(alertBox);
                document.querySelector('main').style.filter = "blur(0px)";
                document.querySelector('header').style.filter = "blur(0px)";
                resolve();
            };
            buttonrow.appendChild(cancelButton);

            document.body.appendChild(alertBox);
        });
    }

    cellDetails()
    {
        return new Promise((resolve) => {

            const alertBox = document.createElement('div');
            alertBox.className = 'property-box-details';
            alertBox.style.padding = '20px';

            const alertTitle = document.createElement('h3');
            alertTitle.innerText = this.name;
            alertBox.appendChild(alertTitle);

            const alertText = document.createElement('div');
            alertText.innerText = `\nPrice: ${this.price}₵\nOwner: ${this.owner ? this.owner.name : 'Aucun'}`;
            alertBox.appendChild(alertText);

            const rentList = document.createElement('ul');
            
            const rentItem = document.createElement('div');
            rentItem.innerText = `Service fee: ${this.serviceFee}₵`;
            
            rentList.appendChild(rentItem);
            alertBox.appendChild(rentList);

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.onclick = () => {
                document.body.removeChild(alertBox);
                return resolve();
            };
            alertBox.appendChild(closeButton);

            document.body.appendChild(alertBox);
            if (this.owner && this.owner === game.players[game.currentPlayerIndex])
            {
                const manageButton = document.createElement('button');
                manageButton.innerText = 'Sell the company';
                manageButton.onclick = () => 
                {
                    console.log(`Gestion de la propriété ${this.name} par ${this.owner.name}`);
                    game.sell(this.owner, this);
                    document.body.removeChild(alertBox);
                    return resolve();
                };
                alertBox.appendChild(manageButton);
            }
        });
    }   
}