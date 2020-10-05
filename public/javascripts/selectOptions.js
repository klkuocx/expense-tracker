document.querySelector('#selectAll').addEventListener('click', () => {
  $('input[type="checkbox"]').prop('checked', true)
})

document.querySelector('#clearAll').addEventListener('click', () => {
  $('input[type="checkbox"]').prop('checked', false)
})
