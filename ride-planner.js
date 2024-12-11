document.getElementById('rider').addEventListener('click', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const feet = document.getElementById('feet').value;
    const inches = document.getElementById('inches').value;
    const weight = document.getElementById('weight').value;
    const fitnessLevel = document.getElementById('fitnessLevel').value;
    
    const height = (parseInt(inches) / 12) + parseInt(feet);

    const riderData = {
        name: name,
        pic: pic,
        age: age,
        height: height,
        weight: weight,
        fitnessLevel: fitnessLevel
    };

    localStorage.setItem('riderData', JSON.stringify(riderData));
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
    <h3>Weather at Origin</h3>
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

        const originLat = result.routes[0].legs[0].start_location.lat();
        const originLng = result.routes[0].legs[0].start_location.lng();
        fetchWeather(originLat, originLng);
        displayEstimates();
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
  }
  
  let distance = 0;

  function computeTotalDistance(result) {
    
    const myroute = result.routes[0];
  
    for (let i = 0; i < myroute.legs.length; i++) {
      distance += myroute.legs[i].distance.value;
    }
  
    distance = distance * 0.000621371;
  }

  let duration = 0;

  function computeTotalTime(result) {
    const myroute = result.routes[0];
    const riderFitnessLevel = JSON.parse(localStorage.getItem('riderData'));
    console.log(riderFitnessLevel.fitnessLevel);
  
    for (let i = 0; i < myroute.legs.length; i++) {
      duration += myroute.legs[i].duration.value;
    }
  
    duration = duration / 60 / 60;
    
    if ((riderFitnessLevel.fitnessLevel) == "beginner"){
        duration = 1.2 * duration;

    }
    else if ((riderFitnessLevel.fitnessLevel) == "advanced"){
        duration = .9 * duration;

    }
    else if ((riderFitnessLevel.fitnessLevel) == "elite"){
        duration = .5 * duration;

    }
  }
  
  function displayEstimates() {
    const estimatesElement = document.getElementById("estimates");
    estimatesElement.innerHTML = `
      <h3>Estimated Totals</h3>
      <p>Duration: ${duration}</p>
      <p>Distance: ${distance}</p>
    `;
  }
  
