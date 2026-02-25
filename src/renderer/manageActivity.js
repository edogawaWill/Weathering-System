const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '..', 'data');
const filePath = path.join(dataDir, 'activities.json');

function loadActivities() {
    if (!fs.existsSync(filePath)) return [];
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } 
    catch (e) { return []; }
}

function saveActivities(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function displayManageList() {
    const list = document.getElementById("manage-list");
    if (!list) return;
    list.innerHTML = "";
    const saved = loadActivities();

    if (saved.length === 0) {
        list.innerHTML = `<p style="text-align:center; opacity:0.5; padding:20px;">No records found in dossier.</p>`;
        return;
    }

    saved.forEach((act, index) => {
        const li = document.createElement('li');
        li.className = "saved-item";
        li.innerHTML = `
            <div>
                <div class="activity-name">${act.name}</div>
                <div class="activity-meta">PROTOCOL: ${act.type.toUpperCase()} | DATE: ${act.date || "PENDING"}</div>
            </div>
            <div class="btn-group">
                <button class="edit-btn" onclick="prepareEdit(${index})">EDIT</button>
                <button class="delete-btn" onclick="deleteActivity(${index})">REMOVE</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function addActivity() {
    const nameElem = document.getElementById("activity-name");
    const dateElem = document.getElementById("activity-date");
    const addBtn = document.getElementById("add-btn");
    
    const name = nameElem.value.trim();
    const date = dateElem.value;
    const type = document.getElementById("activity-type").value;
    const editIndex = parseInt(document.getElementById("edit-index").value);

    // --- SILENT VALIDATION (Fixes the typing lockout) ---
    if (!name || !date) {
        const originalText = addBtn.innerText;
        addBtn.innerText = "FORGOT SOMETHING?";
        addBtn.style.background = "#555"; // Neutral warning color
        
        setTimeout(() => {
            addBtn.innerText = originalText;
            addBtn.style.background = (editIndex > -1) ? "#2563eb" : "#b91c1c";
        }, 2000);
        return; // Exit without freezing via alert()
    }

    let activities = loadActivities();

    if (editIndex > -1) {
        activities[editIndex] = { name, date, type };
        addBtn.innerText = "ADD TO SCHEDULE";
        addBtn.style.background = "#b91c1c";
        document.getElementById("edit-index").value = "-1";
    } else {
        activities.push({ name, date, type });
    }

    saveActivities(activities);
    
    nameElem.value = "";
    dateElem.value = "";
    displayManageList();
}

window.prepareEdit = function(index) {
    const activities = loadActivities();
    const item = activities[index];

    document.getElementById("activity-name").value = item.name;
    document.getElementById("activity-date").value = item.date;
    document.getElementById("activity-type").value = item.type;
    document.getElementById("edit-index").value = index;

    const btn = document.getElementById("add-btn");
    btn.innerText = "CONFIRM CHANGES";
    btn.style.background = "#2563eb"; 
    
    document.getElementById("activity-name").focus();
}

window.deleteActivity = function(index) {
    const activities = loadActivities();
    activities.splice(index, 1);
    saveActivities(activities);
    displayManageList();
}

window.onload = displayManageList;