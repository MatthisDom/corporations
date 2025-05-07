# Corporations

## Description
Corporations is a futuristic board game inspired by Monopoly, where players navigate a corporate dystopia. The game involves buying properties, paying taxes, drawing event cards, and competing to dominate the corporate landscape.

## Objective
The goal of the game is to become the last player standing by managing your finances, acquiring properties, and avoiding bankruptcy.

## Rules
1. Players take turns rolling two dice to move around the board.
2. Landing on a cell triggers its effect:
   - **Property Cells**: Players can buy shares or pay rent to the owners.
   - **Utility and Station Cells**: Players can buy them or pay fees for using them.
   - **Tax Cells**: Players pay the specified tax amount.
   - **Luck and Corpo Cells**: Players draw a card and follow its instructions.
   - **Jail Cell**: Players can pay to leave, use a "Get Out of Jail" card, or wait for three turns.
   - **Start Cell**: Players receive a salary when passing or landing on it.
   - **Parking Cell**: A safe space with no effect.
3. Players can sell properties or shares to recover money.
4. A player is eliminated if their money falls below -500₵.
5. The last player remaining wins the game.

## Features
- **Dynamic Property Ownership**: Properties can have multiple owners with shares.
- **Event Cards**: Luck and Corpo cards introduce random events like inflation, tax changes, or stock market crashes.
- **Customizable Gameplay**: The game supports 2 to 4 players.
- **Visual Indicators**: Ownership and player positions are visually represented on the board.

## How to Play
1. Open the game in a browser.
2. Enter the number of players (2-4) in the form and start the game.
3. Players take turns rolling the dice and interacting with the board.
4. Manage your finances wisely to avoid bankruptcy and outlast your opponents.

## Technical Details
- **Frontend**: HTML, CSS, and JavaScript.
- **Game Logic**: Implemented in JavaScript with modular classes for cells, cards, and players.
- **Assets**: Includes custom fonts, dice images, and a styled game board.

## File Structure
- **`/json/cell.json`**: Defines the board layout and cell properties.
- **`/json/card.json`**: Contains the Luck and Corpo card definitions.
- **`/js/`**: Contains the game logic, including classes for cells, cards, and the game board.
- **`/css/style.css`**: Styles for the game interface.
- **`/index.html`**: Entry point for the game.

## Credits
Developed by Matthis Domingues as part of the "Some Web Games" project.

## License
This project is open-source and available under the MIT License.
