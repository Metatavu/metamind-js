(() => {
  'use strict';

  window.metamind = new window.Metamind({apiUrl: 'http://dev-metamind-api.metatavu.io:8080/v1', 'story': 'lumme-electricity-order' });

  var botImage = 'https://robohash.org/' + Math.random().toString(36).substr(2);
  
  $(document).on('click', '.quick-message-btn', function(e) {
    sendMessage($(this).text());
  });

  $('.send-message-btn').click(function(e) {
    sendMessage();
  });
  
  function sendMessage(text) {
    $('.bot-typing').show();
    const disabled = $('.send-message-btn').attr('disabled');
    const message = text || $('.user-text-input').val();

    if (typeof disabled !== typeof undefined && disabled !== false) {
      return;
    }

    $('.send-message-btn').attr('disabled', 'disabled');
    $('#botHintText').text('');
    $('.quick-responses').empty();
    $('.discussion-container').append(
      `<div class="card user-response">
        <div class="card-body">
          <div class="media">
           <img class="mr-3 user-image" src="gfx/user.png">
           <div class="media-body">
             <h5 class="mt-0">Käyttäjä</h5>
             ${message}
           </div>
          </div>
        </div>
      </div>`  
    );
    $('.discussion-container')[0].scrollTop = $('.discussion-container')[0].scrollHeight;
    window.metamind.sendMessage(message);
  }
  
  function replaceLineBreaks(text) {
    return (text||'').replace(/\n/g, '<br/>');
  }

  window.metamind.on('response', function(data) {
    $('.bot-typing').hide();
    $('.send-message-btn').removeAttr('disabled');
    $('.user-text-input').val('');

    for (var i = 0; i < data.quickResponses.length; i++) {
      $('.quick-responses').append(`<button class="btn btn-info btn-sm quick-message-btn">${data.quickResponses[i]}</button>`);
    }

    $('#botHintText').text(data.hint || '');

    $('.discussion-container').append(
      `<div class="card bot-response">
        <div class="card-body">
          <div class="media">
           <img class="mr-3 user-image" src="${botImage}">
           <div class="media-body">
             <h5 class="mt-0">Lumme Bot</h5>
             ${replaceLineBreaks(data.response)}
           </div>
          </div>
        </div>
      </div>`  
    );
    $('.discussion-container')[0].scrollTop = $('.discussion-container')[0].scrollHeight;
  });
  
  $(document).ready(() => {
    $('.bot-typing').hide();
    $('.send-message-btn').attr('disabled', 'disabled');
    window.metamind.sendMessage('INIT');
  });
  
  $(document).on('keydown', (event) => {
    if (event.keyCode === 13) {
      sendMessage();
    }
  });
  
})();