(function (window) {
  var ajaxUtils = {};

  function getRequestObject() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
    else {
      alert("AJAX not supported");
      return null;
    }
  }

  ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJson) {
    var request = getRequestObject();

    request.onreadystatechange = function () {
      if ((this.readyState == 4) && (this.status == 200)) {
        if (isJson == undefined) {
          isJson = true;
        }

        responseHandler(isJson ? JSON.parse(this.responseText) : this.responseText);
      }
    };

    request.open("GET", requestUrl, true);
    request.send(null);
  };

  window.$ajaxUtils = ajaxUtils;
})(window);
