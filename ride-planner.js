document.getElementById('rider').addEventListener('click', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const pic = document.getElementById('pic').value;
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
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
  }
  
  function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];
  
    if (!myroute) {
      return;
    }
  
    for (let i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
  
    total = total * 0.000621371;
    document.getElementById("total").innerHTML = total + " mi";
  }

  function computeTotalTime(result) {
    let total = 0;
    const myroute = result.routes[0];
    const riderFitnessLevel = JSON.parse(localStorage.getItem('riderData'));
    console.log(riderFitnessLevel.fitnessLevel);
    if (!myroute) {
      return;
    }
  
    for (let i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].duration.value;
    }
  
    total = total / 60 / 60;
    if ((riderFitnessLevel.fitnessLevel) == "beginner"){
        total = 1.2 * total;
        document.getElementById("duration").innerHTML = total + " hours";

    }
    else if ((riderFitnessLevel.fitnessLevel) == "advanced"){
        total = .9 * total;
        document.getElementById("duration").innerHTML = total + " hours";

    }
    else if ((riderFitnessLevel.fitnessLevel) == "elite"){
        total = .5 * total;
        document.getElementById("duration").innerHTML = total + " hours";

    }
    else {
        document.getElementById("duration").innerHTML = total + " hours";

    }
  }
  

  
