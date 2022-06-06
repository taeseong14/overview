// profile slide checkbox
const profile_checkbox = document.querySelector('#profile-slide');
profile_checkbox.innerHTML = '';
[...document.querySelectorAll('.profile-image img')].forEach((_, i) => {
    const radio = document.createElement('input');
    if (i === 0) radio.checked = true;
    radio.type = 'radio';
    radio.name = 'profile-slide';
    radio.addEventListener('change', () => {
        document.querySelector('#profile-images').style.transform = `translateX(${i * -100}%)`;
    });
    profile_checkbox.appendChild(radio);
});

let profile_intervalIndex = 0;
let profile_interval = setInterval(() => {
    profile_checkbox.querySelectorAll('input')[++profile_intervalIndex % profile_checkbox.querySelectorAll('input').length].click();
}, 3000);

const profileImageTab = document.querySelector('#profile-image-tab');
profileImageTab.addEventListener('click', (e) => {
    clearInterval(profile_interval);
    if (!e.target.alt) return;
    let index = e.target.alt.replace('babpool', '');
    const allLen = profile_checkbox.querySelectorAll('input').length;
    if (index >= allLen) index = 0;
    profile_checkbox.querySelectorAll('input')[index].click();
});
profileImageTab.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});