document.addEventListener('DOMContentLoaded', async () => {
  const { chat } = await httpGet(`/chats/${chatId}`)
  $('#chatName').innerHTML = getChatName(chat)
})

let chatIdUpdateName
$('#chatName').onclick = e => {
  chatIdUpdateName = e.target.dataset.id
  $('input#chatNameInput').value = e.target.innerHTML
}

let chatNameUpdate
$('input#chatNameInput').onchange = e => {
  chatNameUpdate = e.target.value
}

const updateChatName = async (chatIdUpdateName, chatNameUpdate) => {
  const { chatUpdated } = await httpPatch(`/chats/${chatIdUpdateName}`, {
    chatName: chatNameUpdate,
  })
  $('#chatName').innerHTML = chatUpdated.chatName
}

$('#createChatNameModal').addEventListener('shown.bs.modal', e => {
  e.target.onclick = async e => {
    if (e.target.closest('#submitChatNameButton')) {
      if (chatNameUpdate) {
        updateChatName(chatIdUpdateName, chatNameUpdate)
      }
    }
  }
})

$('#createChatNameModal').addEventListener('hide.bs.modal', e => {
  $('input#chatNameInput').value = $('#chatName').innerHTML
})
