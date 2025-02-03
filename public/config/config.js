let token, userId;
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
        $("#account-id").val(config.streamElementsId);
        $("#jwt-token").val(config.streamElementsToken);
      }
    } catch (err) {
      console.error("Invalid config.");
    }
  }
});

$(function () {
  // $("#paste-account-id").click(() => {
  //   navigator.clipboard.readText().then((text) => {
  //     $("#account-id").val(text);
  //   });
  // });

  // $("#paste-jwt-token").click(() => {
  //   navigator.clipboard.readText().then((text) => {
  //     $("#jwt-token").val(text);
  //   });
  // });

  $("#id-form").submit((e) => {
    e.preventDefault();

    const streamElementsId = $("#account-id").val().trim();
    const streamElementsToken = $("#jwt-token").val().trim();

    if (streamElementsId && streamElementsToken) {
      $("#status").removeClass("error success");

      try {
        twitch.configuration.set(
          "broadcaster",
          "1.0",
          JSON.stringify({ streamElementsId, streamElementsToken })
        );
        $("#status").addClass("success").text("Success.");
      } catch (err) {
        $("#status").addClass("error").text(`Error: ${err.message}.`);
      }
    } else {
      $("#status").addClass("error").text(`Plese fill the fields.`);
    }
  });
});
