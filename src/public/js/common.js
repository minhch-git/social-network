const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const createPostHtml = post => {
  let isRetweet = post.retweetData !== undefined
  let retweetBy = isRetweet ? post.postedBy.fullName : null
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
  let pinnedText = ''
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
    if (post.pinned) {
      pinnedText = `
        <div class="pinnedText"><i class="fas fa-thumbtack"></i> <span>Pinned by ${postedBy.fullName}</span></div>
      `
    }
  }

  const timestamp = timeDifference(new Date(), new Date(post.createdAt))

  return `
    <div class="post ${isRetweet ? 'post-retweet' : ''}" data-id="${post.id}"" >
      ${pinnedText}
      <div class="post_action-container">${retweetText}</div>
      <div class="post_main-content-container">
        <div class="user_image-container">
          <img src="${postedBy.profilePic}" alt="User's profile picture" />
        </div>
        <div class="post_content-container">
          <div class="post_header">
            <a class="displayName" href="/profile/${postedBy.username}">${
    postedBy.fullName
  }</a>
            <span class="username">@${postedBy.username}</span>
            <span class="date">${timestamp}</span>

            ${buttonPinned}          
            ${buttonDelete}
          </div>
          <div class="post_body">
            <span>${post.content}</span>
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

const outputPost = (post, selector = '.posts') => {
  const html = createPostHtml(post)
  $(selector).insertAdjacentHTML('afterbegin', html)
}

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

$('.logout').onclick = e => {
  e.preventDefault()
  Swal.fire({
    title: `Đăng xuất tài khoản?`,
    html: `Đăng xuất tài khoản <span class="text-primary"> ${userLoggedIn.fullName}</span>.`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Để sau',
    confirmButtonText: 'Có 😀',
    background: '#15202b',
  }).then(result => {
    if (result.isConfirmed) return (window.location.href = '/auth/logout')
  })
}
