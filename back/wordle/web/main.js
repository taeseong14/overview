fetch('/words', {
    method: 'POST',
    body: '',
}).then(res => res.json()).then(words => {
    const answer = words[Math.floor(Math.random() * words.length)].toUpperCase();
    const keys = Array.from(document.querySelectorAll('.key'));
    const boxs = Array.from(document.querySelectorAll('.box-line')).map(line => Array.from(line.querySelectorAll('.box')));
    
    function onKeydown(e) {
        const pressedKey = e.key.toUpperCase();
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        if (pressedKey.length === 1 && 'A' <= pressedKey && pressedKey <= 'Z') {
            if (e.repeat) return;
            e.preventDefault && e.preventDefault();
            const key = keys.find(key => key.innerText.toUpperCase() === pressedKey);
            if (!key || key.classList.contains('gray')) return;
            key.classList.add('press');
            const line = boxs.find(line => line.some(e=>!e.innerText));
            if (!line) return console.log('끝난건가');
            if (line.map(e=>e.innerText).includes(pressedKey)) return;
            const box = line.find(e => !e.innerText);
            box.innerText = pressedKey;
            if (line.indexOf(box) === 4) {
                // 라인 끝
                line.forEach(e => {
                    const index = line.indexOf(e);
                    const key = Array.from(document.querySelectorAll('.key')).find(key => key.innerText === e.innerText);
                    if (answer[index] === e.innerText) {
                        e.classList.add('green');
                        key.className = 'key green';
                    } else if (answer.includes(e.innerText)) {
                        e.classList.add('yellow');
                        key.className = 'key yellow';
                    } else {
                        e.classList.add('gray');
                        key.className = 'key gray';
                    }
                    
                });
                if (line.map(e=>e.innerText).join('') === answer) {
                    alert('정답');
                }
            }
        } else if (pressedKey === 'BACKSPACE') {
            const line = boxs.find(line => line.some(e=>!e.innerText));
            const box = line.filter(e => e.innerText);
            if (!box.length) return console.log('이 라인에선 지울게 없는걸');
            box.pop().innerText = '';
        } else if (pressedKey === 'ESCAPE') { // clear
            boxs.forEach(line => line.forEach(e => {
                e.innerText = '';
                e.className = 'box';
            }));
        }
    }
    window.addEventListener('keydown', onKeydown);
    Array.from(document.querySelectorAll('.key')).forEach(key => {
        key.addEventListener('click', () => {
            onKeydown({ key: key.innerText });
        });
    });
    
    window.addEventListener('keyup', e => {
        if ('a' <= e.key && e.key <= 'z') {
            keys.find(key => key.innerText.toLowerCase() === e.key.toLowerCase()).classList.remove('press');
        }
    });
});