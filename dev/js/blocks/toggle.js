function toggleMarker(current, array) {
  array.forEach(el => {
    el.classList.remove('active-list');
  })
  current.classList.add('active-list');
}