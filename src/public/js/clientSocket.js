let connected = false
const socket = io('http://localhost:8888')

socket.emit('setup', userLoggedIn)

socket.on('connected', () => (connected = true))
socket.on('message-received', message => addChatMessage(message))
