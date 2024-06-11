import { Game } from "./game.js";
let initGame;
let serverLocal ="http://localhost:3306/player"
let serverOnline = "https://space-traveller-back.vercel.app/player"
let server =serverOnline
function animate(game) {
  game.update();
  if (game.isGameOver) {
    document.querySelector(".gameover").style.display = "flex";

    return;
  }
  requestAnimationFrame(() => animate(game));
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
document.querySelector(".menuBtn").addEventListener("click", (e) => {
    document.querySelector('.gameover').style.display="none"
    document.querySelector('.classement').style.display="none"
  document.querySelector(".menu").style.display = "flex";
});
function startGame() {
    document.querySelector('.container__score').style.display="flex"
  let tmp = new Game(ctx);

  tmp.draw(ctx);
  animate(tmp);
  return tmp;
}

function createPlayerRow(player, score) {
  let el = document.createElement("div");
  el.classList.add("ClassementRow");
  let pseudoEl = document.createElement("p");
  pseudoEl.innerHTML = player;
  pseudoEl.classList.add('name')
  let scoreEl = document.createElement("p");
  scoreEl.innerHTML = score;
  el.appendChild(pseudoEl);
  el.appendChild(scoreEl);

  document.querySelector(".classement").appendChild(el);
  return;
}
document
  .querySelector(".check__classement")
  .addEventListener("click", async () => {
    document.querySelector(".classement").style.display = "flex";
    let data = await fetchClassement();
    document.querySelector(".classement").innerHTML=""
    let p  = document.createElement('p')
    p.innerHTML=`Classement de ${data.scores.length} joueurs :`
    p.classList.add('title')
    document.querySelector('.classement').appendChild(p)
    data.scores.forEach((element) => {
      createPlayerRow(element.pseudo, element.score);
    });
  });
document.querySelector(".start__game").addEventListener("click", () => {
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".classement").style.display = "none";
  initGame = startGame();
});
async function fetchClassement() {
  let tmp = await fetch(server+"/classement",{
    Accept: "*/*",
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // Ajoutez d'autres headers personnalisés ici si nécessaire
    }
}
  ).then((res) =>
    res.json()
  );
  return tmp;
}
function verifyInput() {
  if (document.querySelector(".input__pseudo").value.length > 2) {
    document.querySelector(".errInput").innerHTML = "";
    return true;
  } else {
    document.querySelector(".errInput").innerHTML =
      "Il faut ajouter un pseudo d'au moins 3 lettres !";
    return false;
  }
}
document.querySelector(".save").addEventListener("click", () => {
  if (verifyInput()) {
    let pseudo = document.querySelector(".input__pseudo").value;

    addScoreToBdd(pseudo, initGame.score);
    document.querySelector('.classement').style.display="none"

    document.querySelector('.gameover').style.display="none"
    document.querySelector('.menu').style.display="flex"
  }
});
async function addScoreToBdd(pseudo, score) {
  let tmp = {
    pseudo: pseudo,
    score: score,
  };
  fetch(server+"/pushOne", {
    method: "POST",
    headers:{
      "Accept":"*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tmp),
  });
}
