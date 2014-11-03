(function() {
  window.CeregoApi = {};

  CeregoApi._host = "http://localhost:3001/v2/";

  CeregoApi._successCallback = function(data) {
    console.log(data);
  };

  CeregoApi._errorCallback = function(method, endpoint, jqXHR) {
    console.log("AJAX " + method + " to " + endpoint + " failed with status " + jqXHR.status + ": " + jqXHR.responseJSON.response);
  };

  CeregoApi._ajax = function(method, endpoint, params, successCallback, errorCallback) {
    successCallback = (typeof successCallback !== 'undefined') ? successCallback : CeregoApi._successCallback;
    errorCallback = (typeof errorCallback !== 'undefined') ? errorCallback : CeregoApi._errorCallback;

    var endpoint = CeregoApi._host + endpoint;

    $.ajax({
      type: method,
      dataType: 'json',
      url: endpoint,
      data: params,
      headers: {
        "Authorization": "Bearer " + CeregoApi._apiKey
      }
    }).done(function(data, textStatus, jqXHR) {
      var response = data.response;
      successCallback(response);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      errorCallback(method, endpoint, jqXHR);
    });
  };

  CeregoApi.apiKey = function(apiKey) {
    CeregoApi._apiKey = apiKey;
  };

  CeregoApi.getProfile = function(callback) {
    CeregoApi._ajax("GET", "my/profile", null, callback);
  };

  CeregoApi.createSet = function(params, callback) {
    CeregoApi._ajax("POST", "sets", params, callback);
  };

  // Result wrapped with {concept: {}}
  CeregoApi.createSetConcept = function(set_id, params, callback) {
    CeregoApi._ajax("POST", "sets/" + set_id + "/concepts", params, callback);
  };

  CeregoApi.createSetItem = function(set_id, params, callback) {
    CeregoApi._ajax("POST", "sets/" + set_id + "/items", params, callback);
  };

  CeregoApi.createItemFacet = function(item_id, params, callback) {
    CeregoApi._ajax("POST", "items/" + item_id + "/facets", params, callback);
  };

  // Result wrapped with {image: {}}
  CeregoApi.createImage = function(params, callback) {
    CeregoApi._ajax("POST", "images", params, callback);
  };

  // Expects params: {anchor: {text: "anchor1"}, {association: {text: "association1"}}}
  CeregoApi.createQuickItemAnchorAssociation = function(set_id, params, callback) {
    anchor = params.anchor;
    association = params.association;

    CeregoApi.createSetConcept(set_id, anchor, function(anchorConceptResult) {
      var anchorConcept = anchorConceptResult.concept;
      CeregoApi.createSetConcept(set_id, association, function(associationConceptResult) {
        var associationConcept = associationConceptResult.concept;
        CeregoApi.createSetItem(set_id, {
          association_collection: {
            concept_id: anchorConcept.id
          }
        }, function(item) {
          CeregoApi.createItemFacet(item.id, {
            set_id: set_id,
            concept_id: associationConcept.id
          }, callback);
        });
      });
    });
  };
})();

