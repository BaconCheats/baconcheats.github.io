document.addEventListener("DOMContentLoaded", () => {
  // UI Elements
  const overlay = document.getElementById("overlay");
  const mainUi = document.getElementById("main-ui");
  const step1Card = document.getElementById("step1-card");
  const scriptverseCard = document.getElementById("scriptverse-card");
  const discordCard = document.getElementById("discord-card");

  // Inputs & Errors
  const scriptverseInput = document.getElementById("scriptverse-input");
  const discordInput = document.getElementById("discord-input");
  const step1Error = document.getElementById("step1-error");
  const scriptverseError = document.getElementById("scriptverse-error");
  const discordError = document.getElementById("discord-error");

  // Buttons
  const selectButtons = document.querySelectorAll(".select-btn");
  const continueStep1 = document.getElementById("continue-step1");
  const continueScriptverse = document.getElementById("continue-scriptverse");
  const continueDiscord = document.getElementById("continue-discord");

  // Audio Elements
  const audio = document.getElementById("bg-music");
  const ticker = document.getElementById("music-ticker");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");
  const audioTimeDisplay = document.getElementById("audio-time");

  let selectedValue = null;

  function showError(inputEl, errorEl, cardEl) {
    if (inputEl) inputEl.classList.add("input-error");
    if (errorEl) errorEl.classList.remove("hidden-error");
    if (cardEl) {
      cardEl.classList.remove("invalid-shake");
      void cardEl.offsetWidth;
      cardEl.classList.add("invalid-shake");
    }
  }

  function clearError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove("input-error");
    if (errorEl) errorEl.classList.add("hidden-error");
  }

  function triggerLoadingAndRedirect(buttonEl) {
    const textSpan = buttonEl.querySelector(".btn-text");
    const spinnerSpan = buttonEl.querySelector(".spinner");

    buttonEl.disabled = true;
    if (textSpan) textSpan.classList.add("hidden");
    if (spinnerSpan) spinnerSpan.classList.remove("hidden");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1200);
  }

  function transitionCard(fromCard, toCard) {
    fromCard.classList.add("card-animate-out");

    setTimeout(() => {
      fromCard.classList.add("hidden-card");
      fromCard.classList.remove("card-animate-out");

      toCard.classList.remove("hidden-card");
      toCard.classList.add("card-animate-in");

      setTimeout(() => {
        toCard.classList.remove("card-animate-in");
      }, 400);
    }, 300);
  }

  // Overlay Action
  overlay.addEventListener(
    "click",
    () => {
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";

      mainUi.classList.remove("hidden");

      audio
        .play()
        .catch((err) => console.log("Audio play blocked by browser:", err));

      setTimeout(() => {
        ticker.classList.add("visible");
      }, 500);
    },
    { once: true }
  );

  // Selection buttons
  selectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedValue = btn.getAttribute("data-value");
      clearError(null, step1Error);
    });
  });

  // Step 1 Continue
  continueStep1.addEventListener("click", () => {
    if (!selectedValue) {
      showError(null, step1Error, step1Card);
      return;
    }

    if (selectedValue === "scriptverse") {
      transitionCard(step1Card, scriptverseCard);
    } else if (selectedValue === "discord") {
      transitionCard(step1Card, discordCard);
    }
  });

  // Scriptverse Validation
  continueScriptverse.addEventListener("click", () => {
    const value = scriptverseInput.value.trim();
    const requiredPrefix = "https://scriptverse.net/u/";

    if (
      !value.startsWith(requiredPrefix) ||
      value.length <= requiredPrefix.length
    ) {
      showError(scriptverseInput, scriptverseError, scriptverseCard);
      return;
    }

    clearError(scriptverseInput, scriptverseError);
    triggerLoadingAndRedirect(continueScriptverse);
  });

  // Discord Validation
  continueDiscord.addEventListener("click", () => {
    const value = discordInput.value.trim();
    if (!value) {
      showError(discordInput, discordError, discordCard);
      return;
    }

    clearError(discordInput, discordError);
    triggerLoadingAndRedirect(continueDiscord);
  });

  // Clear error feedback on typing
  scriptverseInput.addEventListener("input", () =>
    clearError(scriptverseInput, scriptverseError)
  );
  discordInput.addEventListener("input", () =>
    clearError(discordInput, discordError)
  );

  // Audio Timer & Play/Pause
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  audio.addEventListener("timeupdate", () => {
    const current = formatTime(audio.currentTime);
    const total = formatTime(audio.duration);
    audioTimeDisplay.textContent = `${current}/${total}`;
  });

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
    } else {
      audio.pause();
      pauseIcon.classList.add("hidden");
      playIcon.classList.remove("hidden");
    }
  });
});
