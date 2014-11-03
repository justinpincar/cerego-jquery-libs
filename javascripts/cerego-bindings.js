$(function() {
  // TODO: Remove this test API key
  var apiKey = "gOAhh3oc3jvK4SYK76HIxyd3IeF5h39Lv1JLQ1tb9hc+6t7NyCFjdyrvdMOs2a7s";
  $("#cerego-api-key").val(apiKey);

  var getApiKey = function() {
    Cerego.apiKey($("#cerego-api-key").val());
  };
  getApiKey();

  $("#profile-get").click(function() {
    getApiKey();
    Cerego.getProfile(Cerego._debugCallback);
    return false;
  });

  $("#set-create").click(function() {
    getApiKey();
    Cerego.createSet({
      name: $("#set-create-name").val(),
      description: $("#set-create-description").val(),
      language_id: 1819
    }, Cerego._debugCallback);
    return false;
  });
});

