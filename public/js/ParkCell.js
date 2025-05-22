import Cell from './Cell.js';

export default class ParkCell extends Cell
{
    constructor(id,name)
    {
        super(id,name);
    }

    cellEffect(player)
    {
        return new Promise(resolve => {
            resolve();
        })
    }

    cellDetails()
    {
        return new Promise(resolve => {
            resolve();
        });
    }
}
