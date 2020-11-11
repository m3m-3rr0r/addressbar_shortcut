var suggestList = []; //global variable to restore url


chrome.omnibox.onInputEntered.addListener(
  function (text) {
    if (suggestList != null && suggestList.length > 0) {
      chrome.tabs.create({
        url: suggestList[0].content
      });
    }
  });

chrome.omnibox.onInputChanged.addListener(

  function (text, suggest) {
    let re = new RegExp("^" + text);
    suggestList = [];
    restore_options();
    for (let key in predefinedJSON) {
      let reResult = key.match(re);
      if (reResult != null) {
        suggestList.push(getSuggestionFromDict(key, predefinedJSON[key]))
      }
    }

    chrome.bookmarks.search(text, function (results) {
      for (let i = 0; i < results.length; i++) {
        if (results[i].url != undefined) {
          suggestList.push(getSuggestionFromDict(results[i].title, results[i].url))
        }
      }
      console.log(suggestList)
      suggest(suggestList);
      if (suggestList != null && suggestList.length > 0) {
        chrome.omnibox.setDefaultSuggestion({
          description: suggestList[0].content
        })
      }


    });
  });

chrome.commands.onCommand.addListener(function (command) {
  if (suggestList != null && suggestList.length > 0 && commandValue[command] < suggestList.length) {
    chrome.tabs.create({
      url: suggestList[commandValue[command]].content
    });
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
      'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue);
  }
  if (changes.hasOwnProperty("predefinedJSON")) {
    if (changes["predefinedJSON"].newValue != undefined) {
      predefinedJSON = changes["predefinedJSON"].newValue;
      console.log(predefinedJSON)
    }
  }
});


//generate content and description
function getSuggestionFromDict(key, value) {
  let des = key + " - " + value;
  return {
    content: value,
    description: HTMLEncode(des)
  };
}

//encode url, otherwise will have error: EntityRef: expecting ';'
function HTMLEncode(html) {
  var temp = document.createElement("div");
  (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
  var output = temp.innerHTML;
  temp = null;
  return output;
}

commandValue = {
  "suggestion1": 0,
  "suggestion2": 1,
  "suggestion3": 2,
  "suggestion4": 3,
}


function restore_options() {
  chrome.storage.sync.get({
    predefinedJSON: {},
  }, function (items) {
    if (items != null) {
      console.log(items)
      predefinedJSON = items.predefinedJSON;
    }
    else {
      console.log("items is null")
    }
  });
}

function beforeConstruct() {
  restore_options()
}

beforeConstruct()