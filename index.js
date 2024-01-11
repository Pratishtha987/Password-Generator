const inputSlider = document.querySelector(".slider");
const dataDisplay = document.querySelector("[data-lengthNum]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lowerCaseCheck = document.querySelector("#uppercase");
const upperCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector(".indicator");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
// let checkCount = 0;
handleSlider();
// set strength circle to grey
setIndicator("#ccc");

//set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  dataDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  // indicator.style.backGroundColor = 'red';
  indicator.style.backgroundColor = color;
  //shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(96, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbol() {
  const symbol = '~`!@#$%^&*()_-+={}[]|:;"<,>.?/';
  const randNum = getRandomInteger(0, symbol.length);
  return symbol.charAt(randNum);
}

function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSymbol = false;
  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //to make capy span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
//   console.log(checkCount);
//   console.log(passwordLength);
  //special corner case
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
//   console.log(passwordLength);
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected
  
  if (checkCount <= 0) return;
 
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    console.log(checkCount);
    handleSlider();
    
  }

  console.log(checkCount);
  //find new password
  password = "";

  // //create password according to checkbox
  // if(upperCaseCheck.checked){
  //     password += generateUpperCase;
  // }

  // if(lowerCaseCheck.checked){
  //     password += generateLowerCase;
  // }

  // if(numberCheck.checked){
  //     password += generateNumber;
  // }

  // if(symbolCheck.checked){
  //     password += generateSymbol;
  // }

  const arrOfGenerate = [];

  if (upperCaseCheck.checked)
  arrOfGenerate.push(generateUpperCase);

//   console.log(arrOfGenerate);
  if (lowerCaseCheck.checked);
  arrOfGenerate.push(generateLowerCase);

  if (numberCheck.checked);
  arrOfGenerate.push(generateNumber);

  if (symbolCheck.checked);
  arrOfGenerate.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < arrOfGenerate.length; i++) {
    password += arrOfGenerate[i]();
  }

  console.log(arrOfGenerate);
  console.log(upperCaseCheck.checked);
  console.log(lowerCaseCheck.checked);
  console.log(numberCheck.checked);
  console.log(symbolCheck.checked);

  //remaining addition
  for (let i = 0; i < passwordLength - arrOfGenerate.length; i++) {
    let ranIndex = getRandomInteger(0, arrOfGenerate.length);
    password += arrOfGenerate[ranIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //show in UI
  passwordDisplay.value = password;
  //calculate strength
  calculateStrength();

  password = "";
});
