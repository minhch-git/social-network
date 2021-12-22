// Get chat list
const getChatList = async (options = {}) => {
  const page = options?.page || 1
  const limit = options?.limit || 8
  const sortBy = options?.sortBy || 'updatedAt'

  const data = await httpGet(
    `/chats?sortBy=${sortBy}&page=${page}&limit=${limit}`
  )
  if (data.chats.length === 0)
    return $('.resultsContainer').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  data.chats.forEach(chat => outputChatListItem(chat))
}

document.addEventListener('DOMContentLoaded', () => {
  getChatList()
})
