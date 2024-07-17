function GetPageData() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getData' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        document.getElementById('data').innerText = 'Error getting videos.';
      } else {
        const dataDiv = document.getElementById('data')
        document.getElementById('site-name').innerText = response.site

        if (response.lengthSeconds && response.watchedSeconds) {
          const mainVideo = {
            title: response.page,
            lengthSeconds: response.lengthSeconds,
            watchedSeconds: response.watchedSeconds
          }
          setVideoButtons(mainVideo)
        }

        if (response.videos) {
          for (const video of response.videos) {
            setVideoButtons(video)
          }
        }
      }
    });
  });
}


function setVideoButtons(video) {
  const videoContainer = document.getElementById('video-container');

  const newVideoContainer = document.createElement('div')
  const buttonContainer = document.createElement('div')

  const newVideoTitle = document.createElement('p')
  newVideoTitle.innerText = video.title
  newVideoContainer.appendChild(newVideoTitle)

  const watchedButton = createAddTimeButton(video.title, video.watchedSeconds)
  const lengthButton = createAddTimeButton(video.title, video.lengthSeconds)

  buttonContainer.appendChild(watchedButton);
  buttonContainer.appendChild(lengthButton);

  newVideoContainer.appendChild(buttonContainer)
  videoContainer.appendChild(newVideoContainer)
}

function createAddTimeButton(videoTitle, secondsToAdd) {
  const addTimeButton = document.createElement('button');
  addTimeButton.innerText = '+ ' + formatTime(secondsToAdd);
  addTimeButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'addToDreamingSpanish',
      title: `${videoTitle} -- Logged by DreamingSync`,
      duration: Math.floor(secondsToAdd)
    }, function(response) {
      if (response.success) {
        addTimeButton.innerText = 'Added'
        addTimeButton.disabled = true
      }
      else addTimeButton.innerText = 'Error'
    });
  });
  return addTimeButton
}

GetPageData()

document.getElementById('get-data').addEventListener('click', GetPageData)
