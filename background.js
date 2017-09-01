/**
 * Created by gx on 31/08/17.
 */

chrome.storage.sync.get(/* String or Array */["vegan-stopped"], function(items){
    var value = (items["vegan-stopped"]).toString();;

    chrome.browserAction.setBadgeText({text: value});
});

chrome.extension.onMessage.addListener(function(message, sender) {
    chrome.storage.sync.get(/* String or Array */["vegan-stopped"], function(items){
        var value = (items["vegan-stopped"]).toString();
        chrome.browserAction.setBadgeText({text: value});
    });
});