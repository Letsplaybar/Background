//META{"name":"Background","source":"https://raw.githubusercontent.com/Letsplaybar/Background/master/Background.plugin.js"}*//

var Background = function(){};
	
var timer;

Background.prototype.testing = false;
Background.prototype.testurl= "";
Background.prototype.url= "";

var amount = -1;

function readTextFile(file, callback) {
	var filepath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "\\AppData\\Roaming\\BetterDiscord\\plugins\\"+file;
	var fs = require('fs');
    callback(fs.readFileSync(filepath));
	
};

Background.prototype.setBackground = function(){
	amount++;
	BdApi.Plugins.get('Background').instance.onSwitchBG();
};

Background.prototype.changeBackground = function(url){
	document.getRootNode().body.style.setProperty("--theme-background-image","url("+url+")");
};

Background.prototype.onSwitchBG = function(){
	var obj = BdApi.Plugins.get('Background').instance;
	readTextFile("Background.config.json",function(text){
	var json = JSON.parse(text);
	
	// Array enthält alle Elemente des Dokuments
	
	var url = json.img[amount].url;
	Background.prototype.url = url;
	obj.changeBackground(url);
	if(amount == json.img.length-1){
		amount = -1;
	}
	});
}

Background.prototype.addPicture = function(name1, url1){
	var obj = BdApi.Plugins.get('Background').instance;
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.img.push({name:name1,url:url1});
		obj.save(JSON.stringify(json,null, "\t"),"Background.config.json");
	});
}
;

Background.prototype.setTime = function(time){
	var obj = BdApi.Plugins.get('Background').instance;
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		json.time = time;
		obj.save(JSON.stringify(json,null, "\t"),"Background.config.json");
		clearInterval(timer);
		timer = setInterval(obj.setBackground,1000*timer);
	});
}
;

Background.prototype.removePicture = function(name){
	var obj = BdApi.Plugins.get('Background').instance;
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		var i = -1;
		json.img.forEach(function(element){
			i++;
			if(element.name == name){
				json.img.splice(i,1);
			}
		});
		obj.save(JSON.stringify(json,null, "\t"),"Background.config.json");
		clearInterval(timer);
		timer = setInterval(obj.setBackground,1000*timer);
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
	BdApi.Plugins.get('Background').instance.addPicture(name, url);
	document.getElementById("name").value = "";
	document.getElementById("url").value = "";
	var html = BdApi.Plugins.get('Background').instance.createContent();
	document.getElementById("content").innerHTML = html;
	console.log("Picture added");
};

Background.prototype.changeTime = function(){
	var time =document.getElementById("time").value;
	BdApi.Plugins.get('Background').instance.setTime(time);
	console.log("Time changed");
};

Background.prototype.remove = function(){
	var img = document.querySelector('input[name="picture"]:checked').value;
	BdApi.Plugins.get('Background').instance.removePicture(img);
	document.getElementById("content").innerHTML = BdApi.Plugins.get('Background').instance.createContent();
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
	if(BdApi.Plugins.get('Background').instance.testing){
		console.log("Testing end")
		BdApi.Plugins.get('Background').instance.testing = false;
		var obj = BdApi.Plugins.get('Background').instance;
		readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		obj.setBackground()
		timer = setInterval(obj.setBackground,1000*json.time);});
		obj.testurl = ""
		document.getElementById("test").value = obj.testurl;
		document.getElementById("testid").innerHTML = test();
		return;
	}
	console.log("Testing begin")
	BdApi.Plugins.get('Background').instance.testing = true;
	clearInterval(timer);
	BdApi.Plugins.get('Background').instance.testurl = document.getElementById("test").value;
	BdApi.Plugins.get('Background').instance.changeBackground(BdApi.Plugins.get('Background').instance.testurl);
	document.getElementById("testid").innerHTML = BdApi.Plugins.get('Background').instance.test();
}
;


Background.prototype.test = function(){
	if(BdApi.Plugins.get('Background').instance.testing){
		return "Testen beenden";
	}
	return "Testen starten";
}
;
Background.prototype.start = function () {
	if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="" target="_blank">Click here to download the library!</a>`);
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/Letsplaybar/Background/master/Background.plugin.js");
	BdApi.Plugins.get('Background').instance.setBackground();
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		timer = setInterval(BdApi.Plugins.get('Background').instance.setBackground,1000*json.time);})
		
	console.log("Background started");
};


Background.prototype.load = function () {};

Background.prototype.initialize= function(){};

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
	var url = Background.prototype.url;
	document.getRootNode().body.style.setProperty("--background-image","url("+url+")");
	console.log("Update");
	//PluginUtilities.checkForUpdate("Background", this.getVersion(), "https://raw.githubusercontent.com/Letsplaybar/Background/master/Background.plugin.js");
};

Background.prototype.observer = function (e) {
    //raw MutationObserver event for each mutation
};


Background.prototype.getSettingsPanel = function () {
	var timer = "";
	var html = BdApi.Plugins.get('Background').instance.createContent();
	readTextFile("Background.config.json",function(text){
		var json = JSON.parse(text);
		timer = json.time;
	});
    return "<h3>Settings Panel</h3><br> <div style=\"color: white;\">Name:<br><input type=\"text\" id=\"name\" style=\"width: 95%;\"> <br> <br> URL:<br><input type\"text\" id=\"url\" style=\"width: 95%;\"> <br> <br> <button onclick=\"BdApi.Plugins.get('Background').instance.addValue()\" style=\"width: 25%;\">Add</button></div><br><br><div style=\"color: white;\">Time:<br><input id=\"time\"style=\"width: 95%;\" value=\""+timer+"\"> <br> <br> <button onclick=\"BdApi.Plugins.get('Background').instance.changeTime()\" style=\"width: 25%;\">change Time</button></div><br><br><div style=\"color: white;\"> Picture:<br><div id=\"content\">"+html+"</div><br><br><button onclick=\"BdApi.Plugins.get('Background').instance.remove()\" style=\"width: 25%;\">Remove</button></div><br><br><div style=\"color: white;\">Testen:<br><input id=\"test\"style=\"width: 95%;\" value=\""+BdApi.Plugins.get('Background').instance.testurl+"\"> <br> <br> <button id=\"testid\" onclick=\"BdApi.Plugins.get('Background').instance.changeTesting()\" style=\"width: 25%;\">"+BdApi.Plugins.get('Background').instance.test()+"</button></div> <br> <br> <div><h3>Skip</h3><br> <br>  <button id=\"skip\" onclick=\"BdApi.Plugins.get('Background').instance.setBackground()\" style=\"width: 25%;\">Skip</button></div>";
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
    return "0.2.9";
};

Background.prototype.getAuthor = function () {
    return "Letsplaybar";
};
