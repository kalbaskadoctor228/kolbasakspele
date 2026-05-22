const sausage = document.getElementById("sausage");
const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");

let y = 120;
let velocity = 0;
let gravity = 0.6;
let jumpPower = 14;

let jumping = false;
let score = 0;
let speed = 6;
let running = true;

let obstacles = [];
let birds = [];
let bullets = [];
let megaBoxes = [];

let boss = null;
let finalMode = false;

// rekords
fetch("/highscore")
.then(r => r.json())
.then(d => bestText.innerText = d.best_score);

// vadība
document.addEventListener("keydown", e => {
    if (e.code === "Space" && !jumping && !finalMode) {
        velocity = jumpPower;
        jumping = true;
    }
});

// šķēršļi
function spawnObstacle() {
    if (!running || finalMode) return;

    let o = document.createElement("div");
    o.innerText = "🪨";
    o.style.position = "absolute";
    o.style.left = window.innerWidth + "px";
    o.style.bottom = "110px";
    o.style.fontSize = "50px";

    game.appendChild(o);
    obstacles.push(o);
}

// putni
function spawnBird() {
    if (!running || finalMode) return;

    let b = document.createElement("div");
    b.innerText = "🌭🐦";

    b.style.position = "absolute";
    b.style.left = window.innerWidth + "px";
    b.style.bottom = (320 + Math.random()*120) + "px";
    b.style.fontSize = "60px";

    game.appendChild(b);
    birds.push(b);
}

// mega kaste
function spawnMegaBox() {
    if (!running || finalMode) return;

    let m = document.createElement("div");
    m.innerText = "🎁";

    m.style.position = "absolute";
    m.style.left = window.innerWidth + "px";
    m.style.bottom = "140px";
    m.style.fontSize = "50px";

    game.appendChild(m);
    megaBoxes.push(m);
}

// Colt
function spawnColt() {
    if (!running || finalMode) return;

    let c = document.createElement("div");
    c.innerText = "🔫";

    c.style.position = "absolute";
    c.style.left = window.innerWidth + "px";
    c.style.bottom = "140px";
    c.style.fontSize = "50px";

    game.appendChild(c);
    obstacles.push(c);

    setInterval(() => {
        if (!running || finalMode) return;

        let bullet = document.createElement("div");
        bullet.innerText = "💥";

        bullet.style.position = "absolute";
        bullet.style.left = c.style.left;
        bullet.style.bottom = "150px";

        game.appendChild(bullet);
        bullets.push(bullet);

    }, 2500);
}

// boss
function spawnFinalBoss() {
    finalMode = true;

   
    boss = document.createElement("div");

    boss.style.position = "absolute";
    boss.style.left = window.innerWidth + "px";
    boss.style.bottom = "200px";
    boss.style.textAlign = "center";


    let img = document.createElement("img");
    img.src = "https://i.ytimg.com/vi/FayduQrRN1Q/oar2.jpg?sqp=-oaymwEkCJUDENAFSFqQAgHyq4qpAxMIARUAAAAAJQAAyEI9AICiQ3gB&rs=AOn4CLA4fCL4-52nBF0CJwijr5yDm-JAaw";
    img.style.width = "120px";
    img.style.borderRadius = "15px";


    let name = document.createElement("div");
    name.innerText = "👹 MELLSTROY";
    name.style.color = "red";
    name.style.fontWeight = "bold";
    name.style.marginTop = "5px";

 
    boss.appendChild(img);
    boss.appendChild(name);

    game.appendChild(boss);
}
// kazino
function showCasino() {
    game.innerHTML = `
        <div style="color:white;text-align:center;margin-top:80px;">
            <h1>🎰 KAZINO</h1>
            <h2 id="result">Griežam...</h2>
            <div id="spin" style="font-size:70px;">🎰</div>
            <div id="reward" style="margin-top:20px;"></div>

            <button onclick="restartGame()" 
            style="margin-top:30px;padding:10px 20px;font-size:18px;border:none;border-radius:10px;cursor:pointer;">
            🔄 Spēlēt vēlreiz
            </button>
        </div>
    `;

    let rewards = ["💰","💎","🍒","🔥","💀","👑"];
    let spin = document.getElementById("spin");
    let result = document.getElementById("result");
    let reward = document.getElementById("reward");

    let count = 0;

    let interval = setInterval(() => {
        spin.innerText = rewards[Math.floor(Math.random()*rewards.length)];
        count++;
        
        if (count > 20) {
            clearInterval(interval);

            spin.innerText = "👑";
            result.innerText = "🔥 IZKRITA LEĢENDĀRAIS MARKUSS RUBIKS!";

            reward.innerHTML = `
                <img src="https://scontent.frix3-1.fna.fbcdn.net/v/t39.30808-6/495461194_1744164049844795_7999977758072079100_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=RRikVXjFG7sQ7kNvwECgp29&_nc_oc=AdqjXPTKSu6oAKxYnaXitCzACp5K4ffH9DPnnFhgfuZVmyaFfzNpQpMvJgVTVKWfoJI&_nc_zt=23&_nc_ht=scontent.frix3-1.fna&_nc_gid=c_6SFppRQsahzVkfXIwLvg&_nc_ss=7b289&oh=00_Af4nN9_yXpgY6RXGslXx3cpgW-DIdUYMhZzOEc7LvagZzg&oe=6A15ECA4"
                style="width:220px;border-radius:20px;margin-top:10px;">
                <h3>👑 LEĢENDĀRS CĪNĪTĀJS</h3>
            `;
        }

    }, 150);
}

// spawn
setInterval(spawnObstacle, 2000);
setInterval(spawnBird, 3000);
setInterval(spawnMegaBox, 5000);
setInterval(spawnColt, 8000);

// update
function update() {
    if (!running) return;

    velocity -= gravity;
    y += velocity;

    if (y <= 120) {
        y = 120;
        velocity = 0;
        jumping = false;
    }

    sausage.style.bottom = y + "px";

    speed += 0.002;

    if (score >= 50 && !finalMode) {
        spawnFinalBoss();
    }

    if (finalMode && boss) {
        let left = parseInt(boss.style.left);
        left -= 5;
        boss.style.left = left + "px";

        if (left < 150) {
            endGame();
        }
    }

    if (!finalMode) {

        obstacles.forEach((o, i) => {
            let left = parseInt(o.style.left);
            left -= speed;
            o.style.left = left + "px";

            if (left < -100) {
                o.remove();
                obstacles.splice(i,1);
                score++;
                scoreText.innerText = score;
            }

            if (left < 140 && left > 90 && y < 150) {
                endGame();
            }
        });

        birds.forEach((b,i) => {
            let left = parseInt(b.style.left);
            left -= speed;
            b.style.left = left + "px";

            let bottom = parseInt(b.style.bottom);

            if (left < 140 && left > 90 && y > bottom - 60) {
                endGame();
            }

            if (left < -100) {
                b.remove();
                birds.splice(i,1);
            }
        });

        megaBoxes.forEach((m,i) => {
            let left = parseInt(m.style.left);
            left -= speed;
            m.style.left = left + "px";

            if (left < 140 && left > 90 && y < 170) {
                score += 5;
                scoreText.innerText = score;
                m.remove();
                megaBoxes.splice(i,1);
            }
        });

        bullets.forEach((b,i) => {
            let left = parseInt(b.style.left);
            left -= 9;
            b.style.left = left + "px";

            if (left < 140 && left > 90 && y < 170) {
                endGame();
            }

            if (left < -50) {
                b.remove();
                bullets.splice(i,1);
            }
        });
    }

    requestAnimationFrame(update);
}

// beigas
function endGame() {
    running = false;

    fetch("/save_score", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({score})
    });

    setTimeout(() => {
        showCasino();
    }, 1000);
}

// restart
function restartGame() {
    location.reload();
}

update();