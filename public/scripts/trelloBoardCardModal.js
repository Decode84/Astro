// Get the modals
const boardModal = document.getElementById('boardModal')
const cardModal = document.getElementById('cardModal')

// Get the buttons that opens the modal
const boardBtn = document.getElementById('boardBtn')
const cardBtn = document.getElementById('cardBtn')

// Get the button that closes the modal
const boardClose = document.getElementById('boardClose')
const cardClose = document.getElementById('cardClose')

boardModal.style.display = 'none'
cardModal.style.display = 'none'

// When the user clicks on the button, open the modal
boardBtn.addEventListener('click', () => {
    boardModal.style.display = 'block'
})
cardBtn.addEventListener('click', () => {
    cardModal.style.display = 'block'
})

boardClose.addEventListener('click', () => {
    boardModal.style.display = 'none'
})
cardClose.addEventListener('click', () => {
    cardModal.style.display = 'none'
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = event => {
    if (!boardModal.contains(event.target) && event.target.id !== 'boardBtn') {
        boardModal.style.display = 'none'
    } if (!cardModal.contains(event.target) && event.target.id !== 'cardBtn') {
        cardModal.style.display = 'none'
    }
}
