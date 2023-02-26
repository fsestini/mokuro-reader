
var yomi;

function injectYomichan(path) {
  yomi = document.createElement("iframe");
  yomi.src = path;
  yomi.id = "yomichan-panel";
  yomi.setAttribute('frameborder', 0);
  document.body.appendChild(yomi);
}

document.body.addEventListener('click', (e) => {
  console.log('click');
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (el.classList.contains("pageContainer")) {
    // yomi.style.display = "none";
    yomi.style.visibility = "hidden";
  }
});

function prepareYomichan() {
  const boxes = document.getElementsByClassName("textBox");
  for (const box of boxes) {
    const ps = box.getElementsByTagName("p");
    for (const p of ps) {
      const text = p.innerText;
      p.innerHTML = "";
      for (let i = 0; i < text.length; i++) {
        const t = text[i];
        const s = document.createElement("span");
        s.innerText = t;
        s.onclick = e => {
          onSpanClick(s, e.clientX, e.clientY);
          console.log(e.clientX, e.clientY);
        };
        p.appendChild(s);
      }
    }
  }
}

function onSpanClick(span, x, y) {
  const p = span.parentElement;
  const box = p.parentElement;

  var query = span.innerText;

  var next = span.nextSibling;
  while (next) {
    query += next.innerText;
    next = next.nextSibling;
  }
  var nextP = p.nextSibling;
  while (nextP) {
    if (nextP.tagName == "P") {
      for (const s of nextP.getElementsByTagName("span")) {
        query += s.innerText;
      }
    }
    nextP = nextP.nextSibling;
  }

  positionPopup(x, y);
  yomi.contentWindow.postMessage(query, "*");
}

function isXCoordOnLeftSide(mainContainer, x) {
  return x < mainContainer.clientWidth / 2;
}

function positionPopup(x, y) {
  const cont = document.body;

  if (isXCoordOnLeftSide(cont, x)) {
    const calcLeft = Math.floor(cont.clientWidth / 2) + 10;
    const newLeft = calcLeft + yomi.clientWidth > cont.clientWidth
      ? cont.clientWidth - yomi.clientWidth
      : calcLeft;
    yomi.style.left = newLeft + 'px';
  } else {
    const calcLeft = Math.floor(cont.clientWidth / 2) - yomi.clientWidth - 10;
    const newLeft = calcLeft < 0 ? 0 : calcLeft;
    yomi.style.left = newLeft + 'px';
  }
  yomi.style.top = (y + yomi.clientHeight > cont.clientHeight
    ? cont.clientHeight - yomi.clientHeight
    : y) + "px";

  // yomi.style.display = "block";
  yomi.style.visibility = "visible";
}