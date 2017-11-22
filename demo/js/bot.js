(()=>{'use strict';window.metamind=new window.Metamind({apiUrl:'http://dev-metamind-api.metatavu.io:8080/v1'});var botImage='https://robohash.org/'+Math.random().toString(36).substr(2);$(document).on('click','.quick-message-btn',function(e){sendMessage($(this).text())});$('.send-message-btn').click(function(e){var disabled=$(this).attr('disabled');var text=$('.user-text-input').val();if(typeof disabled!==typeof undefined&&disabled!==false){return}sendMessage(text)});function sendMessage(message){$('.send-message-btn').attr('disabled','disabled');$('#botHintText').text('');$('.quick-responses').empty();$('.discussion-container').append(`<div class="card user-response">
        <div class="card-body">
          <div class="media">
           <img class="mr-3 user-image" src="gfx/user.png">
           <div class="media-body">
             <h5 class="mt-0">Käyttäjä</h5>
             ${message}
           </div>
          </div>
        </div>
      </div>`);$('.discussion-container')[0].scrollTop=$('.discussion-container')[0].scrollHeight;window.metamind.sendMessage(message)}window.metamind.on('response',function(data){$('.send-message-btn').removeAttr('disabled');$('.user-text-input').val('');for(var i=0;i<data.quickResponses.length;i++){$('.quick-responses').append(`<button class="btn btn-info btn-sm quick-message-btn">${data.quickResponses[i]}</button>`)}$('#botHintText').text(data.hint||'');$('.discussion-container').append(`<div class="card bot-response">
        <div class="card-body">
          <div class="media">
           <img class="mr-3 user-image" src="${botImage}">
           <div class="media-body">
             <h5 class="mt-0">Metamind</h5>
             ${data.response}
           </div>
          </div>
        </div>
      </div>`);$('.discussion-container')[0].scrollTop=$('.discussion-container')[0].scrollHeight})})();
//# sourceMappingURL=bot.js.map
