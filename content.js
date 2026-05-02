const RICKROLL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

function checkUrl() {
  if (location.href.includes("/search")) {
    window.location.href = RICKROLL;
  }
}

checkUrl();

let lastUrl = location.href;

new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    checkUrl();
  }
}).observe(document, { subtree: true, childList: true });