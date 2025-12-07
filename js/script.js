(function(global) {
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
    var randomIndex = Math.floor(Math.random() * categories.length);
    var randomShortName = categories[randomIndex].short_name;
    dc.randomCategoryShortName = "'" + randomShortName + "'";
    dc.randomCategoryName = categories[randomIndex].name;
    console.log('Random category selected:', dc.randomCategoryShortName);
  }

  dc.loadHomePage = function() {
    $ajaxUtils.sendGetRequest(allCategoriesUrl, function(categories) {
      chooseRandomCategory(categories);
      $ajaxUtils.sendGetRequest(homeHtmlUrl, function(homeHtml) {
        var finalHtml = insertProperty(homeHtml, "randomCategoryShortName", dc.randomCategoryShortName);
        insertHtml("#main-content", finalHtml);
        var logo = document.getElementById('logo-link');
        if (logo) {
          logo.addEventListener('click', function(e) {
            e.preventDefault();
            dc.loadHomePage();
          });
        }
      }, false);
    }, true);
  };

  dc.loadMenuItems = function(categoryShortName) {
    var shortName = categoryShortName;
    if (typeof shortName === 'string') {
      shortName = shortName.replace(/['"]+/g, '');
    }
    $ajaxUtils.sendGetRequest(categoryHtmlUrl, function(categoryHtml) {
      $ajaxUtils.sendGetRequest(menuItemsUrl, function(allItems) {
        var items = allItems[shortName] || [];
        var listHtml = '';
        for (var i=0;i<items.length;i++) {
          listHtml += '<li>' + items[i].name + '</li>';
        }
        var title = shortName;
        var final = categoryHtml;
        final = insertProperty(final, 'categoryShortName', shortName);
        final = insertProperty(final, 'categoryName', title);
        final = insertProperty(final, 'menuItems', listHtml);
        insertHtml('#main-content', final);
        var back = document.getElementById('back-home');
        if (back) {
          back.addEventListener('click', function(e) {
            e.preventDefault();
            dc.loadHomePage();
          });
        }
      }, true);
    }, false);
  };

  global.$dc = dc;
  document.addEventListener('DOMContentLoaded', function() {
    dc.loadHomePage();
  });

})(window);
