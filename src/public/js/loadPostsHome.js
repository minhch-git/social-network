// Load posts
const loadPostsHome = async () => {
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

loadPostsHome()
