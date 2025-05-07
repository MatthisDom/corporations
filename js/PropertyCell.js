import Cell from './Cell.js';
import { game } from './index.js';

export default class PropertyCell extends Cell
{
    constructor(id,name,description,color,price,rent)
    {
        super(id,name);
        this.color = color;
        this.description = description;
        this.price = price;
        this.rent = rent;
        this.owner = [null,null,null,null,null];
    }

    cellEffect(player)
    {
        game.paused = true;
        document.querySelector('main').style.filter = "blur(5px)";
        document.querySelector('header').style.filter = "blur(5px)";
        return new Promise((resolve) =>
        {
            const activeOwners = this.owner.filter(o => o !== null); // Filter out null owners
            const firstPlayer = this.owner.find(o => o !== null);
            const isValidOwnership = this.owner.every(o => o === null || o === player);

            if (activeOwners.length > 0) 
            {
                let totalRentToPay = 0;

                activeOwners.forEach(owner => {
                    const ownerShares = this.owner.filter(o => o === owner).length; // Count shares owned by this owner
                    const ownerRent = this.rent * ownerShares;
                    totalRentToPay += ownerRent;
                    owner.money += ownerRent;
                    game.updatePlayerMoney(owner);
                });

                player.money -= totalRentToPay; 
                game.updatePlayerMoney(player);

                console.log(`${player.name} paid ${totalRentToPay}₵ distributed among the owners.`);
                var alertBox = document.createElement('div');
                alertBox.className = 'property-box';
                alertBox.style.padding = '20px';

                const alertText = document.createElement('p');
                if(isValidOwnership && firstPlayer && player.money >= this.price)
                {
                    alertText.innerText = `Voulez vous acheter une part de ${this.name} ?`;	
                }
                else if(isValidOwnership && firstPlayer && player.money < this.price)
                {
                    alertText.innerText = `Vous n'avez pas assez d'argent pour acheter une part de ${this.name}.`;
                }
                else if(activeOwners.includes(player) && player.money < this.price) 
                {
                    alertText.innerText = `Vous n'avez pas assez d'argent pour acheter une part de ${this.name}.`;
                }
                else
                {
                    alertText.innerText = `Vous avez payé ${totalRentToPay}₵ répartis entre les propriétaires.`;
                }
                alertBox.appendChild(alertText);

                const buttonrow = document.createElement('div');
                alertBox.appendChild(buttonrow);

                const buyShareButton = document.createElement('button');
                buyShareButton.innerText = 'Buy a share';
                const buyBackShareButton = document.createElement('button');
                buyBackShareButton.innerText = 'Buy back a share';
                if (player.money >= this.price) 
                {
                    buttonrow.appendChild(buyShareButton);
                    if (activeOwners.some(owner => owner !== player)) // Ensure there are other owners besides the player
                    {
                        buttonrow.appendChild(buyBackShareButton);
                    }
                }

                buyShareButton.onclick = () => {
                    if (player.money >= this.price && this.owner.includes(null)) 
                    {
                        player.money -= this.price;
                        this.owner[this.owner.findIndex(o => o === null)] = player; // Assign player to the first null slot
                        console.log(`${player.name} a acheté une part de ${this.name} pour ${this.price}₵`);
                        game.updatePlayerMoney(player);
                    } 
                    else 
                    {
                        console.log("Achat impossible : soit pas assez d'argent, soit aucune part disponible.");
                    }
                    document.body.removeChild(alertBox);
                    game.paused = false; // Resume the game after the player finishes their action
                    document.querySelector('main').style.filter = "blur(0px)";
                    document.querySelector('header').style.filter = "blur(0px)";
                    resolve();
                };

                buyBackShareButton.onclick = () => 
                {
                    const alertBoxbuy = document.createElement('div');
                    alertBoxbuy.className = 'property-box';
                    alertBoxbuy.style.padding = '20px';

                    const alertText = document.createElement('p');
                    alertText.innerText = 'Select the share you want to buy back:';
                    alertBoxbuy.appendChild(alertText);

                    const buttonRow = document.createElement('div');
                    alertBoxbuy.appendChild(buttonRow);

                    const owners = [...new Set(this.owner.filter(o => o !== null))];
                    owners.forEach(owner => {
                        const ownerShares = this.owner.filter(o => o === owner && owner !== player).length; // Count shares owned by this owner
                        const ownerButton = document.createElement('button');
                        ownerButton.innerText = `${owner.name} (${ownerShares} shares)`;

                        ownerButton.onclick = () => {
                            if (player.money >= this.price) {
                                const shareIndex = this.owner.findIndex(o => o === owner); // Find the first share of the owner
                                if (shareIndex !== -1) {
                                    this.owner[shareIndex] = player; 
                                    player.money -= this.price;
                                    owner.money += this.price;
                                    console.log(`${player.name} bought back a share of ${this.name} from ${owner.name} for ${this.price}₵`);
                                    game.updatePlayerMoney(player);
                                    game.updatePlayerMoney(owner);
                                    game.updatePropertyIndicator();
                                    alertBox.remove();
                                    document.body.removeChild(alertBoxbuy); // Remove the buy back alert box
                                    document.querySelector('main').style.filter = "blur(0px)"; // Remove blur effect
                                    document.querySelector('header').style.filter = "blur(0px)"; // Remove blur effect
                                    game.paused = false; // Resume the game after the player finishes their action
                                    resolve();
                                } 
                                else 
                                {
                                    console.log("No shares available to buy back.");
                                }
                            } 
                            else 
                            {
                                console.log("Not enough money to buy back the share.");
                            }
                            document.body.removeChild(alertBox);
                            resolve();
                        };

                        buttonRow.appendChild(ownerButton);
                    });

                    const cancelButton = document.createElement('button');
                    cancelButton.innerText = 'Cancel';
                    cancelButton.onclick = () => {
                        document.body.removeChild(alertBoxbuy);
                    };
                    buttonRow.appendChild(cancelButton);

                    document.body.appendChild(alertBoxbuy);
                }

                const closeButton = document.createElement('button');
                closeButton.innerText = 'Close';
                closeButton.onclick = () => {
                    document.body.removeChild(alertBox);
                    game.paused = false; // Resume the game after the player finishes their action
                    document.querySelector('main').style.filter = "blur(0px)"; // Remove blur effect
                    document.querySelector('header').style.filter = "blur(0px)"; // Remove blur effect
                    resolve();
                };
                buttonrow.appendChild(closeButton);

                document.body.appendChild(alertBox);
            }
            else if (activeOwners.length <  5 && player.money >= this.price) 
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
                    this.owner[this.owner.findIndex(o => o === null)] = player; // Assign player to the first null slot
                    document.body.removeChild(alertBox);
                    console.log(`${player.name} a acheté ${this.name} pour ${this.price}₵`);
                    game.updatePropertyIndicator();
                    game.paused = false; // Resume the game after the player finishes their action
                    document.querySelector('main').style.filter = "blur(0px)"; // Remove blur effect
                    document.querySelector('header').style.filter = "blur(0px)"; // Remove blur effect
                    resolve();
                };
                buttonrow.appendChild(buyButton);

                const cancelButton = document.createElement('button');
                cancelButton.innerText = 'Cancel';
                cancelButton.onclick = () => 
                {
                    document.body.removeChild(alertBox);
                    game.paused = false; 
                    document.querySelector('main').style.filter = "blur(0px)"; // Remove blur effect
                    document.querySelector('header').style.filter = "blur(0px)"; // Remove blur effect
                    resolve();
                };
                buttonrow.appendChild(cancelButton);

                document.body.appendChild(alertBox);
            } 
            else
            {
                game.paused = false;
                document.querySelector('main').style.filter = "blur(0px)"; // Remove blur effect
                document.querySelector('header').style.filter = "blur(0px)"; // Remove blur effect
                resolve();
            }
        });
    }


    countOwnedPropertiesByColor(player)
    {
        let count = 0;
        for (let i = 0; i < game.board.cells.length; i++)
        {
            if (game.board.cells[i].color === this.color && game.board.cells[i].owner === player)
            {
                count++;
            }
        }
        return count;
    }

    countPropertiesByColor()
    {
        let count = 0;
        for (let i = 0; i < game.board.cells.length; i++)
        {
            if (game.board.cells[i].color === this.color)
            {
                count++;
            }
        }
        return count;
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

            const alertDescription = document.createElement('p');
            alertDescription.innerText = this.description;
            alertBox.appendChild(alertDescription);

            const alertText = document.createElement('div');
            alertText.innerText = `\n- Price: ${this.price}₵\n- Dividend: ${this.rent}₵`;
            alertBox.appendChild(alertText);

            const pieChart = document.createElement('canvas');
            pieChart.width = 200; 
            pieChart.height = 200; 
            const ctx = pieChart.getContext('2d');
            const data = Array(5).fill(null).map((_, index) => {
                const color = this.owner[index] === null ? '#AAAAAA' : this.owner[index].color; // Gray if null, player color otherwise
                return { value: 1, color: color };
            });
            const total = data.length; // Total is now 5 for equal slices
            let startAngle = 0;
            data.forEach(item => {
                const sliceAngle = (1 / total) * 2 * Math.PI; // Equal slice for each part
                ctx.beginPath();
                ctx.moveTo(100, 100);
                ctx.arc(100, 100, 50, startAngle, startAngle + sliceAngle + 0.1);
                ctx.closePath();
                ctx.fillStyle = item.color;
                ctx.fill();
                startAngle += sliceAngle;
            });
            alertBox.appendChild(pieChart);

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.onclick = () => {
                document.body.removeChild(alertBox);
                return resolve();
            };
            alertBox.appendChild(closeButton);

            const currentPlayer = game.players[game.currentPlayerIndex];
            if (this.owner.includes(currentPlayer)) {
                const sellButton = document.createElement('button');
                sellButton.innerText = 'Sell shares';
                sellButton.onclick = () => {
                    game.sell(currentPlayer, this);
                    document.body.removeChild(alertBox);
                    resolve();
                };
                alertBox.appendChild(sellButton);
            }

            document.body.appendChild(alertBox);
        });
    }
}

