// Add or remove followers in profile
function follow() {
  if ($('.follow-button')) {
    $('.follow-button').onclick = async e => {
      const button = e.target
      const userId = button.dataset.user

      // Update follow
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
  }
}

window.addEventListener('DOMContentLoaded', () => {
  follow()
})
