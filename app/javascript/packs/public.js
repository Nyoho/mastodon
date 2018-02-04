import loadPolyfills from '../mastodon/load_polyfills';
var loadScript = require('load-script');

function main() {
  const { length } = require('stringz');
  const IntlRelativeFormat = require('intl-relativeformat').default;
  const { delegate } = require('rails-ujs');
  const emojify = require('../mastodon/emoji').default;
  const { getLocale } = require('../mastodon/locales');
  const ready = require('../mastodon/ready').default;

  const { localeData } = getLocale();
  localeData.forEach(IntlRelativeFormat.__addLocaleData);

  ready(() => {
    const locale = document.documentElement.lang;
    const dateTimeFormat = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    const relativeFormat = new IntlRelativeFormat(locale);

    [].forEach.call(document.querySelectorAll('.emojify'), (content) => {
      content.innerHTML = emojify(content.innerHTML);
    });

    [].forEach.call(document.querySelectorAll('time.formatted'), (content) => {
      const datetime = new Date(content.getAttribute('datetime'));
      const formattedDate = dateTimeFormat.format(datetime);
      content.title = formattedDate;
      content.textContent = formattedDate;
    });

    [].forEach.call(document.querySelectorAll('time.time-ago'), (content) => {
      const datetime = new Date(content.getAttribute('datetime'));
      content.textContent = relativeFormat.format(datetime);
    });
  });

  delegate(document, '.video-player video', 'click', ({ target }) => {
    if (target.paused) {
      target.play();
    } else {
      target.pause();
    }
  });

  delegate(document, '.activity-stream .media-spoiler-wrapper .media-spoiler', 'click', function() {
    this.parentNode.classList.add('media-spoiler-wrapper__visible');
  });

  delegate(document, '.activity-stream .media-spoiler-wrapper .spoiler-button', 'click', function() {
    this.parentNode.classList.remove('media-spoiler-wrapper__visible');
  });

  delegate(document, '.webapp-btn', 'click', ({ target, button }) => {
    if (button !== 0) {
      return true;
    }
    window.location.href = target.href;
    return false;
  });

  delegate(document, '.status__content__spoiler-link', 'click', ({ target }) => {
    const contentEl = target.parentNode.parentNode.querySelector('.e-content');
    if (contentEl.style.display === 'block') {
      contentEl.style.display = 'none';
      target.parentNode.style.marginBottom = 0;
    } else {
      contentEl.style.display = 'block';
      target.parentNode.style.marginBottom = null;
    }
    return false;
  });

  delegate(document, '.account_display_name', 'input', ({ target }) => {
    const nameCounter = document.querySelector('.name-counter');
    if (nameCounter) {
      nameCounter.textContent = 30 - length(target.value);
    }
  });

  delegate(document, '.account_note', 'input', ({ target }) => {
    const noteCounter = document.querySelector('.note-counter');
    if (noteCounter) {
      noteCounter.textContent = 160 - length(target.value);
    }
  });

  loadScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML,Safe', function () {
    const options = {
      tex2jax: {
	    inlineMath: [ ['$','$'], ['\\(','\\)'] ]
      },
      TeX: {
        extensions: ["AMScd.js"]
      },
      skipStartupTypeset: true,
      showProcessingMessages: false,
      messageStyle: "none",
      showMathMenu: true,
      showMathMenuMSIE: true,
      "SVG": {
	    font:
	    "TeX"
	    // "STIX-Web"
	    // "Asana-Math"
	    // "Neo-Euler"
	    // "Gyre-Pagella"
	    // "Gyre-Termes"
	    // "Latin-Modern"
      },
      "HTML-CSS": {
	    availableFonts: ["TeX"],
	    preferredFont: "TeX",
	    webFont: "TeX"
      }
    };
    MathJax.Hub.Config(options);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, ""]);
  });

  delegate(document, '#account_avatar', 'change', ({ target }) => {
    const avatar = document.querySelector('.card.compact .avatar img');
    const [file] = target.files || [];
    const url = URL.createObjectURL(file);
    avatar.src = url;
  });

  delegate(document, '#account_header', 'change', ({ target }) => {
    const header = document.querySelector('.card.compact');
    const [file] = target.files || [];
    const url = URL.createObjectURL(file);
    header.style.backgroundImage = `url(${url})`;
  });
}

loadPolyfills().then(main).catch(error => {
  console.error(error);
});
