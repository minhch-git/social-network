let connected = false
const socket = io('http://localhost:8888')

socket.emit('setup', userLoggedIn)

socket.on('connected', () => (connected = true))

socket.on('message-received', message => addChatMessage(message))

socket.on('notification-received', async newNotification => {
  const { notification } = await httpGet('/notifications/latest')
  alertify.set('notifier', 'position', 'top-right')

  let notifyHtml = `<div class="toast-notify">${createNotificationItemHtml(
    notification
  )}</div>`
  alertify.success(notifyHtml)
  refreshNotificationsBadge()
  // refreshMessagesBadge()
})

function emitNotification(userId) {
  if (userId == userLoggedIn.id) return
  socket.emit('notification-received', userId)
}
