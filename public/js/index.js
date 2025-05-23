import Game from "./Game.js";

window.onload = init;
let game;

async function init()
{
    
    let board = document.getElementById('board');
    let dices = document.getElementById('dices_container');
    board.style.display = 'none';
    dices.style.display = 'none';
    const players = localStorage.getItem('player_number');
    if (players > 0)
    {
        game = new Game(players); 
        await game.init(); 
        window.game = game; 
        board.style.display = 'grid';
        dices.style.display = 'flex';
    }
    else
    {
        alert('Please enter a valid number of players.');
    }
}

export { game }
