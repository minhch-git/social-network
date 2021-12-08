// Create post
const createPost = async () => {
  $('#postTextarea').onclick = async e => {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Create post',
      background: '#15202b',
      inputPlaceholder: `What's on your mind, ${userLoggedIn.fullName}?`,
      inputAttributes: {
        'aria-label': 'Type your message here',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Post',
    })
    if (text) {
      // call API
      const { post } = await httpPost(`/posts`, {
        content: text,
      })
      outputPost(post)
      if ($('.posts-empty')) $('.posts-empty').remove()
    }
  }
}

// Load posts
const loadPosts = async () => {
  const { posts } = await httpGet(`/posts/`)
  if (posts.length > 0) return posts.forEach(post => outputPost(post))
  Swal.fire({
    title: `Xin chào bạn <span class="text-primary"> ${userLoggedIn.fullName}</span>`,
    text: 'Bạn có muốn tìm kiếm bạn bè quanh đây không?',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Để sau',
    confirmButtonText: 'Có 😀',
    background: '#15202b',
  }).then(result => {
    if (result.isConfirmed) return (window.location.href = '/search')

    $('.posts').innerHTML = `
        <div class="posts-empty text-center d-flex align-items-center px-4" style="height: 200px;">
          <p class="w-100">Bạn chưa có bài viết, tìm kiếm bạn bè quanh đây
            <a class="text-primary" href="/search">tìm bạn bè</a> hoặc đăng bài viết?
          </p>
        </div>
      `
  })
}

// Like post
const likePost = async (postId, button) => {
  await httpPatch(`/posts/${postId}/like`, {})
  const isLiked = button.parentElement.classList.toggle('active')
  const numberLikesBtn = button.parentElement.querySelector('span.number-likes')
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
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 800,
    background: '#15202b',
  })

  // Handle button pinning
  const buttonPinning = postContainer.parentElement.querySelector(
    '.button-pinned-post.active'
  )
  if (buttonPinning) {
    buttonPinning.classList.remove('active')
    buttonPinning.setAttribute('data-bs-target', '#pinPostModal')
  }

  // Handle button new pinned
  postContainer = $(`.post[data-id='${data.postUpdated.id}']`)
  const buttonPin = postContainer?.querySelector('.button-pinned-post')
  if (buttonPin) {
    buttonPin.classList.add('active')
    buttonPin.setAttribute('data-bs-target', '#unpinPostModal')
  }
}

// Unpin post
// Pin post
const unpinPost = async (postId, postContainer) => {
  const data = await httpPatch(`/posts/${postId}`, { pinned: false })
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
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
    if (e.target.closest('.like-button')) {
      likePost(postId, e.target)
    }
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
  createPost()
  loadPosts()
  handlePost()
})
