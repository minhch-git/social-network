// Load posts
const loadPostsProfile = async () => {
  const { posts } = await httpGet(`/posts?postedBy=${profileUserId}`)

  if (posts.length == 0)
    return $('.posts_container').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  let postPinned
  posts.forEach(post => {
    if (post.pinned) postPinned = post
    else outputPost(post, '.posts_container')
  })
  if (postPinned) {
    outputPost(postPinned, '.posts_container')
    $('.posts_container').querySelector('.post').classList.add('post-pinned')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPostsProfile()
})
