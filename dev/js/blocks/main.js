function existAudio() {
  const audio = document.querySelector('audio');
  if (audio) {
    audio.remove();
  }
}

function renderingAudio(obj) {
  let blobUrl = obj.audio.dataURL;
  window.audio = new Audio();
  window.audio.src = blobUrl;
  document.body.appendChild(window.audio);
  document.querySelector('#button-audio').addEventListener('click', () => {
    window.audio.play();
  })
}

function renderingPhrasesList(selector, obj) {
  let contain = document.querySelector(`#${selector}`);
  contain.innerHTML = '';
  for (key in obj) {
    if (obj[key] !== null) {
      contain.innerHTML += `
        <li class="phrase">${obj[key]}</li>
      `;
    }
  }
}

function renderingPhrasesRussian(obj) {
  let pharseRu = obj.context.phrase.hTranslations;
  renderingPhrasesList('phrase-ru', pharseRu);
}

function renderingPhrasesEnglish(obj) {
  let phraseEn = obj.context.phrase.subtitles;
  renderingPhrasesList('phrase-en', phraseEn);
}

function renderingEnglishFront(obj) {
  let wordEn = obj.word.text,
    front = document.querySelector('#front');

  front.innerHTML = `<p class="word">${wordEn}</p>`;
}

function renderingTranslateList(obj) {
  let wordsRu = obj.wordTranslationsArr,
    list = document.querySelector('#translate-list');

  list.innerHTML = '';
  wordsRu.forEach(wordRu => {
    list.innerHTML += `
      <li class="translate">${wordRu}</li>
    `;
  })
}

function renderingFlipCard(obj) {
  renderingEnglishFront(obj);
  renderingTranslateList(obj);
  renderingPhrasesEnglish(obj);
  renderingPhrasesRussian(obj);
  existAudio();
  renderingAudio(obj);
}

function toggleFlipping() {
  document.querySelector('#front').classList.toggle('active');
  document.querySelector('#back').classList.toggle('active');
}

function changesSide() {
  document.querySelector('#container').addEventListener('click', () => {
    toggleFlipping();
  })
}

function eventsNull() {
  document.querySelector('#button-comback').onclick = null;
  document.querySelector('#button-continue').onclick = null;
  document.onkeydown = null;
}

function initApp(data) {
  eventsNull();
  for (let i = 0; i < data.length; i++) {
    renderingFlipCard(data[i]);
    document.querySelector('#button-comback').onclick = function () {
      data.unshift(data.pop());
      renderingFlipCard(data[i]);      
    }
    document.querySelector('#button-continue').onclick = function () {
      data.push(data.shift());
      renderingFlipCard(data[i]);      
    }
    document.onkeydown = function (event) {      
      if (event.code === 'ArrowLeft') {
        data.unshift(data.pop());
        renderingFlipCard(data[i]);
      }
      if (event.code === 'ArrowRight') {
        data.push(data.shift());
        renderingFlipCard(data[i]);
      }
      if (event.code === 'Space') {
        toggleFlipping();
      }
      if (event.code === 'ArrowDown') {
        window.audio.play();
      }
    }
    break;
  }
}

function initFetch(value) {
  let url = `json/${value}.json`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      initApp(data);
    })
}

(function init() {
  const defaultUrl = 'w1';
  const wordList = document.querySelectorAll('[data-words-list]');

  for (let list of wordList) {
    list.addEventListener('click', function () {
      toggleMarker(this, wordList);
      initFetch(this.dataset.wordsList);
    })
  }
  changesSide();
  initFetch(defaultUrl);
}())