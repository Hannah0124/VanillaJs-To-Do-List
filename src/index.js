const form = document.querySelector('.js-form');
const input = form.querySelector('input');
const pending = document.querySelector('.js-pending');
const finished = document.querySelector('.js-finished');

const PENDING_LS = 'PENDING';
const FINISHED_LS = 'FINISHED';

let pendingArr = [];
let finishedArr = [];

function savePending() {
	localStorage.setItem(PENDING_LS, JSON.stringify(pendingArr));
}

function saveFinished() {
	localStorage.setItem(FINISHED_LS, JSON.stringify(finishedArr));
}

function generateLi(task, target) {
	const li = document.createElement('li');
	const delBtn = document.createElement('button');
	// Create span to add "text"
	const span = document.createElement('span');

	// delBtn.innerHTML = "❌";
	delBtn.innerHTML = '<i class="fa fa-trash"></i>';
	span.innerText = task;
	li.appendChild(span);
	li.appendChild(delBtn);

	if (target === 'pending') {
		delBtn.addEventListener('click', deletePending);
	} else {
		delBtn.addEventListener('click', deleteFinished);
	}
	return li;
}

// Display pending list on UI & LS
function paintPending(text, newId) {
	const doneLi = generateLi(text, 'pending');
	const doneBtn = document.createElement('button');

	// doneBtn.innerHTML = "✅";
	doneBtn.innerHTML = `<i class="fa fa-check-circle"></i>`;
	doneBtn.className = 'doneBtn';
	doneBtn.addEventListener('click', addToFinished);
	doneLi.appendChild(doneBtn);
	pending.appendChild(doneLi);
	doneLi.id = newId;

	// Create a pending obejct to store in the array
	const pendingObj = {
		id: newId,
		text
	};

	// Save to pending LS
	pendingArr.push(pendingObj);
	savePending();
}

// Delete pending from UI & LS
function deletePending(event) {
	const btn = event.target;
	const li = btn.parentNode.parentNode; // => <li id="1575865242781">…</li>

	// Remove from Pending UI
	pending.removeChild(li);

	const newPending = pendingArr.filter(function(p) {
		return p.id !== li.id;
	});

	// Savae to Pending LS
	pendingArr = newPending;
	savePending();
}

// Relocate a list from "Pending" to "Finished"
function addToFinished(event) {
	const btn = event.target;
	const li = btn.parentNode.parentNode;
	const text = li.firstChild.innerText;

	// Remove Pending from UI & LS
	deletePending(event);

	// Add to Finished UI & LS
	paintFinished(text, li.id);
}

// Dispaly finished items on UI & LS
function paintFinished(text, id) {
	const backLi = generateLi(text, 'finished');
	const backBtn = document.createElement('button');
	// backBtn.innerHTML = "⏪";
	backBtn.innerHTML = `<i class="fa fa-chevron-circle-left"></i>`;
	backBtn.className = 'backBtn';
	backBtn.addEventListener('click', backToPending);

	backLi.id = id;
	backLi.className = 'line-through';
	backLi.appendChild(backBtn);
	finished.appendChild(backLi);

	const finishedObj = {
		id,
		text
	};

	// Update finished items to LS
	finishedArr.push(finishedObj);
	saveFinished();
}

// Delete finished list from UI & LS
function deleteFinished(event) {
	const btn = event.target;
	const li = btn.parentNode.parentNode; // => <li id="1575865242781">…</li>
	// console.log(li);

	// Remove from UI
	finished.removeChild(li);

	const newFinished = finishedArr.filter(function(obj) {
		return obj.id !== li.id;
	});

	// Remove from LS
	finishedArr = newFinished;
	// console.log("newFinished " + newFinished);
	saveFinished();
	// console.log(newPending);
}

// Relocate finished items to pending
function backToPending(event) {
	const btn = event.target;
	const li = btn.parentNode.parentNode;
	const text = li.firstChild.innerText;

	// Remove Finished items from UI & LS
	deleteFinished(event);

	// Add to Pending UI & LS
	paintPending(text, li.id);
}

function handleSubmit(event) {
	event.preventDefault();
	const currentValue = input.value;
	// console.log(currentValue);

	const generateId = new Date().getTime();
	// Paint pending list on UI & LS
	paintPending(currentValue, generateId.toString());
	input.value = '';
}

function loadData() {
	const loadedPending = localStorage.getItem(PENDING_LS);
	const loadedFinished = localStorage.getItem(FINISHED_LS);

	if (loadedPending !== null) {
		const parsedPending = JSON.parse(loadedPending);
		parsedPending.forEach(function(pendingObj) {
			paintPending(pendingObj.text, pendingObj.id);
		});
	}

	if (loadedFinished !== null) {
		const parsedFinished = JSON.parse(loadedFinished);
		parsedFinished.forEach(function(finishedObj) {
			paintFinished(finishedObj.text, finishedObj.id);
		});
	}
}

function init() {
	loadData();
	// Make sure to add event listener on "form"
	form.addEventListener('submit', handleSubmit);
}

init();
