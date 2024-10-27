let siteName
let videoContainer
let errorMessage

export function SetupVideos(main) {
  siteName = document.createElement('h3')
  videoContainer = document.createElement('div')
  videoContainer.id = 'video-container'
  errorMessage = document.createElement('div')

  main.append(
    siteName,
    videoContainer,
    errorMessage
  )

  AddSignOut()
  SetVideoData()
}

function AddSignOut() {
  const signOutButton = document.createElement('button')
  signOutButton.innerText = "Sign out"

  signOutButton.addEventListener('click', () => {
    localStorage.removeItem('token')
  })

  main.append(signOutButton)
}

function SetVideoData() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getData' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        errorMessage.innerText = 'Error getting videos.';
      } else {
        siteName.innerText = response.site

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

function generateUniqueId() {
  const timestamp = Date.now();
  const randomComponent = Math.random();
  const uniqueId = `${timestamp}${randomComponent}`;
  return uniqueId;
}

function addHours(title, duration) {
  const body = {
    date: new Date().toLocaleString('en-CA').split(',')[0],
    description: `${title} -- Logged by DreamingSync`,
    id: generateUniqueId(),
    timeSeconds: duration,
    type: "watching"
  }

  const token = localStorage.getItem('token')

  return fetch('https://www.dreamingspanish.com/.netlify/functions/externalTime', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      console.log(`Success. Time added with id: ${data.id}`);
      return { success: true }
    })
    .catch((error) => {
      console.error('Error adding time:', error);
      return { success: false }
    });
}

function setVideoButtons(video) {
  const newVideoContainer = document.createElement('div')
  const buttonContainer = document.createElement('div')

  const newVideoTitle = document.createElement('p')
  newVideoTitle.innerText = video.title
  newVideoContainer.appendChild(newVideoTitle)

  const watchedButton = createAddTimeButton(video.title, Math.floor(video.watchedSeconds))
  const lengthButton = createAddTimeButton(video.title, Math.floor(video.lengthSeconds))

  buttonContainer.appendChild(watchedButton);
  buttonContainer.appendChild(lengthButton);

  newVideoContainer.appendChild(buttonContainer)
  videoContainer.appendChild(newVideoContainer)
}

function createAddTimeButton(videoTitle, secondsToAdd) {
  const addTimeButton = document.createElement('button');
  addTimeButton.innerText = '+ ' + formatTime(secondsToAdd);
  addTimeButton.addEventListener('click', () => {
    addHours(videoTitle, secondsToAdd).then((response) => {
      if (response.success) {
        addTimeButton.innerText = 'Added'
        addTimeButton.disabled = true
      }
      else addTimeButton.innerText = 'Error'
    })
  });
  return addTimeButton
}
