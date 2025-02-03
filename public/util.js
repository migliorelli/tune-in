const $extension = $(".extension");
const $nowPlayingStatus = $(".now-playing-status");
const $queueList = $(".queue-list");
const $queueStatus = $(".queue-status");

function fetchQueue(channelId, token) {
  $.when(
    $.ajax({
      url: `https://api.streamelements.com/kappa/v2/songrequest/${channelId}/playing`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    $.ajax({
      url: `https://api.streamelements.com/kappa/v2/songrequest/${channelId}/queue`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  )
    .then((response1, response2) => {
      updateNowPlaying(response1[0]);
      updateQueueDisplay(response2[0]);
    })
    .fail((xhr, status, error) => {
      console.error("One or both of the AJAX requests failed:", error);
    })
    .always(() => {
      $extension.removeClass("loading");
    });
}
function updateNowPlaying(song) {
  if (!song) {
    $nowPlayingStatus.text("No music playing.");
    return;
  }

  $nowPlayingStatus.empty();
  $("#now-playing").html(generateSongContent(song));
}

function updateQueueDisplay(songs) {
  if (!songs || songs.length === 0) {
    $queueStatus.text("The queue is empty.");
    $queueList.empty();
    return;
  }

  $queueList.empty();
  $queueStatus.empty();

  const queue = songs.map(
    (song) => `
      <li class="song">
        ${generateSongContent(song)}
      </li>
    `
  );

  $queueList.html(queue.join(""));
}

function generateSongContent(song) {
  const songThumb = `https://i.ytimg.com/vi/${song.videoId}/default.jpg`;

  return `
    <a href="https://youtu.be/${song.videoId}" target="_blank">
      <div class="song-thumb">
        <img src="${songThumb}" />
      </div>
      <div class="song-infos">
        <div class="song-title">🎵 ${song.title}</div>
        <div class="song-footer">
          ${song.user ? `👤 ${song.user.username}` : ""} ⌚ ${convertDuration(
    song.duration
  )}
        </div>
      </div>
    </a>
  `;
}

function convertDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ${seconds % 60}s`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
