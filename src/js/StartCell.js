import Cell from './Cell.js';

export default class StartCell extends Cell
{
    constructor(id,name,amount)
    {
        super(id,name,amount);
        this.amount =  amount;
    }

    cellEffect(player)
    {
        return new Promise((resolve) =>
        {
            resolve();
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
            alertText.innerText = `\nSalary: ${this.amount}₵\n\n`;
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