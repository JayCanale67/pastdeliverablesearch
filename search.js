var project_arr = [];
var category_arr = [];
var project_checkboxes = [];
var public_checkboxes = [];
var category_checkboxes = [];
var rows_data = [];

var projectID = 1;

//project checkboxes
data["PastDeliverablesList"].forEach((element) => {
  var project_str = parseInt(element["Project"]);
  if (!project_arr.includes(project_str)) {
    project_arr.push(project_str);
  }
  project_arr.sort();
});

//public checkbox
var publicCheckboxList = document.getElementById("publicFilter");
var checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.id = "publiccheckbox";
checkbox.name = "public";
checkbox.value = "Public";
checkbox.checked = true;
checkbox.className = "mr-2";
checkbox.setAttribute("onchange", "onCategoryChange()");
var label = document.createElement("label");
label.htmlFor = "Public";
label.className = "mr-3 d-inline";
label.appendChild(document.createTextNode("Public"));
var br = document.createElement("br");
publicCheckboxList.appendChild(checkbox);
publicCheckboxList.appendChild(label);
publicCheckboxList.appendChild(br);
public_checkboxes.push(checkbox);

//private checkbox
var checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.id = "privatecheckbox";
checkbox.name = "private";
checkbox.value = "Private";
checkbox.checked = true;
checkbox.className = "mr-2";
checkbox.setAttribute("onchange", "onCategoryChange()");
var label = document.createElement("label");
label.htmlFor = "Private";
label.className = "mr-3 d-inline";
label.appendChild(document.createTextNode("Private"));
var br = document.createElement("br");
publicCheckboxList.appendChild(checkbox);
publicCheckboxList.appendChild(label);
publicCheckboxList.appendChild(br);
public_checkboxes.push(checkbox);

//project checkboxes
var projectCheckboxList = document.getElementById("projectFilter");
project_arr.sort((a, b) => a - b);
project_checkboxes = [];
project_arr.forEach((element) => {
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = element + "checkbox";
  checkbox.name = "project";
  checkbox.value = element;
  checkbox.checked = false;
  checkbox.className = "mr-2";
  checkbox.setAttribute("onchange", "onProjectChange()");
  var label = document.createElement("label");
  label.htmlFor = element;
  label.className = "mr-3 d-inline";
  label.appendChild(document.createTextNode('P37-' + (100 + parseInt(element))));
  var br = document.createElement("br");
  projectCheckboxList.appendChild(checkbox);
  projectCheckboxList.appendChild(label);
  projectCheckboxList.appendChild(br);
  project_checkboxes.push(checkbox);
});

//creates an array containing all the project names
//and all the check boxes.
function onProjectChange() {
  category_arr = [];
  category_checkboxes = [];
  var checkboxList = document.getElementById("categoryFilter");
  checkboxList.innerHTML = "";
  for (i = 0; i < project_checkboxes.length; i++) {
    if (project_checkboxes[i].checked == true) {
      data["PastDeliverablesList"].forEach((element) => {
        var category = element["Category"];
        var id = project_checkboxes[i].value;
        if (
          parseInt(element["Project"]) === parseInt(id)) {
          if (!category_arr.includes(element["Category"])) {
            category_arr.push(element["Category"]);
          }
        }
      });
      category_arr.sort();
    }
  }
  var tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = "";
  var checkboxList = document.getElementById("categoryFilter");
  checkboxList.innerHTML = "";
  category_arr.forEach((element) => {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id =
      element
        .replace(/\s/g, "")
        .replace(/[^\w ]/g, "")
        .replace(/,/g, "") + "checkbox";
    checkbox.name = "category";
    checkbox.value = element;
    checkbox.checked = false;
    checkbox.className = "mr-2";
    checkbox.setAttribute("onchange", "onCategoryChange()");
    var label = document.createElement("label");
    label.htmlFor = element;
    label.className = "mr-3 d-inline";
    label.appendChild(document.createTextNode(element));
    var br = document.createElement("br");
    checkboxList.appendChild(checkbox);
    checkboxList.appendChild(label);
    checkboxList.appendChild(br);
    category_checkboxes.push(checkbox);
  });
}

function onCategoryChange() {
  rows_data = [];
  var rowData = [];

  for (i = 0; i < project_checkboxes.length; i++) {
    if (project_checkboxes[i].checked === true) {
      var projectNum = parseInt(project_checkboxes[i].value);
      //console.log(projectNum);
      for (j = 0; j < category_checkboxes.length; j++) {
        if (category_checkboxes[j].checked === true) {
          var cat_str = category_checkboxes[j].value;
          //console.log(cat_str);
          data["PastDeliverablesList"].forEach((element) => {
            //console.log(cat_str);
            if (
              parseInt(element["Project"]) == projectNum &&
              cat_str == element["Category"]
            ) {
              if (element["Public"] == "Yes" && public_checkboxes[0].checked) {
                var data = [
                  element["Name"],
                  element["Category"],
                  element["PID"],
                  element["Date"],
                  "Public",
                  element["Link"],
                ];
                rowData.push(data);
              }
              if (element["Public"] == "No" && public_checkboxes[1].checked) {
                var data = [
                  element["Name"],
                  element["Category"],
                  element["PID"],
                  element["Date"],
                  "Private",
                  element["Link"],
                ];
                rowData.push(data);
              }
            }
          });
          //console.log(rowData);
        }
      }
    }
  }
  generateTable(rowData);
}

function generateTable(rows) {
  var tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = "";
  if (rows.length == 0) return;
  var table = document.createElement("TABLE");
  table.style.border = "solid 1px black";
  tableContainer.appendChild(table);
  let thead = table.createTHead();
  let row = thead.insertRow();
  let keys = ["Name", "Category", "PID", "Date", "Public/Private"];
  let widths = ["60%", "10%", "10%", "10%", "10%"];
  for (let i = 0; i < keys.length; i++) {
    let th = document.createElement("th");
    th.style.width = widths[i];
    th.setAttribute("onClick", "sortTable(" + i + ")");
    th.style.cursor = "pointer";
    let text = document.createTextNode(keys[i]);
    th.appendChild(text);
    row.appendChild(th);
  }
  let tbody = table.createTBody();
  for (let row of rows) {
    addRow(tbody, row);
  }
  sortTable(3);
}

function addRow(tbody, data) {
  let row = tbody.insertRow();
  row.style.border = "solid 1px black";
  for (let i = 0; i < data.length - 1; i++) {
    let cell = row.insertCell();
    if (i == 2) {
      var aTag = document.createElement("a");
      aTag.setAttribute("href", data[5]);
      aTag.target = "_blank";
      aTag.innerText = data[i];
      cell.appendChild(aTag);
    } else {
      data[i] = data[i] == null ? "" : data[i];
      let text = document.createTextNode(data[i]);
      cell.appendChild(text);
    }
  }
}

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("tableContainer");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("tr");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (n == 3) {
        if (dir == "asc") {
          if (new Date(y.innerHTML) > new Date(x.innerHTML)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (new Date(x.innerHTML) > new Date(y.innerHTML)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      } else {
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
