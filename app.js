const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Currency to country code mapping for flags
const countryList = {
  USD: "us",
  INR: "in",
  EUR: "eu",
  GBP: "gb",
  JPY: "jp",
  AUD: "au",
  CAD: "ca",
  CNY: "cn"
};

// Get DOM elements
const fromInput = document.getElementById("fromInput");
const toInput = document.getElementById("toInput");
const fromSuggestions = document.getElementById("fromSuggestions");
const toSuggestions = document.getElementById("toSuggestions");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const convertBtn = document.querySelector("form button");
const amountInput = document.querySelector(".amount input");
const resultBox = document.querySelector(".result");

// Autocomplete setup
function setupAutocomplete(input, suggestions, flagImg) {
  input.addEventListener("input", () => {
    const query = input.value.toUpperCase();
    suggestions.innerHTML = "";

    if (!query) return;

    for (let code in countryList) {
      if (code.startsWith(query)) {
        const li = document.createElement("li");
        li.innerText = code;
        li.addEventListener("click", () => {
          input.value = code;
          suggestions.innerHTML = "";
          updateFlag(code, flagImg);
        });
        suggestions.appendChild(li);
      }
    }
  });
}

// Update flag image
function updateFlag(currencyCode, imgElement) {
  const countryCode = countryList[currencyCode];
  if (countryCode) {
    imgElement.src = `https://flagcdn.com/48x36/${countryCode}.png`;
  }
}

// Initialize autocomplete for both inputs
setupAutocomplete(fromInput, fromSuggestions, fromFlag);
setupAutocomplete(toInput, toSuggestions, toFlag);

// Handle conversion
convertBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const from = fromInput.value.trim().toLowerCase();
  const to = toInput.value.trim().toLowerCase();
  let amtVal = parseFloat(amountInput.value);

  if (!from || !to || !countryList[from.toUpperCase()] || !countryList[to.toUpperCase()]) {
    resultBox.innerText = "Please enter valid currency codes.";
    return;
  }

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const url = `${BASE_URL}/${from}.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rate = data[from][to];

    if (!rate) throw new Error("Invalid currency conversion");

    const converted = (amtVal * rate).toFixed(2);
    resultBox.innerText = `${amtVal} ${from.toUpperCase()} = ${converted} ${to.toUpperCase()}`;
  } catch (err) {
    console.error("Conversion failed:", err);
    resultBox.innerText = "Conversion failed. Please try again.";
  }
});
