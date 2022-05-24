const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = 600;
const height = canvas.height = 400;

const canvasTitle = document.querySelector('#canvas-title');

class Square {
    constructor(x, y, width, height, color = 'green') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.draw();
    }
    draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        canvasTitle.innerHTML = `x: ${this.x}, y: ${this.y}`;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }
    move(x = 0, y = 0) {
        this.x += x;
        this.y += y;
        this.draw();
    }
}

const square = new Square(100, 100, 50, 50);

const interval = {
    ArrowUp: 0,
    ArrowDown: 0,
    ArrowLeft: 0,
    ArrowRight: 0
}

const keyDisplay = {
    ArrowUp: document.querySelector('#ArrowUp'),
    ArrowDown: document.querySelector('#ArrowDown'),
    ArrowLeft: document.querySelector('#ArrowLeft'),
    ArrowRight: document.querySelector('#ArrowRight')
}

window.onkeydown = (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowUp') {
        clearInterval(interval.ArrowUp);
        interval.ArrowUp = setInterval(() => {
            square.move(0, -5);
        }, 10);
        keyDisplay.ArrowUp.classList.add('pressed');
    }
    if (e.key === 'ArrowDown') {
        clearInterval(interval.ArrowDown);
        interval.ArrowDown = setInterval(() => {
            square.move(0, 5);
        }, 10);
        keyDisplay.ArrowDown.classList.add('pressed');
    }
    if (e.key === 'ArrowLeft') {
        clearInterval(interval.ArrowLeft);
        interval.ArrowLeft = setInterval(() => {
            square.move(-5, 0);
        }, 10);
        keyDisplay.ArrowLeft.classList.add('pressed');
    }
    if (e.key === 'ArrowRight') {
        clearInterval(interval.ArrowRight);
        interval.ArrowRight = setInterval(() => {
            square.move(5, 0);
        }, 10);
        keyDisplay.ArrowRight.classList.add('pressed');
    }
}


const isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

window.onkeyup = (e) => {
    if (e.key === 'ArrowUp') {
        clearInterval(interval.ArrowUp);
        keyDisplay.ArrowUp.classList.remove('pressed');
    }
    if (e.key === 'ArrowDown') {
        clearInterval(interval.ArrowDown);
        keyDisplay.ArrowDown.classList.remove('pressed');
    }
    if (e.key === 'ArrowLeft') {
        clearInterval(interval.ArrowLeft);
        keyDisplay.ArrowLeft.classList.remove('pressed');
    }
    if (e.key === 'ArrowRight') {
        clearInterval(interval.ArrowRight);
        keyDisplay.ArrowRight.classList.remove('pressed');
    }
}


Object.keys(keyDisplay).forEach(key => {
    if (isMobile) {
        keyDisplay[key].addEventListener('touchstart', () => {
            window.onkeydown({ key });
        });
        keyDisplay[key].addEventListener('touchend', () => {
            window.onkeyup({ key });
        });
    } else {
        keyDisplay[key].addEventListener('mouseover', () => {
            window.onkeydown({ key: key });
        });
        keyDisplay[key].addEventListener('mouseout', () => {
            window.onkeyup({ key: key });
        });
    }
});