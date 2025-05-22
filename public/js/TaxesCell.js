import Cell from './Cell.js';

export default class TaxesCell extends Cell
{
    constructor(id,name,amount)
    {
        super(id,name);
        this.amount = amount;
    }

    cellEffect(player)
    {
        return new Promise((resolve) =>
        {
            player.money -= this.amount;
            console.log(player.name + " paid " + this.amount + "$ to " + this.name);
            resolve();
        })
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
            alertText.innerText = `\nTax amount: ${this.amount}₵`;
            alertBox.appendChild(alertText);

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.onclick = () => {
                document.body.removeChild(alertBox);
                resolve();
            };
            alertBox.appendChild(closeButton);
            document.body.appendChild(alertBox);
        });
    }
}