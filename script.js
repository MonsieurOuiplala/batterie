// Variables globales
let audioElement = null; // Pour stocker l'élément audio
let experienceActive = false; // État de l'expérience

// Gestion de l'interrupteur
document.getElementById("toggle-notification").addEventListener("change", function() {
    experienceActive = this.checked;
    const importAudio = document.getElementById("import-audio");

    // Afficher ou masquer le sélecteur de fichier
    if (experienceActive) {
        importAudio.style.display = "block";
        console.log("Expérience activée : Notification au débranchement du câble (000).");
    } else {
        importAudio.style.display = "none";
        console.log("Expérience désactivée : Notification au débranchement du câble (000).");
    }
});

// Gestion de l'import audio
document.getElementById("audio-file").addEventListener("change", function(event) {
    const fichier = event.target.files[0];
    if (fichier && fichier.type.startsWith("audio/")) {
        // Créer un élément audio avec le fichier sélectionné
        audioElement = new Audio(URL.createObjectURL(fichier));
        document.getElementById("audio-status").textContent = `Fichier audio importé : ${fichier.name}`;
        console.log("Fichier audio importé avec succès.");
    } else {
        alert("Veuillez importer un fichier audio valide.");
    }
});

// Gestion du débranchement du câble
if (navigator.getBattery) {
    navigator.getBattery().then(function(batterie) {
        // Appliquer la couleur de fond initiale
        appliquerCouleurFond(batterie.charging);

        batterie.addEventListener("chargingchange", function() {
            appliquerCouleurFond(batterie.charging);

            if (!batterie.charging && experienceActive && audioElement) {
                audioElement.play().then(() => {
                    console.log("Son joué : Câble débranché.");
                }).catch((erreur) => {
                    console.error("Erreur lors de la lecture du son :", erreur);
                });
            }
        });
    });
} else {
    console.error("L'API Battery Status n'est pas supportée par votre navigateur.");
}

// Fonction pour appliquer la couleur de fond
function appliquerCouleurFond(charging) {
    const body = document.body;
    if (charging) {
        body.style.backgroundColor = "#4CAF50"; // Vert
    } else {
        body.style.backgroundColor = "#FF6666"; // Rouge
    }
}

// Fonction pour mettre à jour les informations de la batterie
function mettreAJourBatterie(batterie) {
    let niveauBatterie = Math.round(batterie.level * 100);
    let rouge = Math.round(255 * (1 - batterie.level));
    let vert = Math.round(255 * batterie.level);
    let niveauElement = document.getElementById("niveau-batterie");

    // Mise à jour du texte et du fond
    niveauElement.textContent = `Niveau de batterie : ${niveauBatterie}%`;
    niveauElement.style.backgroundColor = `rgb(${rouge}, ${vert}, 100)`;

    // Mise à jour de la barre de niveau de batterie
    document.getElementById("barre-niveau-batterie").style.width = `${niveauBatterie}%`;

    // Mise à jour de l'état de charge
    document.getElementById("etat-charge").textContent = "État de charge : " + (batterie.charging ? "En charge ⚡" : "Sur batterie 🔋");

    // Mise à jour du temps restant
    let texteTempsRestant = "";
    let heureEstimee = "";

    if (batterie.charging) {
        texteTempsRestant = batterie.chargingTime === Infinity ? 
        "Temps restant pour la charge : Estimation non disponible ⏳" : 
        `Temps restant pour la charge : ${formaterTempsRestant(batterie.chargingTime)}`;

        if (batterie.chargingTime !== Infinity) {
            heureEstimee = calculerHeureEstimee(batterie.chargingTime);
        }
    } else {
        texteTempsRestant = batterie.dischargingTime === Infinity ? 
        "Temps restant avant décharge : Estimation non disponible ⏳" : 
        `Temps restant avant décharge : ${formaterTempsRestant(batterie.dischargingTime)}`;

        if (batterie.dischargingTime !== Infinity) {
            heureEstimee = calculerHeureEstimee(batterie.dischargingTime);
        }
    }

    document.getElementById("temps-restant").textContent = texteTempsRestant + (heureEstimee ? ` (${heureEstimee})` : "");
}

// Fonction pour formater le temps restant
function formaterTempsRestant(tempsEnSecondes) {
    let heures = Math.floor(tempsEnSecondes / 3600);
    let minutes = Math.floor((tempsEnSecondes % 3600) / 60);
    return `${heures > 0 ? `${heures}h ` : ""}${minutes}min`;
}

// Fonction pour calculer l'heure estimée
function calculerHeureEstimee(tempsRestantEnSecondes) {
    let maintenant = new Date();
    let tempsRestantEnMillisecondes = tempsRestantEnSecondes * 1000;
    let heureEstimee = new Date(maintenant.getTime() + tempsRestantEnMillisecondes);

    let heures = heureEstimee.getHours();
    let minutes = heureEstimee.getMinutes();

    return `${heures}h${minutes < 10 ? "0" : ""}${minutes}`;
}

// Appliquer les mises à jour de la batterie
if (navigator.getBattery) {
    navigator.getBattery().then(function(batterie) {
        mettreAJourBatterie(batterie);
        batterie.addEventListener("levelchange", () => mettreAJourBatterie(batterie));
        batterie.addEventListener("chargingtimechange", () => mettreAJourBatterie(batterie));
        batterie.addEventListener("dischargingtimechange", () => mettreAJourBatterie(batterie));
    });
} else {
    document.getElementById("niveau-batterie").textContent = "L'API Battery Status n'est pas supportée par votre navigateur.";
}
// Variables globales
let confettiActive = false; // État de l'expérience

// Gestion de l'interrupteur
document.getElementById("toggle-confetti").addEventListener("change", function() {
    confettiActive = this.checked;
    if (confettiActive) {
        console.log("Expérience activée : Effet de confetti à 100%.");
    } else {
        console.log("Expérience désactivée : Effet de confetti à 100%.");
    }
});

// Fonction pour lancer le confetti
function lancerConfetti() {
    if (!confettiActive) return; // Ne rien faire si l'expérience est désactivée

    // Premier effet de confetti
    var count = 200;
    var defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Deuxième effet de confetti (continu)
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

// Gestion de la batterie
if (navigator.getBattery) {
    navigator.getBattery().then(function(batterie) {
        batterie.addEventListener("levelchange", function() {
            if (batterie.level === 1 && confettiActive) {
                lancerConfetti(); // Lancer le confetti à 100%
            }
        });
    });
} else {
    console.error("L'API Battery Status n'est pas supportée par votre navigateur.");
}
