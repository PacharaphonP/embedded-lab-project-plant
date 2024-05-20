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

var lightVisible = 1;
let humidVisible = 1;
let tempVisible = 1;

let yLight = [];
var yHumid = [];
let yTemp = [];

let glabel = [];
var i = 25;
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
            min: 0, // minimum will be 0, unless there is a lower value.
            // OR //
            beginAtZero: true, // minimum value will be 0.
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
function plantDescription() {
  if (light > 25 && humidity >= 30 && temperature <= 38)
    return "Your plant is super super healthy";
  else {
    return "your plant is not fine(T-T)";
  }
}
function plantPic() {
  if (light > 25 && humidity >= 30 && temperature <= 38)
    return "./Images/้healthy.png";
  else {
    return "./Images/sad.jpg";
  }
}
function update() {
  firebaseRef = firebase.database().ref("/humidity");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    humidity = dataSnapshot.val().toFixed(2);
  });

  firebaseRef = firebase.database().ref("/light");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    light = dataSnapshot.val().toFixed(2);
  });

  firebaseRef = firebase.database().ref("/temperature");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    temperature = dataSnapshot.val().toFixed(2);
  });

  firebaseRef = firebase.database().ref("/lastUpdate");
  firebaseRef.once("value").then(function (dataSnapshot) {
    console.log(dataSnapshot.val());
    lastUpdate = dataSnapshot.val();
  });
  if (i == 0) {
    yLight.shift();
    yHumid.shift();
    yTemp.shift();
  } else {
    glabel.push("");
    i--;
  }
  console.log(humidity);
  yLight.push(light);
  yHumid.push(humidity);
  yTemp.push(temperature);

  document.querySelector("#humidity").innerHTML = humidity + " %";
  document.querySelector("#light").innerHTML = light + " %";
  document.querySelector("#temperature").innerHTML = temperature + " °C";
  document.querySelector("#time").innerHTML = lastUpdate;

  document.getElementById("plantStatus").innerHTML = plantDescription();
  document.getElementById("status-pic").src = plantPic();
  graph.update();
}

update();
var interval = setInterval(update, 5000);
