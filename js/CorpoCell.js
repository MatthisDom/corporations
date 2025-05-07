import Cell from './Cell.js';

export default class CorpoCell extends Cell
{
    constructor(id, name, board)
    {
        super(id, name);
        this.board = board;
    }

    cellEffect(player)
    {
        return new Promise( resolve => 
        {
            const card = this.board.drawCard(this.board.corpoDeck);
            console.log("Drew corpo card:", card);
            this.cardDrawed(card).then(() => 
            {
                this.board.discardedCorpo.push(card);
                card.cardsEffect(player);
                //this.board.updateCellBoard();
                resolve();
            });
        })
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