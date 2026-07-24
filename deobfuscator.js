document.addEventListener("DOMContentLoaded", () => {
  // Interactive copy support for command badges
  const commandBadges = document.querySelectorAll(".cmd-badge");

  commandBadges.forEach((badge) => {
    badge.style.cursor = "pointer";
    badge.title = "Click to copy command";

    badge.addEventListener("click", () => {
      const cmdText = badge.textContent.trim();
      navigator.clipboard
        .writeText(cmdText)
        .then(() => {
          showToast(`Copied "${cmdText}" to clipboard!`);
        })
        .catch(() => {
          showToast("Failed to copy command.", true);
        });
    });
  });
});

// Toast notification helper
function showToast(message, isError = false) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.cssText = `
        background: ${
          isError ? "rgba(239, 68, 68, 0.9)" : "rgba(18, 18, 26, 0.95)"
        };
        color: #ffffff;
        border: 1px solid ${
          isError ? "rgba(239, 68, 68, 0.5)" : "rgba(99, 102, 241, 0.4)"
        };
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(8px);
        animation: toastIn 0.25s ease forwards;
    `;

  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut 0.25s ease forwards";
    setTimeout(() => toast.remove(), 250);
  }, 2500);
}

// Keyframe animations for toasts
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes toastOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(12px); }
}
`;
document.head.appendChild(styleSheet);
