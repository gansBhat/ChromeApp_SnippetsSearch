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
		var output = "";
		var num = 1;
		
		for(key in snippets) {
			var anySnippet = snippets[key];
			output += "No:"+num+"\n";
			output += "Title:"+anySnippet.title+"\n";
			output += "Tags:"+anySnippet.tags+"\n"
			output += "Content:"+anySnippet.content+"\n\n"
			num++;
		}

		console.log("op received:"+output);
		$("#jsonCode").empty();
		$("#jsonCode").append(output);
	});	
	});
}
