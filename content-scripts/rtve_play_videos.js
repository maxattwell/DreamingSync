chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {
    selectEpisodiosLink()
    setTimeout(() => {

      const vjsCurrentTime = document.querySelector('div.vjs-current-time-display').innerText
      const vjsRemainingTime = document.querySelector('div.vjs-remaining-time-display').innerText

      const watchedSeconds = convertToSeconds(vjsCurrentTime)
      const lengthSeconds = watchedSeconds + convertToSeconds(vjsRemainingTime.replaceAll('-', ''))

      const data = {
        site: 'rtve play',
        page: document.title,
        watchedSeconds,
        lengthSeconds
      };
      // const listElements = document.getElementById('listCapitulos')
      // if (listElements) {

      //   let videos = Array.from(listElements.childNodes)
      //   videos = videos.filter((node) => isListItem(node))
      //   data.videos = videos.map((v) => getVideoInfo(v))
      // }
      console.log(data)
      // addVideoButtons()
      sendResponse(data);
    }, 200)
  }
  return true; // Required to use sendResponse asynchronously
});

function getVideoInfo(video) {
  const title = video.querySelector('span.maintitle').innerText
  const progressDiv = video.querySelector('span.icon.progressBar.play');
  const progressSpan = progressDiv.querySelector('span.rtve-icons')
  const watchedSeconds = progressSpan.style.width;
  const lengthSeconds = video.querySelector('span.duration').innerText;
  return { title, watchedSeconds, lengthSeconds }
}


function isListItem(node) {
  return node && node.nodeName === 'LI';
}

function selectEpisodiosLink() {
  const liTag = document.querySelector('li[data-tab="capters"]');
  const link = liTag.querySelector('a')

  if (link) {
    link.click()
  } else {
    console.log('Episodios Link not found');
  }
}


// function addFullToDreamingSpanish(video) {
//   const title = video.querySelector('span.maintitle').innerText
//   const url = video.querySelector('a.goto_media').href
//   const videoDuration = video.querySelector('span.duration').innerText;
//   const durationInSeconds = convertToSeconds(videoDuration)
//   chrome.runtime.sendMessage({
//     action: 'addToDreamingSpanish',
//     title: `...ds${title} [${url}] -- Logged by DreamingSync`,
//     duration: Math.floor(durationInSeconds)
//   });
//   console.info(`DreamingSynced ${durationInSeconds}s`)
// }

// function addWatchedToDreamingSpanish(video) {
//   const title = video.querySelector('span.maintitle').innerText
//   const progressDiv = video.querySelector('span.icon.progressBar.play');
//   const progressSpan = progressDiv.querySelector('span.rtve-icons')
//   const widthPercentage = progressSpan.style.width;
//   const videoDuration = video.querySelector('span.duration').innerText;
//   const durationInSeconds = calculateWatchedTime(videoDuration, widthPercentage);
//   chrome.runtime.sendMessage({
//     action: 'addToDreamingSpanish',
//     title: title,
//     duration: Math.floor(durationInSeconds)
//   });
//   console.info(`DreamingSynced ${durationInSeconds}s`)
// }
