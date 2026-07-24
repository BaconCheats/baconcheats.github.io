document.addEventListener("DOMContentLoaded", () => {
  // Copy Button & Animation Functionality
  const copyButtons = document.querySelectorAll(".copy-script-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const scriptText = button.getAttribute("data-script");
      const textSpan = button.querySelector(".btn-text");
      const originalText = textSpan.textContent;

      // Prevent double clicking while animation is running
      if (button.classList.contains("copied")) return;

      try {
        // Copy script to clipboard
        await navigator.clipboard.writeText(scriptText);

        // Apply copied animation state
        button.classList.add("copied");
        textSpan.textContent = "Copied!";

        // Trigger Toast Notification
        showToast("Script copied to clipboard!");

        // Revert button state after 1.5 seconds
        setTimeout(() => {
          button.classList.remove("copied");
          textSpan.textContent = originalText;
        }, 1500);
      } catch (err) {
        console.error("Failed to copy: ", err);
        showToast("Failed to copy script.");
      }
    });
  });

  // Real-Time Search Filter
  const searchInput = document.getElementById("script-search");
  const scriptCards = document.querySelectorAll(".script-card");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      scriptCards.forEach((card) => {
        const title = card.getAttribute("data-title").toLowerCase();
        const description = card.querySelector("p").textContent.toLowerCase();

        if (title.includes(query) || description.includes(query)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Toast System
  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
});
