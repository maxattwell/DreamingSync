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

function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = Math.floor(seconds % 60);

    let formattedTime = '';

    if (hrs > 0) {
        formattedTime += (hrs < 10 ? '0' : '') + hrs + ':';
    }
    formattedTime += (mins < 10 ? '0' : '') + mins + ':';
    formattedTime += (secs < 10 ? '0' : '') + secs;

    return formattedTime;
}

function calculateWatchedTime(duration, progressPercentage) {
  const totalSeconds = convertToSeconds(duration);
  const fractionWatched = parseFloat(progressPercentage)
  const watchedSeconds = totalSeconds * (parseFloat(progressPercentage) / 100);
  return watchedSeconds;
}
