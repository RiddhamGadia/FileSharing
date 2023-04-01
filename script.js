const firebaseConfig = {
  apiKey: "AIzaSyAvJHDSNzCfKzhRgK66wdl0VcLsRgvwKs0",
  authDomain: "clone-610d7.firebaseapp.com",
  projectId: "clone-610d7",
  storageBucket: "clone-610d7.appspot.com",
  messagingSenderId: "773189860267",
  appId: "1:773189860267:web:9c98c5698c692bcdda70ee",
  measurementId: "G-NLRPTCCK30",
};

firebase.initializeApp(firebaseConfig);
var messagesRef = firebase.database().ref('image');


function uploadImage() {
  if (document.getElementById("file").value != "") {
    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Uploading...";
    var file = document.getElementById("file").files[0];
    var storageRef = firebase.storage().ref("images/" + file.name);
    var uploadTask = storageRef.put(file);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      function (error) {
        console.log(error.message);
        document.getElementById("upload").innerHTML = "Upload Failed";
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);
          saveMessage(downloadURL);
        });
      }
    );
  } else {
    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Please select a file";
    setTimeout(function () {
      document.getElementById("upload").innerHTML = uploadtext;
    }, 2000);
  }
}
function saveMessage(downloadURL) {
  var newMessageRef = messagesRef.push();
  var unique = createUniquenumber();
  // Hidding recive file div
  var x = document.getElementById("downloadiv");
  x.style.display = "none";
  var showUnique = document.getElementById("ShowUniqueID");
  var shU = document.getElementById("showunique");
  shU.value = unique;
  showUnique.style.display = "block";
  newMessageRef.set({
    url: downloadURL,
    number: unique,
  });
  document.getElementById("upload").innerHTML = "Upload Successful";
  document.getElementById("file").value = "";
}

function createUniquenumber() {
  var number = Math.floor(10000 + Math.random() * 90000);
  var ref = firebase.database().ref("image");
  ref.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      if (childData.number == number) {
        createUniquenumber();
      }
    });
  });
  return number;
}

function showimage() {
  var uniqueId = document.getElementById("unique").value;
  if (uniqueId == "") {
    alert("Unique Id is empty\n Please enter a Unique Id");
    return;
  }
  var ref = firebase.database().ref("image");
  var flag = 0;
  ref.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      if (childData.number == uniqueId) {
        flag = 1;
        window.open(childData.url, "_blank");
        ref.child(childSnapshot.key).remove();
        setTimeout(function () {
          var storageRef = firebase.storage().refFromURL(childData.url);
          storageRef
            .delete()
            .then(function () {
              ref.child(childSnapshot.key).remove();
            })
            .catch(function (error) {});
        }, 15000);
      }
    });
  });
}

function flesize() {
  var file = document.getElementById("file").files[0];
  // Dont allow file size greater than 100MB
  if (file.size > 100000000) {
    alert(
      "File size is greater than 100MB\n Please select a file less than 100MB"
    );
    document.getElementById("file").value = "";
  }
}

// Click on download button when enter is pressed
document.getElementById("unique").addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("show").click();
  }
});
