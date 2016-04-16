// Get current year for copyright
$('#currentYear').text(new Date().getFullYear());

// Handle search box autocomplete
$("#search").autocomplete({
  delay: 0,
  source: function(request, response) {
    var limit = $("input:radio[name='gimme']:checked").val();
    getSuggestions(request, response, limit);
    $('.search-engine-label').show();
  },
  // Hide number of results message
  messages: {
    noResults: '',
    results: function() {}
  }
});

// Pass term to search engines (requests), and poulate lists of suggestions (responses)
function getSuggestions(request, response, limit) {

  // Google request
  var googSuggestURL = "http://suggestqueries.google.com/complete/search?client=chrome&q=%QUERY";
  googSuggestURL = googSuggestURL.replace('%QUERY', request.term);
  $.ajax({
      method: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'jsonCallback',
      url: googSuggestURL
    })
    .success(function(data) {
      // Remove any previous suggestions
      $('#goog-suggestions li').remove();
      // Build list of suggestion links
      $.each(data[1], function(key, val) {
        var link = getLink("https://www.google.com/#q=", val, "Google");
        $('#goog-suggestions').append("<li>" + link + "</li>");
        return key < limit - 1;
      });
    });

  // Bing request
  var bingSuggestURL = "http://api.bing.com/osjson.aspx?JsonType=callback&JsonCallback=?";
  $.getJSON(bingSuggestURL, {
    query: request.term
  }, function(data) {
    $('#bing-suggestions li').remove();
    $.each(data[1], function(key, val) {
      var link = getLink("http://www.bing.com/search?q=", val, "Bing");
      $('#bing-suggestions').append("<li>" + link + "</li>");
      return key < limit - 1;
    });
  });

  // Yahoo request
  var yahooSuggestURL = "http://ff.search.yahoo.com/gossip";
  $.ajax({
      url: yahooSuggestURL,
      dataType: "jsonp",
      data: {
        "output": "jsonp",
        "command": request.term
      }
    })
    .success(function(data) {
      $('#yahoo-suggestions li').remove();
      $.each(data.gossip.results, function(key, val) {
        var link = getLink("https://search.yahoo.com/search?p=", val.key, "Yahoo");
        $('#yahoo-suggestions').append("<li>" + link + "</li>");
        return key < limit - 1;
      });
    });
}

// Generate link for suggestions
function getLink(url, term, label) {
  formattedTerm = term.split(' ').join('+');
  return "<a target=\"_blank\" href=\"" + url + formattedTerm + "\" title=\"View results on " + label + "\"\">" + term + "</a>";
}
