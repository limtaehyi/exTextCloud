chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        chrome.notifications.create('urlChange', {
            title: 'URL changed!',
            message: 'The URL has changed to: ' + changeInfo.url,
            iconUrl: '/icon.png',
            type: 'basic'
        });
    }
});
