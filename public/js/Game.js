import Board from "./Board.js";
import Player from "./Player.js";
import PropertyCell from "./PropertyCell.js";
import StationCell from "./StationCell.js";
import UtilityCell from "./UtilityCell.js";

export default class Game
{
    constructor(player_number)
    {
        this.playernumber = player_number;
        this.board = null;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.paused = false;
    }

    init()
    {
        console.log('Game initialized');
        this.board = new Board();
        let color = ['red', 'blue', 'purple', 'yellow'];
        return this.board.init().then(() => {
            for (let i = 0; i < this.playernumber; i++)
            {
                this.players.push(new Player(i, `Player ${i + 1}`, color[i]));
            }
            for (let i = 0; i < this.playernumber; i++)
            {
                this.players[i].init();
                document.getElementById('players').innerHTML += `<div id="player${i}" class="player_score"><h4>${this.players[i].name}</h4><span>${this.players[i].money}₵</span></div>`;
                const playerElement = document.createElement('div');
                playerElement.id = `${i}`;
                playerElement.className = 'player';
                const cellElement = document.getElementById(`cell${this.players[i].cellPosition}`);
                playerElement.className += ` ${color[i]}_player`;
                if (cellElement) {
                    cellElement.appendChild(playerElement);
                }
            }
            console.log(this.players);
            console.log(this.board.toString());
            this.turn();
        });
    }

    turn()
    {
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (!currentPlayer) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            return this.turn();
        }
        const playerScores = document.querySelectorAll('.player_score');
        playerScores.forEach(score => score.classList.remove('current_player'));
        const currentPlayerScore = document.getElementById(`player${currentPlayer.id}`);
        if (currentPlayerScore)
        {
            currentPlayerScore.classList.add('current_player');
        }
        if(!currentPlayer)
        {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            return this.turn();
        }
        if(currentPlayer.remainingTurnInJail > 0)
        {
            this.fadingAlert(`${currentPlayer.name}, you are in prison for ${currentPlayer.remainingTurnInJail} turns.`, 2500)
            currentPlayer.remainingTurnInJail--;
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            return this.turn();
        }
        console.log(`It's ${currentPlayer.name}'s turn`);
        document.getElementById('rollDiceButton').onclick = () => this.rollDice(currentPlayer);
        this.winCondition();
        this.paused = false; //failsafe
    }

    rollDice(player)
    {   
        if (this.paused) return;
        document.getElementById('rollDiceButton').onclick = null;
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        console.log(`${player.name} rolled ${dice1} and ${dice2}`);
        document.getElementById('dice1').src = `./assets/img/dice${dice1}.png`;
        document.getElementById('dice2').src = `./assets/img/dice${dice2}.png`;
        
        const initial_position = player.cellPosition;
        player.cellPosition += dice1 + dice2;
        if (player.cellPosition > 40)
        {
            player.cellPosition -= 40;
        }
        console.log(`${player.name} moved to cell ${player.cellPosition}: ${this.board.cells.find(cell => cell.id === player.cellPosition).name}`);
        this.updatePlayerPosition(player, initial_position).then(() => {
            const currentCell = this.board.cells.find(cell => cell.id === player.cellPosition);
            currentCell.cellEffect(player).then(() => {
                this.updatePlayerMoney(player);
                if(dice1+dice2 !== dice1 * 2 && player.remainingTurnInJail == 0)
                {
                    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
                }
                this.loseCondition(player);
                this.turn();
            });
        });

    }

    updatePlayerPosition(player, initial_position)
    {
        return new Promise((resolve) =>
        {
            this.paused = true;
            const movePlayer = (i) => {
            if (i > 40) 
            {
                i -= 40;
                if(player.remainingTurnInJail == 0)
                {
                    player.money += this.board.cells[0].amount;
                }
                this.updatePlayerMoney(player);
            }
            const cellElement = document.getElementById(`cell${i}`);
            const playerElement = document.getElementById(`${player.id}`);
            playerElement.remove();
            cellElement.appendChild(playerElement);
            if (i === player.cellPosition) {resolve();return;}
            setTimeout(() => movePlayer(i + 1), 500);
        };
        movePlayer(initial_position);
        this.paused = false;
        });
    }

    updatePlayerMoney(player)
    {
        const playerElement = document.getElementById(`player${player.id}`);
        playerElement.innerHTML = `<h4>${player.name}</h4><span>${player.money}₵</span>`;
    }

    loseCondition(player)
    {
        if(player.money <= -500)
        {
            this.fadingAlert(`${player.name} is bankrupt!`, 2000);
            let index_player = this.players.findIndex(p => p === player);
            this.players.splice(index_player, 1);

            const playerElement = document.getElementById(`player${player.id}`);
            if (playerElement)
            {
                playerElement.remove();
            }
            const playerToken = document.getElementById(`${player.id}`);
            if (playerToken)
            {
                playerToken.remove();
            }

            // Adjust currentPlayerIndex to ensure the turn order remains consistent
            if (index_player <= this.currentPlayerIndex && this.currentPlayerIndex > 0)
            {
                this.currentPlayerIndex--;
            }

            if (this.currentPlayerIndex >= this.players.length)
            {
                this.currentPlayerIndex = 0; 
            }

            this.board.cells.forEach(cell => 
            {
                if (cell.constructor.name === 'PropertyCell') {
                    cell.owner = cell.owner.map(owner => owner === player ? null : owner);
                } 
                else if ((cell instanceof StationCell || cell instanceof UtilityCell) && cell.owner === player)
                {
                    cell.owner = null;
                }
            });

            this.updatePropertyIndicator(); 

            if (this.players.length > 0) {
                this.turn();
            }
        }
    }

    sell(player, property) 
    {
        if (property.constructor.name === 'PropertyCell') 
        {
            const sharesOwned = property.owner.filter(owner => owner === player).length;
            if (sharesOwned === 0) return;

            const sellBox = document.createElement('div');
            sellBox.className = 'property-box';
            sellBox.style.padding = '20px';

            const text = document.createElement('p');
            text.innerText = `How many shares do you want to sell? (You own ${sharesOwned} shares)`;
            sellBox.appendChild(text);

            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = sharesOwned;
            input.value = 1;
            sellBox.appendChild(input);

            const buttonRow = document.createElement('div');
            sellBox.appendChild(buttonRow);

            const sellButton = document.createElement('button');
            sellButton.innerText = 'Sell';
            sellButton.onclick = () => {
                const sharesToSell = parseInt(input.value);
                if (sharesToSell > 0 && sharesToSell <= sharesOwned) {
                    let soldCount = 0;
                    for (let i = 0; i < property.owner.length && soldCount < sharesToSell; i++) {
                        if (property.owner[i] === player) {
                            property.owner[i] = null;
                            player.money += property.price;
                            soldCount++;
                        }
                    }
                    this.updatePlayerMoney(player);
                    this.updatePropertyIndicator(); // Add this line
                    document.body.removeChild(sellBox);
                }
            };
            buttonRow.appendChild(sellButton);

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.onclick = () => {
                document.body.removeChild(sellBox);
            };
            buttonRow.appendChild(cancelButton);

            document.body.appendChild(sellBox);
        } 
        // Pour les propriétés à propriétaire unique (UtilityCell et TrainStationCell)
        else if (property.owner === player) 
        {
            const sellBox = document.createElement('div');
            sellBox.className = 'property-box';
            sellBox.style.padding = '20px';

            const text = document.createElement('p');
            text.innerText = `Do you want to sell ${property.name} for ${property.price}₵?`;
            sellBox.appendChild(text);

            const buttonRow = document.createElement('div');
            sellBox.appendChild(buttonRow);

            const sellButton = document.createElement('button');
            sellButton.innerText = 'Sell';
            sellButton.onclick = () => {
                property.owner = null;
                player.money += property.price;
                this.updatePlayerMoney(player);
                this.updatePropertyIndicator();
                
                document.body.removeChild(sellBox);
            };
            buttonRow.appendChild(sellButton);

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.onclick = () =>
            {
                document.body.removeChild(sellBox);
            };
            buttonRow.appendChild(cancelButton);

            document.body.appendChild(sellBox);
        }
    }

    updatePropertyIndicator() 
    {
        this.board.cells.forEach(cell => 
        {
            const cellElement = document.getElementById('cell'+cell.id);
            if (!cellElement) return;

            const indicators = cellElement.querySelectorAll('[class*="_owned"]');
            indicators.forEach(indicator => indicator.remove());

            if(cell instanceof PropertyCell)
            {
                const activeOwners = cell.owner.filter(owner => owner !== null);
                if (activeOwners.length > 0) {
                    // Compte les parts pour chaque propriétaire
                    const ownerShares = {};
                    activeOwners.forEach(owner => {
                        if (!ownerShares[owner.id]) {
                            ownerShares[owner.id] = {
                                owner: owner,
                                shares: 0,
                                firstIndex: cell.owner.findIndex(o => o === owner)
                            };
                        }
                        ownerShares[owner.id].shares++;
                    });

                    // Trouve le propriétaire majoritaire
                    let majorityOwner = Object.values(ownerShares).reduce((prev, current) => {
                        if (current.shares > prev.shares) {
                            return current;
                        } else if (current.shares === prev.shares) {
                            // En cas d'égalité, prend celui qui a acheté en premier
                            return current.firstIndex < prev.firstIndex ? current : prev;
                        }
                        return prev;
                    });

                    // Crée l'indicateur pour le propriétaire majoritaire
                    const owned = document.createElement('div');
                    if(cell.id < 11) 
                    {
                        owned.className = 'top_owned ' + majorityOwner.owner.color + '_owned';
                    } 
                    else if(cell.id < 21 && cell.id > 11) 
                    {
                        owned.className = 'right_owned ' + majorityOwner.owner.color + '_owned';
                    } 
                    else if(cell.id < 31 && cell.id > 21) 
                    {
                        owned.className = 'bottom_owned ' + majorityOwner.owner.color + '_owned';
                    } 
                    else 
                    {
                        owned.className = 'left_owned ' + majorityOwner.owner.color + '_owned';
                    }
                    cellElement.appendChild(owned);
                }
            }
            else if(cell instanceof StationCell || cell instanceof UtilityCell)
            {
                if(cell.owner)
                {
                    const owned = document.createElement('div');
                    if(cell.id < 11)
                    {
                        owned.className = 'top_owned '+cell.owner.color+'_owned';
                    }
                    else if(cell.id < 21 && cell.id > 11)
                    {
                        owned.className = 'right_owned '+cell.owner.color+'_owned';
                    }
                    else if(cell.id < 31 && cell.id > 21)
                    {
                        owned.className = 'bottom_owned '+cell.owner.color+'_owned';
                    }
                    else
                    {
                        owned.className = 'left_owned '+cell.owner.color+'_owned';
                    }
                    cellElement.appendChild(owned);
                }
            }
        });
    }

    winCondition()
    {
        if(this.players.length == 1)
        {
            alert(this.players[0].name + ' a gagné !');
            return true;
        }
        return false;
    }

    fadingAlert(message, duration = 2000)
    {
        return new Promise(resolve => {
            const alertBox = document.createElement('div');
            alertBox.className = 'fading-alert-box';
            alertBox.style.padding = '20px';
            alertBox.innerText = message;
            document.body.appendChild(alertBox);
            
            setTimeout(() => {
                alertBox.style.opacity = 0;
                setTimeout(() => {
                    document.body.removeChild(alertBox);
                    resolve();
                }, duration); 
            }, duration); 
        });
    }    
}