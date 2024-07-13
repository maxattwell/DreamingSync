window.addEventListener('load', () => {
    const videos = document.querySelectorAll('ytd-video-renderer');

    videos.forEach(video => {
        const button = createAddButton(video);
    console.log(video)
        video.appendChild(button);
    });
});

function createAddButton(video) {
    const button = document.createElement('button');
    button.innerText = 'Add to Dreaming Spanish';
    button.style.margin = '10px';
    button.addEventListener('click', () => addToDreamingSpanish(video));
    return button;
}

function addToDreamingSpanish(video) {
    console.log('DreamingSync')
    const progressDiv = video.querySelector('#progress');
    const widthPercentage = progressDiv.style.width;
    const videoTitle = video.querySelector('#video-title').innerText;
    const videoDuration = video.querySelector('.badge-shape-wiz__text').innerText;
    const durationInSeconds = calculateWatchedTime(videoDuration, widthPercentage);

    chrome.runtime.sendMessage({
        action: 'addToDreamingSpanish',
        title: videoTitle,
        duration: Math.floor(durationInSeconds)
    });
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
