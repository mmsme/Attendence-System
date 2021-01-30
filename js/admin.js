const _url = "../resource/employee.json";
const _daileyReportsUrl = "../resource/dailyReport.json";
const _monthelyReportUrl = "../resource/monthelyReport.json";

$(function () {
  loadNotification(getRequsetsList());
  const admin = getAdminInfo();

  if (admin == null) {
    $("#errorMsg").show();
    $("#wrapper").hide();
  } else {
    $("#AdminTitle").text(admin.username);
  }
});

$("#fullAttendsReport").on("click", () => {
  var table = `<div class="table-responsive">
                <table class="table table-bordered" id="fullReportDatatable" width="100%" cellspacing="0"></table>
              </div>`;
  $("#bgImg").hide(500);
  $("#tableCard").show(500);
  $("#TableTitle").text("Full Report");
  $("#myCardBody").html(table);
  $("#fullReportDatatable").DataTable({
    ajax: {
      url: _daileyReportsUrl,
      type: "GET",
      error: function (e) {},
      dataSrc: function (d) {
        return d[d.length - 1].attends;
      },
    },
    columns: [
      { data: "code", title: "Code" },
      { data: "name", title: "Name" },
      {
        mData: function (data) {
          return `${data.arrivedAt.hour} h ${data.arrivedAt.minute} m`;
        },
        title: "Arrived At",
      },
      {
        mData: function (data) {
          if (data.arrivedAt.hour >= 9) {
            return `${data.arrivedAt.hour - 9} h ${data.arrivedAt.minute} m`;
          } else {
            return `0 h 0 m`;
          }
        },
        title: "Late",
      },
    ],
  });
});

$("#fullAbsentReport").on("click", () => {
  var table = `<div class="table-responsive">
                <table class="table table-bordered" id="fullReportDatatable" width="100%" cellspacing="0"></table>
            </div>`;
  $("#bgImg").hide(500);
  $("#tableCard").show(500);
  $("#TableTitle").text("Full Report");
  $("#myCardBody").html(table);
  $("#fullReportDatatable").DataTable({
    ajax: {
      url: _daileyReportsUrl,
      type: "GET",
      error: function (e) {},
      dataSrc: function (d) {
        return d[d.length - 1].absent;
      },
    },
    columns: [
      { data: "code", title: "Code" },
      { data: "name", title: "Name" },
      { data: "arrivedAt", title: "Arrived At" },
    ],
  });
});

$("#lateReport").on("click", () => {
  var table = `<div class="table-responsive">
                <table class="table table-bordered" id="lateReportDatatable" width="100%" cellspacing="0">
                </table>
            </div>`;

  $("#bgImg").hide(500);
  $("#tableCard").show(500);
  $("#TableTitle").text("Late Report");
  $("#myCardBody").html(table);
  $("#lateReportDatatable").DataTable({
    ajax: {
      url: _daileyReportsUrl,
      type: "GET",
      error: function (e) {},
      dataSrc: function (d) {
        const attends = d[d.length - 1].attends;
        return attends.filter((e) => {
          return e.arrivedAt.hour >= 9;
        });
      },
    },
    columns: [
      { data: "code", title: "Code" },
      { data: "name", title: "Name" },
      {
        mData: function (data) {
          return `${data.arrivedAt.hour - 9} h ${data.arrivedAt.minute} m`;
        },
        title: "Late",
      },
    ],
  });
});

$("#excuseReport").on("click", () => {
  var table = `<div class="table-responsive">
                <table class="table table-bordered" id="execuseReportDatatable" width="100%" cellspacing="0">
                </table>
            </div>`;

  $("#bgImg").hide(500);
  $("#tableCard").show(500);
  $("#TableTitle").text("Execuse Report");
  $("#myCardBody").html(table);
  $("#execuseReportDatatable").DataTable({
    ajax: {
      url: _daileyReportsUrl,
      type: "GET",
      error: function (e) {},
      dataSrc: function (d) {
        return d[d.length - 1].excuse;
      },
    },
    columns: [
      { data: "code", title: "Code" },
      { data: "name", title: "Name" },
      {
        mData: function (data) {
          return `${data.time.hour} h ${data.time.minute} m`;
        },
        title: "Excuse Time",
      },
    ],
  });
});

$("#monthleyReport").on("click", () => {
  var table = `<div class="table-responsive">
                <table class="table table-bordered" id="monthleyReportDatatable" width="100%" cellspacing="0">
                </table>
            </div>`;

  $("#bgImg").hide(500);
  $("#tableCard").show(500);
  $("#TableTitle").text("Monthley Report");
  $("#myCardBody").html(table);
  $("#monthleyReportDatatable").DataTable({
    ajax: {
      url: _monthelyReportUrl,
      type: "GET",
      error: function (e) {},
      dataSrc: function (d) {
        return d[d.length - 1].employees;
      },
    },
    columns: [
      { data: "code", title: "Code" },
      { data: "name", title: "Name" },
      { data: "attendsCount", title: "Attends Times" },
      { data: "absentCount", title: "Absent Times" },
      { data: "excuseCount", title: "Excuse Times" },
    ],
  });
});

$("#AllEmployee").on("click", () => {
  var table = `<div class="table-responsive">
                <table class="table table-bordered" id="fullEmployeeDatatable" width="100%" cellspacing="0">
                </table>
            </div>`;

  $("#bgImg").hide(500);
  $("#tableCard").show(500);
  $("#TableTitle").text("Full Employee Report");
  $("#myCardBody").html(table);
  $("#fullEmployeeDatatable").DataTable({
    ajax: {
      url: _url,
      type: "GET",
      error: function (e) {},
      dataSrc: function (d) {
        return d;
      },
    },
    columns: [
      { data: "empCode", title: "Code" },
      { data: "username", title: "Name" },
      { data: "email", title: "Email" },
      { data: "address", title: "Address" },
      { data: "dob", title: "Date of Birth" },
    ],
  });
});

function createNotification(_name) {
  var colors = [
    "bg-primary",
    "bg-success",
    "bg-danger",
    "bg-warning",
    "bg-dark",
    "bg-secondary",
  ];

  var rand = Math.floor(Math.random() * 6);
  var notification = `<a class="dropdown-item d-flex align-items-center" href="#">
                        <div class="mr-3">
                            <div class="icon-circle ${colors[rand]}">
                                <i class="fas fa-users text-white"></i>
                            </div>
                            </div>
                            <div>
                                <span class="font-weight-bold">A new request is sent from ${_name}!</span>
                            </div>
                        </a>`;

  return notification;
}

function loadNotification(arr) {
  $("notificationContainer").empty();

  if (arr.length != 0) {
    arr.forEach((element) => {
      $("#notificationContainer").append(createNotification(element.username));
    });
    $("#numberOfNotification").text(arr.length);
    $("#notificationContainer").append(
      '<a class="dropdown-item text-center small text-gray-500" href="#"> Show All Alerts </a>'
    );
  } else {
    $("#numberOfNotification").text("0");
    $("#notificationContainer").append(
      '<span class="dropdown-item text-center small text-gray-500">No Notifications Avilable</span>'
    );
  }
}

function createRequestTable() {
  var table = `<div class="table-responsive">
                <table class="table table-bordered text-center" id="requestDataTable" width="100%" cellspacing="0">
                </table>
            </div>`;

  $("#bgImg").hide(500);
  $("#tableCard").show(500);
  $("#TableTitle").text("Requests Table");
  $("#myCardBody").html(table);
  $("#requestDataTable").DataTable({
    data: getRequsetsList(),
    columns: [
      { data: "username", title: "Name" },
      { data: "email", title: "Email" },
      { data: "address", title: "Address" },
      { data: "dob", title: "Date of Birth" },
      {
        defaultContent: `<button id="addEmp" class="btn btn-success text-white">Add</button>`,
        title: "Operation",
      },
      {
        defaultContent: `<button id="removeRequest" class="btn btn-danger text-white">Reject</button>`,
        title: "Operation",
      },
    ],
  });
}

$("#content-wrapper").on("click", "#addEmp", function () {
  // function data() return an obj of user data of button which fire the event
  var data = $("#requestDataTable")
    .DataTable()
    .row($(this).parent().parent())
    .data();

  console.log(data);
  // add obj user to json file
  $.ajax({
    url: "../resource/employee.json",
    type: "GET",
    success: function (resource) {
      const code = generateEmployeeCode(resource);
      data.empCode = code;
      resource.push(data);
      saveJson(resource);
      deleteRequest(data);
    },
    error: function (err) {
      console.log(err);
    },
  });
});

$("#content-wrapper").on("click", "#removeRequest", function () {
  var data = $("#requestDataTable")
    .DataTable()
    .row($(this).parent().parent())
    .data();
  deleteRequest(data);
});

$("#deleteEmployee").on("click", () => {
  var table = `<div class="table-responsive">
                <table class="table table-bordered text-center" id="removeEmployeeDatatable" width="100%" cellspacing="0">
                </table>
            </div>`;

  $("#bgImg").hide(500);
  $("#tableCard").show(500);
  $("#TableTitle").text("Full Employee Report");
  $("#myCardBody").html(table);
  $("#removeEmployeeDatatable").DataTable({
    ajax: {
      url: _url,
      type: "GET",
      error: function (e) {},
      dataSrc: function (d) {
        return d;
      },
    },
    columns: [
      { data: "empCode", title: "Code" },
      { data: "username", title: "Name" },
      { data: "email", title: "Email" },
      { data: "address", title: "Address" },
      { data: "dob", title: "Date of Birth" },
      {
        defaultContent: `<button id="removeEmp" class="btn btn-danger text-white text-center">Remove</button>`,
        Title: "Operation",
      },
    ],
  });
});

$("#content-wrapper").on("click", "#removeEmp", function () {
  var data = $("#removeEmployeeDatatable")
    .DataTable()
    .row($(this).parent().parent())
    .data();
  $.ajax({
    url: _url,
    type: "GET",
    success: function (employees) {
      index = employees.findIndex((employee) => {
        return employee.empCode == data.empCode;
      });

      employees.splice(index, 1);
      saveJson(employees);
    },
  });
});

function getRequsetsList() {
  return JSON.parse(localStorage.getItem("requestList"));
}

function getAdminInfo() {
  return JSON.parse(sessionStorage.getItem("employee"));
}

function saveJson(jsonDataToSave) {
  var data = new Blob([JSON.stringify(jsonDataToSave)], {
    type: "application/json",
  });
  var link = document.createElement("a");
  link.href = window.webkitURL.createObjectURL(data);
  link.setAttribute("download", "employee");
  link.click();
}

function generateEmployeeCode(arr) {
  // flag to stop itreation
  let flag = true;
  let randomCode;
  do {
    // create code for the first time
    randomCode = Math.floor(100000 + Math.random() * 900000);

    // search if there some one have the same code
    var repted = arr.findIndex((e) => {
      return e.empCode == randomCode;
    });

    // case if no one has the same code stop itreation
    if (repted == -1) {
      flag = false;
    }
    // no continue
  } while (flag);

  return randomCode;
}

function deleteRequest(_request) {
  const requestsList = getRequsetsList();
  index = requestsList.findIndex((e) => {
    return e.email == _request.email && e.username == _request.username;
  });

  if (index != -1) {
    requestsList.splice(index, 1);
  }

  localStorage.setItem("requestList", JSON.stringify(requestsList));
  loadNotification(requestsList);
  createRequestTable();
}

$("#AdminLogout").on("click", () => {
  sessionStorage.clear();
});
