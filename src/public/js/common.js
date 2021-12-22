/**
 * Convert a Date into a Human-Readable
 * @param {data} current date
 * @param {date} previous date
 * @returns time + string
 */
const timeDifference = (current, previous) => {
  let msPerMinute = 60 * 1000
  let msPerHour = msPerMinute * 60
  let msPerDay = msPerHour * 24
  let msPerMonth = msPerDay * 30
  let msPerYear = msPerDay * 365
  let elapsed = current - previous

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return 'Vừa xong'
    return Math.round(elapsed / 1000) + ' giây trước'
  }
  if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' phút trước'
  }
  if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' giờ trước'
  }
  if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' ngày trước'
  }
  if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' tháng trước'
  }
  return Math.round(elapsed / msPerYear) + ' năm trước'
}

const createPostHtml = post => {
  let isRetweet = post.retweetData !== undefined
  let retweetBy = isRetweet ? post.postedBy.username : null
  post = isRetweet ? post.retweetData : post
  const { postedBy } = post

  let retweetText = ''
  if (isRetweet) {
    retweetText = `
      <span>
        <i class="fas fa-retweet"></i> Retweeted by
        <a href="/profile/${retweetBy}">@${retweetBy}</a> 
      </span>
    `
  }

  // handel action post of me
  // button delete
  let buttonDelete = ''
  let buttonPinned = ''
  if (postedBy.id === userLoggedIn.id) {
    buttonDelete = `
      <button
        class="button-delete-post button_open-modal button_action-sm"
        data-bs-toggle="modal"
        data-bs-target="#deletePostModal"
      >
      <i class="remove-pointer-events fas fa-times"></i>
    </button>
    `

    buttonPinned = `
    <button class="button-pinned-post button_open-modal button_action-sm ${
      post.pinned ? 'active' : ''
    }" 
      data-bs-toggle="modal" 
      data-bs-target="${post.pinned ? '#unpinPostModal' : '#pinPostModal'}"
    >
      <i class="remove-pointer-events fas fa-thumbtack"></i>
    </button>
    `
  }
  let pinnedText = ''
  if (post.pinned) {
    pinnedText = `
      <div class="pinnedText"><i class="fas fa-thumbtack"></i> ${
        postedBy.id === userLoggedIn.id
          ? 'Pinned post'
          : `<span>Pinned by <b>${postedBy.fullName}</b></span>`
      } </div>
    `
  }
  const timestamp = timeDifference(new Date(), new Date(post.createdAt))

  let content =
    post.content.length > 120
      ? `${post.content.substr(0, 120)}...`
      : post.content

  let fullName = postedBy.fullName
    ? postedBy.fullName
    : `${firstName} ${lastName}`

  let postImage = post.image
    ? `<div class="post-image__container">
      <img data-bs-toggle="modal" data-bs-target="#createPostImageShowModal" src="${post.image}" alt="" />
    </div>`
    : ''

  return `
    <div class="post ${isRetweet ? 'post-retweet' : ''}" data-id="${post.id}" >
      ${pinnedText}
      <div class="post_action-container">${retweetText}</div>
      <div class="post_main-content-container">
        <div class="user_image-container">
          <img src="${postedBy.profilePic}" alt="User's profile picture" />
        </div>
        <div class="post_content-container">
          <div class="post_header">
            <a class="displayName" href="/profile/${
              postedBy.username
            }">${fullName}</a>
            <span class="username">@${postedBy.username}</span>
            <span class="date">${timestamp}</span>
            ${buttonPinned}          
            ${buttonDelete}
          </div>
          <div class="post_body">
            <span>${content}</span>
            ${postImage}
          </div>

          <div class="post_footer">
            <div class="post_button-container">
              <div class="post_button-container_content">
                <button 
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#replyModal"
                >
                  <i class="far fa-comment"></i>
                </button>
              </div>
            </div>

            <div class="post_button-container green ${
              postedBy.id === userLoggedIn.id ? 'remove-pointer-events' : ''
            }">
              <div
                class=" post_button-container_content ${
                  post.retweetUsers.includes(userLoggedIn.id) ? 'active' : ''
                }"
              >
                <button class="retweet-button">
                  <i class="fas fa-retweet"></i>
                </button>
                <span class="number-retweets">${
                  post.retweetUsers.length ? post.retweetUsers.length : ''
                }</span>
              </div>
            </div>
            <div class="post_button-container pink">
              <div class="post_button-container_content ${
                post.likes.includes(userLoggedIn.id) ? 'active' : ''
              }">
                <button class="like-button" >
                  <i class="far fa-heart"></i>
                </button>
                <span class="number-likes">${
                  post.likes.length ? post.likes.length : ''
                }</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
const createUserHtml = user => {
  const isFollowing =
    userLoggedIn.following && userLoggedIn.following.includes(user.id)
  let text = isFollowing ? 'Following' : 'Follow'
  let buttonClass = isFollowing ? 'follow-button following' : 'follow-button'

  let followButton = `<button class="${buttonClass}" data-user="${user.id}">${text}</button>`
  if (userLoggedIn.id === user.id) followButton = ''
  let fullName = user.fullName || `${user.firstName} ${user.lastName}`
  let numberFollwers = user.numberFollwers || user.followers.length
  return `
  <div class="user" data-id="${user.id}">
    <div class="user_image-container">
      <img src="${user.profilePic}" alt="User's profile picture" />
    </div>
    <div class="user__details-container">
      <a href="/profile/${user.username}">${fullName}</a>
      <span class="username">@${user.username}</span>
      <span class="numbers-follow ${
        numberFollwers > 2 ? '' : 'd-none'
      }">${numberFollwers} followers</span>
    </div>
    <div class="follow__button-container">
      ${followButton}  
    </div>
  </div>
  `
}

const getOrtherChatUsers = users => {
  if (users.length === 1) return users
  return users.filter(user => user.id !== userLoggedIn.id)
}

const getChatName = chatData => {
  let chatName = chatData.chatName
  if (!chatName) {
    const otherChatUsers = getOrtherChatUsers(chatData.users)
    const namesArray = otherChatUsers.map(user => user.fullName)
    chatName = namesArray.join(', ')
  }

  return chatName
}

const getUserChatImageElement = user => {
  if (!user || !user.profilePic) {
    return alertify.notify('User passed info function is invalid', 'error', 6)
  }

  return `<img src="${user.profilePic}" alt="User's profile pic" />`
}

const getChatImageElements = chatData => {
  let otherChatUsers = getOrtherChatUsers(chatData.users)
  let groupChatClass = ' '
  let chatImage = getUserChatImageElement(otherChatUsers[0])

  if (otherChatUsers.length > 1) {
    groupChatClass = 'group-chat__image'
    chatImage += getUserChatImageElement(otherChatUsers[1])
  }
  return `<div class="list__image-container ${groupChatClass}">${chatImage}</div>`
}

const createChatListHtml = chatData => {
  let chatName = getChatName(chatData)
  let image = getChatImageElements(chatData)
  let lastestMessage = chatData.lastestMessage
  let newMessage = ''
  let senderName = ''
  if (lastestMessage) {
    newMessage = lastestMessage.content
    senderName = lastestMessage.sender.fullName
  }
  let timestamps = timeDifference(
    new Date(),
    new Date(chatData.lastestMessage?.createdAt || chatData.updatedAt)
  )
  return `
      <a href="/messages/${chatData.id}" class="list__item-link">
      ${image}
        <div class="list__item-link-details ellipsis">
          <span class="heading ellipsis">${chatName}</span>
          <span class="subText ellipsis"><b>${
            senderName ? senderName : ''
          }</b>: ${newMessage ? newMessage : ''}</span>
          <span class="text-xs">${timestamps}</span>
        </div>
      </a>
  `
}

const createTextNotification = notificationType => {
  const types = {
    postLike: 'postLike',
    postRetweet: 'postRetweet',
    newMessage: 'newMessage',
    follow: 'follow',
    newMessage: 'newMessage',
  }
  let text
  if (notificationType === types.postLike) {
    text = 'liked one of your posts'
  }
  if (notificationType === types.postRetweet) {
    text = 'retweeted one of your posts'
  }
  if (notificationType === types.follow) {
    text = 'followed you'
  }
  return text
}

const createNotificationListHtml = notification => {
  const { userFrom } = notification
  let timestamps = timeDifference(new Date(), new Date(notification.createdAt))
  let text = createTextNotification(notification.notificationType)
  return `
  <a href="/messages/61c2bd09b5b7510bbe821872" class="list__item-link">
    <div class="list__image-container">
      <img src="${userFrom.profilePic}" alt="User's profile pic">
    </div>
    <div class="list__item-link-details ellipsis">
      <span class="heading ellipsis">${userFrom.fullName}</span>
      <span class="subText ellipsis">${text}</span>
      <span class="text-xs">${timestamps}</span>
    </div>
  </a>
  `
}

const createPostSidebarRightHtml = post => {
  const { postedBy } = post
  const timestamp = timeDifference(new Date(), new Date(post.createdAt))
  let fullName =
    postedBy.fullName || `${postedBy.firstName} ${postedBy.lastName}`
  let content =
    post.content.length > 10 ? `${post.content.substr(0, 10)}...` : post.content
  let numberRetweetUsers = post.numberRetweetUsers || post.retweetUsers.length
  let numberLikes = post.numberLikes || post.likes.length
  return `
    <div class="post" data-id="${post.id}">
      <div class="post_action-container"></div>
      <div class="post_main-content-container">
        <div class="user_image-container">
          <img
            src="${postedBy.profilePic}"
            alt="User's profile picture"
          />
        </div>
        <div class="post_content-container">
          <div class="post_header">
            <a class="displayName" href="/profile/${postedBy.username}">
              ${fullName}
            </a>
            <span class="date">${timestamp}</span>
          </div>
          <div class="post_body">
            <span>${content}</span>
          </div>
          <div class="post_footer">
            <div class="post_button-container">
              <div class="post_button-container_content">
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#replyModal"
                >
                  <i class="far fa-comment"></i>
                </button>
              </div>
            </div>
            <div class="post_button-container green remove-pointer-events">
              <div class="post_button-container_content">
                <button class="retweet-button">
                  <i class="fas fa-retweet"></i>
                </button>
                <span class="number-retweets">${
                  numberRetweetUsers > 0 ? numberRetweetUsers : ''
                }</span>
              </div>
            </div>
            <div class="post_button-container pink">
              <div class="post_button-container_content ${
                post.likes.includes(userLoggedIn.id) ? 'active' : ''
              }">
                <button class="like-button">
                  <i class="far fa-heart"></i>
                </button>
                <span class="number-likes">${
                  numberLikes > 0 ? numberLikes : ''
                }</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

const outputUser = (user, selector = '.users', position = 'afterbegin') => {
  const html = createUserHtml(user)
  $(selector).insertAdjacentHTML(position, html)
}

const outputPost = (post, selector = '.posts', position = 'afterbegin') => {
  const html = createPostHtml(post)
  $(selector).insertAdjacentHTML(position, html)
}

const outputChatListItem = (
  chat,
  selector = '.chat-list',
  position = 'afterbegin'
) => {
  const html = createChatListHtml(chat)
  $(selector).insertAdjacentHTML(position, html)
}
const outputNotificationItem = (
  notification,
  selector = '.notifcations-list',
  position = 'afterbegin'
) => {
  const html = createNotificationListHtml(notification)
  $(selector).insertAdjacentHTML(position, html)
}

const outputPostSidebarRight = (
  post,
  selector = '.sidebarRight_container .topPostLikes',
  position = 'afterbegin'
) => {
  const html = createPostSidebarRightHtml(post)
  $(selector).insertAdjacentHTML(position, html)
}

//--------------------------- Message ---------------------------
// Scroll
const scrollToBottom = animated => {
  let container = $('.messages')
  let scrollHeight = container.scrollHeight

  if (animated) {
    container.scrollTop = scrollHeight + $('.message_received').scrollHeight
  } else container.scrollTop = scrollHeight
}

const createMessageHtml = message => {
  let isMine = message.sender.id === userLoggedIn.id
  let classMessage = isMine
    ? 'message_received message_owner'
    : 'message_received'
  let profilePic = message.sender.profilePic || message.readBy.profilePic
  let timestamp = ` ${new Date(message.createdAt).getDate()}/${
    new Date(message.createdAt).getMonth() + 1
  }/${new Date(message.createdAt).getFullYear()} ${new Date(
    message.createdAt
  ).getHours()}:${new Date(message.createdAt).getMinutes()}`
  return `
  <div class="${classMessage}">
    <div class="message_received_img message_owner_img">
      <img src="${profilePic}" alt="avatar" />
    </div>
    <div class="message_received_msg message_owner_msg">
        <div class="message_received_text message_owner_text">
            <p>${message.content}</p>
            <span class="message_received_time message_owner_time">${timestamp}</span>
        </div>
    </div>
  </div>
  `
}
// add message
const addChatMessage = (
  message,
  selector = '.messages',
  position = 'beforeend'
) => {
  if (!message || !message.id) {
    return alertify.notify('Message is not invalid', 'error', 6)
  }

  const html = createMessageHtml(message)
  $(selector).insertAdjacentHTML(position, html)
  scrollToBottom(true, '.messages')
}
