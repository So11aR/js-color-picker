const cols = document.querySelectorAll('.col')
const refreshBtn = document.querySelector('.refresh')

// снимаем класс для анимирования кнопки
refreshBtn.addEventListener('animationend', event => {
  refreshBtn.classList.remove('animate__rotateIn')
})

// функция удаления тултипов
function removeToolTips() {
  document.querySelector(".tips").remove();
}

// генерация фонов по нажатию на пробел
document.addEventListener('keydown', event => {
  event.preventDefault()
  if (event.code.toLowerCase() == 'space') {
    setRandomColors()
  }
})

// обработчик кликов
document.addEventListener('click', event => {
  const type = event.target.dataset.type
  if (type == 'refresh') {
    event.preventDefault()
    event.target.classList.add('animate__rotateIn')
    setRandomColors()
  }
  if (type == 'lock') {
    const node = event.target.tagName.toLowerCase() === 'i' ? event.target : event.target.children[0]

    node.classList.toggle('fa-lock-open')
    node.classList.toggle('fa-lock')
  } else if (type == 'copy') {
    copyToClickboard(event.target.textContent)
    let span = document.createElement("span");
    span.classList.add("tips");
    span.innerHTML = event.target.getAttribute("data-text");
    event.target.appendChild(span);
    window.setTimeout(removeToolTips, 900);
  }
})

// функция копирования текста
function copyToClickboard(text) {
  return navigator.clipboard.writeText(text)
}

// функция установки рандомного цвета
function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : []

  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock')
    const text = col.querySelector('h2')
    const button = col.querySelector('button')

    if (isLocked) {
      colors.push(text.textContent)
      return
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random()

    if (!isInitial) {
      colors.push(color)
    }

    text.textContent = color
    col.style.background = color

    setTextColor(text, color)
    setTextColor(button, color)
  })

  updateColorHash(colors)
}

// функция переключения подсветки цвета текста
function setTextColor(text, color) {
  const luminance = chroma(color).luminance()
  text.style.color = luminance > 0.5 ? 'black' : 'white'
}

// функция обновления хеша цветов в url
function updateColorHash(colors = []) {
  document.location.hash = colors.map((col) => col.toString().substring(1)).join('-')
}

// функция получения цветов из локального хранилища
function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash.substring(1).split('-').map(color => '#' + color)
  }

  return []
}

setRandomColors(true)