chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getData') {
        selectEpisodiosLink()
        // Replace this with the actual data you want to retrieve
        const data = {
            title: document.title,
            url: window.location.href,
        };
      const listElements = document.getElementById('listCapitulos')
      if (listElements) {

        let videos = Array.from(listElements.childNodes)
        videos = videos.filter((node) => isListItem(node))
        data.videos = videos.map((v) => getVideoInfo(v))
      }
      console.log(data)
      // addVideoButtons()
      sendResponse(data);
    }
    return true; // Required to use sendResponse asynchronously
});

function getVideoInfo(video) {
  // const show = document.querySelector('div.onsite').innerText
  // const episodeTitle = video.querySelector('span.maintitle').innerText
  // const title = show + ' ' + episodeTitle
  const title = video.querySelector('span.maintitle').innerText
  const url = video.querySelector('a.goto_media').href
  const progressDiv = video.querySelector('span.icon.progressBar.play');
  const progressSpan = progressDiv.querySelector('span.rtve-icons')
  const widthPercentage = progressSpan.style.width;
  const videoDuration = video.querySelector('span.duration').innerText;
  // const durationInSeconds = calculateWatchedTime(videoDuration, widthPercentage);
  // chrome.runtime.sendMessage({
  //   action: 'addToDreamingSpanish',
  //   title: title,
  //   duration: Math.floor(durationInSeconds)
  // });
  return {title, url, watched: widthPercentage, seconds: videoDuration}
}

window.addEventListener('load', () => {

  console.log('loaded DreamingSync rtve')
  addFixedButton();

});

function addVideoButtons() {
    selectEpisodiosLink()

    setTimeout(() => {
        let videos = Array.from(document.getElementById('listCapitulos').childNodes)
        videos = videos.filter((node) => isListItem(node))
        videos.forEach(video => {
            const watchedButton = createAddWatchedButton(video);
            const fullDurationButton = createAddFullButton(video);
          console.log(video)
            video.appendChild(watchedButton);
            video.appendChild(fullDurationButton);
        });

    }, 1000)
}

function isListItem(node) {
    return node && node.nodeName === 'LI';
}

function selectEpisodiosLink() {
  const liTag = document.querySelector('li[data-tab="capters"]');
  const link =  liTag.querySelector('a')

  if (link) {
    link.click()
  } else {
    console.log('Episodios Link not found');
  }
}

function addFixedButton() {
    const button = document.createElement('button');
    button.innerText = 'DreamingSync';
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
    button.style.fontSize = '16px';
    button.style.padding = '10px 20px';
    button.style.border = '2px solid black';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.zindex = '9999'; // ensure the button is above other elements
    const maintag = document.querySelector('main#topPage');
    button.addEventListener('click', addVideoButtons)
    maintag.appendChild(button)
}

function createAddWatchedButton(video) {
  const button = document.createElement('button');
  button.innerText = 'Add Watched Time to Dreaming Spanish';
  button.style.margin = '10px';
  button.style.backgroundColor = 'red';
  button.style.color = 'white';
  button.style.fontSize = '12px';
  button.style.padding = '5px 10px';
  button.style.border = '2px solid black';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.addEventListener('click', () => addWatchedToDreamingSpanish(video));
  return button;
}

function createAddFullButton(video) {
  const button = document.createElement('button');
  button.innerText = 'Add to Full Time Dreaming Spanish';
  button.style.margin = '10px';
  button.style.backgroundColor = 'red';
  button.style.color = 'white';
  button.style.fontSize = '16px';
  button.style.padding = '10px 20px';
  button.style.border = '2px solid black';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.addEventListener('click', () => addFullToDreamingSpanish(video));
  return button;
}

// function createAddButton(video) {
//   const button = document.createElement('button');
//   button.innerText = 'Add to Dreaming Spanish';
//   button.style.margin = '10px';
//   button.addEventListener('click', () => addToDreamingSpanish(video));
//   return button;
// }

function addFullToDreamingSpanish(video) {
  const title = video.querySelector('span.maintitle').innerText
  const url = video.querySelector('a.goto_media').href
  const videoDuration = video.querySelector('span.duration').innerText;
  const durationInSeconds = convertToSeconds(videoDuration)
  chrome.runtime.sendMessage({
    action: 'addToDreamingSpanish',
    title: `...ds${title} [${url}] -- Logged by DreamingSync`,
    duration: Math.floor(durationInSeconds)
  });
  console.info(`DreamingSynced ${durationInSeconds}s`)
}

function addWatchedToDreamingSpanish(video) {
  const title = video.querySelector('span.maintitle').innerText
  const progressDiv = video.querySelector('span.icon.progressBar.play');
  const progressSpan = progressDiv.querySelector('span.rtve-icons')
  const widthPercentage = progressSpan.style.width;
  const videoDuration = video.querySelector('span.duration').innerText;
  const durationInSeconds = calculateWatchedTime(videoDuration, widthPercentage);
  chrome.runtime.sendMessage({
    action: 'addToDreamingSpanish',
    title: title,
    duration: Math.floor(durationInSeconds)
  });
  console.info(`DreamingSynced ${durationInSeconds}s`)
}

function calculateWatchedTime(duration, progressPercentage) {
  const totalSeconds = convertToSeconds(duration);
  const fractionWatched = parseFloat(progressPercentage)
  const watchedSeconds = totalSeconds * (parseFloat(progressPercentage) / 100);
  return watchedSeconds;
}

function convertToSeconds(duration) {
  const parts = duration.trim().split(':').map(Number);
  if (parts.length === 2) {
    // duration is in "mm:ss" format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // duration is in "hh:mm:ss" format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else {
    throw new Error("Invalid duration format");
  }
}
