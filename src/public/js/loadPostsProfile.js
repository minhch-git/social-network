// Load posts
const loadPostsProfile = async () => {
  const { posts } = await httpGet(`/posts?postedBy=${profileUserId}`)
  if (posts.length > 0) {
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
}

document.addEventListener('DOMContentLoaded', () => {
  loadPostsProfile()
})
