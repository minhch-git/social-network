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

document.addEventListener('DOMContentLoaded', () => {
  createPost()
})
