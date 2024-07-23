const display = document.querySelector("#display");
const inputSlider = document.querySelector("#slider");
const pswdLength = document.querySelector("[pswd-length-number]");
const copyMssg = document.querySelector("[data-copy-mssg]");
const copyButton = document.querySelector(".copy-button");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const pswdStrength = document.querySelector("[pswdStrength]");
const generatePassBtn = document.querySelector("[generatePass]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")

//initialise 
let password = "";
let passwordLength = 10;
let checkCount = 0;
let strength = "weak";

function slideHandler(){
  pswdLength.innerText = passwordLength;
  inputSlider.value = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "%  100%";
}
slideHandler()

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    slideHandler();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange)
})

async function copyContent() {
  try {
    await navigator.clipboard.writeText(password);
    copyMssg.innerText = "Copied";
  } catch (e) {
    copyMssg.innerText = "Failed";
  }
  copyMssg.classList.add('active');
  setTimeout(() => {
    copyMssg.classList.remove('active');
  }, 1000)
}

inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  slideHandler();
})

function generateCharacter(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumber() {
  return generateCharacter(0, 9);
}

function getUpperLetter() {
  return String.fromCharCode(generateCharacter(65, 90));
}

function getLowerLetter() {
  return String.fromCharCode(generateCharacter(97, 122));
}

const symbol = [
  '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
  '_', '-', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';',
  '"', "'", ',', '<', '>', '.', '?'
];

function getSymbols() {
  const index = generateCharacter(0, symbol.length - 1);
  return symbol[index];
}

function shufflePassword(password) {
  let array = password.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

generatePassBtn.addEventListener('click', () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    slideHandler();
  }

  password = '';
  let arr = [];

  if (uppercase.checked) {
    arr.push(getUpperLetter);
  }
  if (lowercase.checked) {
    arr.push(getLowerLetter);
  }
  if (numbers.checked) {
    arr.push(getRandomNumber);
  }
  if (symbols.checked) {
    arr.push(getSymbols);
  }

  // compulsory
  for (let i = 0; i < arr.length; i++) {
    password += arr[i]();
  }

  // for remaining
  for (let i = 0; i < (passwordLength - arr.length); i++) {
    let randIndex = generateCharacter(0, arr.length - 1);
    password += arr[randIndex]();
  }

  // shuffle the password
  password = shufflePassword(password);

  // show in the UI
  display.value = password;

  //calculate strength
  calStrength();
})

function calStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSymbol = false;

  if (uppercase.checked) hasUpper = true;
  if (lowercase.checked) hasLower = true;
  if (numbers.checked) hasNum = true;
  if (symbols.checked) hasSymbol = true;

  if (hasUpper && hasLower && hasNum && hasSymbol && passwordLength >= 12) {
    pswdStrength.innerText = "Very Strong";
    pswdStrength.style.color ="Green";
  }
  else if (hasUpper && hasLower && hasNum && hasSymbol && passwordLength >= 8) {
    pswdStrength.innerText = "Strong";
    pswdStrength.style.color ="Green";
  } else if (((hasUpper && hasLower && hasNum) || (hasSymbol && hasLower && hasNum) || (hasUpper && hasSymbol && hasNum)) && passwordLength >= 12) {
    pswdStrength.innerText = "Strong";
    pswdStrength.style.color ="Green";
  } else if (((hasUpper && hasLower && hasNum) || (hasSymbol && hasLower && hasNum) || (hasUpper && hasSymbol && hasNum)) && passwordLength >= 8) {
    pswdStrength.innerText = "Moderate";
    pswdStrength.style.color ="Yellow";
  } else if (((hasUpper && hasLower && hasNum) || (hasSymbol && hasLower && hasNum) || (hasUpper && hasSymbol && hasNum)) && passwordLength >= 8) {
    pswdStrength.innerText = "Moderate";
    pswdStrength.style.color ="Yellow";
  } else {
    pswdStrength.innerText = "Weak";
    pswdStrength.style.color ="Red";
  }
}

copyButton.addEventListener('click', () => {
  if (password)
    copyContent();
})
