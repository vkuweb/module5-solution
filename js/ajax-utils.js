(function (window) {
  var ajaxUtils = {};

  function getRequestObject() {
    if (window.XMLHttpRequest) {
      return (new XMLHttpRequest());
    } else if (window.ActiveXObject) {
      return (new ActiveXObject("Microsoft.XMLHTTP"));
    } else {
      window.alert("Ajax not supported");
      return null;
    }
  }

  ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          if (isJsonResponse === undefined) {
            isJsonResponse = true;
          }
          if (isJsonResponse) {
            responseHandler(JSON.parse(request.responseText));
          } else {
            responseHandler(request.responseText);
          }
        } else {
          console.error("Request error", request.status, request.statusText, request.responseURL);
        }
      }
    };
    request.open("GET", requestUrl, true);
    request.send(null);
  };

  window.$ajaxUtils = ajaxUtils;
})(window);
