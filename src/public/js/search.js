// Render result user search
const renderUserSearch = users => {
  $('.users').innerHTML = ''
  // render users
  if (users.length === 0)
    return $('.users').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  users.forEach(user => {
    if (user.id !== userLoggedIn.id) outputUser(user)
  })
  follow()
}
// Render result post search
const renderPostsSearch = posts => {
  $('.posts').innerHTML = ''
  // render users
  if (posts.length === 0)
    return $('.posts').insertAdjacentHTML(
      'afterbegin',
      '<span class="d-block text-center mt-3">Nothing to show</span>'
    )

  posts.forEach(post => outputPost(post))
}
// Search
const submitSearch = async (keyword, searchType = 'users', options = {}) => {
  const page = options?.page || 1
  const limit = options?.limit || 10
  const sortBy = options?.sortBy || 'createdAt:desc'
  const select = options?.select || ''

  const url = searchType === 'users' ? '/users' : '/posts'
  const data = await httpGet(
    `${url}?search=${keyword}&&page=${page}&&limit=${limit}&&sortBy=${sortBy}&&select=${select}`
  )

  // Result: Search type = users
  if (data.users) return renderUserSearch(data.users)

  // Result: Search type = posts
  if (data.posts) return renderPostsSearch(data.posts)
}
// Search
$('#searchInput').onkeyup = e => {
  const input = e.target
  const value = input.value
  const searchType = input.dataset.search
  let searchButton = input.parentElement.querySelector('#searchButton')

  // disabled button search
  if (!value) {
    searchButton.setAttribute('disabled', true)
    searchButton.classList.remove('text-primary')
    return
  }

  // remove disabled button search
  searchButton.removeAttribute('disabled')
  searchButton.classList.add('text-primary')

  // Submit
  $('#searchButton').onclick = () => {
    submitSearch(value, searchType)
    input.value = ''
  }
  if (value && e.keyCode === 13) {
    submitSearch(value, searchType)
    input.value = ''
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let options = {
    page: 1,
    limit: 8,
  }
  if (selectedTab === 'users') return submitSearch({}, 'users', options)

  submitSearch({}, 'posts', options)
})
