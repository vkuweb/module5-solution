(function (global) {

  var dc = {};

  var allCategoriesUrl = "data/categories.json";
  var homeHtmlUrl = "snippets/home-snippet.html";
  var categoryHtmlUrl = "snippets/category-snippet.html";
  var menuItemsUrl = "data/menu-items.json";

  function insertHtml(selector, html) {
    document.querySelector(selector).innerHTML = html;
  }

  function insertProperty(template, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    return template.replace(new RegExp(propToReplace, "g"), propValue);
  }

  function chooseRandomCategory(categories) {
    var index = Math.floor(Math.random() * categories.length);
    var short = categories[index].short_name;

    dc.randomCategoryShortName = "'" + short + "'";
    dc.randomCategoryName = categories[index].name;
  }

  dc.loadHomePage = function () {
    $ajaxUtils.sendGetRequest(allCategoriesUrl, function (categories) {

      chooseRandomCategory(categories);

      $ajaxUtils.sendGetRequest(homeHtmlUrl, function (html) {
        html = insertProperty(html, "randomCategoryShortName", dc.randomCategoryShortName);
        insertHtml("#main-content", html);
      }, false);

    });
  };

  dc.loadMenuItems = function (shortName) {
    shortName = shortName.replace(/['"]/g, "");

    $ajaxUtils.sendGetRequest(categoryHtmlUrl, function (html) {
      $ajaxUtils.sendGetRequest(menuItemsUrl, function (items) {

        var list = "";
        (items[shortName] || []).forEach(function (item) {
          list += "<li>" + item.name + "</li>";
        });

        html = insertProperty(html, "categoryShortName", shortName);
        html = insertProperty(html, "categoryName", shortName);
        html = insertProperty(html, "menuItems", list);

        insertHtml("#main-content", html);

      });
    }, false);
  };

  document.addEventListener("DOMContentLoaded", function () {
    dc.loadHomePage();
  });

  global.$dc = dc;

})(window);
