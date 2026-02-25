const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '..', 'data');
const filePath = path.join(dataDir, 'activities.json');

const systemCatalog = {
    "Indoor": ["Visit a Local Museum", "Read at the Library", "Go to the Cinema", "Try an Indoor Climbing Gym", "Coffee Shop Journaling"],
    "Outdoor": ["Go for a Nature Hike", "Visit the Botanical Gardens", "Outdoor Photography Session", "Park Picnic", "Jogging at the Track"]
};

function loadActivities() {
    if (!fs.existsSync(filePath)) return [];
    try { 
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) { return []; }
}

function displayAllData() {
    const suggestionList = document.getElementById("activity-list");
    const savedList = document.getElementById("saved-activities-list");
    const typeHeader = document.getElementById("recommendation-type");

    // Clear existing content
    suggestionList.innerHTML = "";
    savedList.innerHTML = "";

    const currentType = localStorage.getItem("currentRecommendation") || "Indoor";

    // --- DYNAMIC BACKGROUND LOGIC ---
    if (currentType === "Indoor") {
        document.body.style.backgroundImage = "url('indoor.gif')";
    } else {
        document.body.style.backgroundImage = "url('outdoor.gif')";
    }
    // Ensure the GIF fills the screen correctly
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    // --------------------------------

    if (typeHeader) typeHeader.innerText = `Activity Type: ${currentType}`;

    // RENDER SYSTEM SUGGESTIONS
    systemCatalog[currentType].forEach(name => {
        const li = document.createElement("li");
        li.className = "mission-card";
        li.innerHTML = `
            <div>
                <span class="mission-name">${name}</span>
                <span class="tag">AI SUGGESTION</span>
            </div>
        `;
        suggestionList.appendChild(li);
    });

    // RENDER PLANNED ACTIVITIES
    const savedData = loadActivities();
    if (savedData.length === 0) {
        savedList.innerHTML = `<p style="opacity:0.4; font-size: 0.8rem; padding: 10px;">NO ACTIVE RECORDS FOUND</p>`;
    } else {
        savedData.forEach((activity) => {
            const li = document.createElement("li");
            li.className = "mission-card";
            li.innerHTML = `
                <div>
                    <span class="mission-name" style="color: #60a5fa;">${activity.name}</span>
                    <p style="font-size:0.65rem; color:rgba(255,255,255,0.4); margin-top:5px; font-family: monospace;">
                        TIMESTAMP: ${activity.date || 'PENDING'} | TYPE: ${activity.type.toUpperCase()}
                    </p>
                </div>
            `;
            savedList.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', displayAllData);