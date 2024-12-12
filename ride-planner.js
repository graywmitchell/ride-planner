const profileSetup = document.getElementById("profileSetup");
const scrim = document.getElementById("scrim");
const errorMessage = document.getElementById("errorMessage");

const userName = document.getElementById('name');
const age = document.getElementById('age');
const feet = document.getElementById('feet');
const inches = document.getElementById('inches');
const weight = document.getElementById('weight');
const fitnessLevel = document.getElementById('fitnessLevel'); 

const formInputs = [userName, age, feet, inches, weight, fitnessLevel];

let generated = false;
let riderData = {};

let duration = 0;
let distance = 0;

function requiredFields(formInputs) {
  for (let i = 0; i < formInputs.length; i++) {
    if (!formInputs[i].value) {
      formInputs[i].classList.add("invalid");
    }
    else {
      formInputs[i].classList.remove("invalid");
    }
    }
}

window.addEventListener("load", function () {
  if (localStorage.getItem('riderData')) {
    const profile = document.getElementById("profile");
    
    riderData = {
      name: JSON.parse(localStorage.getItem('riderData')).name,
      age: JSON.parse(localStorage.getItem('riderData')).age,
      feet: JSON.parse(localStorage.getItem('riderData')).feet,
      inches: JSON.parse(localStorage.getItem('riderData')).inches,
      weight: JSON.parse(localStorage.getItem('riderData')).weight,
      fitnessLevel: JSON.parse(localStorage.getItem('riderData')).fitnessLevel
    };
    
    profile.innerHTML = `
      <h3>My Profile</h3>
      <p>Name: ${riderData.name}</p>
      <p>Age: ${riderData.age}</p>
      <p>Height: ${riderData.feet} feet ${riderData.inches} inches</p>
      <p>Weight: ${riderData.weight}</p>
      <p>Fitness Level: ${riderData.fitnessLevel}</p>
      <button id="edit">Edit Details</button>
    `;
    document.getElementById('edit').addEventListener('click', function(e) {
      e.preventDefault();
      profileSetup.classList.toggle("hidden");
      scrim.classList.toggle("hidden");
      userName.value = riderData.name;
      age.value = riderData.age;
      feet.value = riderData.feet;
      inches.value = riderData.inches;
      weight.value = riderData.weight;
      fitnessLevel.value = riderData.fitnessLevel;
      
    });

  }
  else {
    profileSetup.classList.toggle("hidden");
    scrim.classList.toggle("hidden");
  }
});

  
document.getElementById('rider').addEventListener('click', function(e) {
  e.preventDefault();
    
  if (!profileSetup.checkValidity()) {
    e.preventDefault();
    errorMessage.classList.remove("hidden");
    requiredFields(formInputs);
  }

  else {
    requiredFields(formInputs);
    errorMessage.classList.add("hidden");
    

    riderData = {
      name: userName.value,
      age: parseInt(age.value),
      feet: parseInt(feet.value),
      inches: parseInt(inches.value),
      weight: parseInt(weight.value),
      fitnessLevel: fitnessLevel.value
    };

    if (generated) {calcAdjustment(duration, riderData.feet, riderData.inches, riderData.weight, riderData.age, riderData.fitnessLevel)};

    localStorage.setItem('riderData', JSON.stringify(riderData));

    const profile = document.getElementById("profile");
    profile.innerHTML = `
      <h3>My Profile</h3>
      <p>Name: ${riderData.name}</p>
      <p>Age: ${riderData.age}</p>
      <p>Height: ${JSON.parse(localStorage.getItem('riderData')).feet} feet ${JSON.parse(localStorage.getItem('riderData')).inches} inches</p>
      <p>Weight: ${riderData.weight}</p>
      <p>Fitness Level: ${riderData.fitnessLevel}</p>
      <button id="edit">Edit Details</button>
    `;

    
    profileSetup.classList.toggle("hidden");
    scrim.classList.toggle("hidden");

    document.getElementById('edit').addEventListener('click', function(e) {
      e.preventDefault();
      profileSetup.classList.toggle("hidden");
      scrim.classList.toggle("hidden");
    });

  }
    
});

const WEATHER_API_KEY = "a008ca2308f1daa4dcacddfcfcc35fdb";

function fetchWeather(lat, lng) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`;

  fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Weather API error: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Failed to fetch weather data:", error);
    });
}

function displayWeather(data) {
  const weatherElement = document.getElementById("weather");
  weatherElement.innerHTML = `
    <h3>Weather for Ride</h3>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Condition: ${data.weather[0].description}</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

document.getElementById('route').addEventListener('click', function(e) {
  e.preventDefault();

  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  initMap(start, end);

});


function initMap(start, end) {
  const map = new google.maps.Map(document.getElementById("map"));
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map,
  });
  
  
  displayRoute(
    start,
    end,
    directionsService,
    directionsRenderer,
  );
}
  
function displayRoute(origin, destination, service, display) {
    service
      .route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.BICYCLING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      })
      .then((result) => {
        display.setDirections(result);
        computeTotalDistance(result);
        computeTotalTime(result);
        generated = true;
        calcAdjustment(duration, riderData.feet, riderData.inches, riderData.weight, riderData.age, riderData.fitnessLevel);

        const originLat = result.routes[0].legs[0].start_location.lat();
        const originLng = result.routes[0].legs[0].start_location.lng();
        fetchWeather(originLat, originLng);
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
}


function computeTotalDistance(result) {
  
  const myroute = result.routes[0];

  for (let i = 0; i < myroute.legs.length; i++) {
    distance += myroute.legs[i].distance.value;
  }

  distance = distance * 0.000621371;
}



function computeTotalTime(result) {
  const myroute = result.routes[0];
  
  for (let i = 0; i < myroute.legs.length; i++) {
    duration += myroute.legs[i].duration.value;
  }

  duration = duration / 60 / 60;
}

function calcAdjustment(duration, feetVal, inchesVal, userWeight, ageVal, fitnessVal) {
  console.log(duration, feetVal, inchesVal, userWeight, ageVal, fitnessVal)
  
  const baselineHeight = 68;
  const baselineWeight = 150;
  const baselineAge = 40;

  const heightWeight = 0.3;
  const weightWeight = 0.4; 
  const ageWeight = 0.3;  

  
  const userHeight = parseInt(inchesVal) + (parseInt(feetVal)*12);

  const heightDeviation = (userHeight - baselineHeight) / baselineHeight;
  const weightDeviation = (userWeight - baselineWeight) / baselineWeight;
  const ageDeviation = (ageVal - baselineAge) / baselineAge;

  let heightFactor = 1 - Math.abs(heightDeviation) * heightWeight;
  let weightFactor = 1 - Math.abs(weightDeviation) * weightWeight;
  let ageFactor = 1 - Math.abs(ageDeviation) * ageWeight;

  heightFactor = Math.max(heightFactor, 0.5);
  weightFactor = Math.max(weightFactor, 0.5);
  ageFactor = Math.max(ageFactor, 0.5);

  let fitnessFactor = (heightFactor + weightFactor + ageFactor) / 3;

  const fitnessLevelMultipliers = {
    beginner: 0.8, 
    average: 1.0,   
    advanced: 1.2, 
    elite: 1.5,     
  };

  const fitnessMultiplier = fitnessLevelMultipliers[fitnessVal.toLowerCase()] || 1.0;
  fitnessFactor = fitnessFactor * fitnessMultiplier;

  let adjustedDuration = duration / fitnessFactor;

  const estimatesElement = document.getElementById("estimates");
  estimatesElement.innerHTML = `
    <h3>Estimated Totals</h3>
    <p>Distance: ${distance.toFixed(2)} miles</p>
    <p>Duration: ${adjustedDuration.toFixed(2)} hours based on your fitness multiplier of ${fitnessFactor.toFixed(2)}</p>
  `;
}
