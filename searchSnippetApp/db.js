/**
 * @file A module for interacting with the DB.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */

var snippetsDB = (function() {
  var tDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  tDB.open = function(callback) {
    // Database version.
    var version = 4;

    // Open a connection to the datastore.
    var request = indexedDB.open('snippets', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = tDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('snippet')) {
        db.deleteObjectStore('snippet');
      }

      // Create a new datastore.
      var store = db.createObjectStore('snippet', {
        keyPath: 'id',  autoIncrement: true
      });
	  
		store.createIndex("title", "title", { unique: false });
		store.createIndex("tags", "tags", { unique: false });
	
	  
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
      // Get a reference to the DB.
      datastore = e.target.result;
      
      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = tDB.onerror;
  };


  /**
   * Fetch all of the snippet items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the snippet items.
   */
  tDB.fetchSnippets = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['snippet'], 'readwrite');
    var objStore = transaction.objectStore('snippet');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var snippets = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(snippets);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      
      if (!!result == false) {
        return;
      }
      
      snippets.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = tDB.onerror;
  };


  /**
   * Create a new snippet item.
   * @param {string} text The snippet item.
   */
  tDB.createSnippet = function(snippetObj, callback) {
    // Get a reference to the db.
    var db = datastore;

    // Initiate a new transaction.
    var transaction = db.transaction(['snippet'], 'readwrite');

    // Get the datastore.
    var objStore = transaction.objectStore('snippet');

    // Create a timestamp for the snippet item.
        // Create the datastore request.
    var request = objStore.put(snippetObj);

    // Handle a successful datastore put.
    request.onsuccess = function(e) {
      // Execute the callback function.
      callback(snippetObj);
    };

    // Handle errors.
    request.onerror = tDB.onerror;
  };


  /**
   * Delete a snippet item.
   * @param {int} id The timestamp (id) of the snippet item to be deleted.
   * @param {function} callback A callback function that will be executed if the 
   *                            delete is successful.
   */
  tDB.deleteSnippet = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['snippet'], 'readwrite');
    var objStore = transaction.objectStore('snippet');
    
    var request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };

   /**
   * Query  snippet item.
   */
  tDB.querySnippet = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['snippet'], 'readwrite');
    var objStore = transaction.objectStore('snippet');
    
    var request = objStore.get(id);
    
    request.onsuccess = function(e) {
      callback(request.result);
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };

     /**
   * Query  snippet item.
   */
  tDB.updateSnippet = function(id,snippet, callback) {
    var db = datastore;
    var transaction = db.transaction(['snippet'], 'readwrite');
    var objStore = transaction.objectStore('snippet');
    
    var request = objStore.put(snippet);
    
    request.onsuccess = function(e) {
      callback(request.result);
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };
  
  /**
   * Query  snippet item.
   */
  tDB.searchSnippets = function(keyword, callback) {
    var db = datastore;
    var transaction = db.transaction(['snippet'], 'readwrite');
    var objStore = transaction.objectStore('snippet');
    
	
	var request = objStore.openCursor();
	request.onsuccess = function(event) {
	var snippets = new Array();
	
		var cursor = event.target.result;
		if (cursor) {
			if (cursor.value.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || JSON.stringify(cursor.value.tags).toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
			cursor.value.content.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {                
				console.log("We found a row with value: " + JSON.stringify(cursor.value));
				snippets.push(cursor.value);
			} 
			
			cursor.continue();          
		}
		
		callback(snippets);
	};

    
    request.onerror = function(e) {
      console.log(e);
    }
  };
  
  
  // Export the tDB object.
  return tDB;
}());
