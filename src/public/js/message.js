document.addEventListener('DOMContentLoaded', async () => {
  const { chat } = await httpGet(`/chats/${chatId}`)
  $('#chatName').innerHTML = getChatName(chat)
  scrollToBottom(false)
})

//-------------------- Rename chat --------------------
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
//-------------------- End rename chat --------------------

// ------------------- Message ---------------------
// ------------------- Get all messages ---------------------
;(async () => {
  const page = 1
  const limit = 10
  const sortBy = 'createdAt'
  const select = ''

  const data = await httpGet(
    `/messages/content?chat=${chatId}&page=${page}&limit=${limit}&sortBy=${sortBy}&select=${select}`
  )

  if (data.messages.length < 1) {
    $('.messages').innerHTML = `
      <div class="sayhi">
        <img src="https://media1.giphy.com/media/LPehs7j0jKj48I0HeM/giphy.gif?cid=ecf05e478vdwqyop055dycxko107r6kdcj71vr5lh48wbt1j&rid=giphy.gif&ct=g" alt="" />                        
        <p >Vẫy tay chào</p>
      </div>`
    return
  }
  data.messages.forEach(message => addChatMessage(message))
  $('.lds-message').remove()
  $('.messages.hidden').classList.remove('hidden')
})()

// ------------------- Send message ---------------------
const sendMessage = async content => {
  const { message } = await httpPost('/messages/', {
    content: content,
    chat: chatId,
  })
  addChatMessage(message)
}

const messageSubmitted = () => {
  let content = $('textarea#inputTextBox').value.trim()
  sendMessage(content)
  $('textarea#inputTextBox').value = ''
}

$('button.send-message__button').onclick = () => {
  messageSubmitted()
}
$('textarea#inputTextBox').onkeyup = e => {
  let content = e.target.value.trim()

  if (!content) {
    $('button.send-message__button').setAttribute('disabled', true)
    return
  }
  if (e.keyCode === 13) {
    messageSubmitted()
  }

  $('button.send-message__button').removeAttribute('disabled')
}
