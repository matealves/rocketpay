// Modal
const fadeModal = document.querySelector("#fade-modal");
const modal = document.querySelector("#modal");
const closeModalButton = document.querySelector("#close-modal");

export const toggleModal = function () {
  [fadeModal, modal].forEach((el) => {
    el.classList.toggle("hide");
  });
};

[closeModalButton, fadeModal].forEach((el) => {
  el.addEventListener("click", () => {
    toggleModal();

    document.querySelector("#add-card").removeAttribute("disabled");
    pageReload();
  });
});

// event key - close modal
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === "Escape") {
    if (!modal.classList.contains("hide")) {
      toggleModal();

      document.querySelector("#add-card").removeAttribute("disabled");
      pageReload();
    }
  }
});

export const toggleMessage = function (title, message) {
  const titleModal = document.querySelector(".title-modal");
  const messageModal = document.querySelector(".message-modal");

  titleModal.innerText = title;
  messageModal.innerText = message;

  fadeModal.classList.toggle("hide");
  modal.classList.toggle("hide");
};

export const pageReload = function () {
  setTimeout(() => {
    document.location.reload(true);
  }, 1000);
};
