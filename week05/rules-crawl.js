Array.from(document.querySelector('#container').children).filter(e => e.getAttribute('data-tag').match(/css/)).map(e => ({ name: e.children[1].children[0].innerHTML, url: e.children[1].children[0].href }))