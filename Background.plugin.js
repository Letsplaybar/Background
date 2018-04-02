//META{"name":"Background"}*//

var Background = function(){};
	
var timer;

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
	var obj = $("[class~=app]");
	obj.attr("style","background: url("+url+") !important;background-size: cover !important;");
	if(amount == json.img.length-1){
		amount = -1;
	}
	});
};

var addPicture = function(name1, url1){
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.img.push({name:name1,url:url1});
		save(JSON.stringify(json),"Background.config.json");
	});
}
;

var setTime = function(time){
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.time = time;
		save(JSON.stringify(json),"Background.config.json");
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
		save(JSON.stringify(json),"Background.config.json");
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

Background.prototype.getSettingsPanel = function () {
	var timer = "";
	var html = createContent();
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		timer = json.time;
	});
    return "<h3>Settings Panel</h3><br> <div style=\"color: white;\">Name:<br><input type=\"text\" id=\"name\" style=\"width: 95%;\"> <br> <br> URL:<br><input type\"text\" id=\"url\" style=\"width: 95%;\"> <br> <br> <button onclick=\"addValue()\" style=\"width: 25%;\">Hinzufügen</button></div><br><br><div style=\"color: white;\">Time:<br><input id=\"time\"style=\"width: 95%;\" value=\""+timer+"\"> <br> <br> <button onclick=\"changeTime()\" style=\"width: 25%;\">Time ändern</button></div><br><br><div style=\"color: white;\"> Picture:<br><div id=\"content\">"+html+"</div><br><br><button onclick=\"remove()\" style=\"width: 25%;\">Remove</button></div>";
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
    return "0.1.0";
};

Background.prototype.getAuthor = function () {
    return "Letsplaybar";
};
