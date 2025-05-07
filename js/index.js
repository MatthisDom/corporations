import Game from "./Game.js";

window.onload = init;
let game;

async function init()
{
    const form = document.createElement('form');
    form.innerHTML = `
        <label for="players">Number of Players:</label>
        <input type="number" id="players" name="players" min="2" max="4" required>
        <button type="submit">Create Game</button>
    `;
    let board = document.getElementById('board');
    let dices = document.getElementById('dices_container');
    board.style.display = 'none';
    dices.style.display = 'none';
    form.onsubmit = async (event) => {
        event.preventDefault();
        const players = event.target.players.value;
        if (players > 0)
        {
            game = new Game(players); 
            await game.init(); 
            window.game = game; 
            board.style.display = 'grid';
            dices.style.display = 'flex';
            form.remove();
        }
        else
        {
            alert('Please enter a valid number of players.');
        }
    };
    document.body.appendChild(form);
}

export { game };
