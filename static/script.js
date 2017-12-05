numToMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function setup() {
	document.getElementById("addcat").addEventListener("click", addCategory, true);
	document.getElementById("addpurch").addEventListener("click", addPurchase, true);
	poller()
	//makeReq("GET", "/cats", 200, repopulate);
	//makeReq("GET", "/purchases", 200, repopulate);
}

function makeReq(method, target, retCode, action, data) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = makeHandler(httpRequest, retCode, action);
	httpRequest.open(method, target);
	
	if (data){
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.send(data);
	}
	else {
		httpRequest.send();
	}
}

function makeHandler(httpRequest, retCode, action) {
	function handler() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === retCode) {
				action(httpRequest.responseText);
			} else if (httpRequest.status == 400) {
				alert("Please make sure all fields were entered correctly.");
			} else {
				alert("There was a problem with the request.  you'll need to refresh the page!");
			}
		}
	}
	return handler;
}

function addPurchase() {
	var newbought = document.getElementById("newbought").value;
	var newamount = document.getElementById("newamount").value;
	var newdate = document.getElementById("newdate").value;
	var newcat = document.getElementById("newcat").value;
	var data = "amount="+newamount+"&bought="+newbought+"&date="+newdate+"&category="+newcat;
	makeReq("PUT", "/purchases", 201, poller, data);
}

function addCategory() {
	var newname = document.getElementById("newcatname").value;
	var newlimit = document.getElementById("newcatlimit").value;
	var data = "name=" + newname + "&limit="+newlimit;
	//window.clearTimeout(timeoutID);
	makeReq("POST", "/cats", 201, poller, data);
	//document.getElementById("newDo").value = "New ToDo Item";
}

function clearForms() {
	document.getElementById("newbought").value = "";
	document.getElementById("newamount").value = "";
	document.getElementById("newdate").value = "";
	document.getElementById("newcat").value = "";
	document.getElementById("newcatname").value = "";
	document.getElementById("newcatlimit").value = "";
}

function poller() {
	clearForms();
	makeReq("GET", "/cats", 200, repopulate);
	var d = new Date();
	//d = d.getMonth() + 1;
	var data = "month="+(d.getMonth()+1)+"&year="+d.getFullYear();
	makeReq("GET", "/purchases", 200, printConsole, "month="+d);
}

function deleteCat(catName) {
	makeReq("DELETE", "/cats", 204, poller, "name="+catName);
}

// helper function for repop:
function addCell(row, text) {
	var newCell = row.insertCell();
	var newText = document.createTextNode(text);
	newCell.appendChild(newText);
}

function printConsole(responseText) {
	var purchases = JSON.parse(responseText);
	
	var tab = document.getElementById("uncategorized");
	while (tab.rows.length > 1) {
		tab.deleteRow(1);
	}
	var newRow = tab.insertRow();
	var numpurchases = purchases.reduce(function(count, current) {
		if (current["category"] == "") {
			return count + 1;
		} else {
			return count;
		}
	}, 0);
	var spent = purchases.reduce(function(amount, current) {
		if (current["category"] == "") {
			return amount + current['amount']
		} else {
			return amount;
		}
	}, 0);
	addCell(newRow, numpurchases);
	addCell(newRow, "$"+spent);
	console.log("Purchases:");
	for (var purchase in purchases) {
		
		console.log(purchases[purchase])
	}
	//console.log(purchases);
}

function repopulate(responseText) {
	console.log("Categories:");
	var cats = JSON.parse(responseText);
	var tab = document.getElementById("categories");
	if (cats.length == 0) {
		//tab.innerHTML = "There are no categories.";
	}
	var newRow, newCell, t, task, newButton, newDelF;

	while (tab.rows.length > 1) {
		tab.deleteRow(1);
	}
			
	for (t in cats) {
		newRow = tab.insertRow();
		console.log(cats[t]);
		var month = new Date().getMonth();
		addCell(newRow, numToMonth[month]);
		keys = [];
		for (var key in cats[t]) keys.push(key);
		addCell(newRow, keys[0]);
		var limit = cats[t][keys[0]]['limit']
		addCell(newRow, "$"+limit);
		var spentlist = cats[t][keys[0]]["purchases"].map(function(obj) {
			if (obj["date"].split("-")[1] == new Date().getMonth() + 1 && obj["date"].split("-")[0] == new Date().getFullYear()) {
				return obj["amount"];
			} else return 0;
		});
		var spent = 0;
		if (spentlist.length != 0) {
			spent = spentlist.reduce((prev, curr) => prev + curr);
		}
		var purchases = spentlist.reduce(function(prev, curr) {
			if (curr != 0) return prev + 1;
			else return prev;
		}, 0);
		addCell(newRow, purchases);
		addCell(newRow, "$"+spent);
		addCell(newRow, "$"+(limit-spent));
		newCell = newRow.insertCell();
		newButton = document.createElement("input");
		newButton.type = "button";
		newButton.value = "Delete " + keys[0];
		(function(_t){ newButton.addEventListener("click", function() { deleteCat(_t); }); })(keys[0]);
		newCell.appendChild(newButton);
	}
	
	//timeoutID = window.setTimeout(poller, timeout);
}

// setup load event
window.addEventListener("load", setup, true);
