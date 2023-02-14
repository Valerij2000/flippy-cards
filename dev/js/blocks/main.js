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
  renderingAudio(obj);
}

function changesSide() {
  const container = document.querySelector('#container');
  container.addEventListener('click', () => {
    const front = document.querySelector('#front');
    const back = document.querySelector('#back');
    front.classList.toggle('active');
    back.classList.toggle('active');
  })
}

function initApp(data) {
  changesSide();
  for (let i = 0; i < data.length; i++) {
    renderingFlipCard(data[i]);
    document.querySelector('#button-comback').addEventListener('click', () => {
      data.unshift(data.pop());
      renderingFlipCard(data[i]);
    })
    document.querySelector('#button-continue').addEventListener('click', () => {
      data.push(data.shift());
      renderingFlipCard(data[i]);
    })
    break;
  }
}

fetch('json/words.json')
  .then((response) => response.json())
  .then((data) => {
    initApp(data);
  })