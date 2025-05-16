import Cell from './Cell.js';

export default class UtilityCell extends Cell
{
    constructor(id,name, price)
    {
        super(id,name);
        this.price = price;
        this.owner = null;
    }

    cellEffect(player)
    {
        return new Promise((resolve) =>
            {
                game.paused = true;
                document.querySelector('main').style.filter = "blur(5px)";
                document.querySelector('header').style.filter = "blur(5px)";
                if (this.owner && this.owner !== player)
                {
                    document.querySelector('main').style.filter = "blur(5px)";
                    document.querySelector('header').style.filter = "blur(5px)";
                    const multiplierRandom = Math.floor(Math.random() * 6) + 1;
                    player.money -= 10 * multiplierRandom;
                    this.owner.money += 10 * multiplierRandom;
                    const alertBox = document.createElement('div');
                    alertBox.className = 'property-box';
                    alertBox.style.padding = '20px';
                    alertBox.innerText = `${this.owner.name} has charged you ${10 * multiplierRandom}₵ for using ${this.name}`;
                    document.body.appendChild(alertBox);

                    const okButton = document.createElement('button');
                    okButton.innerText = 'OK';
                    alertBox.appendChild(okButton);
                    okButton.onclick = () => 
                    {
                        document.body.removeChild(alertBox);
                        game.updatePlayerMoney(player);
                        game.updatePlayerMoney(this.owner);
                        game.updatePropertyIndicator();
                        document.querySelector('main').style.filter = "blur(0px)";
                        document.querySelector('header').style.filter = "blur(0px)";
                        game.paused = false;
                        resolve();
                    };
                }
                else if (!this.owner && player.money >= this.price) 
                {
                    
                    const alertBox = document.createElement('div');
                    alertBox.className = 'property-box';
                    alertBox.style.padding = '20px';
    
                    const alertText = document.createElement('p');
                    alertText.innerText = `Do you want to buy ${this.name} for ${this.price}₵ ?`;
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
                        const propertyCellElement = document.getElementById('cell' + this.id);
                        const owned = document.createElement('div');
                        if(this.id < 11)
                        {
                            owned.className = 'top_owned '+player.color+'_owned';
                        }
                        else if(this.id < 21 && this.id > 11)
                        {
                            owned.className = 'right_owned '+player.color+'_owned';
                        }
                        else if(this.id < 31 && this.id > 21)
                        {
                            owned.className = 'bottom_owned '+player.color+'_owned';
                        }
                        else
                        {
                            owned.className = 'left_owned '+player.color+'_owned';
                        }
                        propertyCellElement.appendChild(owned);
                        game.paused = false;
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
                        game.paused = false; // Resume the game after the player finishes their action
                        document.querySelector('main').style.filter = "blur(0px)";
                        document.querySelector('header').style.filter = "blur(0px)";
                        resolve();
                    };
                    buttonrow.appendChild(cancelButton);
    
                    document.body.appendChild(alertBox);
                } 
                else
                {
                    game.paused = false;
                    document.querySelector('main').style.filter = "blur(0px)";
                    document.querySelector('header').style.filter = "blur(0px)";
                    resolve();
                }
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
    
            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.onclick = () => {
                document.body.removeChild(alertBox);
                resolve();
            };
            alertBox.appendChild(closeButton);
    
            document.body.appendChild(alertBox);
            if (this.owner && this.owner === game.players[game.currentPlayerIndex]) {
                const manageButton = document.createElement('button');
                manageButton.innerText = 'Sell the company';
                manageButton.onclick = () => {
                    console.log(`Gestion de la propriété ${this.name} par ${this.owner.name}`);
                    game.sell(this.owner, this);
                    document.body.removeChild(alertBox);
                    resolve();
                };
                alertBox.appendChild(manageButton);
            }
        });
    }
}