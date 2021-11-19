var ERROR = "ERROR";

// Create or Open Database.
var db = window.openDatabase("FGW", "1.0", "FGW", 20000);

//validation post

const checkData = new validation();
let valid = true;

const checkCommonValidation = (
  selectInput,
  errorSelect = "",
  name,
  min = -1,
  max = -1
) => {
  let value = document.querySelector(selectInput).value;

  // let name = document.querySelector('#page-create #frm-register #Property_name').value;

  valid &= checkData.checkEmpty(value, errorSelect, name);

  if (min && max != -1) {
    valid &= checkData.checkLength(value, errorSelect, min, max, name);
  }

  if (!valid) {
    return;
  }
};

const checkCharacterValidation = (selectInput, errorSelect = "", name) => {
  let value = document.querySelector(selectInput).value;

  // let name = document.querySelector('#page-create #frm-register #Property_name').value;

  valid &= checkData.checkEmpty(value, errorSelect, name);

  valid &= checkData.checkCharacter(value, errorSelect, name);

  if (!valid) {
    return;
  }
};

const checkPriceValidation = (
  selectInput,
  errorSelect = "",
  name,
  min = -1,
  max = -1
) => {
  let value = document.querySelector(selectInput).value;

  valid &= checkData.checkEmpty(value, errorSelect, name);

  if (min && max != -1) {
    valid &= checkData.CheckMinMax(value, errorSelect, min, max, name);
  }

  if (!valid) {
    return;
  }
};

const checkSelectValidation = (select, errorSelect = "", name) => {
  let value = document.querySelector(select).value;

  console.log("value", value);

  console.log("-1" == value);

  if (value == "-1") {
    document.querySelector(errorSelect).innerHTML = `${name} must be selected.`;
    console.log("hello");
  } else {
    document.querySelector(errorSelect).innerHTML = ``;
  }
};

// To detect whether users use mobile phones horizontally or vertically.
$(window).on("orientationchange", onOrientationChange);

// Display messages in the console.
function log(message, type = "INFO") {
  console.log(`${new Date()} [${type}] ${message}`);
}

function onOrientationChange(e) {
  if (e.orientation == "portrait") {
    log("Portrait.");
  } else {
    log("Landscape.");
  }
}

// To detect whether users open applications on mobile phones or browsers.
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
  $(document).on("deviceready", onDeviceReady);
} else {
  $(document).on("ready", onDeviceReady);
}

// Display errors when executing SQL queries.
function transactionError(tx, error) {
  log(`SQL Error ${error.code}. Message: ${error.message}.`, ERROR);
}

//option object
const Furniture = Object.freeze({
  Unfurnished: "Unfurnished",
  "Half Furnished": "Half Furnished",
  Furnished: "Furnished",
});

const Type = Object.freeze({
  Penthouse: "Penthouse",
  Apartment: "Apartment",
  House: "House",
  Bungalow: "Bungalow",
});

const Bedroom = Object.freeze({
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
});

// Run this function after starting the application.
function onDeviceReady() {
  log(`Device is ready.`);

  db.transaction(function (tx) {
    // Create table POST.
    var query = `CREATE TABLE IF NOT EXISTS Post (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                            Property_name TEXT NOT NULL UNIQUE,
                                                            Property_address TEXT NOT NULL,
                                                            City TEXT NOT NULL,
                                                            District TEXT NOT NULL,
                                                            Ward TEXT NOT NULL,
                                                            Property_type TEXT NOT NULL,
                                                            Bedroom TEXT NOT NULL,
                                                            DateTime DATE NOT NULL,
                                                            Rent_Price INT NOT NULL,
                                                            Furniture_type TEXT NOT NULL,
                                                            Reporter TEXT NOT NULL)`;
    tx.executeSql(
      query,
      [],
      function (tx, result) {
        log(`Create table 'Post' successfully.`);
      },
      transactionError
    );

    // Create table Note.
    var query = `CREATE TABLE IF NOT EXISTS Note (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         Message TEXT NOT NULL,
                                                         DateTime DATE NOT NULL,
                                                         PostId INTEGER NOT NULL,
                                                         FOREIGN KEY (PostId) REFERENCES Post(Id))`;
    tx.executeSql(
      query,
      [],
      function (tx, result) {
        log(`Create table 'Note' successfully.`);
      },
      transactionError
    );
  });
}

//import option type, furniture, bedroom
$(document).on("pagebeforeshow", "#page-create", function () {
  addSelectOption("#page-create #frm-register #Property_type", Type, "Type");
  addSelectOption(
    "#page-create #frm-register #Furniture_types",
    Furniture,
    "Furniture"
  );
  addSelectOption("#page-create #frm-register #Bedroom", Bedroom, "Bedroom");
});

//import address
$(document).on("pagebeforeshow", "#page-create", function () {
  importAddress("#page-create #frm-register", "City");
  importAddress("#page-create #frm-register", "District", "City");
  importAddress("#page-create #frm-register", "Ward", "District");
});

$(document).on("change", "#page-create #frm-register #city", function () {
  importAddress("#page-create #frm-register", "District", "City");
  importAddress("#page-create #frm-register", "Ward", "District");
});

$(document).on("change", "#page-create #frm-register #district", function () {
  importAddress("#page-create #frm-register", "Ward", "District");
});

// Submit a form to register a new post.
$("#page-create #frm-register").on("submit", function (e) {
  e.preventDefault();

  checkCommonValidation(
    "#page-create #frm-register #Property_name",
    "#page-create #frm-register #error_name",
    "Property Name",
    6,
    100
  );
  checkCommonValidation(
    "#page-create #frm-register #Property_address",
    "#page-create #frm-register #error_address",
    "Property Address",
    6,
    100
  );
  checkCharacterValidation(
    "#page-create #frm-register #Reporter_name",
    "#page-create #frm-register #error_reporter",
    "Reporter Name",
    3,
    120
  );
  checkPriceValidation(
    "#page-create #frm-register #Rent_Price",
    "#page-create #frm-register #error_price",
    "Monthly Price",
    100000,
    5000000000
  );
  checkSelectValidation(
    "#page-create #frm-register #Property_type",
    "#error_type",
    "Property Type"
  );
  checkSelectValidation(
    "#page-create #frm-register #Bedroom",
    "#error_bedroom",
    "Property Bedroom"
  );
  checkSelectValidation(
    "#page-create #frm-register #Furniture_types",
    "#error_furniture",
    "Property Furniture"
  );
  checkSelectValidation(
    "#page-create #frm-register #city",
    "#error_city",
    "City"
  );
  checkSelectValidation(
    "#page-create #frm-register #district",
    "#error_district",
    "District"
  );
  checkSelectValidation(
    "#page-create #frm-register #ward",
    "#error_ward",
    "Ward"
  );

  errorName = document.querySelector(
    "#page-create #frm-register #error_name"
  ).innerText;
  errorPrice = document.querySelector(
    "#page-create #frm-register #error_price"
  ).textContent;
  errorAddress = document.querySelector(
    "#page-create #frm-register #error_address"
  ).textContent;
  errorReporter = document.querySelector(
    "#page-create #frm-register #error_reporter"
  ).textContent;
  errorType = document.querySelector(
    "#page-create #frm-register #error_type"
  ).textContent;
  errorBedroom = document.querySelector(
    "#page-create #frm-register #error_bedroom"
  ).textContent;
  errorFurniture = document.querySelector(
    "#page-create #frm-register #error_furniture"
  ).textContent;
  errorCity = document.querySelector(
    "#page-create #frm-register #error_city"
  ).textContent;
  errorDistrict = document.querySelector(
    "#page-create #frm-register #error_district"
  ).textContent;
  errorWard = document.querySelector(
    "#page-create #frm-register #error_ward"
  ).textContent;

  if (
    errorName.length === 0 &&
    errorPrice.length === 0 &&
    errorAddress.length === 0 &&
    errorReporter.length === 0 &&
    errorType.length === 0 &&
    errorBedroom.length === 0 &&
    errorFurniture.length === 0 &&
    errorCity.length === 0 &&
    errorDistrict.length === 0 &&
    errorWard.length === 0
  ) {
    confirmPost();
  }
});

$(document).on(
  "vclick",
  "#page-create #popup-register-confirm #btn-confirm",
  registerPost
);

// Display Post List.
$(document).on("pagebeforeshow", "#page-list", showList);

// Save Post Id.
$(document).on("vclick", "#list-post li a", function (e) {
  e.preventDefault();

  var id = $(this).data("details").Id;
  localStorage.setItem("currentPostId", id);

  $.mobile.navigate("#page-detail", { transition: "none" });

  const closeModalButtons = document.querySelectorAll("[data-close-button]");

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      closeModal(modal);
    });
  });
});

// Show Post Details.
$(document).on("pagebeforeshow", "#page-detail", showDetail);

//close popup
$(document).on("vclick", "#page-detail #frm-update #cancel", function () {
  $("#page-detail #frm-update").popup("close");
});

//load data from db to update form
$(document).on("change", "#page-detail #frm-update #city", function () {
  importAddressUpdate(
    "#page-detail #frm-update",
    "District",
    -1,
    "City",
    this.value
  );
  importAddressUpdate(
    "#page-detail #frm-update",
    "Ward",
    -1,
    "District",
    this.value
  );
});

$(document).on("change", "#page-detail #frm-update #district", function () {
  importAddressUpdate(
    "#page-detail #frm-update",
    "Ward",
    -1,
    "District",
    this.value
  );
});

$(document).on("vclick", "#page-detail #btn-update-popup", function () {
  var id = localStorage.getItem("currentPostId");

  db.transaction(function (tx) {
    var query = "SELECT * FROM Post WHERE Id = ?";
    tx.executeSql(query, [id], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      if (result.rows[0] != null) {
        $(`#page-detail #frm-update #update-name`).val(
          result.rows[0].Property_name
        );
        $(`#page-detail #frm-update #update-rent`).val(
          result.rows[0].Rent_Price
        );
        $(`#page-detail #frm-update #update-address`).val(
          result.rows[0].Property_address
        );
        $(`#page-detail #frm-update #update-reporter`).val(
          result.rows[0].Reporter
        );

        addSelectOption(
          "#page-detail #frm-update #update-type",
          Type,
          "Type",
          result.rows[0].Property_type
        );
        addSelectOption(
          "#page-detail #frm-update #update-furniture",
          Furniture,
          "Furniture",
          result.rows[0].Furniture_type
        );
        addSelectOption(
          "#page-detail #frm-update #update-bedroom",
          Bedroom,
          "Bedroom",
          result.rows[0].Bedroom
        );

        importAddressUpdate(
          "#page-detail #frm-update",
          "City",
          result.rows[0].City
        );
        importAddressUpdate(
          "#page-detail #frm-update",
          "District",
          result.rows[0].District,
          "City",
          result.rows[0].City
        );
        importAddressUpdate(
          "#page-detail #frm-update",
          "Ward",
          result.rows[0].Ward,
          "District",
          result.rows[0].District
        );
      }
    }
  });
});

$("#page-detail #frm-update").on("submit", function (e) {
  e.preventDefault();

  checkCommonValidation(
    "#page-detail #frm-update #update-name",
    "#page-detail #frm-update #error_name",
    "Property Name",
    12,
    120
  );
  checkCommonValidation(
    "#page-detail #frm-update #update-address",
    "#page-detail #frm-update #error_address",
    "Property Address",
    6,
    100
  );
  checkCharacterValidation(
    "#page-detail #frm-update #update-reporter",
    "#page-detail #frm-update #error_reporter",
    "Reporter Name",
    3,
    120
  );
  checkPriceValidation(
    "#page-detail #frm-update #update-rent",
    "#page-detail #frm-update #error_price",
    "Monthly Price",
    100000,
    5000000000
  );
  checkSelectValidation(
    "#page-detail #frm-update #update-type",
    "#page-detail #frm-update #error_type",
    "Property Type"
  );
  checkSelectValidation(
    "#page-detail #frm-update #update-bedroom",
    "#page-detail #frm-update #error_bedroom",
    "Property Bedroom"
  );
  checkSelectValidation(
    "#page-detail #frm-update #update-furniture",
    "#page-detail #frm-update #error_furniture",
    "Property Furniture"
  );
  checkSelectValidation(
    "#page-detail #frm-update #city",
    "#page-detail #frm-update #error_city",
    "City"
  );
  checkSelectValidation(
    "#page-detail #frm-update #district",
    "#page-detail #frm-update #error_district",
    "District"
  );
  checkSelectValidation(
    "#page-detail #frm-update #ward",
    "#page-detail #frm-update #error_ward",
    "Ward"
  );

  errorName = document.querySelector(
    "#page-detail #frm-update #error_name"
  ).innerText;
  errorPrice = document.querySelector(
    "#page-detail #frm-update #error_price"
  ).textContent;
  errorAddress = document.querySelector(
    "#page-detail #frm-update #error_address"
  ).textContent;
  errorReporter = document.querySelector(
    "#page-detail #frm-update #error_reporter"
  ).textContent;
  errorType = document.querySelector(
    "#page-detail #frm-update #error_type"
  ).textContent;
  errorBedroom = document.querySelector(
    "#page-detail #frm-update #error_bedroom"
  ).textContent;
  errorFurniture = document.querySelector(
    "#page-detail #frm-update #error_furniture"
  ).textContent;
  errorCity = document.querySelector(
    "#page-detail #frm-update #error_city"
  ).textContent;
  errorDistrict = document.querySelector(
    "#page-detail #frm-update #error_district"
  ).textContent;
  errorWard = document.querySelector(
    "#page-detail #frm-update #error_ward"
  ).textContent;

  if (
    errorName.length === 0 &&
    errorPrice.length === 0 &&
    errorAddress.length === 0 &&
    errorReporter.length === 0 &&
    errorType.length === 0 &&
    errorBedroom.length === 0 &&
    errorFurniture.length === 0 &&
    errorCity.length === 0 &&
    errorDistrict.length === 0 &&
    errorWard.length === 0
  ) {
    updatePost();
  }
});

//update Post
// $(document).on('vclick', '#page-detail #btn-update', updatePost);
// $(document).on('submit', '#page-detail #frm-update', updatePost);

// Delete Post.
$(document).on("vclick", "#page-detail #frm-delete #btn-delete", deletePost);
$(document).on("vclick", "#page-detail #btn-delete-popup", () => {
  $("#page-detail #frm-delete #btn-delete ").addClass("ui-disabled");
  confirmDeletePost();
});
$("#page-detail #frm-delete").on("submit", deletePost);

// delete Note
$(document).on(
  "vclick",
  "#page-detail #list-note .note #btn-delete-note",
  deleteNote
);

// Add Comment.
$("#page-detail #frm-note").on("submit", addNote);

//search
$(document).on("pagebeforeshow", "#page-search", function () {
  addSelectOption("#page-search #frm-search #Property_type", Type, "Type");
  addSelectOption(
    "#page-search #frm-search #Furniture_types",
    Furniture,
    "Furniture"
  );
  addSelectOption("#page-search #frm-search #Bedroom", Bedroom, "Bedroom");

  importAddress("#page-search #frm-search", "City");
  importAddress("#page-search #frm-search", "District", "City");
  importAddress("#page-search #frm-search", "Ward", "District");
});

$(document).on("change", "#page-search #frm-search #city", function () {
  importAddress("#page-search #frm-search", "District", "City");
  importAddress("#page-search #frm-search", "Ward", "District");
});

$(document).on("change", "#page-search #frm-search #district", function () {
  importAddress("#page-search #frm-search", "Ward", "District");
});

//Submit in page Search
$("#page-search #frm-search").on("submit", (e) => {
  e.preventDefault();
  $("#page-search .popup").addClass("active");
  search();
});

//importAddress
function importAddress(from, name, parentName = "", selectedId = -1) {
  var lowerName = name.toLowerCase();
  // var selectedName = $('#page-create #frm-register #city option:selected').text();
  var id,
    condition = "";
  if (parentName) {
    id = $(`${from} #${parentName.toLowerCase()}`).val();
    condition = `WHERE ${parentName}Id = ${id}`;
  }

  db.transaction(function (tx) {
    var query = `SELECT * FROM ${name} ${condition} ORDER BY Name`;
    tx.executeSql(query, [], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      var optionList = `<option value="-1">Select ${name}</option> `;
      for (let item of result.rows) {
        optionList += `<option value="${item.Id}" ${
          item.Name === selectedId ? "selected" : ""
        }> ${item.Name}</option> `;
      }

      $(`${from} #${lowerName} `).html(optionList);
      $(`${from} #${lowerName} `).selectmenu("refresh", true);
    }
  });
}

// Confirm
function confirmPost() {
  // Get post input.
  var propertyname = $("#page-create #frm-register #Property_name").val();
  var propertyaddress = $("#page-create #frm-register #Property_address").val();
  var city = $("#page-create #frm-register #city option:selected").text();
  var district = $(
    "#page-create #frm-register #district option:selected"
  ).text();
  var ward = $("#page-create #frm-register #ward option:selected").text();
  var propertytype = $("#page-create #frm-register #Property_type").val();
  var bedroom = $("#page-create #frm-register #Bedroom").val();
  var rentprice = $("#page-create #frm-register #Rent_Price").val();
  var furnituretype = $("#page-create #frm-register #Furniture_types").val();
  var note = $("#page-create #frm-register #Note").val();
  var reportername = $("#page-create #frm-register #Reporter_name").val();

  db.transaction(function (tx) {
    var query = "SELECT Id FROM Post WHERE Property_name = ?";
    tx.executeSql(query, [propertyname], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      if (result.rows[0] == null) {
        $("#page-create #popup-register-confirm #Property_name").text(
          propertyname
        );
        $("#page-create #popup-register-confirm #Property_address").text(
          propertyaddress
        );
        $("#page-create #popup-register-confirm #city").text(city);
        $("#page-create #popup-register-confirm #district").text(district);
        $("#page-create #popup-register-confirm #ward").text(ward);
        $("#page-create #popup-register-confirm #Property_type").text(
          propertytype
        );
        $("#page-create #popup-register-confirm #Bedroom").text(bedroom);
        $("#page-create #popup-register-confirm #Rent_Price").text(rentprice);
        $("#page-create #popup-register-confirm #Furniture_types").text(
          furnituretype
        );
        $("#page-create #popup-register-confirm #Note").text(note);
        $("#page-create #popup-register-confirm #Reporter_name").text(
          reportername
        );

        $("#page-create #popup-register-confirm").popup("open");
      } else {
        alert("Post exists.");
      }
    }
  });
}

// Register
function registerPost(e) {
  e.preventDefault();

  var propertyname = $("#page-create #frm-register #Property_name").val();
  var propertyaddress = $("#page-create #frm-register #Property_address").val();
  var city = $("#page-create #frm-register #city").val();
  var district = $("#page-create #frm-register #district").val();
  var ward = $("#page-create #frm-register #ward").val();
  var propertytype = $("#page-create #frm-register #Property_type").val();
  var bedroom = $("#page-create #frm-register #Bedroom").val();

  var dateTime = new Date();

  var rentprice = $("#page-create #frm-register #Rent_Price").val();
  var furnituretype = $("#page-create #frm-register #Furniture_types").val();
  var note = $("#page-create #frm-register #Note").val();
  var reportername = $("#page-create #frm-register #Reporter_name").val();

  db.transaction(function (tx) {
    var query =
      "INSERT INTO Post (Property_name, Property_address, City, District, Ward, Property_type, Bedroom, DateTime, Rent_Price, Furniture_type, Reporter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    tx.executeSql(
      query,
      [
        propertyname,
        propertyaddress,
        city,
        district,
        ward,
        propertytype,
        bedroom,
        dateTime,
        rentprice,
        furnituretype,
        reportername,
      ],
      transactionSuccess,
      transactionError
    );

    function transactionSuccess(tx, result) {
      log(`Create a propertyName '${propertyname}' successfully.`);

      // Reset the form.
      $("#frm-register").trigger("reset");
      $("#propertyname").focus();

      $("#page-create #popup-register-confirm").popup("close");

      if (note) {
        db.transaction(function (tx) {
          var query = `INSERT INTO Note (Message, PostId, DateTime) VALUES (?, ?, ?)`;
          tx.executeSql(
            query,
            [note, result.insertId, dateTime],
            transactionSuccess,
            transactionError
          );

          function transactionSuccess(tx, result) {
            log(`Add new note to Post '${propertyname}' successfully.`);
          }
          function transactionError(tx, result) {
            log(`Note error`);
          }
        });
      }
    }
    function transactionError(tx, result) {
      log(`Post error`);
    }
  });
}

// List
function showList() {
  db.transaction(function (tx) {
    var query = `SELECT Post.Id AS Id, Post.Property_name AS Name,  Rent_Price as Price, Bedroom, Property_type as Type, City.Name AS City, District.Name as District
        FROM Post LEFT JOIN City ON Post.City = City.Id
                  LEFT JOIN District ON Post.District = District.Id`;
    tx.executeSql(query, [], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      log(`Get list of posts successfully.`);

      // Prepare the list of posts.
      var listPost = `<ul id='list-posts' data-filter='true' data-role='listview' class='ui-nodisc-icon'>`;
      for (let post of result.rows) {
        listPost += `<li> <a data-details='{"Id" : ${
          post.Id
        }}' style="padding: 0.7em 0.5em; background-color: #f48fb1; border: none !important;">
                <div class="card">
                    <div><strong>${post.Type}</strong> - ${post.Name}</div>
                    <p style="margin-left: 10px;" class="flex"><i class="fas fa-map-pin" style="font-size: 20px; margin-right: 20px;"></i>${
                      post.District
                    } - ${post.City}</p>
                    <div class="flex-between" style="margin: 30px 20px 10px 10px">
                        <div class="flex-column">
                          <i class="fas fa-dollar-sign"></i>
                          <p style="font-size: 14px; font-weight: 300; text-shadow: none !important;">${post.Price.toLocaleString()} Đ</p>
                        </div>
                        <div class="flex-column" style="max-width:50%; width: 100%">
                          <i class="fas fa-bed"></i>
                          <p style="font-size: 14px; font-weight: 300; text-shadow: none !important;">${
                            post.Bedroom
                          }</p>
                        </div>
                        
                    </div>
                </div>
                
            </a></li> `;
      }
      listPost += `</ul> `;

      // Add list to UI.
      $("#list-post")
        .empty()
        .append(listPost)
        .listview("refresh")
        .trigger("create");

      log(`Show list of posts successfully.`);
    }
  });
}

// Detail
function showDetail() {
  var id = localStorage.getItem("currentPostId");

  db.transaction(function (tx) {
    var query = `SELECT Post.*,
                     City.Name AS CityName,
                     District.Name AS DistrictName,
                     Ward.Name AS WardName
                     FROM Post 
                     LEFT JOIN City ON City.Id = Post.City
                     LEFT JOIN District ON District.Id = Post.District
                     LEFT JOIN Ward ON Ward.Id = Post.Ward
                     WHERE Post.Id = ?`;
    tx.executeSql(query, [id], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      var errorMessage = "Post not found.";
      var propertyname = errorMessage;
      var propertyaddress = errorMessage;
      var city = errorMessage;
      var district = errorMessage;
      var ward = errorMessage;
      var propertytype = errorMessage;
      var bedroom = errorMessage;
      var dateTime = errorMessage;
      var rentprice = errorMessage;
      var furnituretype = errorMessage;
      var reportername = errorMessage;

      if (result.rows[0] != null) {
        log(`Get details of post '${id}' successfully.`);

        propertyname = result.rows[0].Property_name;
        propertyaddress = result.rows[0].Property_address;
        city = result.rows[0].CityName;
        district = result.rows[0].DistrictName;
        ward = result.rows[0].WardName;
        propertytype = result.rows[0].Property_type;
        bedroom = result.rows[0].Bedroom;
        dateTime = result.rows[0].DateTime;
        rentprice = result.rows[0].Rent_Price.toLocaleString();
        furnituretype = result.rows[0].Furniture_type;
        reportername = result.rows[0].Reporter;
      } else {
        log(errorMessage, ERROR);

        $("#page-detail #btn-update").addClass("ui-disabled");
        $("#page-detail #btn-delete-confirm").addClass("ui-disabled");
      }

      $("#page-detail #id").val(id);
      $("#page-detail #Property_name").text(propertyname);
      $("#page-detail #Property_address").text(propertyaddress);
      $("#page-detail #City").text(city);
      $("#page-detail #District").text(district);
      $("#page-detail #Ward").text(ward);
      $("#page-detail #Property_type").text(propertytype);
      $("#page-detail #Bedroom").text(bedroom);
      $("#page-detail #date").text(
        moment(dateTime).format("dddd, MMMM Do YYYY, h:mm:ss A")
      );
      $("#page-detail #Rent_Price").text(rentprice);
      $("#page-detail #Furniture_type").text(furnituretype);

      $("#page-detail #Reporter_name").text(reportername);

      showNote();
    }
  });
}

// address
function importAddressUpdate(
  from,
  name,
  selectedId = -1,
  parentName = "",
  selectedParentId = -1
) {
  var lowerName = name.toLowerCase();
  // var selectedName = $('#page-create #frm-register #city option:selected').text();
  var id,
    condition = "";
  if (parentName) {
    // id = $(`${from} #${parentName.toLowerCase()}`).val();
    condition = `WHERE ${parentName}Id = ${selectedParentId}`;
  }

  db.transaction(function (tx) {
    var query = `SELECT * FROM ${name} ${condition} ORDER BY Name`;
    tx.executeSql(query, [], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      var optionList = `<option value="-1">Select ${name}</option> `;
      for (let item of result.rows) {
        optionList += `<option value="${item.Id}" ${
          item.Id == selectedId ? "selected" : ""
        }> ${item.Name}</option> `;
      }

      $(`${from} #${lowerName}`).html(optionList);
      $(`${from} #${lowerName}`).selectmenu("refresh", true);
    }
  });
}

function addSelectOption(select, list, name, selectedValue = "") {
  var optionList = `<option value="-1">Select ${name}</option>`;

  for (var key in list) {
    optionList += `<option value="${list[key]}" ${
      list[key] == selectedValue ? "selected" : ""
    }>${key}</option>`;
  }

  $(`${select}`).html(optionList);
  $(`${select}`).selectmenu("refresh", true);
}

function updatePost() {
  var id = localStorage.getItem("currentPostId");
  var propertyname = $("#page-detail #frm-update #update-name").val();
  var propertyaddress = $("#page-detail #frm-update #update-address").val();
  var city = $("#page-detail #frm-update #city").val();
  var district = $("#page-detail #frm-update #district").val();
  var ward = $("#page-detail #frm-update #ward").val();
  var propertytype = $("#page-detail #frm-update #update-type").val();
  var bedroom = $("#page-detail #frm-update #update-bedroom").val();
  var rentprice = $("#page-detail #frm-update #update-rent").val();
  var furnituretype = $("#page-detail #frm-update #update-furniture").val();
  var reportername = $("#page-detail #frm-update #update-reporter").val();
  var dateTime = new Date();

  db.transaction(function (tx) {
    var query =
      "UPDATE Post SET Property_name = ?, Property_address = ?, City = ? , District = ?, Ward = ? , Property_type = ?, Bedroom = ?, Rent_Price = ?, Furniture_type = ?, Reporter = ?, DateTime = ? WHERE id = ?";
    tx.executeSql(
      query,
      [
        propertyname,
        propertyaddress,
        city,
        district,
        ward,
        propertytype,
        bedroom,
        rentprice,
        furnituretype,
        reportername,
        dateTime,
        id,
      ],
      transactionSuccess,
      transactionError
    );

    function transactionSuccess(tx, result) {
      log(`Update Post '${id}' successfully.`);

      // $.mobile.navigate('#page-list', { transition: 'none' });
      showDetail();
      $("#page-detail #frm-update").popup("close");
    }
  });
}

//delete
function confirmDeletePost() {
  var id = localStorage.getItem("currentPostId");
  document.querySelector("#page-detail #frm-delete #txt-delete").value = "";

  db.transaction(function (tx) {
    var query = "SELECT Post.Property_name as Name FROM Post Where Id = ?";
    tx.executeSql(query, [id], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      $("#frm-delete #confirm-text").text(result.rows[0].Name);

      $(document).on(
        "keyup input",
        "#page-detail #frm-delete #txt-delete",
        function () {
          var text = this.value;
          console.log("textKeyPress", text);

          if (text === result.rows[0].Name) {
            $("#page-detail #frm-delete #btn-delete").removeClass(
              "ui-disabled"
            );
          } else {
            $("#page-detail #frm-delete #btn-delete ").addClass("ui-disabled");
          }
        }
      );
    }

    function deletePost(e) {
      e.preventDefault();
      var text = $("#page-detail #frm-delete #txt-delete").val();
      if (text != "#confirm-text") return;
      var id = localStorage.getItem("currentPostId");

      db.transaction(function (tx) {
        var query = "DELETE FROM Post WHERE Id = ?";
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
          log(`Delete post '${id}' successfully.`);

          $("#page-detail #frm-delete").trigger("reset");

          $.mobile.navigate("#page-list", { transition: "none" });
        }
      });
    }
  });
}

function deletePost(e) {
  e.preventDefault();

  var id = localStorage.getItem("currentPostId");

  db.transaction(function (tx) {
    var query = "DELETE FROM Post WHERE Id = ?";
    tx.executeSql(query, [id], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      log(`Delete post '${id}' successfully.`);

      alert(`Deleted this Post successfully.`);

      $("#page-detail #frm-delete").trigger("reset");
      $("#page-detail #frm-delete #txt-delete").val("");

      $.mobile.navigate("#page-list", { transition: "none" });
    }
  });
}

//Add Note
function addNote(e) {
  e.preventDefault();

  var postId = localStorage.getItem("currentPostId");
  var note = $("#page-detail #frm-note #txt-note").val();
  var dateTime = new Date();

  if (note) {
    db.transaction(function (tx) {
      var query =
        "INSERT INTO Note (Message, DateTime, PostId) VALUES (?, ?, ?)";
      tx.executeSql(
        query,
        [note, dateTime, postId],
        transactionSuccess,
        transactionError
      );

      function transactionSuccess(tx, result) {
        log(`Add new note to post '${postId}' successfully.`);

        $("#page-detail #frm-note").trigger("reset");

        showNote();
      }
    });
  } else {
    alert("Please enter something on note before add it to your post.");
  }
}

// deleteNote
function deleteNote() {
  var postId = localStorage.getItem("currentPostId");

  var noteId = parseInt(
    document.querySelector("#page-detail #list-note .note").id
  );

  db.transaction(function (tx) {
    var query = "DELETE FROM Note WHERE Id = ?";
    tx.executeSql(query, [noteId], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      log(`Delete ${noteId} note in post '${postId}' successfully.`);

      // $('#page-detail #frm-note').trigger('reset');

      showNote();
    }
  });
}

// Show Comment.
function showNote() {
  var postId = localStorage.getItem("currentPostId");

  db.transaction(function (tx) {
    var query = "SELECT * FROM Note WHERE PostId = ? ORDER BY DateTime";
    tx.executeSql(query, [postId], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      log(`Get list of Notes successfully.`);

      // Prepare the list of comments.
      var listNote = "";
      for (let note of result.rows) {
        listNote += `<div style="position: relative;" id=${
          note.Id
        } class="note">
                                <button id='btn-delete-note'><i class="fas fa-eraser"></i></button>
                                <div class='message-text'>${note.Message}</div>
                                <div class='message-hour'>${moment(
                                  note.DateTime
                                ).format("dddd, h:mm:ss A")}</div>
                            </div>`;
      }

      // Add list to UI.
      $("#list-note").empty().append(listNote);

      log(`Show list of notes successfully.`);
    }
  });
}

//Search
function search() {
  var propertyname = $("#page-search #frm-search #Property_name").val();
  var propertyaddress = $("#page-search #frm-search #Property_address").val();
  var city = $("#page-search #frm-search #city").val();
  var district = $("#page-search #frm-search #district").val();
  var ward = $("#page-search #frm-search #ward").val();
  var propertytype = $("#page-search #frm-search #Property_type").val();
  var bedroom = $("#page-search #frm-search #Bedroom").val();
  var rentprice = $("#page-search #frm-search #Rent_Price").val();
  var furnituretype = $("#page-search #frm-search #Furniture_types").val();

  console.log("propertyname", propertyname);
  console.log("city", city);
  console.log("district", district);
  console.log("ward", ward);
  console.log("propertytype", propertytype);
  console.log("bedroom", bedroom);
  console.log("furnituretype", furnituretype);

  db.transaction(function (tx) {
    var query = `SELECT Post.Id AS Id, Post.Property_name AS Name, Post.Rent_price AS Price, Post.Bedroom AS Bedroom, Post.Property_type as Type, City.Name AS City
          FROM Post LEFT JOIN City ON Post.City = City.Id WHERE`;

    if (propertyname) {
      query += ` Property_name LIKE "%${propertyname}%"   AND`;
    }

    if (propertyaddress) {
      query += ` Property_address LIKE "%${propertyaddress}%"   AND`;
    }

    if (city != "-1") {
      query += ` City = ${city}   AND`;
    }
    if (district != "-1") {
      query += ` District = ${district}   AND`;
    }
    if (ward != "-1") {
      query += ` Ward = ${ward}   AND`;
    }

    if (propertytype != "-1") {
      query += ` Property_type = "${propertytype}"   AND`;
    }

    if (bedroom != "-1") {
      query += ` Bedroom = ${bedroom}   AND`;
    }

    if (furnituretype != "-1") {
      query += ` Furniture_type = "${furnituretype}"   AND`;
    }

    if (rentprice) {
      query += ` Rent_Price <= ${rentprice}   AND`;
    }

    query = query.substring(0, query.length - 6);

    tx.executeSql(query, [], transactionSuccess, transactionError);

    function transactionSuccess(tx, result) {
      log(`Get list of posts successfully.`);

      if (result.rows.length === 0) {
        document.querySelector("#page-search #search-message").innerHTML =
          "Post not Found.";
      } else {
        document.querySelector("#page-search #search-message").innerHTML = "";
      }
      // Prepare the list of posts.
      var listPost = `<ul id='list-property' data-role='listview' class='ui-nodisc-icon'>`;
      for (let post of result.rows) {
        listPost += `<li> <a data-details='{"Id" : ${
          post.Id
        }}' style="padding: 0.7em 0.5em; background-color: transparent !important; border-color: transparent !important">
                  <div class="card">
                      <div class="title"><strong>${post.Type}</strong> - ${
          post.Name
        }</div>
                      <p style="margin-left: 10px;" class="flex"><i class="fas fa-map-pin" style="font-size: 20px; margin-right: 20px;"></i>${
                        post.City
                      }</p>
                      <div class="flex-between" style="margin: 30px 20px 10px 10px">
                          <div class="flex-column">
                            <i class="fas fa-dollar-sign"></i>
                            <p style="font-size: 14px; font-weight: 300;">${post.Price.toLocaleString()} Đ</p>
                          </div>
                          <div class="flex-column" style="max-width:50%; width: 100%">
                            <i class="fas fa-bed"></i>
                            <p style="font-size: 14px; font-weight: 300;">${
                              post.Bedroom
                            }</p>
                          </div>
                          
                      </div>
                  </div>
                  
              </a></li> `;
      }
      listPost += `</ul> `;

      // Add list to UI.
      $("#page-search #list-post")
        .empty()
        .append(listPost)
        .listview("refresh")
        .trigger("create");
      log(`Show list of posts successfully.`);
    }
  });
}

//modal
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

// ==  Code js của cw2 bài số 02: chức năng thông báo tin nhắn bằng âm thanh và rung  =========================
$(document).on("vclick", "#btn-cordova-beep", cordovaBeep);
function cordovaBeep() {
  navigator.notification.beep(4);
}
$(document).on("vclick", "#btn-cordova-vibration", cordovaVibration);

function cordovaVibration() {
  navigator.vibrate(1000, 1000, 1000, 3000, 3000, 3000, 1000, 1000, 1000);
}
