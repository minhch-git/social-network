const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

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

// Delete user
const deleteUser = async (userId, userContainer) => {
  const data = await httpDelete(`/users/${userId}`)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  userContainer.remove()
}

// Update user
const updateUser = async (userId, body) => {
  const data = await httpPatch(`/users/${userId}`, body)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  location.reload()
}

// Delete user
const deleteManager = async (userId, userContainer) => {
  const data = await httpDelete(`/users/${userId}`)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  userContainer.remove()
}

// Update user
const updateManager = async (userId, body) => {
  const data = await httpPatch(`/users/${userId}`, body)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  location.reload()
}

// Create new user
// Update user
const createNewUser = async body => {
  const data = await httpPost(`/users/`, body)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `<span>${data.message}</span>`,
    showConfirmButton: false,
    timer: 1200,
    background: '#15202b',
  })
  location.reload()
}

const modalBodyUpdateUser = user => {
  let roles = ['user', 'admin']
  let userEmail = user.local.email || user.facebook.email || user.google.email
  return `
    <div class="col-12 grid-margin stretch-card">
      <div class="card">
          <div class="card-body">
              <form class="form-update-user">
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input class="form-control text-primary bg-dark" type="text" disabled value=${userEmail} />
                  </div>
                  <div class="form-group">
                    <label>Role</label>
                    <select class="form-select bg-dark form-select-sm text-white" name="role">
                      <option selected>${user.role}</option>
                      ${roles
                        .map(role => {
                          return (
                            role !== user.role &&
                            `<option value="${role}">${role}</option>`
                          )
                        })
                        .join(',')}
                    </select>
                  </div>
              </form>
          </div>
      </div>
    </div>
  `
}
const modalBodyCreateUser = () => {
  return `
    <div class="col-12 grid-margin stretch-card">
      <div class="card">
          <div class="card-body">
              <form class="form-update-user">
                  <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input class="form-control text-primary required bg-dark" type="text" name="firstName"/>
                  </div>

                   <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input class="form-control text-primary required bg-dark" type="text" name="lastName"/>
                  </div>

                  <div class="form-group">
                    <label for="email">Email</label>
                    <input class="form-control text-primary required bg-dark" type="email" name="email"/>
                  </div>

                  <div class="form-group">
                    <label for="email">Password</label>
                    <input class="form-control text-primary required bg-dark" type="text" value="abc.12345" name="password"/>
                  </div>

                  <div class="form-group">
                    <label>Role</label>
                    <select class="form-select bg-dark form-select-sm text-white" name="role">
                      <option selected>user</option>
                      <option>admin</option>
                    </select>
                  </div>

              </form>
          </div>
      </div>
    </div>
  `
}

const handlePostTable = async () => {
  let post = null
  let postContainer = null
  $('.posts_table').onclick = async e => {
    postContainer = e.target.closest('.post_row')
    if (postContainer) {
      post = JSON.parse(postContainer.dataset.post)
    }

    if (e.target.closest('.btn-delete-post')) {
      let modalTitle = $('#deletePostModal').querySelector('.modal-title')
      let modalBody = $('#deletePostModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Xóa bài viết của <span class="text-white">${post.postedBy.fullName}</span> ?`
      modalBody.innerHTML = `<span class="text-center d-block">Bạn có chắc chắn muốn xóa bài viết có nội dung: <span class="text-info">${
        post.content.length > 10
          ? `${post.content.substr(0, 10)}...`
          : post.content
      }</span>. ra khỏi hệ thống?</span>`
    }
  }

  $('#deletePostModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitDeletePost'))
        return deletePost(post.id, postContainer)
    }
  })
}

const handleUserTable = async () => {
  let user = null
  let userContainer = null
  $('.users_table').onclick = async e => {
    userContainer = e.target.closest('.user_row')
    if (userContainer) {
      user = JSON.parse(userContainer.dataset.user)
    }

    if (e.target.closest('.btn-delete-user')) {
      let userEmail =
        user.local.email || user.facebook.email || user.google.email
      let modalTitle = $('#deleteUserModal').querySelector('.modal-title')
      let modalBody = $('#deleteUserModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Xóa tài khoản <span class="text-white">${userEmail}</span> ?`
      modalBody.innerHTML = `<span class="text-center d-block">Bạn có chắc chắn muốn xóa tài khoản và bài viết của <span class="fw-bold text-info">${user.fullName}</span> ra khỏi hệ thống?</span>`
    }
    if (e.target.closest('.btn-update-user')) {
      let userEmail =
        user.local.email || user.facebook.email || user.google.email
      let modalTitle = $('#updateUserModal').querySelector('.modal-title')
      let modalBody = $('#updateUserModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Cấp quyền cho <span class="text-white">${user.fullName}</span> ?`
      modalBody.innerHTML = modalBodyUpdateUser(user)
    }
  }

  $('#deleteUserModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitDeleteUser'))
        return deleteUser(user.id, userContainer)
    }
  })

  $('#updateUserModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitUpdateUser')) {
        let form =
          e.target.parentElement.parentElement.querySelector('.modal-body form')

        let body = {}
        form.querySelectorAll('input[name]').forEach(input => {
          body[input.name] = input.value
        })
        form.querySelectorAll('select').forEach(select => {
          body[select.name] = select.value
        })
        return updateUser(user.id, body)
      }
    }
  })
}

const handleManagersTable = async () => {
  let user = null
  let userContainer = null
  $('.managers_table').onclick = async e => {
    userContainer = e.target.closest('.user_row')
    if (userContainer) {
      user = JSON.parse(userContainer.dataset.user)
    }

    if (e.target.closest('.btn-delete-manager')) {
      let userEmail =
        user.local.email || user.facebook.email || user.google.email
      let modalTitle = $('#deleteUserModal').querySelector('.modal-title')
      let modalBody = $('#deleteUserModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Xóa tài khoản <span class="text-white">${userEmail}</span> ?`
      modalBody.innerHTML = `<span class="text-center d-block">Bạn có chắc chắn muốn xóa thành viên <span class="fw-bold text-info">${user.fullName}</span> ra khỏi hệ thống?</span>`
    }

    if (e.target.closest('.btn-update-manager')) {
      let modalTitle = $('#createManagerModal').querySelector('.modal-title')
      let modalBody = $('#createManagerModal').querySelector('.modal-body')
      modalTitle.innerHTML = `Sửa quyền của <span class="text-white">${user.fullName}</span> ?`
      modalBody.innerHTML = modalBodyUpdateUser(user)
    }
  }

  $('#deleteManagerModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitDeleteManager'))
        return deleteManager(user.id, userContainer)
    }
  })

  $('#createManagerModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitCreateManager')) {
        let form =
          e.target.parentElement.parentElement.querySelector('.modal-body form')

        let body = {}
        form.querySelectorAll('input[name]').forEach(input => {
          body[input.name] = input.value
        })
        form.querySelectorAll('select').forEach(select => {
          body[select.name] = select.value
        })
        return updateManager(user.id, body)
      }
    }
  })
}

const handleNewUser = async () => {
  $('.btn-create-user').onclick = () => {
    let modalTitle = $('#createNewUserModal').querySelector('.modal-title')
    let modalBody = $('#createNewUserModal').querySelector('.modal-body')
    modalTitle.innerHTML = `Tạo một tài khoản mới ?`
    modalBody.innerHTML = modalBodyCreateUser()
  }
  $('#createNewUserModal').addEventListener('shown.bs.modal', e => {
    e.target.onclick = async e => {
      if (e.target.closest('#submitCreateNewUser')) {
        let form =
          e.target.parentElement.parentElement.querySelector('.modal-body form')

        let body = {}
        form.querySelectorAll('input[name]').forEach(input => {
          body[input.name] = input.value
        })
        form.querySelectorAll('select').forEach(select => {
          body[select.name] = select.value
        })
        return createNewUser(body)
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  handlePostTable()
  handleUserTable()
  handleManagersTable()
  handleNewUser()
})
