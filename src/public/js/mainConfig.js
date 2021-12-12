const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const flashMasterNotify = () => {
  let notify = $('.master-success-message span.message')
  if (notify) {
    alertify.notify(notify.textContent, 'success', 5)
    notify.parentElement.remove()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Flash message ở màn hình master
  flashMasterNotify()
})
