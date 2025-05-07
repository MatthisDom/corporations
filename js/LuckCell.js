import Cell from './Cell.js';
import { game } from './index.js';

export default class LuckCell extends Cell
{
    constructor(id,name, board)
    {
        super(id,name);
        this.board = board;
    }

    cellEffect(player)
    {
        return new Promise(resolve => {
            const card = this.board.drawCard(this.board.luckDeck);
            console.log("Drew luck card:", card);
            this.cardDrawed(card).then(() => 
            {
                const storedPosition = player.cellPosition;
                card.cardsEffect(player).then(() => 
                {

                    console.log(storedPosition);
                    console.log(player.cellPosition);
                    this.board.discardedLuck.push(card);
                    for (let i = 0; i < game.players.length; i++) 
                    {
                        game.updatePlayerMoney(game.players[i]);
                    }
                    if (player.cellPosition !== storedPosition && player.remainingTurnInJail === 0) 
                    {
                        console.log(player.name + " moved to cell " + player.cellPosition);
                        const cell = game.board.cells.find(cell => cell.id === player.cellPosition);
                        game.updatePlayerPosition(player, storedPosition).then(() => {
                            cell.cellEffect(player).then(resolve()); 
                        });
                    }
                    else 
                    {
                        game.updatePlayerPosition(player, storedPosition).then(() => {
                        resolve()}); 
                    }

                });
            });
        });
    }

    cardDrawed(card)
    {
        return new Promise(resolve => {
            document.querySelector('main').style.filter = "blur(5px)";
            document.querySelector('header').style.filter = "blur(5px)";
            game.paused = true;

            console.log("Drew luck card:", card);

            const alertBox = document.createElement('div');
            alertBox.className = 'property-box';
            alertBox.style.padding = '20px';

            const alertText = document.createElement('p');
            alertText.innerText = card.description;
            alertBox.appendChild(alertText);

            const okButton = document.createElement('button');
            okButton.innerText = 'OK';
            okButton.onclick = () => 
            {
                document.body.removeChild(alertBox);
                document.querySelector('main').style.filter = "blur(0px)";
                document.querySelector('header').style.filter = "blur(0px)";
                game.paused = false;
                resolve();
            }
            
            alertBox.appendChild(okButton);
            document.body.appendChild(alertBox);
        });
    }

    cellDetails()
    {
        return new Promise(resolve => {
            resolve();
        });
    }
}