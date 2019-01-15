//META{"name":"Background","source":"https://raw.githubusercontent.com/Letsplaybar/Background/master/Background.plugin.js"}*//

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

Background.prototype.setBackground = function(){
	amount++;
	readTextFile("Background.config.json",function(text){
	var json = JSON.parse(text);
	
	// Array enthält alle Elemente des Dokuments
	
	var url = json.img[amount].url;
	BdApi.getPlugin('Background').changeBackground(url);
	if(amount == json.img.length-1){
		amount = -1;
	}
	});
	PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/Letsplaybar/Background/master/Background.plugin.js");
};

Background.prototype.changeBackground = function(url){
	document.documentElement.style.setProperty("--background-image","url("+url+")");
};

Background.prototype.addPicture = function(name1, url1){
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.img.push({name:name1,url:url1});
		save(JSON.stringify(json,null, "\t"),"Background.config.json");
	});
}
;

Background.prototype.setTime = function(time){
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.time = time;
		save(JSON.stringify(json,null, "\t"),"Background.config.json");
		clearInterval(timer);
		timer = setInterval(BdApi.getPlugin('Background').setBackground,1000*timer);
	});
}
;

Background.prototype.removePicture = function(name){
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		var i = -1;
		json.img.forEach(function(element){
			i++;
			if(element.name == name){
				json.img.splice(i,1);
			}
		});
		BdApi.getPlugin('Background').save(JSON.stringify(json,null, "\t"),"Background.config.json");
		clearInterval(timer);
		timer = setInterval(BdApi.getPlugin('Background').setBackground,1000*timer);
	});
};

Background.prototype.save = function(value, file){
	var filepath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "\\AppData\\Roaming\\BetterDiscord\\plugins\\"+file;
	var fs = require('fs');
	fs.writeFileSync(filepath, value, function(err) {
		if (err) {
			console.log(err);
		}
	});
};

Background.prototype.addValue = function(){
	var name = document.getElementById("name").value;
	if(name == "undefined")
		return;
	var url = document.getElementById("url").value;
	if(url == "undefined")
		return;
	BdApi.getPlugin('Background').addPicture(name, url);
	document.getElementById("name").value = "";
	document.getElementById("url").value = "";
	var html = BdApi.getPlugin('Background').createContent();
	document.getElementById("content").innerHTML = html;
	console.log("Picture added");
};

Background.prototype.changeTime = function(){
	var time =document.getElementById("time").value;
	BdApi.getPlugin('Background').setTime(time);
	console.log("Time changed");
};

Background.prototype.remove = function(){
	var img = document.querySelector('input[name="picture"]:checked').value;
	BdApi.getPlugin('Background').removePicture(img);
	document.getElementById("content").innerHTML = BdApi.getPlugin('Background').createContent();
	console.log("Picture removed");
};

Background.prototype.createContent = function(){
	var html = "";
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.img.forEach(function(element){
			html = html + "<input type=\"radio\" name=\"picture\" value=\""+element.name+"\"> <a href=\""+element.url+"\">"+element.name+"</a><br> ";
		});
	});
	return html;
}

Background.prototype.changeTesting = function(){
	if(testing){
		console.log("Testing end")
		testing = false;
		readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		setBackground()
		timer = setInterval(BdApi.getPlugin('Background').setBackground,1000*json.time);});
		testurl = ""
		document.getElementById("test").value = testurl;
		document.getElementById("testid").innerHTML = test();
		return;
	}
	console.log("Testing begin")
	testing = true;
	clearInterval(timer);
	testurl = document.getElementById("test").value;
	BdApi.getPlugin('Background').changeBackground(testurl);
	document.getElementById("testid").innerHTML = test();
}
;


Background.prototype.test = function(){
	if(testing){
		return "Testen beenden";
	}
	return "Testen starten";
}
;
Background.prototype.start = function () {
	BdApi.getPlugin('Background').setBackground();
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		timer = setInterval(BdApi.getPlugin('Background').setBackground,1000*json.time);})
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


Background.prototype.getSettingsPanel = function () {
	var timer = "";
	var html = BdApi.getPlugin('Background').createContent();
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		timer = json.time;
	});
    return "<h3>Settings Panel</h3><br> <div style=\"color: white;\">Name:<br><input type=\"text\" id=\"name\" style=\"width: 95%;\"> <br> <br> URL:<br><input type\"text\" id=\"url\" style=\"width: 95%;\"> <br> <br> <button onclick=\"BdApi.getPlugin('Background').addValue()\" style=\"width: 25%;\">Add</button></div><br><br><div style=\"color: white;\">Time:<br><input id=\"time\"style=\"width: 95%;\" value=\""+timer+"\"> <br> <br> <button onclick=\"BdApi.getPlugin('Background').changeTime()\" style=\"width: 25%;\">change Time</button></div><br><br><div style=\"color: white;\"> Picture:<br><div id=\"content\">"+html+"</div><br><br><button onclick=\"BdApi.getPlugin('Background').remove()\" style=\"width: 25%;\">Remove</button></div><br><br><div style=\"color: white;\">Testen:<br><input id=\"test\"style=\"width: 95%;\" value=\""+testurl+"\"> <br> <br> <button id=\"testid\" onclick=\"BdApi.getPlugin('Background').changeTesting()\" style=\"width: 25%;\">"+BdApi.getPlugin('Background').test()+"</button></div> <br> <br> <div><h3>Skip</h3><br> <br>  <button id=\"skip\" onclick=\"BdApi.getPlugin('Background').setBackground()\" style=\"width: 25%;\">Skip</button></div>";
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
    return "0.2.2";
};

Background.prototype.getAuthor = function () {
    return "Letsplaybar";
};
