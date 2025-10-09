document.addEventListener("DOMContentLoaded", function() {
  // Bouton "Lance-toi dans l’épopée céleste"
  document.getElementById('play-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cloudIntro').classList.remove('hidden');
  });

  // Bouton "CONTINUER" — disparition animée du nuage uniquement
  ['click', 'touchstart'].forEach(evt => {
    document.getElementById('continueButton').addEventListener(evt, function() {
      const cloud = document.getElementById('cloudIntro');
      cloud.classList.add('fade-out');
      console.log("CONTINUER cliqué");

      setTimeout(() => {
        cloud.parentNode.removeChild(cloud);
      }, 600);
    });
  });

  // Bouton "Quitter"
  document.getElementById("quit-btn").addEventListener("click", () => {
    document.getElementById("quit-dialog").classList.remove("hidden");
  });

  // Bouton "Rester"
  document.getElementById("stay-btn").addEventListener("click", () => {
    document.getElementById("quit-dialog").classList.add("hidden");
  });

  // Bouton "Sortie définitive"
  document.getElementById("exit-btn").addEventListener("click", () => {
    document.getElementById("quit-dialog").classList.add("hidden");
    document.getElementById("crying-pig").classList.remove("hidden");

    setTimeout(() => {
      window.close();
    }, 5000);
  });
});
