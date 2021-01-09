// some variables and consts to manipulate data

const user = JSON.parse(sessionStorage.getItem("employee"));
const _reportUrl = "../resource/dailyReport.json";
const _url = "../resource/employee.json";
const _monthelyReportUrl = "../resource/monthelyReport.json";
const attendsList = [];
var monthleyList = [];
var monthReportDate;
//a flag to prevent take excuse before the report is taken
var reportCreateFlag = false;

$(function () {
  /* load monthely sheet to count attedns and 
  absent and excuse for all employee to genrate the monthely report*/

  fetch(_monthelyReportUrl)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      monthReportDate = res[res.length - 1].date;
      monthleyList = res[res.length - 1].employees;
      console.log(monthReportDate);
    })
    .catch((err) => {
      console.log(err);
    }); //end

  // check type of user is it normal user or sub admin
  if (user == null) {
    $("#errorMsg").show();
    $("#wrapper").hide();
  } else if (user.username !== "dina") {
    $("#profileTitle").text("Account");
    $("#attendsNav").hide();
  } else {
    $("#profileTitle").text("Sub Admin");
    $("#attendsNav").show();
    takeAllAbsent();
  }

  // change usernam
  $("#profileUsername").text(user.username);
  createNewMonthlyReport();
});

// content manipulate function
//---------------------------------------------------------------------------------------------------------
// an event listener to show dailey report for user
$("#show-dailey-report").on("click", () => {
  loadDaileyReport();
  $("#dailyReportUsername").text(user.username);
  $("#dailyReportEmail").text(user.email);
  $("#dailyReportAddress").text(user.address);
  $("#bgImg").hide(500);
  $("#dailey-report").show(500);
  $("#monthely-report").hide(500);
  $("#attends-card").hide(500);
  $("#excuse-card").hide(500);
});

// an event listener to show the monthely report
$("#show-monthely-report").on("click", () => {
  $("#bgImg").hide(500);
  $("#dailey-report").hide(500);
  $("#monthely-report").show(500);
  $("#attends-card").hide(500);
  $("#excuse-card").hide(500);

  index = monthleyList.findIndex((emp) => {
    return emp.code == user.empCode;
  });

  // get the couters from the monthely sheet
  const attend = monthleyList[index].attendsCount;
  const absent = monthleyList[index].absentCount;
  const excuse = monthleyList[index].excuseCount;

  $("#monthelyExcuseCardNumber").text(`${excuse} times`);
  $("#monthelyAbsentCardNumber").text(`${absent} times`);
  $("#monthelyAttendsCardNumber").text(`${attend} times`);

  // for drawing chart
  drawChart(attend, absent, excuse);
});

// an event listener to  show the attends from to the Sub user
$("#show-attends-from").on("click", () => {
  $("#bgImg").hide(500);
  $("#dailey-report").hide(500);
  $("#monthely-report").hide(500);
  $("#attends-card").show(500);
  $("#excuse-card").hide(500);
});

// an event listener to  show the attends from to the Sub user
$("#show-excuse-from").on("click", () => {
  $("#bgImg").hide(500);
  $("#dailey-report").hide(500);
  $("#monthely-report").hide(500);
  $("#attends-card").hide(500);
  $("#excuse-card").show(500);
});

// chart drawing function
function drawChart(x, y, z) {
  (Chart.defaults.global.defaultFontFamily = "Nunito"),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = "#858796";

  // Pie Chart Example
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Attends", "Absent", "Excuse"],
      datasets: [
        {
          data: [x, y, z],
          backgroundColor: ["#54e346", "#ff4646", "#fecd1a"],
          hoverBackgroundColor: ["#28df99", "#ec524b", "#fcf876"],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false,
      },
      cutoutPercentage: 80,
    },
  });
}

// show model logout
$("#exampleModal").on("show.bs.modal", (event) => {
  var button = $(event.relatedTarget);
  var modal = $(this);
  // Use above variables to manipulate the DOM
});

// show the valiable dailey report for user
function loadDaileyReport() {
  // load the reports
  $.ajax({
    url: _reportUrl,
    type: "get",
    success: (reportsData) => {
      if (reportsData.length != 0) {
        $("#dateOfReportList").empty();
        for (i = 0; i < reportsData.length; i++) {
          $("#dateOfReportList").append(
            `<option id="selectReport" value='${i}'> ${reportsData[i].date} Report</option> `
          );
        }
      } else {
        $("#dateOfReportList").append(
          `<option id="selectReport" value='0'>There is no Reports</option> `
        );
      }
    },
    error: (err) => {
      console.log(err);
    },
  });
}

// show the daileyReport in card form
function getReport(option) {
  // get index value
  var index = option.value;
  // load reports
  $.ajax({
    url: _reportUrl,
    type: "get",
    success: (reportsData) => {
      // search by date
      showDailyReport(reportsData[index], user);
    },
    error: (err) => {
      console.log(err);
    },
  });
  // show info
}

// after select Report
function showDailyReport(report, user) {
  // search for the user
  index = report.attends.findIndex((employee) => {
    return employee.code == user.empCode;
  });

  if (index != -1) {
    $("#attendsDaileyCard").removeClass("border-left-danger");
    $("#attendDaileyTimeTitle").text("Arrive Time");
    $("#attendDaileyTimeValue").text(
      `${report.attends[index].arrivedAt.hour} h ${report.attends[index].arrivedAt.minute} m`
    );
    if (report.attends[index].arrivedAt.hour >= 9) {
      $("#attendDaileyLateValue").text(
        `${report.attends[index].arrivedAt.hour - 9} h ${
          report.attends[index].arrivedAt.minute
        } m`
      );
    } else {
      $("#attendDaileyLateValue").html("--");
    }
    return;
  }

  $("#attendsDaileyCard").addClass("border-left-danger");
  $("#attendDaileyTimeTitle").text("Absent");
  $("#attendDaileyTimeValue").html('<i class="fas fa-user-alt-slash"></i>');
  $("#attendDaileyLateValue").html('<i class="fas fa-user-alt-slash"></i>');

  // case 1: the user is attended
  //        show the arrivedAt
  //        show the late date

  // case 2: the user us absent
  //        show absent
  //        show the late date __
}

// attends form event listener with error message handler
$("#attendsButton").on("click", () => {
  const code = $("#employeeCodeInput").val();
  const date = new Date();

  // if user left the code input empty
  if (code == "") {
    $("#AttendsInfoMessage").addClass("alert-danger");
    $("#AttendsInfoMessage").html("Error: <br> Enter Code Please");
    return;
  }

  // date.getHours() <= 8 && date.getHours() >= 10
  // take attends from 8 clock to 10 clock
  if (date.getHours() <= 8 && date.getHours() >= 10) {
    takeAttends(code, date);
  } else {
    $("#AttendsInfoMessage").addClass("alert-danger");
    $("#AttendsInfoMessage").html("Error: <br> Attends report has been closed");
  }

  // genrate the report on 10 AM
  setInterval(() => {
    if (Date.getHours() == 10) {
      createDaileyReport(attendsList);
    }
  }, 900000); // check every 15 minutes if clock is 10 am
});

// take excus button envent listener
$("#excuseButton").on("click", () => {
  const code = $("#employeeCodeExcuseInput").val();
  // check Time
  const time = new Date();

  if (code === "") {
    $("#excuseInfoMessage").addClass("alert-warning");
    $("#excuseInfoMessage").html("Waring: <br> Enter Code Please");
    return;
  }

  //time.getHours() >= 10 && time.getHours() <= 16
  if (time.getHours() >= 10 && time.getHours() <= 16 && reportCreateFlag) {
    takeExcuse(code);
    $("#excuseInfoMessage").removeClass("alert-warning");
    $("#excuseInfoMessage").text(`Success`);
  } else {
    $("#excuseInfoMessage").addClass("alert-warning");
    $("#excuseInfoMessage").text(`excuse report has been closed`);
  }
});

// scritp of logout button
$("#userLogout").on("click", () => {
  sessionStorage.clear();
});

// functionality
//-------------------------------------------------------------------------

function takeAttends(_code, _time) {
  // reload the employee data to get employee name and Code
  $.ajax({
    url: "../resource/employee.json",
    type: "get",
    success: (emps) => {
      // check if code is in data or not
      index = emps.findIndex((employee) => {
        return employee.empCode == _code;
      });

      // if it exist then create and attends object for this employee which have the info and data
      if (index != -1) {
        const emp = {
          code: emps[index].empCode,
          name: emps[index].username,
          arrivedAt: { hour: _time.getHours(), minute: _time.getMinutes() },
        };

        // check if the employee alerady take his attends before and print message
        if (repted(_code)) {
          $("#AttendsInfoMessage").addClass("alert-danger");
          $("#AttendsInfoMessage").html(`Error: <br>
           Employee Attends is alerady token`);
          return;
        }

        // increment Attends Count
        attendsList.push(emp);
        incrementAttendsCount(_code);

        // display success message
        $("#AttendsInfoMessage").removeClass("alert-danger");
        $("#AttendsInfoMessage").html(`Success
        <br>The empolyee:  ${emp.name} <br>
        Arrive At:  ${_time.getHours()} : ${_time.getMinutes()}.`);
        // removeEmpFromAbsent(_code);
        removeEmpFromAbsent(_code);
        return;
      }

      // if empolyee is not founded display the code is invalid
      $("#AttendsInfoMessage").addClass("alert-danger");
      $("#AttendsInfoMessage").html(`Error: <br>
      Employee code is not founded`);
    },
    error: (e) => {
      console.log(e);
      $("#AttendsInfoMessage").addClass("alert-danger");
      $("#AttendsInfoMessage").text(`Error Falied To load DB`);
    },
  });
}

// check if 9 -> 9:30 valid
function createDaileyReport(_report) {
  // load report old data to update it  and create new report to push
  const date = new Date().toLocaleDateString();
  const absent = JSON.parse(localStorage.getItem("tempUsers"));
  const report = new daileyReport(date, _report, absent, []);

  $.ajax({
    url: _reportUrl,
    type: "GET",
    success: (data) => {
      data.push(report);

      // increment absent counts
      absent.forEach((e) => {
        incrementAbsentCount(e.code);
      });

      // save data after update
      console.table(monthleyList);
      saveJson(data, "daileyReport");
      saveJson(
        { date: monthReportDate, employees: monthleyList },
        "monthelyReport"
      );
      reportCreateFlag = true;
    },
    error: (e) => {
      console.log(e);
    },
  });

  // remove temporary data
  localStorage.removeItem("tempUsers");
}

// create new json file with new updates
function saveJson(jsonDataToSave, fileName) {
  var data = new Blob([JSON.stringify(jsonDataToSave)], {
    type: "application/json",
  });
  var link = document.createElement("a");
  link.href = window.webkitURL.createObjectURL(data);
  link.setAttribute("download", fileName);
  link.click();
}

// take code
// get the report of that day and put the in excuse
// check quate of excuse
// case 1 is there place
// put code and Time
// case 2 no place return
function takeExcuse(code) {
  $.ajax({
    url: _reportUrl,
    type: "get",
    success: (reports) => {
      const last = reports[reports.length - 1];
      const qutoa = last.excuse.length;
      // finde name of employee that has the Code

      index = last.attends.findIndex((e) => {
        return e.code == code;
      });

      if (index == -1) {
        $("#excuseInfoMessage").addClass("alert-info");
        $("#excuseInfoMessage").text(`Code is not correct`);
        return;
      }

      if (qutoa != 5) {
        const date = new Date();
        last.excuse.push({
          code: code,
          name: last.attends[index].name,
          time: {
            hour: date.getHours(),
            minute: date.getMinutes(),
          },
        });

        incrementExcuseCount(code);
        saveJson(
          { date: monthReportDate, employees: monthleyList },
          "monthelyReport"
        );
        saveJson(reports, "daileyReport");
      } else {
        $("#excuseInfoMessage").addClass("alert-info");
        $("#excuseInfoMessage").text(`We reached the maximum excuse limit`);
      }
    },
  });
}

// when page is loaded for sub admin take all user absent until take their attends
function takeAllAbsent() {
  $.ajax({
    url: "../resource/employee.json",
    type: "GET",
    success: function (data) {
      var absent = [];
      data.forEach((e) => {
        absent.push({ code: e.empCode, name: e.username, arrivedAt: "absent" });
      });
      localStorage.setItem("tempUsers", JSON.stringify(absent));
    },
  });
}

// after take the user attends remove it from absent list
function removeEmpFromAbsent(code) {
  const absentList = JSON.parse(localStorage.getItem("tempUsers")); // get absent list
  index = absentList.findIndex((e) => {
    // get the index of the user attends
    return e.code == code;
  });

  absentList.splice(index, 1);
  //remove the emp from absent list
  localStorage.setItem("tempUsers", JSON.stringify(absentList)); // return arr with the new update
}

// create new monthely report
function creatMonthelyReport() {
  $.ajax({
    // load employee data
    url: _url,
    type: "GET",
    success: function (employees) {
      const employeesList = [];
      employees.forEach((employee) => {
        employeesList.push({
          code: employee.empCode,
          name: employee.username,
          attendsCount: 0,
          absentCount: 0,
          excuseCount: 0,
        });
      });

      const date = new Date();
      const month = new MonthlyReport(date.toDateString(), employeesList);
      fetch(_monthelyReportUrl)
        .then((res) => {
          return res.json;
        })
        .then((res) => {
          res.push(month);
          saveJson(res, "monthelyReport");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
}

// check if user repted
function repted(code) {
  index = attendsList.findIndex((emp) => {
    return emp.code == code;
  });

  if (index != -1) {
    return true;
  }

  return false;
}

// increment all counts
function incrementAttendsCount(code) {
  index = monthleyList.findIndex((e) => {
    return e.code == code;
  });

  monthleyList[index].attendsCount++;
}

function incrementAbsentCount(code) {
  index = monthleyList.findIndex((e) => {
    return e.code == code;
  });

  monthleyList[index].absentCount++;
}

function incrementExcuseCount(code) {
  index = monthleyList.findIndex((e) => {
    return e.code == code;
  });

  monthleyList[index].excuseCount++;
}

// check if day is the first day of the month to create new monthley report
function createNewMonthlyReport() {
  const date = new Date().toDateString();
  // get day
  const day = date.split(" ")[2];

  if (day == "01" || day == "1") {
    creatMonthelyReport();
  }
}

//////// copyright for M_Mustafa //////////////////////////////////////////////////////////////////
