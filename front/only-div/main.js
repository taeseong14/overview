const form = document.querySelector('.form');
const input = document.querySelector('.input');
const button = document.querySelector('.button');

function submit() {
    console.log(input.innerText);
    input.innerText = '';
}

input.addEventListener('keydown', e => {
    setTimeout(() => {
        if (e.keyCode === 13) {
            input.innerText = input.innerText.slice(0, -1);
            submit();
        }
    }, 0);
});



button.addEventListener('click', submit);



// imgs

const imgs = document.querySelectorAll('.img');
imgs.forEach(img => {
    img.style.backgroundImage = `url(${img.getAttribute('src')}?${Date.now()})`;
})

// a

const as = document.querySelectorAll('.a');
as.forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        open(a.getAttribute('href'));
    })
});