/**
 * Created by gx on 31/08/17.
 */

function getValue(value) {
    if (value) {
        value = value.toString();
    } else {
        value = "0";
    }
    return value;
}

chrome.storage.sync.get(/* String or Array */["salvini-stopped"], function (items) {
    var value = getValue(items["salvini-stopped"]);
    chrome.browserAction.setBadgeText({text: value});
});

chrome.extension.onMessage.addListener(function (message, sender) {
    if (message == "vegan-stopped-msg") {
        chrome.storage.sync.get(/* String or Array */["salvini-stopped"], function (items) {
            var value = getValue(items["salvini-stopped"]);
            chrome.browserAction.setBadgeText({text: value});
        });
    }

});