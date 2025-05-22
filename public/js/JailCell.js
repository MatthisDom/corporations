import Cell from './Cell.js';
import { game } from './index.js';

export default class JailCell extends Cell
{
    constructor(id,name)
    {
        super(id,name);
    }

    cellEffect(player)
    {
        return new Promise(resolve => {
            console.log(player.name + " is in jail");
            document.querySelector('main').style.filter = "blur(5px)";
            document.querySelector('header').style.filter = "blur(5px)";
            const alertBox = document.createElement('div');
            alertBox.className = 'jail-box';
            alertBox.style.padding = '20px';

            const alertText = document.createElement('p');
            alertText.innerText = `YOUR ARE IN JAIL ! WHAT DO YOU DO ?`;
            alertBox.appendChild(alertText);

            const buttonrow = document.createElement('div');
            alertBox.appendChild(buttonrow);

            const buyButton = document.createElement('button');
            buyButton.innerText = 'Pay 50₵';
            buyButton.onclick = () =>
            {
                player.money -= 50;
                document.body.removeChild(alertBox);
                game.updatePlayerMoney(player);
                document.querySelector('main').style.filter = "blur(0px)";
                document.querySelector('header').style.filter = "blur(0px)";
                resolve(); // Résolution unique ici
            };
            buttonrow.appendChild(buyButton);

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Wait 3 turn';
            cancelButton.onclick = () => 
            {
                player.cellPosition = 11;
                player.remainingTurnInJail = 3;
                game.updatePlayerPosition(player, this.id);    
                document.body.removeChild(alertBox);
                document.querySelector('main').style.filter = "blur(0px)";
                document.querySelector('header').style.filter = "blur(0px)";
                resolve(); // Résolution unique ici
            };
            buttonrow.appendChild(cancelButton);

            if(player.getAwayFromJailCard >= 1)
            {
                const freeFromJailCardButton = document.createElement('button');
                freeFromJailCardButton.innerText = 'Free !';
                freeFromJailCardButton.onclick = () => 
                {
                    document.body.removeChild(alertBox);
                    player.getAwayFromJailCard -= 1;
                    document.querySelector('main').style.filter = "blur(0px)";
                    document.querySelector('header').style.filter = "blur(0px)";
                    resolve();
                };
                buttonrow.appendChild(freeFromJailCardButton);
            }

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