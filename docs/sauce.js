
const CHUNK_SIZE = 1000

const SAVE_URL = '/fileput'

const BACKGROUND_NEURAL = [
  './neural_brain.jpeg',
  './neural_darkened.jpg',
  './neural_math.jpeg',
  './neural_network_inverted_darkened.jpeg',
]

const files = []

async function uploadFiles(ev) {
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === 'file') {
        files.push(item.getAsFile())
      }
    })
  } else if (ev.dataTransfer.files) {
    [...ev.dataTransfer.files].forEach((file, i) => {
      files.push(file)
    });
  }

  // TODO: why is this even necessary? why in the hell would someone ever design 2 separate interfaces for a drag and drop dataTransfer? probably because someone didn't plan ahead the first time, and someone else decided they couldn't break something else. which one is it? .items or .files? MORE CODE is obviously the only answer
  // TODO: upload multiple files?
  if(!files.length) {
    return
  }
  const currentFile = files[0]
  const chunks = currentFile.size / CHUNK_SIZE
  const fileData = new Uint8Array(await currentFile.arrayBuffer())

  for(let i = 0; i < Math.ceil(chunks); i++) {
    let segmentData = fileData.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE)
    debugger
    await fetch(SAVE_URL, {
      method: 'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        part: i,
        data: Array.from(segmentData)
      })
    })
  }
}

if(typeof window != 'undefined') {
  document.body.style.backgroundImage = 'url(' 
    + BACKGROUND_NEURAL[Math.floor(Math.random() * BACKGROUND_NEURAL.length)] + ')'


  window.addEventListener('load', function () {
    let dropzone = document.getElementById('drop_zone')

    dropzone.addEventListener('dragenter', function () {
      dropzone.classList.add('dragging')
    })

    dropzone.addEventListener('dragleave', function () {
      dropzone.classList.remove('dragging')
    })

    dropzone.addEventListener('dragover', function (ev) {
      ev.preventDefault()
    })

    // TODO: not sure when this files but this doesn't appear to work
    //   only works on an unsuccessful drap/drop? only works at window level? ambiguity everywhere
    /*
    dropzone.addEventListener('dragend', function (ev) {
      ev.preventDefault()
      dropzone.classList.remove('dragging')
    })
    */

    dropzone.addEventListener("drop",function (ev) {
      ev.preventDefault()
      dropzone.classList.remove('dragging')
      uploadFiles(ev)
    })

  })

}

if(typeof module != 'undefined') {
  module.exports = {
    SAVE_URL,
  }
}
