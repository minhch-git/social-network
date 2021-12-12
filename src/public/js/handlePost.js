const likePost = async (postId, likeButton) => {
  await httpPatch(`/posts/${postId}/like`, {})
  const isLiked = likeButton.parentElement.classList.toggle('active')
  const numberLikesBtn =
    likeButton.parentElement.querySelector('span.number-likes')
  // displike
  if (!isLiked) {
    numberLikesBtn.innerHTML = +numberLikesBtn.innerHTML - 1
    return
  }

  // like
  numberLikesBtn.innerHTML = +numberLikesBtn.innerHTML + 1
}
// Delete post
const deletePost = async (postId, postContainer) => {
  const data = await httpDelete(`/posts/${postId}`)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  postContainer.remove()
}

// Pin post
const pinPost = async (postId, postContainer) => {
  const data = await httpPatch(`/posts/${postId}`, { pinned: true })
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>Ghim bài...</span>`,
    showConfirmButton: false,
    timer: 800,
    background: '#15202b',
  })

  location.reload()
}

// Unpin post
const unpinPost = async (postId, postContainer) => {
  const data = await httpPatch(`/posts/${postId}`, { pinned: false })
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>Bỏ ghim...</span>`,
    showConfirmButton: false,
    timer: 800,
    background: '#15202b',
  })

  // Handle button pinning
  const buttonPinning = postContainer.parentElement.querySelector(
    '.button-pinned-post.active'
  )
  buttonPinning.classList.remove('active')
  buttonPinning.setAttribute('data-bs-target', '#pinPostModal')
  postContainer.parentElement.querySelector('.pinnedText').remove()
}

// retweet-button
const retweetPost = async (postId, retweetButton) => {
  const { post } = await httpPost(`/posts/${postId}/retweet`, {})

  const isReweet = retweetButton.parentElement.classList.toggle('active')
  const numberRetweetsBtn = retweetButton.parentElement.querySelector(
    'span.number-retweets'
  )
  // Add or remove element

  // unretweet
  if (!isReweet) {
    numberRetweetsBtn.innerHTML = +numberRetweetsBtn.innerHTML - 1
    // remove post retweet
    $(`.post-retweet[data-id="${postId}"]`).remove()
    return
  }

  // retweet
  numberRetweetsBtn.innerHTML = +numberRetweetsBtn.innerHTML + 1
  // render post retweet
  outputPost(post)
}

const handlePost = async () => {
  let postId = null
  let postContainer = null
  $('.posts_container').onclick = async e => {
    postContainer = e.target.closest('.post')
    if (postContainer) {
      postId = postContainer.dataset.id
    }

    // Like post
    if (e.target.closest('.like-button')) likePost(postId, e.target)

    // retweet post
    if (e.target.closest('.retweet-button')) retweetPost(postId, e.target)
  }

  $('#pinPostModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitPinPost')) {
        pinPost(postId, postContainer)
      }
    }
  })

  $('#unpinPostModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitUnpinPost')) {
        unpinPost(postId, postContainer)
      }
    }
  })

  $('#deletePostModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitDeletePost'))
        return deletePost(postId, postContainer)
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  handlePost()
})
