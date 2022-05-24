let user_id;

async function getUserId() {
    const res = await fetch("https://api.ipify.org");
    const ip = await res.text();
    user_id = +(ip.replaceAll(".", "")*5+'').slice(0, 7);
}

const span = document.querySelector("#click span");
const rank = document.querySelector("#rank");
const btn = document.querySelector('#reload button');

let clicked = 0;
let isLoading = false;

function click(e) {
    if (e.repeat) return;
    span.innerText = +span.innerText + 1 + +document.querySelector('.level > span').innerText;
    clicked++;
}

document.addEventListener("click", click);
document.addEventListener("keydown", click);
btn.addEventListener("click", () => reload(clicked++))
document.addEventListener("contextmenu", e => e.preventDefault());

// tab change
const tabTitles = Array.from(document.querySelectorAll("#tab-titles > div"));
const tabs = Array.from(document.querySelectorAll("#tab-sections > section"));
tabTitles.forEach(tabTitle => {
    tabTitle.addEventListener("click", () => {
        const section = tabTitle.getAttribute("for");
        tabTitles.forEach(tabTitle => tabTitle.classList.remove("active"));
        tabTitle.classList.add("active");
        tabs.forEach(tab => tab.hidden = true);
        document.querySelector(`#${section}`).hidden = false;
    });
});

// Rank
async function setRank() {
    const res = await fetch("/clicker/rank")
    const json = await res.json()
    rank.innerHTML = '';
    json.sort((a,b)=>b.click - a.click).forEach(e => {
        const div = document.createElement("div");
        div.innerText = `${e.id === user_id? `너님(${e.id})` : e.id} : ${e.click}원`;
        rank.appendChild(div)
    })
}

async function reload() {
    // if (!clicked) return;
    if (!user_id) return;
    if (isLoading) return console.log("로딩중");
    isLoading = true;
    const clicked = +span.innerText;
    await fetch("/clicker/click", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({id: user_id, click: clicked}),
    });
    console.log(`clicks posted: ${clicked}`);
    await setRank();
    isLoading = false;
}

(async () => {
    await getUserId()
    const uiDiv = document.querySelector('#ui');
    uiDiv.innerText = `id: ${user_id}`;
    await setRank();
    console.log("rank set complete");
})()
setInterval(reload, 10000);


// Upgrade

const upgradeItems = Array.from(document.querySelectorAll(".upgrade-item"));
upgradeItems.forEach(upgradeItem => {
    upgradeItem.addEventListener('click', () => {
        const level = upgradeItem.querySelector(".level > span");
        level.innerText++;
    });
});