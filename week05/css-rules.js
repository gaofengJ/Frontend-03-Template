const standards = require('./standards')

let iframe = document.createElement('iframe')
document.body.innerHTML = ''
document.body.append(iframe)

function happen (element, event) {
  return new Promise((resolve, reject) => {
    let handler = () => {
      resolve()
      element.removeEventListener(event, handler)
    }
    element.addEventListener(event, handle)
  })
}

void async function () {
  for (let standard of standards) {
    iframe.src = standard.url
    console.log(standard.name)
    await happen(iframe, 'load')
  }
}()