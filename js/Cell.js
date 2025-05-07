import { game } from "./index.js";

export default class Cell
{
    constructor(id,name)
    {
        this.id = id;
        this.name = name;
    }

    cellEffect(player)
    {
        console.log(`${player.name} landed on ${this.name}`);
    }

    show()
    {
        if(game.paused)return;
        
        return new Promise((resolve) => 
        {
            document.querySelector('main').style.filter = "blur(5px)";
            document.querySelector('header').style.filter = "blur(5px)";
            game.paused = true;

            this.cellDetails().then(() => 
            {
                document.querySelector('main').style.filter = "blur(0px)";
                document.querySelector('header').style.filter = "blur(0px)";
                game.paused = false;
                resolve();
            });
        });
        
    }
}