const follow = () => {
  if ($('.follow-button')) {
    $('.follow-button').onclick = async e => {
      const button = e.target
      const userId = button.dataset.user

      // Update follow
      const { user } = await httpPatch(`/users/${userId}/follow`, {})
      console.log({ user })

      if (user.following && user.following.includes(userId)) {
        button.innerText = 'Following'
        button.classList.add('following')
        return
      }
      button.innerText = 'Follow'
      button.classList.remove('following')
    }
  }
}

// Loaf followers
const loadFollowers = async () => {
  const { user } = await httpGet(`/users/${profileUserId}/followers`)
  const usersFollowers = user.followers
  outputUsers(usersFollowers)
  follow()
}

// Loaf following
const loadFollowing = async () => {
  const { user } = await httpGet(`/users/${profileUserId}/following`)
  const usersFollowing = user.following
  outputUsers(usersFollowing)
  follow()
}

document.addEventListener('DOMContentLoaded', () => {
  if (selectedTab == 'followers') return loadFollowers()
  loadFollowing()
})
