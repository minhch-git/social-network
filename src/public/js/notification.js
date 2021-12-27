// Load notifications
;(async () => {
  let limit = 10
  const data = await httpGet(
    `/notifications/content?sortBy=createdAt&page=1&limit=${limit}`
  )
  if (data.notifications.length === 0)
    return $('.notifcations-list').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )
  if (data.notifications.some(notification => !notification.opened)) {
    $('#markNotificationsAsRead').classList.add('active')
  }
  data.notifications.forEach(notification =>
    outputNotificationItem(notification)
  )
})()

// mark a notificaiton as read
$('.notifcations-list').onclick = async e => {
  const notificationId = e.target.closest('.list__item-link.active').dataset.id
  await httpPatch(`/notifications/${notificationId}`, { opened: true })
}

// mark all notifications as read
$('span#markNotificationsAsRead').onclick = async e => {
  await httpPatch(`/notifications/markAsOpened`, { opened: true })
  $$('.list__item-link.active').forEach(li => li.classList.remove('active'))
  $('span#markNotificationsAsRead').classList.remove('active')
  $('.notification-badge').classList.remove('active')
}
