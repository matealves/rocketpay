// Show or hide loader
const fadeLoader = document.querySelector("#fade");

export const toggleLoader = () => {
  const loaderElement = document.querySelector("#loader");

  fadeLoader.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};
