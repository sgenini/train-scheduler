var config = {
    apiKey: "AIzaSyCYmiWCLzICPNT4NAg62pebfhPdPKK_m3w",
    authDomain: "train-scheduler-52442.firebaseapp.com",
    databaseURL: "https://train-scheduler-52442.firebaseio.com",
    projectId: "train-scheduler-52442",
    storageBucket: "train-scheduler-52442.appspot.com",
    messagingSenderId: "908323825769"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = moment($("#time-input").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

  var train = childSnapshot.val();

  // Store everything into a variable.
  var trainName = train.name;
  var trainDestination = train.destination;
  var trainStart = train.start;
  var trainFrequency = train.frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainFrequency);

//   Calculate arrival and minutes
var trainStartFormat = moment(train.start, "HH:mm");
console.log(trainStartFormat);
var trainYesterday = trainStartFormat.subtract(1, "days");
console.log("trainYesterday: " + trainYesterday.format("MM/DD/YY HH:mm"));
var trainArrival = moment().diff(trainYesterday, "minutes");
console.log("trainArrival: " + trainArrival);
var trainMinutes = train.frequency - (trainArrival % train.frequency);
console.log("train.frequency: " + train.frequency);

var trainNext = moment().add(trainMinutes, "minutes").format("HH:mm")

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(trainNext),
    $("<td>").text(trainMinutes),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

// Trying to get it to auto-update on an interval
// function doRefresh(){
//     $("#train-table").get();
// }
// $(function() {
//     setInterval(doRefresh, 5000);
// });
