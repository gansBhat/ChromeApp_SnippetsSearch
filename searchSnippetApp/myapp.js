var snippetUnderEditId;
var filter = "ALL";
var delSticky = new Object();
var sortType;
/* 1- all, 2-title, 3-tags, 4-content */
$(document).ready(function () {
   init();
});

init = function(){
	//set the default stage
	//$("#newSnippet").hide();
	//$("#snippetList").show();
	
	//set click listeners
	$("#createNewSnippetBtn").on("click",clearSnippetCreateView);
	$("#cancelSnippetCreateBtn").on("click",cancelSnippetBtn);
	$("#createSnippetBtn").on("click",createSnippetBtn);
	$("#showFavoritesBtn").on("click",showFavouriteSnippets);
	$("#showAllBtn").on("click",backToListing);
	$("#updateSnippetBtn").on("click",updateSnippet);
	
	$("#serarchSnippetField").on("input", searchAsType);
	
	$("#updateSnippetBtn").hide();
	
	$("#exportAllJsonBtn").on("click",exportAllJsonData);
	$("#exportAllClearTextBtn").on("click",exportAllClearText);
	
	$("#searchGoBtn").on("click",searchAsType);
	
	$("#filterBtns .btn").on('click',function(){
		filter = $(this).text();
		filter = filter.toUpperCase().trim();
		searchAsType();
	});

	
	/* sort functions */
	$('input:radio[name="filterTag"]').change(
    function(){
        if (this.checked && this.value == 'AtoZ') {
            // note that, as per comments, the 'changed'
            // <input> will *always* be checked, as the change
            // event only fires on checking an <input>, not
            // on un-checking it.
            // append goes here
			sortType = "AtoZ";
			backToListing();
			
			console.log("AtoZ sorting");
        } else if (this.checked && this.value == 'ZtoA') {
            // note that, as per comments, the 'changed'
            // <input> will *always* be checked, as the change
            // event only fires on checking an <input>, not
            // on un-checking it.
            // append goes here
			sortType = "ZtoA";
			backToListing();
			
			console.log("ZtoA sorting");
        } else if (this.checked && this.value == 'Asc') {
            // note that, as per comments, the 'changed'
            // <input> will *always* be checked, as the change
            // event only fires on checking an <input>, not
            // on un-checking it.
            // append goes here
			sortType = "Asc";
			backToListing();
			
			console.log("Asc sorting");
        } else if (this.checked && this.value == 'Dsc') {
            // note that, as per comments, the 'changed'
            // <input> will *always* be checked, as the change
            // event only fires on checking an <input>, not
            // on un-checking it.
            // append goes here
			sortType = "Dsc";
			backToListing();
			
			console.log("Dsc sorting");
        }
    });
	

	
	/*
	$("#showAtoZ").on('click',function(){
		sortType = "AtoZ";
		backToListing();
	});
	
	$("#showZtoA").on('click',function(){
		sortType = "ZtoA";
		backToListing();
	});
	
	$("#showAsc").on('click',function(){
		sortType = "Asc";
		backToListing();
	});
	
	$("#showDsc").on('click',function(){
		sortType = "Dsc";
		backToListing();
	});
	
	$("input[name='filterTag'][value='Dsc']").prop("checked",true);
	*/
	
	$('input:radio[name=filterTag]:nth(3)').attr('checked',true);
	$('[checked="checked"]').parent().addClass("active");
	
	snippetsDB.open(backToListing);
	sortType = "Dsc";
	
	var newTag = new Object();
	newTag.id = 2;
	newTag.text = "Apple";
	newTag.url = "http://www.apple.com";
	newTag.title = "Click here to see all &quot;records&quot; of only Apple's";

	$("#tagsList").tags({
              tagData: [newTag],
			  promptText: " provide your favourite search terms here"		
			  
    });
	
		
};



getSelectedText = function() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';
}

undoDelSticky = function() {

console.log("undo the deleted sticky");

	snippetsDB.createSnippet(delSticky, function(result){
			console.log(result);
			backToListing();
		});

}

backToListing = function(){
	$("#snippetLists").empty();
	
	snippetsDB.fetchSnippets(function(snippets) {
	
		if(sortType == "Dsc" ) {
			snippets.reverse();
		} else if(sortType == "AtoZ"){
			snippets.sort(function(a,b){
				if(a.title.toLowerCase()>b.title.toLowerCase()) {
					return 1;
				} else if(a.title.toLowerCase()<b.title.toLowerCase()) {
					return -1;
				} else {
					return 0;
				}
			});
		} else if(sortType == "ZtoA"){
			snippets.sort(function(a,b){
				if(a.title.toLowerCase()>b.title.toLowerCase()) {
					return -1;
				} else if(a.title.toLowerCase()<b.title.toLowerCase()) {
					return 1;
				} else {
					return 0;
				}
			});
		} 
		
		for(key in snippets) {
			addSnippet(snippets[key]);
		}
		
	});
	
};

showFavouriteSnippets = function(){
	$("#snippetLists").empty();
	
	snippetsDB.fetchSnippets(function(snippets) {
	
		for(key in snippets) {
			if(snippets[key].isFavorite) {
			addSnippet(snippets[key]);
			
		}
			
		}
		
	});
	
	
};


exportAllJsonData = function(){
		chrome.app.window.create('exportedJson.html', {
			'outerBounds': {
			  'width': 600,
			  'height': 800
			},
			'state':'maximized'
		  }, function(window){
			console.log("launched");
			//window.document.body.innerText += output;
		  });
  
	/* for (var a in localStorage) {
		output += localStorage[a]+"\n";
	}
	window.open('about:blank').document.body.innerText += output; */
};
exportAllClearText = function(){
	
	chrome.app.window.create('exportedClearText.html', {
			'outerBounds': {
			  'width': 600,
			  'height': 800
			},
			'state':'maximized'
		  }, function(window){
			console.log("launched");
			//window.document.body.innerText += output;
		  });

};
updateSnippet = function(){
	var snippetId = snippetUnderEditId;
	var snippetForUpdate = new Object();
	snippetForUpdate.id = snippetUnderEditId;
	snippetForUpdate.title = $("#snippetTitle").val();
	snippetForUpdate.isFavorite = $("#isFavoriteChkbox").is(':checked');
	snippetForUpdate.tags = $("#snippetTags").val().split(",");
	snippetForUpdate.content = $("#snippetContent").val();
	//localStorage[snippetId] = jsonToStore;
	
	snippetsDB.updateSnippet(snippetId,snippetForUpdate, function(result){
		console.log("updation success");
		$(".alert").alert('close');
		clearSnippetCreateView();
		$("#appMessages").append("<div class='alert alert-success'> <a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a> Updated "+snippetForUpdate.title+" Successfully</div>");	
		
		
		backToListing();
	});
	
	
};
cancelSnippetBtn = function(){
	clearSnippetCreateView();
	backToListing();
};

clearSnippetCreateView = function(){
	//$("#newSnippet").show();
	//$("#snippetList").hide();
	$("#snippetTitle").val("");
	$("#isFavoriteChkbox").attr('checked', false);
	$("#snippetTags").val("");
	$("#snippetContent").val("");
	
	$("#updateSnippetBtn").hide();
	$("#createSnippetBtn").show();
	$("#cancelSnippetCreateBtn").show();
};



createSnippetBtn = function(){
	var newSnippet = new Object();

	newSnippet.title = $("#snippetTitle").val();
	if(newSnippet.title) {
		newSnippet.isFavorite = $("#isFavoriteChkbox").is(':checked');
		newSnippet.tags = $("#snippetTags").val().split(",");
		newSnippet.content = $("#snippetContent").val();
		
			//alert(jsonToStore);
		
		//localStorage[newSnippet.id] = jsonToStore;
				
		snippetsDB.createSnippet(newSnippet, function(result){
			console.log(result);
			clearSnippetCreateView();
			backToListing();
		});
	}  else {
		$(".alert").alert('close');
		$("#appMessages").append("<div class='alert alert-danger'> <a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a> Title is mandatory.</div>");
	}
};



editSnippet = function(snipId){
	console.log("edit pressed for btn"+snipId);	
	snippetUnderEditId = snipId;
	snippetsDB.querySnippet(snipId, function(result){
		$("#snippetTitle").val(result.title);
		$('#isFavoriteChkbox').prop('checked', result.isFavorite);
		$("#snippetTags").val(result.tags);
		$("#snippetContent").val(result.content);
		
		$("#updateSnippetBtn").show();
		$("#createSnippetBtn").hide();
		$("#cancelSnippetCreateBtn").show();
	});
};

deleteSnippet = function(snipId){
	console.log("delete pressed");
	
	snippetsDB.querySnippet(snipId, function(result){
		delSticky.title = result.title;
		delSticky.isFavorite = result.isFavorite;
		delSticky.tags = result.tags;
		delSticky.content = result.content;
	});
	
	snippetsDB.deleteSnippet(snipId, function() {
		console.log("Delete success");
		$(".alert").alert('close');
		$("#appMessages").append("<div class='alert alert-warning'> <a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a> "+delSticky.title+" Deleted. Would you like to  &nbsp; <button id='undoBtn' type='button' class='btn btn-danger' data-dismiss='alert'>Undo</button> </div>");	
		
		$("#undoBtn").on("click",undoDelSticky);
	});
	
	backToListing();
};

popoutModal = function(snipId){
	console.log("popout modal pressed");
	snippetsDB.querySnippet(snipId, function(result){
		$("#modelContent").val(result.content);
	});
};

createUUID = function () {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};



searchAsType = function(){
	var value = $("#serarchSnippetField").val();
	if(value.length > 2 ) { 
		console.log("found"+value);
		
		/* snippetsDB.searchSnippets(value, function(snippets){
			$("#snippetLists").empty();
			for(key in snippets) {
				addSnippet(snippets[key]);
			}
		});*/
		
		if(!filter) {
			filter = 'ALL';
		}
		
		snippetsDB.fetchSnippets(function(snippets) {
			$("#snippetLists").empty();
			
			if(sortType == "Dsc" ) {
				snippets.reverse();
			} else if(sortType == "AtoZ"){
				snippets.sort(function(a,b){
					if(a.title.toLowerCase()>b.title.toLowerCase()) {
						return 1;
					} else if(a.title.toLowerCase()<b.title.toLowerCase()) {
						return -1;
					} else {
						return 0;
					}
				});
			} else if(sortType == "ZtoA"){
				snippets.sort(function(a,b){
					if(a.title.toLowerCase()>b.title.toLowerCase()) {
						return -1;
					} else if(a.title.toLowerCase()<b.title.toLowerCase()) {
						return 1;
					} else {
						return 0;
					}
				});
			} 
		
			for(key in snippets) {
				if(snippets[key].title.toLowerCase().indexOf(value.toLowerCase())>=0 && (filter == 'TITLE' || filter == 'ALL')) {
					addSnippet(snippets[key]);
				} else if(snippets[key].content.toLowerCase().indexOf(value.toLowerCase())>=0 && (filter == 'CONTENT' || filter == 'ALL')) {
					addSnippet(snippets[key]);
				} else if(JSON.stringify(snippets[key].tags).toLowerCase().indexOf(value.toLowerCase())>=0 && (filter == 'TAGS' || filter == 'ALL')) {
					addSnippet(snippets[key]);
				}
			}
		});
	} else {
		backToListing();	
	}
};

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

addSnippet = function(snippet){
	/* create table dynamically */
	var snippetsList = $("#snippetLists");
	
	var snippetPanel = document.createElement('div');
	snippetPanel.setAttribute("class", "panel panel-primary");
	
	var snippetPanelHeading = document.createElement('div');
	snippetPanelHeading.setAttribute("class", "panel-heading");
	
	var headingTitle = document.createElement('h3');
	headingTitle.setAttribute("class", "panel-title");
	
	var title = "";
	if(snippet.isFavorite) {
		title = "<span class='glyphicon glyphicon-star' aria-hidden='true'></span> ";
	}
	title+=snippet.title;
	headingTitle.innerHTML = title;
	
	snippetPanelHeading.appendChild(headingTitle);   
	
	var snippetPanelBody = document.createElement('div');
	snippetPanelBody.setAttribute("class", "panel-body");
	
	var tagsDiv = document.createElement('div');
	var hasTags = false;
	for(var tag in snippet.tags ) {
		if(snippet.tags[tag] && !isBlank(snippet.tags[tag])) {
			hasTags = true;
			var tagSpan = document.createElement('span');
			tagSpan.setAttribute("class", "label label-info");
			tagSpan.innerHTML = snippet.tags[tag];
			
			var tagSace = document.createElement('span');
			tagSace.innerHTML = "&nbsp;";
			
			tagsDiv.appendChild(tagSpan);  
			tagsDiv.appendChild(tagSace);  
		}
	}
	
	var contentDiv = document.createElement('div');
	contentDiv.setAttribute("padding-left", "5px");
	contentDiv.setAttribute("padding-right", "5px");
	
	var pre = document.createElement('pre');
	var code = document.createElement('code');
	code.innerHTML = new String(snippet.content);
	
	pre.appendChild(code);
	contentDiv.appendChild(pre);
	
	if(hasTags) {
		var breakTag = document.createElement('br');
		snippetPanelBody.appendChild(tagsDiv);
		snippetPanelBody.appendChild(breakTag);
	}
	
	snippetPanelBody.appendChild(contentDiv);
	
	snippetPanel.appendChild(snippetPanelHeading);
	snippetPanel.appendChild(snippetPanelBody);
	
	
	var snippetPanelFooter = document.createElement('div');
	snippetPanelFooter.setAttribute("class", "panel-footer");
	

	var editBtn = document.createElement('button');
	editBtn.setAttribute("class", "btn btn-success");
	editBtn.innerHTML = "Edit";
	editBtn.addEventListener("click", function(){
		editSnippet(snippet.id);
	});
	
	var deleteBtn = document.createElement('button');
	deleteBtn.setAttribute("class", "btn btn-danger");
	deleteBtn.innerHTML = "Delete";
	deleteBtn.addEventListener("click", function(){
		deleteSnippet(snippet.id);
	});
	
	var popBtn = document.createElement('button');
	popBtn.setAttribute("class", "btn btn-warning");
	popBtn.setAttribute("data-toggle", "modal");
	popBtn.setAttribute("data-target", "#popOutModal");
	
	popBtn.innerHTML = "Scratch It!";
	popBtn.addEventListener("click", function(){
		popoutModal(snippet.id);
	});
	
	var tagSace2 = document.createElement('span');
	tagSace2.innerHTML = "&nbsp;";
	
	snippetPanelFooter.appendChild(editBtn);
	snippetPanelFooter.appendChild(tagSace2);	
	snippetPanelFooter.appendChild(deleteBtn);
	
	var tagSace3 = document.createElement('span');
	tagSace3.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	snippetPanelFooter.appendChild(tagSace3);
	
	snippetPanelFooter.appendChild(popBtn);
	
	snippetPanel.appendChild(snippetPanelFooter);
	
	snippetsList.append(snippetPanel);
};


