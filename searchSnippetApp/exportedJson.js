$(document).ready(function () {
   init();
});

init = function(){
	//set the default stage
	//$("#newSnippet").hide();
	//$("#snippetList").show();
	
	//set click listeners
	snippetsDB.open(function(){
		snippetsDB.fetchSnippets(function(snippets) {
		
		var snipptsArray = new Array();
		for(key in snippets) {
			snipptsArray.push(snippets[key]);
		}
		
		var output = JSON.stringify(snipptsArray);
		console.log("op received:"+output);
		$("#jsonCode").empty();
		$("#jsonCode").append(output);
	});	
	});
}

exportAllClearText = function(){
var output = "";
var num = 1;

snippetsDB.fetchSnippets(function(snippets) {
		for(key in snippets) {
			var anySnippet = snippets[key];
			output += "No:"+num+"\n";
			output += "Title:"+anySnippet.title+"\n";
			output += "Tags:"+anySnippet.tags+"\n"
			output += "Content:"+anySnippet.content+"\n\n"
			num++;
			
		}
		window.open('about:blank').document.body.innerText += output; 
	});
	
	/* for (var a in localStorage) {
		var anySnippet = JSON.parse( localStorage[a]);
		output += "No:"+num+"\n";
		output += "Title:"+anySnippet.title+"\n";
		output += "Tags:"+anySnippet.tags+"\n"
		output += "Content:"+anySnippet.content+"\n\n"
		num++;
	}
	window.open('about:blank').document.body.innerText += output; */

};
