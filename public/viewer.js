let userId,
  token,
  streamElementsId,
  streamElementsToken,
  makeRequest,
  queueInterval;
const twitch = window.Twitch.ext;

twitch.onAuthorized((auth) => {
  token = auth.token;
  userId = auth.userId;
});

twitch.configuration.onChanged(() => {
  if (twitch.configuration.broadcaster) {
    try {
      const config = JSON.parse(twitch.configuration.broadcaster.content);

      if (typeof config === "object") {
        streamElementsId = config.streamElementsId;
        streamElementsToken = config.streamElementsToken;

        makeRequest =
          config.makeRequest === null || config.makeRequest === undefined
            ? true
            : config.makeRequest;

        $("#request-form").toggle(makeRequest);
        createQueueInterval();
      }
    } catch (err) {
      console.error("Invalid config.");
    }
  }
});

$(document).ready(() => {
  const $formContainer = $("#request-form");
  const $input = $("#song-selector");

  $formContainer.toggle(makeRequest);
  $formContainer.submit((e) => {
    e.preventDefault();
    const video = $input.val().trim();
    if (video) {
      $.ajax({
        url: `https://api.streamelements.com/kappa/v2/songrequest/${streamElementsId}/queue`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ video }),
        headers: {
          Authorization: `Bearer ${streamElementsToken}`,
        },
        success: () => {
          createQueueInterval();
          $input.val("");
        },
        error: (err) => {
          console.error(err);
          $input.addClass("error");
        },
      });
    }
  });

  $input.on("focus", () => {
    $input.removeClass("error");
  });
});

function createQueueInterval() {
  if (queueInterval) {
    clearInterval(queueInterval);
  }

  fetchQueue(streamElementsId, streamElementsToken);
  queueInterval = setInterval(
    () => fetchQueue(streamElementsId, streamElementsToken),
    30000
  );
}
