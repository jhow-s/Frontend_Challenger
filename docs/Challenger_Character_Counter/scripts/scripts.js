const textArea = document.getElementById("container-text");
const excludeSpacesCheckbox = document.querySelectorAll(
  ".container-checkbox input"
)[0];
const setCharLimitCheckbox = document.querySelectorAll(
  ".container-checkbox input"
)[1];
const totalCharacters = document.getElementById("total-characters");
const wordCount = document.getElementById("word-count");
const sentenceCount = document.getElementById("sentence-count");
const letterCountList = document.getElementById("letter-count-list");
const noTextMessage = document.getElementById("no-text-message");
const containerLetterDensity = document.getElementById(
  "container-letter-density"
);

let charLimitInput = null;
let charLimit = null;

function createCharLimitInput() {
  if (!charLimitInput) {
    charLimitInput = document.createElement("input");
    charLimitInput.type = "number";
    charLimitInput.min = "1";
    charLimitInput.value = "100";
    charLimitInput.classList.add("char-limit-input");
    charLimitInput.style.marginLeft = "10px";
    setCharLimitCheckbox.parentNode.appendChild(charLimitInput);

    charLimitInput.addEventListener("input", () => {
      const val = parseInt(charLimitInput.value);
      charLimit = isNaN(val) ? null : val;
      enforceCharLimit();
      updateCounts();
    });
  }
}

function removeCharLimitInput() {
  if (charLimitInput) {
    charLimitInput.remove();
    charLimitInput = null;
    charLimit = null;
  }
}

function enforceCharLimit() {
  let text = textArea.value;
  if (charLimit === null) return;

  if (excludeSpacesCheckbox.checked) {
    let countNoSpaces = text.replace(/\s/g, "").length;
    if (countNoSpaces > charLimit) {
      let newText = "";
      let nonSpaceCount = 0;
      for (let ch of text) {
        if (ch === " ") {
          newText += ch;
        } else {
          if (nonSpaceCount < charLimit) {
            newText += ch;
            nonSpaceCount++;
          } else {
            break;
          }
        }
      }
      textArea.value = newText;
    }
  } else {
    if (text.length > charLimit) {
      textArea.value = text.slice(0, charLimit);
    }
  }
}

function updateCounts() {
  let text = textArea.value;

  let totalChars = excludeSpacesCheckbox.checked
    ? text.replace(/\s/g, "").length
    : text.length;
  totalCharacters.textContent = totalChars;

  let words = text.trim().split(/\s+/).filter(Boolean);
  wordCount.textContent = words.length;

  let sentences = text
    .match(/[^.!?]+[.!?]*|$/g)
    .filter((s) => s.trim().length > 0);
  sentenceCount.textContent = sentences.length;

  updateLetterDensity(text);
}

function updateLetterDensity(text) {
  letterCountList.innerHTML = "";

  if (!text.trim()) {
    noTextMessage.style.display = "block";
    return;
  } else {
    noTextMessage.style.display = "none";
  }

  const letterCounts = {};
  for (const char of text.toUpperCase()) {
    if (char >= "A" && char <= "Z") {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
  }

  if (Object.keys(letterCounts).length === 0) {
    noTextMessage.style.display = "block";
    return;
  }

  const sorted = Object.entries(letterCounts).sort((a, b) => b[1] - a[1]);

  const maxCount = sorted[0][1];

  for (const [letter, count] of sorted) {
    const li = document.createElement("li");

    const widthPercent = Math.max((count / maxCount) * 100, 5);

    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "10px";

    const letterSpan = document.createElement("span");
    letterSpan.textContent = letter;
    letterSpan.style.width = "30px";
    letterSpan.style.fontWeight = "bold";
    letterSpan.style.flexShrink = "0";

    const barDiv = document.createElement("div");
    barDiv.style.background = "#7c3aed";
    barDiv.style.height = "18px";
    barDiv.style.width = `${widthPercent}%`;
    barDiv.style.borderRadius = "8px";
    barDiv.style.flexGrow = "1";

    const countSpan = document.createElement("span");
    countSpan.textContent = count;
    countSpan.style.fontWeight = "bold";
    countSpan.style.width = "30px";
    countSpan.style.textAlign = "right";
    countSpan.style.flexShrink = "0";

    li.appendChild(letterSpan);
    li.appendChild(barDiv);
    li.appendChild(countSpan);

    letterCountList.appendChild(li);
  }
}

textArea.addEventListener("input", () => {
  enforceCharLimit();
  updateCounts();
});

excludeSpacesCheckbox.addEventListener("change", () => {
  enforceCharLimit();
  updateCounts();
});

setCharLimitCheckbox.addEventListener("change", () => {
  if (setCharLimitCheckbox.checked) {
    createCharLimitInput();
  } else {
    removeCharLimitInput();
  }
  enforceCharLimit();
  updateCounts();
});

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const themeIcon = document.getElementById("theme-icon");

themeToggle.addEventListener("click", (e) => {
  e.preventDefault();
  body.classList.toggle("dark-theme");
  if (body.classList.contains("dark-theme")) {
    themeIcon.src = "img/icon-sun.svg";
  } else {
    themeIcon.src = "img/icon-moon.svg";
  }
});

updateCounts();
