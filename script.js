document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('play-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cloudIntro').classList.remove('hidden');
  });

  document.getElementById('continueButton').addEventListener('click', function() {
    const cloud = document.getElementById('cloudIntro');
    cloud.classList.add('fade-out');
    console.log("CONTINUER cliqué");

    setTimeout(() => {
      cloud.parentNode.removeChild(cloud);
    }, 600); // durée du fondu
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
});
