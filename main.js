let pool = Array.from({ length: 20 }, (_, i) => i + 1);


let history = [];
let currentName = null;
let timer = null;

const nameBox = document.getElementById("name");
const flash = document.getElementById("flash");

const click = document.getElementById("click");
const roll = document.getElementById("roll");
const win = document.getElementById("win");

function play(sound){
  sound.currentTime = 0;
  sound.play();
}

document.getElementById("start").onclick = () => {
  if (timer || pool.length === 0) return;
  play(click);
  play(roll);

  timer = setInterval(() => {
    currentName = pool[Math.floor(Math.random() * pool.length)];
    nameBox.innerText = currentName;
  }, 100);
};

document.getElementById("stop").onclick = () => {
  if (!timer) return;
  clearInterval(timer);
  timer = null;

  roll.pause();
  play(win);

  // 閃光動畫
  flash.style.opacity = 1;
  setTimeout(() => flash.style.opacity = 0, 200);

  if (navigator.vibrate) navigator.vibrate(200);
};

document.getElementById("keep").onclick = () => {
  if (!currentName) return;
  play(click);

  pool = pool.filter(n => n !== currentName);
  history.push({ name: currentName, time: new Date().toLocaleString() });
  nameBox.innerText = "已保留";
  currentName = null;
};

document.getElementById("redo").onclick = () => {
  if (!currentName) return;
  play(click);
  nameBox.innerText = "重新抽";
  currentName = null;
};

document.getElementById("export").onclick = () => {
  if (history.length === 0) return;

  let csv = "姓名,時間\n";
  history.forEach(h => {
    csv += `${h.name},${h.time}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "抽籤紀錄.csv";
  a.click();
};
play(click);
play(roll);
roll.pause();
play(win);
window.onclick = () => {
  document.getElementById("click").play();
};
