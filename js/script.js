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
    // VERY IMPORTANT: include single quotes so onclick becomes $dc.loadMenuItems('L')
    dc.randomCategoryShortName = "'" + short + "'";
    dc.randomCategoryName = categories[index].name;
    console.log("Random category picked:", dc.randomCategoryShortName);
  }

  dc.loadHomePage = function () {
    // STEP 0: get categories -> choose random -> load home snippet (HTML)
    $ajaxUtils.sendGetRequest(allCategoriesUrl, function (categories) {
      if (!Array.isArray(categories) || categories.length === 0) {
        console.error("No categories found at", allCategoriesUrl);
        return;
      }
      chooseRandomCategory(categories);

      // Load home snippet as TEXT (isJson=false)
      $ajaxUtils.sendGetRequest(homeHtmlUrl, function (homeHtml) {
        var finalHtml = insertProperty(homeHtml, "randomCategoryShortName", dc.randomCategoryShortName);
        insertHtml("#main-content", finalHtml);

        // ensure logo/back works
        var logo = document.getElementById("logo-link");
        if (logo) {
          logo.addEventListener("click", function (e) {
            e.preventDefault();
            dc.loadHomePage();
          });
        }
      }, false);
    }, true);
  };

  dc.loadMenuItems = function (categoryShortName) {
    // remove surrounding quotes
    var shortName = ("" + categoryShortName).replace(/['"]/g, "");
    // load category template (HTML)
    $ajaxUtils.sendGetRequest(categoryHtmlUrl, function (categoryHtml) {
      // load menu items (JSON)
      $ajaxUtils.sendGetRequest(menuItemsUrl, function (allItems) {
        var items = allItems[shortName] || [];
        var listHtml = "";
        for (var i = 0; i < items.length; i++) {
          listHtml += "<li>" + items[i].name + "</li>";
        }
        var final = categoryHtml;
        final = insertProperty(final, "categoryShortName", shortName);
        final = insertProperty(final, "categoryName", shortName);
        final = insertProperty(final, "menuItems", listHtml);
        insertHtml("#main-content", final);

        var back = document.getElementById("back-home");
        if (back) {
          back.addEventListener("click", function (e) {
            e.preventDefault();
            dc.loadHomePage();
          });
        }
      }, true);
    }, false);
  };

  // expose and auto-load
  global.$dc = dc;
  document.addEventListener("DOMContentLoaded", function () {
    dc.loadHomePage();
  });

})(window);
