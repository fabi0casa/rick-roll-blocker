const input = document.getElementById("linkInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("linkList");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");

function loadLinks() {
  chrome.storage.sync.get(["blockedLinks"], (data) => {
    const links = data.blockedLinks || [];
    list.innerHTML = "";

    links.forEach((link, index) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = link;
      span.title = link;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "x";
      removeBtn.onclick = () => removeLink(index);

      li.appendChild(span);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  });
}

function addLink() {
  const value = input.value.trim();
  if (!value) return;

  chrome.storage.sync.get(["blockedLinks"], (data) => {
    const links = data.blockedLinks || [];
    links.push(value);

    chrome.storage.sync.set({ blockedLinks: links }, () => {
      input.value = "";
      loadLinks();
    });
  });
}

function removeLink(index) {
  chrome.storage.sync.get(["blockedLinks"], (data) => {
    const links = data.blockedLinks || [];
    links.splice(index, 1);

    chrome.storage.sync.set({ blockedLinks: links }, loadLinks);
  });
}

exportBtn.onclick = () => {
  chrome.storage.sync.get(["blockedLinks"], (data) => {
    const blob = new Blob([JSON.stringify(data.blockedLinks, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rickroll-blocklist.json";
    a.click();
  });
};

importBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      chrome.storage.sync.set({ blockedLinks: data }, loadLinks);
    } catch {
      alert("Invalid JSON");
    }
  };

  reader.readAsText(file);
};

addBtn.onclick = addLink;

loadLinks();

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addLink();
  }
});