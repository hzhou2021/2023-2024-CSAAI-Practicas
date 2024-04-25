const selectors = {
    gridContainer: document.querySelector('.grid-container'),
    tablero: document.querySelector('.tablero'),
    movimientos: document.querySelector('.movimientos'),
    timer: document.querySelector('.timer'),
    comenzar: document.querySelector('#comenzarButton'),
    restartButton: document.getElementById('restartButton'),
    win: document.querySelector('.win')
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

const dimensionSelector = document.getElementById('dimensionSelector');

dimensionSelector.addEventListener('change', function() {
    restartGame();
});

const generateGame = () => {
    const dimensions = dimensionSelector.value;

    if (dimensions % 2 !== 0) {
        throw new Error("Las dimensiones del tablero deben ser un número par.");
    }
    const img = ['pikachu.jpg', "charmander.jpg", "bulbasaur.jpg", "squirtle.jpg", "chikorita.jpg", "cyndaquil.jpg",
                 "totodile.jpg", "treecko.jpg",   "torchic.jpg",   "mudkip.jpg",   "piplup.jpg",    "turtwing.jpg", 
                 "chimchar.jpg",  "snivy.jpg",    "oshawott.jpg",  "tepig.jpg",    "mewtwo.jpg",     "mew.jpg"       ];

    const picks = pickRandom(img, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);

    const cardsHTML = `
        <div class="tablero" style="grid-template-columns: repeat(${dimensions}, auto)" grid-dimension="${dimensions}">
            ${items.map(item => `
                <div class="card" item-back="${item}">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item}"></div>
                </div>
            `).join('')}
        </div>
    `;

    const tablero = document.querySelector('.tablero');
    tablero.innerHTML = cardsHTML;

    const cardBackImages = document.querySelectorAll('.card-back img');
    cardBackImages.forEach(img => {
        img.onload = () => {
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
        };
    });
};


const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
};

const shuffle = array => {
    const clonedArray = [...array];

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const original = clonedArray[index];

        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
};

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.id === 'comenzarButton' && !eventTarget.classList.contains('disabled')) {
            startGame();
        }

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'comenzarButton' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });

    selectors.restartButton.addEventListener('click', () => {
        restartGame();
    });

    const cardBackImages = document.querySelectorAll('.card-back img');
    cardBackImages.forEach(img => {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
    });
};

const startGame = () => {
    state.gameStarted = true;
    selectors.comenzar.classList.add('disabled');

    dimensionSelector.disabled = true;

    state.loop = setInterval(() => {
        state.totalTime++;

        selectors.movimientos.innerText = `${state.totalFlips} movimientos`;
        selectors.timer.innerText = `tiempo: ${state.totalTime} sec`;
    }, 1000);
};

const restartGame = () => {
    state.gameStarted = false;
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.totalTime = 0;
    clearInterval(state.loop);

    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flipped', 'matched');
    });

    selectors.movimientos.innerText = `0 movimientos`;
    selectors.timer.innerText = `tiempo: 0 sec`;

    selectors.comenzar.classList.remove('disabled');
    selectors.gridContainer.classList.remove('flipped');
    dimensionSelector.disabled = false;

    generateGame();
};

const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].getAttribute('item-back') === flippedCards[1].getAttribute('item-back')) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000);
    }

    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.gridContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    ¡Has ganado!<br />
                    con <span class="highlight">${state.totalFlips}</span> movimientos<br />
                    en un tiempo de <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `;
            clearInterval(state.loop);
        }, 1000);
    }
};

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });
    state.flippedCards = 0;
};

generateGame();

attachEventListeners();
