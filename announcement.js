document.addEventListener("DOMContentLoaded", () => {
  loadAnnouncements();
});

async function loadAnnouncements() {
  const container = document.getElementById("timeline-container");

  const fallbackText = `
date: 7/24/2026
timeEST: 3:37 AM
type: update
text: Added Deobfuscator

date: 7/22/2026
timeEST: 5:13 PM
type: announcement
text: Working on deobfuscator
`;

  let fileContent = "";

  try {
    const response = await fetch("annc.txt");
    if (response.ok) {
      fileContent = await response.text();
    } else {
      fileContent = fallbackText;
    }
  } catch (e) {
    fileContent = fallbackText;
  }

  const announcements = parseAnncTxt(fileContent);
  renderTimeline(announcements, container);
}

function parseAnncTxt(rawText) {
  const blocks = rawText.trim().split(/\n\s*\n/);
  const items = [];

  blocks.forEach((block) => {
    const lines = block.split("\n");
    const item = {};

    lines.forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        item[key] = value;
      }
    });

    if (item.date && item.text) {
      items.push(item);
    }
  });

  return items;
}

function renderTimeline(items, container) {
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="subtitle">No announcements found.</p>';
    return;
  }

  container.innerHTML = "";

  items.forEach((item) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";

    const typeLower = (item.type || "update").toLowerCase();
    let badgeClass = "badge-update";

    if (typeLower.includes("announcement")) badgeClass = "badge-announcement";
    else if (typeLower.includes("maintenance"))
      badgeClass = "badge-maintenance";
    else if (typeLower.includes("fix")) badgeClass = "badge-fix";

    timelineItem.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="badge-type ${badgeClass}">${
      item.type || "Update"
    }</span>
                    <div class="timeline-meta">
                        <span class="timeline-date">${item.date}</span>
                        ${
                          item.timeEST
                            ? `<span class="timeline-time">• ${item.timeEST} EST</span>`
                            : ""
                        }
                    </div>
                </div>
                <div class="timeline-body">${item.text}</div>
            </div>
        `;

    container.appendChild(timelineItem);
  });
}
