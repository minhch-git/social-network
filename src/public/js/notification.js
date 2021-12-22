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

  data.notifications.forEach(notification =>
    outputNotificationItem(notification)
  )
})()
