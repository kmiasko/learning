$('document').ready(function() {
  $('.custom-icon, .icon-close').click(function() {
    $('.searchBox').children().toggleClass('hide');
    $('.searchInput').toggleClass('searchInput-show');
    $('.icon-close').toggleClass('icon-close-show');
  });

  $('.icon-close').click(function() {
    $('#search').val('');
    $('.wrapper').removeClass('top').addClass('center');
    $('.wikis').html('');
  });

  $('#search').on('keydown', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      $('.wikis').html('');
      var text = $('#search').val();
      if (text !== '') {
        $('.wrapper').removeClass('center').addClass('top');
        downloadWikis(text);
      }
    }
  });

  function downloadWikis(searchFor) {
    var url = "http://en.wikipedia.org/w/api.php?callback=?";

    $.getJSON(url, {
      'action': 'query',
      'generator': 'search',
      'gsrnamespace': 0,
      'gsrlimit': 15,
      'prop': 'pageimages|extracts|info',
      'inprop': 'url',
      'pilimit': 'max',
      'exintro': '',
      'explaintext': '',
      'exsentences': 1,
      'exlimit': 'max',
      'gsrsearch': searchFor,
      'format': 'json'
    }).done(function(result) {
      var html = '';
      $.each(result.query.pages, function(i, item) {
        html += '<a href="' + item.fullurl + '" target="_blank">' +
          '<li class="item">' +
          '<h4 class="title">' + item.title + '</h4>' +
          '<p class="extext">' + item.extract + '</p>' +
          '</li>' +
          '</a>';
      });
      $('.wikis').append(html);
    });
  }
});