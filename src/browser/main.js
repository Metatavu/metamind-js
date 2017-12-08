/* global Promise */

const MetamindClient = require('metamind-client');
const queryString = require('query-string');

class Metamind {
  
  constructor(options) {
    this.sessionsApi = new MetamindClient.SessionsApi();
    this.messagesApi = new MetamindClient.MessagesApi();
    this.apiUrl = options.apiUrl;
    this.apiKey = options.apiKey;
    this.story = options.story;
    this.listeners = {};
    this.locale = 'fi';
    this.timeZone = 'Europe/Helsinki';
    this.sessionId = null;
    this.maxRetryCount = 5;
    this.retries =  0;
    this.initClient();
  }
  
  initClient() {
    MetamindClient.ApiClient.instance.basePath = this.apiUrl;
  }
  
  on(eventName, listener) {
    if (typeof listener === "function") {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(listener);
    } else {
      throw new Error('Invalid metamind message listener'); 
    }
  }
  
  sendMessage(content) {
    this.getSessionId()
      .then((sessionId) => {
        const message = MetamindClient.Message.constructFromObject({
          sessionId: sessionId,
          content: content
        });
        
        return this.messagesApi.createMessage(message);        
      })
      .then((response) => {
        this.retries = 0;
        this.trigger('response', response);
      })
      .catch((err) => {
        this.log(err);
        this.retries++;
        if (this.retries < this.maxRetryCount) {
          setTimeout(() => {
            this.sendMessage(content);
          }, 200);
        }
      });
  }
  
  getSessionId() {
    if (this.sessionId) {
      return Promise.resolve(this.sessionId);
    }
    
    const payload = MetamindClient.Session.constructFromObject({
      story: this.story,
      locale: this.locale,
      timeZone: this.timeZone,
      visitor: navigator ? navigator.userAgent : 'Unknown'
    });

    return this.sessionsApi.createSession(payload)
      .then((session) => {
        this.sessionId = session.id;
        return this.sessionId;
      });
  }
  
  trigger(eventName, data) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((listener) => {
        listener(data);
      });  
    }
  }
  
  log(message) {
    if (typeof console.log === "function") {
      console.log(message);
    }
  }
}

const options = queryString.parse(location.search);

window.Metamind = Metamind;
window.metamind = new Metamind(options);