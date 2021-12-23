// Get chat list
const getChatList = async (options = {}) => {
  const page = options?.page || 1
  const limit = options?.limit || 8
  const sortBy = options?.sortBy || 'updatedAt'

  const data = await httpGet(
    `/chats?sortBy=${sortBy}&page=${page}&limit=${limit}`
  )
  if (data.chats.length === 0)
    return $('.chat-list').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  data.chats.forEach(chat => outputChatListItem(chat))
}

// Mark as read message
$('.chat-list').onclick = async e => {
  let chatId = e.target.closest('.list__item-link.active').dataset.id
  await httpPatch(`/chats/${chatId}/markAsRead`, {})
}

document.addEventListener('DOMContentLoaded', () => {
  getChatList()
})
