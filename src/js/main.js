import "../css/index.css";
import IMask from "imask";
import { toggleLoader } from "../js/loader.js";
import { toggleModal, toggleMessage, pageReload } from "../js/modal.js";

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

globalThis.setCardType = setCardType; // ou window...

// security code
const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

// expiration date
const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), // ano atual (2 últimos)
      to: String(new Date().getFullYear() + 10).slice(2), // 10 anos futuro
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

// card number
const cardNumber = document.querySelector("#card-number");
cardNumber.focus();

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find((item) => {
      return number.match(item.regex);
    });
    // console.log(foundMask);
    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

// DOM manipulation
const formCard = document.querySelector("#form-card");

formCard.addEventListener("submit", (e) => {
  e.preventDefault();

  toggleLoader();

  setTimeout(() => {
    securityCode.blur();
    document.querySelector("#add-card").setAttribute("disabled", "disabled");

    toggleLoader();
    toggleMessage("Pedido finalizado", "Dados salvos com sucesso!");

    resetForm();
    resetCard();
  }, 2000);
});

const resetForm = () => {
  cardNumber.value = "";
  cardHolder.value = "";
  expirationDate.value = "";
  securityCode.value = "";
};

const resetCard = function () {
  document.querySelector(".cc-holder .value").innerText = "NOME DO TITULAR";
  document.querySelector(".cc-security .value").innerText = "123";
  document.querySelector(".cc-number").innerText = "1234 5678 9012 3456";
  document.querySelector(".cc-expiration .value").innerText = "02/29";

  setCardType("default");
};

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "NOME DO TITULAR" : cardHolder.value;
});

// IMask manipulation
// on() = quando input for ativo
const replaceCard = function (elem, value, valueDefault) {
  elem.innerText = value.length === 0 ? valueDefault : value;
};

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});
function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");
  replaceCard(ccSecurity, code, "123");
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});
function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number");
  replaceCard(ccNumber, number, "1234 5678 9012 3456");
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});
function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value");
  replaceCard(ccExpiration, date, "02/29");
}
