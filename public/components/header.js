class AuthUserHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.updateUser();
    }

    updateUser() {
        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('username');
        const userImage = localStorage.getItem('userImage');
        const userNameSpan = this.shadowRoot.getElementById('user_name');
        const userImageEl = this.shadowRoot.getElementById('user_image');
        const buttonDiv = this.shadowRoot.getElementById('auth_user_div');
        buttonDiv.innerHTML = '';

        if (token) {
            userNameSpan.innerText = userName || 'User';
            userImageEl.src = userImage || './assets/img/guest.png';
            userImageEl.alt = userName || 'User';

            const logoutButton = document.createElement('button');
            logoutButton.innerText = 'Logout';
            logoutButton.id = 'logout';
            buttonDiv.appendChild(logoutButton);

            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('userImage');
                window.location.href = './index.html';
            });
        } 
        else 
        {
            userNameSpan.innerText = 'Guest';
            userImageEl.src = './assets/img/guest.png';
            userImageEl.alt = 'Guest';

            const loginButton = document.createElement('button');
            loginButton.innerText = 'Login';
            loginButton.id = 'login';
            buttonDiv.appendChild(loginButton);

            loginButton.addEventListener('click', () => {
                window.location.href = './login.html';
            });
        }
    }

    render() 
    {
        this.shadowRoot.innerHTML = `
            <style>
                #user_image { width: 32px; height: 32px; border-radius: 50%; vertical-align: middle; }
                #user_name { margin-right: 8px; }
                button
                {
                    background-color: var(--third-color);
                    font-family: 'PP Neue Machina';
                    color: var(--main-bg-color);
                    border: none;
                    border-radius: var(--border-radius);
                    padding: 1vh;
                    font-size: 1vw;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.5s;

                }     
                button:hover
                {
                    background-color: var(--secondary-color);
                    color: var(--main-bg-color);
                    transform: scale(1.1);
                }       
                </style>
            <div>
                <span id="user_name">Guest</span>
                <img id="user_image" src="./assets/img/guest.png" alt="guest">
                <span id="auth_user_div"></span>
            </div>
        `;
    }
}

customElements.define('auth-user-header', AuthUserHeader);