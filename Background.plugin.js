//META{"name":"Background"}*//

var Background = function(){};
	
var timer;

var testing = false;
var testurl="";

var amount = -1;

function readTextFile(file, callback) {
	var filepath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "\\AppData\\Roaming\\BetterDiscord\\plugins\\"+file;
	var fs = require('fs');
    callback(fs.readFileSync(filepath));
	
};

var setBackground = function(){
	amount++;
	readTextFile("Background.config.json",function(text){
	var json = JSON.parse(text);
	
	// Array enthält alle Elemente des Dokuments
	
	var url = json.img[amount].url;
	changeBackground(url);
	if(amount == json.img.length-1){
		amount = -1;
	}
	});
};

var changeBackground = function(url){
	var obj = $("[class~=app]");
	obj.attr("style","background: url("+url+") !important;background-size: cover !important;");
};

var addPicture = function(name1, url1){
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.img.push({name:name1,url:url1});
		save(JSON.stringify(json,null, "\t"),"Background.config.json");
	});
}
;

var setTime = function(time){
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.time = time;
		save(JSON.stringify(json,null, "\t"),"Background.config.json");
		clearInterval(timer);
		timer = setInterval(setBackground,1000*timer);
	});
}
;

var removePicture = function(name){
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		var i = -1;
		json.img.forEach(function(element){
			i++;
			if(element.name == name){
				json.img.splice(i,1);
			}
		});
		save(JSON.stringify(json,null, "\t"),"Background.config.json");
		clearInterval(timer);
		timer = setInterval(setBackground,1000*timer);
	});
};

var save = function(value, file){
	var filepath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "\\AppData\\Roaming\\BetterDiscord\\plugins\\"+file;
	var fs = require('fs');
	fs.writeFileSync(filepath, value, function(err) {
		if (err) {
			console.log(err);
		}
	});
};
	
Background.prototype.start = function () {
	setBackground();
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		timer = setInterval(setBackground,1000*json.time);})
	console.log("Background started");
};


Background.prototype.load = function () {
	
};

Background.prototype.unload = function () {}
;

Background.prototype.stop = function () {
	clearInterval(timer);
	amount =-1;
	console.log("Background stopped");
};

Background.prototype.onMessage = function () {
    //called when a message is received
};

Background.prototype.onSwitch = function () {
    //called when a server or channel is switched
};

Background.prototype.observer = function (e) {
    //raw MutationObserver event for each mutation
};

var addValue = function(){
	var name = document.getElementById("name").value;
	if(name == "undefined")
		return;
	var url = document.getElementById("url").value;
	if(url == "undefined")
		return;
	addPicture(name, url);
	document.getElementById("name").value = "";
	document.getElementById("url").value = "";
	var html = createContent();
	document.getElementById("content").innerHTML = html;
	console.log("Picture added");
};

var changeTime = function(){
	var time =document.getElementById("time").value;
	setTime(time);
	console.log("Time changed");
};

var remove = function(){
	var img = document.querySelector('input[name="picture"]:checked').value;
	removePicture(img);
	document.getElementById("content").innerHTML = createContent();
	console.log("Picture removed");
};

var createContent = function(){
	var html = "";
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.img.forEach(function(element){
			html = html + "<input type=\"radio\" name=\"picture\" value=\""+element.name+"\"> "+element.name+"<br> ";
		});
	});
	return html;
}

var changeTesting = function(){
	if(testing){
		console.log("Testing end")
		testing = false;
		readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		setBackground()
		timer = setInterval(setBackground,1000*json.time);});
		testurl = ""
		document.getElementById("test").value = testurl;
		document.getElementById("testid").innerHTML = test();
		return;
	}
	console.log("Testing begin")
	testing = true;
	clearInterval(timer);
	testurl = document.getElementById("test").value;
	changeBackground(testurl);
	document.getElementById("testid").innerHTML = test();
}
;

var test = function(){
	if(testing){
		return "Testen beenden";
	}
	return "Testen starten";
}
;

Background.prototype.getSettingsPanel = function () {
	var timer = "";
	var html = createContent();
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		timer = json.time;
	});
    return "<h3>Settings Panel</h3><br> <div style=\"color: white;\">Name:<br><input type=\"text\" id=\"name\" style=\"width: 95%;\"> <br> <br> URL:<br><input type\"text\" id=\"url\" style=\"width: 95%;\"> <br> <br> <button onclick=\"addValue()\" style=\"width: 25%;\">Add</button></div><br><br><div style=\"color: white;\">Time:<br><input id=\"time\"style=\"width: 95%;\" value=\""+timer+"\"> <br> <br> <button onclick=\"changeTime()\" style=\"width: 25%;\">change Time</button></div><br><br><div style=\"color: white;\"> Picture:<br><div id=\"content\">"+html+"</div><br><br><button onclick=\"remove()\" style=\"width: 25%;\">Remove</button></div><br><br><div style=\"color: white;\">Testen:<br><input id=\"test\"style=\"width: 95%;\" value=\""+testurl+"\"> <br> <br> <button id=\"testid\" onclick=\"changeTesting()\" style=\"width: 25%;\">"+test()+"</button></div>";
};

Background.prototype.getName = function () {
    return "Background";
};

Background.prototype.getDescription = function () {
	var value;
	readTextFile("Background.config.json",function(text){
	var json = JSON.parse(text);
	if(json.img[amount] == undefined)
		value = "Ein Plugin um den Background zu wechseln";
	else
		value= "Ein Plugin um den Background zu wechseln \r\n Aktueller Hintergrund: " + json.img[amount].name;
	});
    return value;
};

Background.prototype.getVersion = function () {
    return "0.1.1";
};

Background.prototype.getAuthor = function () {
    return "Letsplaybar";
};
