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

var humidity = "loading";
var light = "loading";
var lastUpdate = "loading";
var temperature = "loading";

var lightVisible = 1;
let humidVisible = 1;
let tempVisible = 1;

let yLight = [];
var yHumid = [];
let yTemp = [];

let glabel = [];
var i = 10;
var currentdata = 1;

let data1 = [
  {
    label: "light",
    data: yLight,
    borderColor: "gold",
    fill: false,
    hidden: !lightVisible,
  },
  {
    label: "Humidity",
    data: yHumid,
    borderColor: "green",
    fill: false,
    hidden: !humidVisible,
  },
];

let data2 = [
  {
    label: "Temperature",
    data: yTemp,
    borderColor: "red",
    fill: false,
    hidden: tempVisible,
  },
  {
    label: "",
    borderColor: "white",
  },
];
let graph = new Chart("chart", {
  type: "line",
  data: {
    labels: glabel,
    datasets: [
      {
        label: "light",
        data: yLight,
        borderColor: "gold",
        fill: false,
        hidden: !lightVisible,
      },
      {
        label: "Humidity",
        data: yHumid,
        borderColor: "green",
        fill: false,
        hidden: !humidVisible,
      },
      {
        label: "Temperature",
        data: yTemp,
        borderColor: "red",
        fill: false,
        hidden: !tempVisible,
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
          //gridLines:false,
          display: true,
          ticks: {
            //min: 0, // minimum will be 0, unless there is a lower value.
            // OR //
            beginAtZero: true, // minimum value will be 0.
            suggestedMax: 50,
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
  //graph.data.datasets = data1;
  if (currentdata == 1) {
    if (lightVisible) {
      lightVisible = 0;
      // graph.data.datasets.shift();
    } else {
      lightVisible = 1;
      // graph.data.datasets.pop();
      // graph.data.datasets.push(lightData);
      // if(humidVisible) graph.data.datasets.push(humidData);
    }
    graph.data.datasets[0].hidden = !lightVisible;
    graph.update();
  }
}
function humidityShow() {
  if (currentdata == 1) {
    if (humidVisible) {
      humidVisible = 0;
      // graph.data.datasets.pop();
    } else {
      humidVisible = 1;
      // graph.data.datasets.pop();
      // if(lightVisible) graph.data.datasets.push(lightData);
      // graph.data.datasets.push(humidData);
    }
    graph.data.datasets[1].hidden = !humidVisible;
    graph.update();
  }
}
function temperatureShow() {
  // if(currentdata==2) {
  //   graph.data.datasets = data1;
  //   currentdata=1;
  // }
  // else {graph.data.datasets = data2;currentdata=2;}
  if (tempVisible) tempVisible = 0;
  else tempVisible = 1;
  graph.data.datasets[2].hidden = !tempVisible;
  graph.update();
}
function plantInfo() {
  if (light > 25 && humidity >= 30 && temperature <= 38)
    return "Your plant is healthy";
  else {
    return "Your plant needs water";
  }
}
function plantDescription() {
  if (light > 25 && humidity >= 30 && temperature <= 38)
    return "Your plant is super super healthy";
  else {
    return "Oh, Sathana... Master Chadchart... Somebody help me... Water me please, anybody... I've had enough of this environment... The night blocks all sight... Oh, somebody, please...";
  }
}
function plantPic() {
  if (light > 25 && humidity >= 30 && temperature <= 38)
    return "./Images/้healthy.png";
  else {
    return "./Images/sadplant.jpg";
  }
}
function update() {
  firebaseRef = firebase.database().ref("/humidity");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    humidity = dataSnapshot.val().toFixed(2);
    yHumid.push(humidity);
  });

  firebaseRef = firebase.database().ref("/light");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    light = dataSnapshot.val().toFixed(2);

    yLight.push(light);
  });

  firebaseRef = firebase.database().ref("/temperature");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    temperature = dataSnapshot.val().toFixed(2);
    yTemp.push(temperature);
  });

  firebaseRef = firebase.database().ref("/lastUpdate");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    lastUpdate = dataSnapshot.val();
    if (i % 2 == 0) glabel.push(lastUpdate);
    else glabel.push("");
    i--;
  });

  if (i < 0) {
    glabel.shift();
    yLight.shift();
    yHumid.shift();
    yTemp.shift();
  }
  document.querySelector("#humidity").innerHTML = humidity + " %";
  document.querySelector("#light").innerHTML = light + " %";
  document.querySelector("#temperature").innerHTML = temperature + " °C";
  document.querySelector("#time").innerHTML = lastUpdate;
  document.getElementById("plantInfo").innerHTML = plantInfo();
  document.getElementById("plantStatus").innerHTML = plantDescription();
  document.getElementById("status-pic").src = plantPic();
  graph.update();
}

update();
var interval = setInterval(update, 5000);
