const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

if (navigator.userAgent.match(/Android/i)) {
    const main = document.querySelector('main');
    main.style.width = '80%';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
}

const width = canvas.width;
const height = canvas.height;


ctx.textBaseline = 'middle';

(init = function() {
    ctx.clearRect(0, 0, width, height);
    // ctx.fillStyle = 'white';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
})();


const form = document.querySelector('form');
const textInput = document.querySelector('input#input-text');
const makeBtn = document.querySelector('button');
const fontSelect = document.querySelector('select#font');
const fontSize = document.querySelector('input#font-size');
const fontColor = document.querySelector('input#font-color');

let font = 'Fira Code';
fontSelect.addEventListener('change', (e) => {
    font = e.target.value;
    fill(textInput.value.replace(/\\n/g, '\n'));
});

const alignObj = {
    left: 20,
    center: width / 2,
    right: width
}

function fillText(val, heightPlus = 0) {
    ctx.fillText(val, alignObj[ctx.textAlign], height / 2 + heightPlus);
}

function fill(value) {
    init();
    const size = fontSize.value;
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = `#${fontColor.value}`;
    
    if (value.match(/\n {2,}/)) {
        ctx.textAlign = 'left';
    }
    
    value.split('\n').forEach((line,i,c)=>{
        const len = c.length;
        if (!(len%2)) {
            if (len/2 > i) return fillText(line, -((len/2|0)-i - 0.5) * size);
            if (len/2 == i || len/2 == i+1) return fillText(line, 0.5 * size);
            return fillText(line, -(((len/2|0)-i) - 0.5) * size);
        }
        fillText(line, -((len/2|0)-i) * size);
    });
    textInput.value = value.replace(/\n/g, '\\n');
    textInput.select();
}

function formSubmit(e) {
    e.preventDefault();
    if (!textInput.value) return;
    fill(textInput.value.replace(/\\n/g, '\n'));
    if (e.target.tagName == 'INPUT') {
        e.target.focus();
    }
}

form.addEventListener('submit', formSubmit);
fontSize.addEventListener('input', formSubmit);
fontColor.addEventListener('input', formSubmit);    



// fonts
window.fonts.forEach((font) => {
    const option = document.createElement('option');
    option.value = font;
    option.innerText = font.replace(/ /g, '-');
    fontSelect.appendChild(option);
});



// link params
const params = location.search.slice(1).split('&').reduce((acc, cur) => {
    acc[cur.split('=')[0]] = cur.split('=').slice(1).join('=');
    return acc;
}, {});
if (Object.keys(params).length) {
    if (params.size) fontSize.value = params.size;
    if (params.color) fontColor.value = params.color;
    if (params.text) {
        textInput.value = decodeURIComponent(params.text);
        fill(textInput.value);
    }
}






/**
* 필요한 기능
*  - text align
*  - background color
*  - dark mode
*/