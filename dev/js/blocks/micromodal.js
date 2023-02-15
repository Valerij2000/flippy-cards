MicroModal.init();
const modalButton = document.querySelector('[data-modal]');
modalButton.addEventListener('click', function() {
  MicroModal.show(this.dataset.modal);  
})