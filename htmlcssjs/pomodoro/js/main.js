var up;

$('document').ready(function() {
  var countingStarted = 0,
      intervalID,
      sessionOrBreak = 0,
      timeSessionElapsed = 0,
      timeBreakElapsed = 0,
      elementColor = $('.color'),
      elementClock = $('.session-time');

  $('.session-time').text($('.session .number').text() + ':00');

  $('.btn').click(function(e) {
    var value = ($(this).hasClass('btn-minus')) ? -1 : 1;
    var session = parseInt($('.session .number').text(), 10);
    var _break = parseInt($('.break .number').text(), 10);
    e.preventDefault();

    if ($(this).parent().hasClass('session')) {
      if ((session + value) < 1) return false;
      session += value;
      $('.session .number').text(session);
      $('.session-time').text(session + ':00');
    } else {
      if ((_break + value) < 1) return false;
      _break += value;
      $('.break .number').text(_break);
    }
  });

  $('.pomidor').click(function() {
    if (countingStarted === 0) {
      $('.btn').attr('disabled', 'disabled');
      countingStarted = 1;
      start();
    }
    else{
      countingStarted = 0;
      stop();
    }
  });

  function start() {
    var sessionTime = parseInt($('.session .number').text(), 10) * 60,
        breakTime = parseInt($('.break .number').text(), 10) * 60;

      intervalID = setInterval(function() {
        if (sessionOrBreak === 0) {
          timeSessionElapsed += 1;
          updateColor(elementColor, timeSessionElapsed, sessionTime);
          updateClock(elementClock, timeSessionElapsed, sessionTime);
          if (timeSessionElapsed === sessionTime) {
            sessionOrBreak = 1;
            timeSessionElapsed = 0;
            $('.color').removeClass('color-session');
            $('.color').addClass('color-break');
            $('.pomidor').removeClass('pomidor-session');
            $('.pomidor').addClass('pomidor-break');
            $('.color').css('height', 0);
            $('.session-text').text('BREAK');
            $('.session-time').text($('.break .number').text() + ':00');
          };
        } else {
          timeBreakElapsed += 1;
           updateColor(elementColor, timeBreakElapsed, breakTime);
           updateClock(elementClock, timeBreakElapsed, breakTime);
          if (timeBreakElapsed === breakTime) {
            sessionOrBreak = 0;
            timeBreakElapsed = 0;
            $('.color').removeClass('color-break');
            $('.color').addClass('color-session');
            $('.pomidor').removeClass('pomidor-break');
            $('.pomidor').addClass('pomidor-session');
            $('.color').css('height', 0);
            $('.session-text').text('SESSION');
            $('.session-time').text($('.session .number').text() + ':00');
          }
        }
      }, 1000);
  };

  function stop() {
    clearInterval(intervalID);
  };

  function updateColor(element, timeElapsed, timeTotal) {
    var heightPercent = (timeElapsed / timeTotal) * 100;
    element.height(heightPercent + '%');
  }

  function updateClock(element, timeElapsed, timeTotal) {
    var minutes = Math.floor((timeTotal - timeElapsed) / 60);
    if (minutes < 10) minutes = '0' + minutes;
    var seconds = (timeTotal - (minutes * 60)) - timeElapsed;
    if (seconds < 10) seconds = '0' + seconds;
    element.text(minutes + ':' + seconds);
  }
});