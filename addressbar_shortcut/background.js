var suggestList = []; //global variable to restore url


chrome.omnibox.onInputEntered.addListener(
  function (text) {
    // Encode user input for special characters , / ? : @ & = + $ #
    //var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
    //chrome.tabs.create({ url: text });
    console.log('inputentered', suggestList)
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
    for (let key in predefinedDict) {
      let reResult = key.match(re);
      if (reResult != null) {
        suggestList.push(getSuggestionFromDict(key, predefinedDict[key]))
      }
    }

    chrome.bookmarks.search(text, function (results) {
      console.log(results);
      for (let i = 0; i < results.length; i++) {
        suggestList.push(getSuggestionFromDict(results[i].title, results[i].url))
      }
      console.log("search")
      console.log(suggestList)
      console.log(results)
      suggest(suggestList);
      if (suggestList != null && suggestList.length > 0) {
        chrome.omnibox.setDefaultSuggestion({
          description: suggestList[0].content
        })
      }

    });
  });

chrome.commands.onCommand.addListener(function (command) {
  console.log('Command:', command);
  if (suggestList != null && suggestList.length > 0 && commandValue[command] < suggestList.length) {
    console.log("command:", suggestList[commandValue[command]].content)
    chrome.tabs.create({
      url: suggestList[commandValue[command]].content
    });
  }
});

commandValue = {
  "suggestion1": 0,
  "suggestion2": 1,
  "suggestion3": 2,
  "suggestion4": 3,
}


//generate content and description
function getSuggestionFromDict(key, value) {
  let des = key + " - " + value;
  return {
    content: value,
    description: des
  };
}