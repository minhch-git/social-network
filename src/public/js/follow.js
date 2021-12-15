const handleFollow = async (userId, button) => {
  const { user } = await httpPatch(`/users/${userId}/follow`, {})

  if (user.following && user.following.includes(userId)) {
    button.innerText = 'Following'
    button.classList.add('following')
    if ($('#followersValue'))
      $('#followersValue').innerHTML = +$('#followersValue').innerHTML + 1
    return
  }

  if ($('#followersValue'))
    $('#followersValue').innerHTML = +$('#followersValue').innerHTML - 1
  button.innerText = 'Follow'
  button.classList.remove('following')
}

const handleFollowButton = (container, followButton = '.follow-button') => {
  container.onclick = async e => {
    if (e.target.closest(followButton)) {
      const button = e.target
      const userId = button.dataset.user
      handleFollow(userId, button)
    }
  }
}

// Add or remove followers in profile
function follow() {
  const searchUserContainer = $('.search_results .users_container .users')
  const followerFollowingContainer = $('.followers-following__container .users')
  const profileButtonContainer = $('.profile__buttons-container')
  const topUserFollowersContainer = $('.topUserFollowers .users_container')

  if (searchUserContainer) handleFollowButton(searchUserContainer)
  if (followerFollowingContainer) handleFollowButton(followerFollowingContainer)
  if (profileButtonContainer) handleFollowButton(profileButtonContainer)
  if (profileButtonContainer) handleFollowButton(profileButtonContainer)
  if (topUserFollowersContainer) handleFollowButton(topUserFollowersContainer)
}

window.addEventListener('DOMContentLoaded', () => {
  follow()
})
