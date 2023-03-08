function renderingInterfaceSearch(obj) {
  const content = document.querySelectorAll('[data-search-content]');
  for (let block of content) {
    block.innerHTML = '';
    if (block.dataset.searchContent === 'phonetics') {
      obj.phonetics.forEach(el => {
        if (el.text !== undefined) {
          block.innerHTML += `<p class="sentences__el">${el.text}</p>`;
        }
      })
    }
    if (block.dataset.searchContent === 'synonyms') {
      for (let i = 0; i < obj.meanings.length; i++) {
        obj.meanings[i].synonyms.forEach(el => {
          block.innerHTML += `<li class="sense__el">${el}</li>`;
        })
      }
    }
    if (block.dataset.searchContent === 'antonyms') {
      for (let i = 0; i < obj.meanings.length; i++) {
        obj.meanings[i].antonyms.forEach(el => {
          block.innerHTML += `<li class="sense__el">${el}</li>`;
        })
      }
    }
    if (block.dataset.searchContent === 'definitions') {
      for (let i = 0; i < obj.meanings.length; i++) {
        obj.meanings[i].definitions.forEach(el => {
          block.innerHTML += `<p class="sentences__el">${el.definition}</p>`;
        })
      }
    }
  }
  document.querySelector('[data-search-source]').onclick = function () {
    obj.sourceUrls.forEach(el => {
      window.open(el);
    })
  }
}

function initSearch(word) {
  document.querySelector('[data-search]').onclick = null;
  document.querySelector('[data-search]').onclick = function () {
    const urlSearch = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(urlSearch)
      .then((response) => response.json())
      .then((data) => {
        renderingInterfaceSearch(data[0]);
        MicroModal.show('modal-search');
      })
  }
}