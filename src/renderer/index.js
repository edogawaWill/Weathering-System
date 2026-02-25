const { ipcRenderer } = require("electron");

let recommendedType = ""; 
let typewriterTimeout; 

const weatherGifs = {
    rain: "raining2.gif",
    drizzle: "raining2.gif",
    thunderstorm: "storm.gif",
    clear: "sunny.gif",
    clouds: "cloudy.gif",
    snow: "snowy.gif",
    mist: "misty.gif",
    default: "scenery.gif"
};

const weatherIntelligence = {
    rain: {
        report: "Satellite imagery confirms high-density cloud accumulation. Expect reduced visibility and slick surfaces.",
        protocol: "PROTOCOL: Deploy waterproof gear. Avoid low-lying sectors."
    },
    clear: {
        report: "Atmospheric clarity is at 100%. Optimal conditions for long-range surveillance and field operations.",
        protocol: "PROTOCOL: High UV radiation detected. Protective eyewear mandatory."
    },
    clouds: {
        report: "Overcast conditions providing natural cover. Light levels stable, monitoring for pressure shifts.",
        protocol: "PROTOCOL: Proceed with standard operation. Visibility is moderate."
    },
    thunderstorm: {
        report: "Electrical discharge detected. Severe instability. Grounded operations strongly advised.",
        protocol: "PROTOCOL: SEEK SHELTER IMMEDIATELY. Disconnect electronics."
    },
    default: {
        report: "Standard atmospheric conditions. No significant anomalies detected in the local troposphere.",
        protocol: "PROTOCOL: Maintain standard alertness. Monitor wind velocity."
    }
};

function buttonClicked() {
    const cityInput = document.getElementById("city-input");
    const city = cityInput.value.trim();

    if (!city) {
        cityInput.style.borderColor = "#b91c1c"; 
        cityInput.placeholder = "Enter a City!...";
        setTimeout(() => {
            cityInput.style.borderColor = "rgba(255,255,255,0.1)";
            cityInput.placeholder = "Enter City Name...";
        }, 2000);
        return; 
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9fd7a449d055dba26a982a3220f32aa2`)
        .then(res => {
            if (!res.ok) throw new Error("City not found");
            return res.json();
        })
        .then(data => {
            const weatherMain = data.weather[0].main.toLowerCase();
            const temp = (data.main.temp - 273.15).toFixed(1);
            
            const selectedGif = weatherGifs[weatherMain] || weatherGifs['default'];
            document.body.style.backgroundImage = `url('${selectedGif}')`;

            document.getElementById("city-name").innerText = `CITY: ${data.name}, ${data.sys.country}`;
            document.getElementById("temperature").innerText = temp;
            document.getElementById("condition").innerText = `Condition: ${data.weather[0].description}`;

            document.getElementById("wind-speed").innerText = data.wind.speed;
            document.getElementById("humidity").innerText = data.main.humidity;
            document.getElementById("pressure").innerText = data.main.pressure;

            // --- UNLOCK RECOMMENDATIONS BUTTON ---
            const recBtn = document.getElementById("view-recommendations-btn");
            recBtn.disabled = false;

            const isRain = weatherMain.includes("rain") || weatherMain.includes("drizzle") || weatherMain.includes("thunderstorm");
            recommendedType = isRain ? "Indoor" : "Outdoor";
            localStorage.setItem("currentRecommendation", recommendedType);

            let intel = weatherIntelligence[weatherMain] || weatherIntelligence['default'];
            if (isRain) intel = weatherIntelligence['rain'];

            const reportElement = document.getElementById("surveillance-report");
            const fullReport = `[SCAN COMPLETE]\nSTATUS: ${weatherMain.toUpperCase()}\n\n${intel.report}\n\n${intel.protocol}\n\nRECOMMENDED: ${recommendedType.toUpperCase()} ACTIVITIES`;
            
            clearTimeout(typewriterTimeout);
            reportElement.innerText = "";
            typeWriter(fullReport, reportElement);
        })
        .catch(err => {
            console.error(err);
            cityInput.style.borderColor = "#b91c1c";
            cityInput.value = "";
            cityInput.placeholder = "SECTOR NOT FOUND";
            
            // Keep button locked if search fails
            document.getElementById("view-recommendations-btn").disabled = true;
        });
}

function typeWriter(text, element, i = 0) {
    if (i < text.length) {
        element.innerText += text.charAt(i);
        typewriterTimeout = setTimeout(() => typeWriter(text, element, i + 1), 15);
    }
}