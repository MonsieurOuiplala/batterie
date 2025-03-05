// Gestion de la batterie
if (navigator.getBattery) {
    navigator.getBattery().then(function(batterie) {

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
                "Temps restant pour la charge : Estimation non disponible �" : 
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

        function formaterTempsRestant(tempsEnSecondes) {
            let heures = Math.floor(tempsEnSecondes / 3600);
            let minutes = Math.floor((tempsEnSecondes % 3600) / 60);
            return `${heures > 0 ? `${heures}h ` : ""}${minutes}min`;
        }

        function calculerHeureEstimee(tempsRestantEnSecondes) {
            let maintenant = new Date();
            let tempsRestantEnMillisecondes = tempsRestantEnSecondes * 1000;
            let heureEstimee = new Date(maintenant.getTime() + tempsRestantEnMillisecondes);

            let heures = heureEstimee.getHours();
            let minutes = heureEstimee.getMinutes();

            return `${heures}h${minutes < 10 ? "0" : ""}${minutes}`;
        }

        function appliquerAnimationCharge(charging) {
            const body = document.body;

            if (charging) {
                body.style.backgroundColor = "#4CAF50"; // Fond vert
            } else {
                body.style.backgroundColor = "#FF6666"; // Fond rouge
            }
        }

        function appliquerEtatInitial() {
            const body = document.body;

            if (batterie.charging) {
                body.style.backgroundColor = "#4CAF50"; // Fond vert
            } else {
                body.style.backgroundColor = "#FF6666"; // Fond rouge
            }
        }

        // Appliquer l'état initial à l'ouverture de la page
        appliquerEtatInitial();
        mettreAJourBatterie(batterie);

        // Ajouter les écouteurs d'événements
        batterie.addEventListener('chargingchange', () => {
            mettreAJourBatterie(batterie);
            appliquerAnimationCharge(batterie.charging);
        });
        batterie.addEventListener('levelchange', () => mettreAJourBatterie(batterie));
        batterie.addEventListener('chargingtimechange', () => mettreAJourBatterie(batterie));
        batterie.addEventListener('dischargingtimechange', () => mettreAJourBatterie(batterie));
    });
} else {
    document.getElementById("niveau-batterie").textContent = "L'API Battery Status n'est pas supportée par votre navigateur.";
}
