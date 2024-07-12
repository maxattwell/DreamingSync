chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {

    const ytTimeDuration = document.querySelector('span.ytp-time-duration').innerText
    const ytTimeCurrent = document.querySelector('span.ytp-time-current').innerText

    const data = {
      site: 'YouTube',
      page: document.title,
      lengthSeconds: convertToSeconds(ytTimeDuration),
      watchedSeconds: convertToSeconds(ytTimeCurrent)
    };
    sendResponse(data);
  }
  return true; // Required to use sendResponse asynchronously
});

