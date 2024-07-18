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

// document.getElementById('get-data').addEventListener('click', GetPageData)

// Load timer
document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const resetButton = document.getElementById('resetButton');
  const timerDisplay = document.getElementById('timerDisplay');

  let startTime;
  let timerInterval;

  // Load stored start time
  chrome.storage.local.get(['startTime'], function (result) {
    if (result.startTime) {
      startTime = result.startTime;
      startTimer();
    }
  });

  startButton.addEventListener('click', function () {
    if (!startTime) {
      startTime = Date.now();
      chrome.storage.local.set({ startTime: startTime }, function () {
        startTimer();
      });
    }
  });

  resetButton.addEventListener('click', function () {
    clearInterval(timerInterval);
    startTime = null;
    timerDisplay.textContent = "0:00:00";
    chrome.storage.local.remove('startTime');
  });

  function startTimer() {
    timerInterval = setInterval(function () {
      const elapsedTime = Date.now() - startTime;
      const seconds = Math.floor((elapsedTime / 1000));
      timerDisplay.textContent = ' + ' + formatTime(seconds)
    }, 1000);
  }
});
