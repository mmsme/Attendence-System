// Show The login Form
$("#registerLink").on("click", () => {
  $("#login-container").show(500);
  $("#register-container").hide();
});

// Show The Register Form
$("#loginLink").on("click", () => {
  $("#login-container").hide();
  $("#register-container").show(500);
});

// Validation on Login form
$("#loginForm").submit(function (event) {
  // make selected form variable
  var vForm = $(this);

  /*
            If not valid prevent form submit
            https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity
            */
  if (vForm[0].checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    var username = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    $.ajax({
      url: "../resource/employee.json",
      type: "get",
      success: function (res) {
        // Check if User is in Json File
        index = res.findIndex((users) => {
          return username == users.username;
        });

        // check if type user
        if (index == -1) {
          alert("Stop");
        } else if (index == 0 && res[index].password == password) {
          sessionStorage.setItem("employee", JSON.stringify(res[index]));
          open("../admin.html", "_self", " ", "false");
        } else if (res[index].password == password) {
          sessionStorage.setItem("employee", JSON.stringify(res[index]));
          open("../profile.html", "_self", " ", "false");
        } else {
          alert("Username or password is wrong!");
        }
      },
      error: function (ErrorMessage) {
        console.log(ErrorMessage);
      },
    });
    // check if user is in db
  }

  // Add bootstrap 4 was-validated classes to trigger validation messages
  vForm.addClass("was-validated");
});

// Validation on Register Form
$("#registerForm").submit(function (event) {
  // make selected form variable
  var vForm = $(this);

  /*
            If not valid prevent form submit
            https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity
            */
  if (vForm[0].checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    var username = $("#registerUsername").val();
    var password = $("#registerPassword").val();
    var email = $("#registerEmail").val();
    var address = $("#registerAddress").val();
    var dob = $("#registerDob").val();

    emp = new Employee(username, email, address, dob);
    emp.Password = password;

    var requestArr = loadCurrentRequest();
    requestArr.push(emp);
    localStorage.setItem("requestList", JSON.stringify(requestArr));
    alert("your request is sended, please wait for admin permission");
  }

  // Add bootstrap 4 was-validated classes to trigger validation messages
  vForm.addClass("was-validated");
});

function loadCurrentRequest() {
  return (users = JSON.parse(localStorage.getItem("requestList") || "[]"));
}
