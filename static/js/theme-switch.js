document.addEventListener("DOMContentLoaded", () => {
  const themeClasses = ["thm-dark", "thm-light"];
  const transitioningClass = "thm-trans";

  const selectTheme = (index) => {
    const rootClasses = document.documentElement.classList;
    rootClasses.remove(...themeClasses);
    rootClasses.add(themeClasses[index], transitioningClass);
    setTimeout(() => {
      rootClasses.remove(transitioningClass);
    }, 500);
  };

  /**
   *
   * @param {HTMLInputElement} control
   */
  const activateThemeSwitch = (control) => {
    control.oninput = () => selectTheme(parseInt(control.value));
    control.previousElementSibling.onclick = () => {
      control.stepDown();
      control.oninput();
    };
    control.nextElementSibling.onclick = () => {
      control.stepUp();
      control.oninput();
    };
  };

  document
    .querySelectorAll("input[data-behavior=theme-switch]")
    .forEach(activateThemeSwitch);
});
