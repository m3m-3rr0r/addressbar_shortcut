// Saves options to chrome.storage
function save_options() {
    var textareavalue = document.getElementById('myTextArea').value;
    chrome.storage.sync.set({
      textareavalue: textareavalue,
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        textareavalue: 'default textareavalue',
    }, function(items) {
        if(items!=null){
            console.log(items)
        }
        else{
            console.log("items is null")
        }
        
      document.getElementById('myTextArea').value = items.textareavalue;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);








