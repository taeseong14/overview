const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = 500;
const height = canvas.height = 500;

ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const textStart = [23, 310], textWidth = [148, 140];
const center = [textStart[0] + textWidth[0] / 2, textStart[1] + textWidth[1] / 2];


// insert image
const img = document.createElement('img');
img.src = './dohwaga.png';
img.onload = init;

function init() {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
}

const form = document.querySelector('form');
form.addEventListener('submit', e => {
    e.preventDefault();
    const textarea = document.querySelector('textarea');
    init();
    const width = ctx.measureText(textarea.value).width;
    const fontSize = ctx.font.split('px')[0];
    (function() {
        const texts = textarea.value.split('\n');
        if (texts.length === 1) {
            ctx.textBaseline = 'middle';
            ctx.font = `${(fontSize||1) * textWidth[0] / width |0}px KyoboHand`;
            if (texts[0].length === 1) ctx.font = ctx.font.replace(/\d+/, e => e - 15);
            return ctx.fillText(texts[0], center[0], center[1]);
        }
        const longestText = [...texts].sort((a, b) => b.length - a.length)[0];
        const longestWidth = ctx.measureText(longestText).width;
        ctx.font = `${fontSize * textWidth[0] / longestWidth |0}px KyoboHand`;
        const height = ctx.measureText('あ').width;
        ctx.textBaseline = 'top';
        texts.forEach((text, i) => {
            ctx.fillText(text, center[0], center[1] - ((texts.length / 2 |0) - i) * height);
        })
    })();
    textarea.value = '';
})