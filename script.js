//если надо очистить консоль
//localStorage.clear();
//ОБЬЯВЛЕНИЯ ПЕРЕМЕННЫХ ДЛЯ КОДА
let score = localStorage.getItem("score")
	? Number(localStorage.getItem("score"))
	: 0;
let countclick = 1;
let energy = localStorage.getItem("energy")
	? Number(localStorage.getItem("energy"))
	: 500;
let fullEnergy = localStorage.getItem("fullEnergy")
	? Number(localStorage.getItem("fullEnergy"))
	: 500;
let percentEnergy;

let priceLvlEnergy = localStorage.getItem("priceLvlEnergy")
	? Number(localStorage.getItem("priceLvlEnergy"))
	: 500;

let lvlEnergy = localStorage.getItem("lvlEnergy")
	? Number(localStorage.getItem("lvlEnergy"))
	: 0;
let scoreInHour = localStorage.getItem("scoreInHour")
	? Number(localStorage.getItem("scoreInHour"))
	: 0;

let countRestart;
let today = new Date().toDateString();
let saveDataGame = localStorage.getItem("countRestartDate");
if (today !== saveDataGame) {
	countRestart = 0;
	localStorage.setItem("countRestart", countRestart);
	localStorage.setItem("countRestartDate", today);
} else {
	countRestart = Number(localStorage.getItem("countRestart"));
}

//ПЕРЕМЕННЫЕ ДЛЯ ОТОБРАЖЕНИЯ НА СТРАНИЦЕ HTML
let scoreHTML = document.getElementById("score");
let energyHTML = document.getElementById("energyText");
let energyFillHTML = document.getElementById("energyFill");

let priceLvlEnergyHTML = document.getElementById("priceLvlEnergy");
let lvlEnergyHTML = document.querySelectorAll(".lvlFullEnergy");

let countRestartHTML = document.querySelectorAll(".lvlRestart");

let scoreInHourHTML = document.getElementById("scoreInHour");

//СТРУКТУРА ДАННЫХ ДЛЯ КАРТОЧЕК ПАССИВНОГО ДОХОДА
let cardsData = {
	1: {
		img: "2.jpeg",
		title: "Дизель",
		level: 0,
		bonus: 150,
		price: 500,
		coef: 3.45,
	},
	2: {
		img: "3.webp",
		title: "Бензин",
		level: 0,
		bonus: 200,
		price: 700,
		coef: 4.75,
	},
	3: {
		img: "4.jpg",
		title: "Скорость",
		level: 0,
		bonus: 300,
		price: 1000,
		coef: 4.25,
	},
	4: {
		img: "5.jpg",
		title: "Двигатель",
		level: 0,
		bonus: 500,
		price: 1500,
		coef: 5.55,
	},
	5: {
		img: "ppnngg.png",
		title: "Машина",
		level: 0,
		bonus: 600,
		price: 2000,
		coef: 6.75,
	},
};

//ПРИ ЗАГРУЗКЕ ВОССТАНАВЛИВАЕМ УРОВНИ ПАССИВНОГО ДОХОДА
Object.keys(cardsData).forEach(id => {
	let savedCard = JSON.parse(localStorage.getItem(`card${id}`));
	if (savedCard) {
		cardsData[id] = savedCard;
	}
});
let cardsPassive = document.querySelectorAll(".cardPassive");
cardsPassive.forEach(card => {
	let id = card.getAttribute("data-id");
	let data = cardsData[id];
	if (data) {
		card.innerHTML = `
		  <div class="imageCard" 
			style="
			       background-image: url('${data.img}');
						 background-size: cover;" >
			<p>ур. <span id="lvl${id}" class="lvlPassive" >${data.level}</span></p>
				</div>
			  <p class="textCard" style="text-align: center;">${data.title}</p>`;
	}
});
let dialog = document.getElementById("screenPassive");
cardsPassive.forEach(card => {
	let touchstartX = 0;
	let touchEndX = 0;
	card.addEventListener("touchstart", event => {
		touchstartX = event.changedTouches[0].screenX;
	});
	card.addEventListener("touchend", event => {
		touchEndX = event.changedTouches[0].screenX;
		if (Math.abs(touchstartX - touchEndX) < 10) {
			let id = card.getAttribute("data-id");
			let data = cardsData[id];
			if (data) {
				dialog.innerHTML = `
			<form method="dialog">
				<button class="closeButton">x</button>
				<img class="imgDialog" src="${data.img}" />
				<h2>${data.title}</h2>
				<div class="textContainer">
					<p>ур.<span class="lvlPassive">${data.level}</span></p>
					<img src="7.png"></span>
					<p>+<span class="bonusPassive">${data.bonus}</span> в час</p>
				</div>
				<button class="pay payPassiveCard">
				<p>Купить за <span class="pricePassive">${data.price}</span></p></button>
			</form>`;
				if (score < data.price) {
					dialog.querySelector(".payPassiveCard").style.background = "grey";
				}
				dialog.showModal();
				dialog
					.querySelector(".payPassiveCard")
					.addEventListener("touchstart", event => {
						payPassiveCard(id, data);
					});
			}
		}
	});
});

function payPassiveCard(id, data) {
	if (score >= data.price) {
		score -= data.price;
		data.level++;
		scoreInHour += data.bonus;
		data.price = Math.round(data.price * data.coef);
		data.bonus = Math.round((data.bonus * data.coef) / 1.5);

		localStorage.setItem(`card${id}`, JSON.stringify(data));
		document.getElementById(`lvl${id}`).innerText = data.level;
		saveData();
		dataScreen();
	}
}

let obj = document.getElementById("objectPanel");
if (obj) {
	obj.addEventListener("touchstart", clicker);
}
let obj2 = document.getElementById("clickerFullEnergy");
let obj2Pay = document.getElementById("payLvlEnergy");
if (obj2) {
	obj2.addEventListener("touchstart", function () {
		if (score < priceLvlEnergy) {
			document.getElementById("payLvlEnergy").style.background = "grey";
		}
		document.getElementById("screenLvlEnergy").showModal();
	});
	obj2Pay.addEventListener("touchstart", payLvlEnergy);
}
let obj3 = document.getElementById("clickRestart");
let obj3Pay = document.getElementById("payLvlRestart");
if (obj3) {
	obj3.addEventListener("touchstart", function () {
		document.getElementById("screenRestart").showModal();
	});
	obj3Pay.addEventListener("touchstart", payRestart);
}

//ФУНКЦИЯ ПОКУПКИ ВОССТАНОВЛЕНИЯ ЭНЕРГИИ
function payRestart() {
	if (countRestart < 6) {
		energy = fullEnergy;
		countRestart++;
		saveData();
		dataScreen2();
	}
}
//ФУНКЦИЯ ПОКУПКИ УРОВНЯ ЗАПАСА ЭНЕРГИИ
function payLvlEnergy() {
	if (score >= priceLvlEnergy) {
		score -= priceLvlEnergy;
		lvlEnergy++;
		fullEnergy += 100;
		priceLvlEnergy = Math.round(priceLvlEnergy * 2.25);
		saveData();
		dataScreen2();
	}
}
//ФУНКЦИЯ НА СОХРАНЕНИЕ ДАННЫХ В ЛОКАЛЬНОЕ ХРАНИЛИЩЕ
function saveData() {
	localStorage.setItem("score", score);
	localStorage.setItem("scoreInHour", scoreInHour);
	localStorage.setItem("energy", energy);
	localStorage.setItem("fullEnergy", fullEnergy);

	localStorage.setItem("lvlEnergy", lvlEnergy);
	localStorage.setItem("priceLvlEnergy", priceLvlEnergy);

	localStorage.setItem("countRestart", countRestart);
	localStorage.setItem("countRestartDate", today);
}

//ФУНКЦИЯ НА ЗАГРУЗКУ ДАННЫХ НА HTML
function dataScreen() {
	scoreHTML.innerText = Math.round(score);
	energyHTML.innerText = energy;
	fillEnergy();
	scoreInHourHTML.innerText = Math.round(scoreInHour);
}
//ФУНКЦИЯ НА ЗАГРУЗКУ ДАННЫХ НА HTML СТРАНИЦЕ ДОХОД
function dataScreen2() {
	dataScreen();
	lvlEnergyHTML.forEach(element => {
		element.innerText = lvlEnergy;
	});

	priceLvlEnergyHTML.innerText = priceLvlEnergy;

	countRestartHTML.forEach(element => {
		element.innerText = countRestart;
	});
}

//ПРОВЕРКА СТРАНИЦЫ ЗАПУСКА
let path = window.location.pathname;
if (path.includes("index.html")) dataScreen();
else if (path.includes("earnings.html")) dataScreen2();

function clicker(event) {
	if (energy >= countclick) {
		score += countclick;
		energy -= countclick;
		scoreHTML.innerText = Math.round(score);
		energyHTML.innerText = energy;
		fillEnergy();

		let img = event.currentTarget.querySelector("#objectImg");
		img.style.transform = "scale(0.9)";
		setTimeout(() => {
			img.style.transform = "";
		}, 100);
		const plus = document.createElement("div");
		plus.className = "plus";
		plus.innerText = "+" + countclick;
		const panel = event.currentTarget;
		const rect = panel.getBoundingClientRect();
		plus.style.left = `${event.clientX - rect.left}px`;
		plus.style.top = `${event.clientX - rect.top}px`;
		panel.appendChild(plus);
		setTimeout(() => {
			plus.remove();
		}, 2200);
		saveData();
	}
}

//ФУНКЦИЯ OТРИСОВКИ КОНТЕЙНЕРА ЭНЕРГИИ
function fillEnergy() {
	percentEnergy = (energy * 100) / fullEnergy;
	energyFillHTML.style.width = percentEnergy + "%";
}

//функция восстановления энергии
function regenerateEnergy() {
	if (energy < fullEnergy) {
		energy++;
		energyHTML;
		energyHTML.innerText = energy;
		fillEnergy();
	}
	score += score / 3600;
	scoreHTML.innerText = Math.round(score);
	saveData();
}
setInterval(regenerateEnergy, 1000);

//ВЫЗЫВАЕТСЯ ПРИ ПОКИДАНИИ СТРАНИЦЫ
window.addEventListener("beforeunload", () => {
	localStorage.setItem("lastVisit", Date.now());
});

//ВЫЗЫВАЕТСЯ ПРИ ПОКИДАНИИ СТРАНИЦЫ
window.addEventListener("load", () => {
	let lastVisit = localStorage.getItem("lastVisit");
	let nowVisit = Date.now();
	if (nowVisit - lastVisit > 30 * 1000 && lastVisit) {
		let hoursAway = (nowVisit - parseInt(lastVisit)) / (1000 * 60 * 60);
		if (hoursAway > 3) hoursAway = 3;

		//Начисление монет
		let offlinescore = Math.round(hoursAway * scoreInHour);
		score += offlinescore;
		scoreHTML.innerText = score;
		//НАЧИСЛЕНИЕ ЭНЕРГИИ
		let offlineEnergy = Math.round(hoursAway * 3600);
		energy = Math.min(energy + offlineEnergy, fullEnergy);
		energyHTML.innerText = energy;

		alert(`За ваше отсутсвие заработано ${offlinescore} монет`);
	}
});
