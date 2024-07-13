chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {

    const videoDuration = document.querySelector('span.ytp-time-duration').innerText
    const videoCurrent = document.querySelector('span.ytp-time-current').innerText

    const data = {
      site: 'YouTube',
      page: document.title,
      lengthSeconds: convertToSeconds(videoDuration),
      watchedSeconds: convertToSeconds(videoCurrent)
    };
    sendResponse(data);
  }
  return true;
});

