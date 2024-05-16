const firebaseConfig = {
  apiKey: "AIzaSyDCDgDxZumV0o2z90bsIq3RNQGF1k7zZ9A",
  authDomain: "embedded-summ.firebaseapp.com",
  databaseURL:
    "https://embedded-summ-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "embedded-summ",
  storageBucket: "embedded-summ.appspot.com",
  messagingSenderId: "733110752658",
  appId: "1:733110752658:web:7c746315f564c852309d4b",
  measurementId: "G-3TG2WPPJGG",
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var firebaseRef = firebase.database().ref("/humidity");

var humidity = 0;
var light = 0;
var lastUpdate = 0;
var temperature = 0;

var lightVisible = 0;
let humidVisible = 0;
let tempVisible = 0;

let yLight = Array(25).fill(null);
let yHumid = Array(25).fill(null);
let yTemp = Array(25).fill(null);

let graph = new Chart("chart", {
  type: "line",
  data: {
    labels: Array(25).fill(""),
    datasets: [
      {
        label: "light",
        data: yLight,
        borderColor: "gold",
        fill: false,
        hidden: lightVisible,
      },
      {
        label: "Humidity",
        data: yHumid,
        borderColor: "green",
        fill: false,
        hidden: humidVisible,
      },
      {
        label: "Temperature",
        data: yTemp,
        borderColor: "red",
        fill: false,
        hidden: tempVisible,
      },
    ],
  },
  options: {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            suggestedMin: 0, // minimum will be 0, unless there is a lower value.
            // OR //
            beginAtZero: true, // minimum value will be 0.
            max: 100,
          },
        },
      ],
    },
    elements: {
      point: {
        radius: 1,
      },
    },
  },
});

function lightShow() {
  if (lightVisible) lightVisible = 0;
  else lightVisible = 1;
  graph.data.datasets[0].hidden = lightVisible;
  graph.update();
}
function humidityShow() {
  if (humidVisible) humidVisible = 0;
  else humidVisible = 1;
  graph.data.datasets[1].hidden = humidVisible;
  graph.update();
}
function temperatureShow() {
  if (tempVisible) tempVisible = 0;
  else tempVisible = 1;
  graph.data.datasets[2].hidden = tempVisible;
  graph.update();
}

function update() {
  firebaseRef = firebase.database().ref("/humidity");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    humidity = dataSnapshot.val().toFixed(2);
    document.querySelector("#humidity").innerHTML = humidity + " %";
  });

  firebaseRef = firebase.database().ref("/light");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    light = dataSnapshot.val().toFixed(2);
    document.querySelector("#light").innerHTML = light + " %";
  });

  firebaseRef = firebase.database().ref("/temperature");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    temperature = dataSnapshot.val().toFixed(2);
    document.querySelector("#temperature").innerHTML = temperature + " °C";
  });

  firebaseRef = firebase.database().ref("/lastUpdate");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    lastUpdate = dataSnapshot.val();
    document.querySelector("#time").innerHTML = lastUpdate;
  });

  yLight.shift();
  yHumid.shift();
  yTemp.shift();
  yLight.push(light);
  yHumid.push(humidity);
  yTemp.push(temperature);
  graph.update();
}

update();
var interval = setInterval(update, 11500);
