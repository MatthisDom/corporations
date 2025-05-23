class soloSettings extends HTMLElement {
    constructor() 
    {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() 
    {
        this.render();
    }

    render() 
    {
        this.shadowRoot.innerHTML = `
            <style>

                h2 {
                    margin-top: 0;
                    font-size: 1.5em;
                }
                label {
                    display: block;
                    margin: 12px 0 4px;
                }
                input[type="text"], input[type="number"] {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button 
                {
                    font-family: inherit;
                    margin-top: 16px;
                    padding: 8px 16px;
                    background: var(--third-color);
                    color: var(--main-bg-color);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background: var(--secondary-color);
                }
                body 
                {
                    opacity: 0.9;
                }
                #header-menu 
                {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    
                }
            </style>
            <div id="header-menu">
                <h2>Solo Settings</h2>
                <button id="close">X</button>
            </div>

            <form id="settingsForm">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required />

                <label for="level">Number of player</label>
                <input type="number" id="player_number" name="level" min="2" max="4" />

                <button type="submit">Start the game</button>
            </form>
            <div id="message"></div>
        `;

        this.shadowRoot.querySelector('#settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = this.shadowRoot.querySelector('#username').value;
            const player_number = this.shadowRoot.querySelector('#player_number').value;
            // Stocke les valeurs dans localStorage pour les récupérer dans game.html
            localStorage.setItem('playername', username);
            localStorage.setItem('player_number', player_number);
            document.location.href = './game.html';
        });

        this.shadowRoot.querySelector('#close').addEventListener('click', () => {
            this.remove();
        });
    }


}

customElements.define('solo-settings', soloSettings);