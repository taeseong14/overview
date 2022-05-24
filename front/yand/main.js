const main = document.querySelector('main > #pics');
const title = document.querySelector("span");
const div = document.createElement("div");
main.appendChild(div);
const select = document.querySelector("select");

async function getImgs(path) {
    const res = await fetch(`https://yande.re/post${path || "/popular_recent"}`);
    return await res.text();
}


async function setView(path) {
    title.innerText = Array.from(select).find(e=>e.selected).innerText;
    await getImgs(path)
    .then(html => {
        main.innerHTML = "";
        div.innerHTML = html;
        const content = path.includes('?tags=') ? div.querySelectorAll(".content ul li") : div.querySelectorAll("#content > div > div > ul > li");
        Array.from(content).map(e => {
            const div = document.createElement("div");
            const a = document.createElement("a");
            a.target = "_blank";
            if (!e.querySelector("a.largeimg")) return;
            a.href = e.querySelector("a.largeimg").href;
            const img = document.createElement("img");
            img.src = e.querySelector("img").src;
            a.appendChild(img);
            div.appendChild(a);
            const a2 = document.createElement("a");
            a2.target = "_blank";
            a2.innerText = "goto post";
            a2.href = "https://yande.re/post/show/" + e.querySelector("a.thumb").href.split("/").reverse()[0];
            div.appendChild(a2);
            main.appendChild(div);
        });
    });
    path && console.log(`${path} 설정 완료`);
}

setView("");


select.addEventListener("change", () => {
    main.innerHTML = "로딩잉..";
    const val = select.value;
    if (val.includes("popular")) setView(val);
    else {
        form = document.createElement("form");
        const input = document.createElement("input");
        input.placeholder = "tags";
        form.appendChild(input);
        const button = document.createElement("button");
        button.innerText = "검색";
        form.appendChild(button);
        form.addEventListener("submit", e => {
            e.preventDefault();
            setView(`?tags=${form.querySelector("input").value}`);
        })
        main.appendChild(form);
    }
});
