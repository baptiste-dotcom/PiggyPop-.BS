document.getElementById("play-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("quit-btn").addEventListener("click", () => {
  document.getElementById("quit-dialog").classList.remove("hidden");
});

document.getElementById("stay-btn").addEventListener("click", () => {
  document.getElementById("quit-dialog").classList.add("hidden");
});

document.getElementById("exit-btn").addEventListener("click", () => {
  document.getElementById("quit-dialog").classList.add("hidden");
  document.getElementById("crying-pig").classList.remove("hidden");

  setTimeout(() => {
    window.close();
  }, 5000);
});