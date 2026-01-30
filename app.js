// Hamburger menu
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const okPopup = document.getElementById('ok-popup');
const closePopupBtn1 = document.getElementById('close-popup1');
const closePopupBtn2 = document.getElementById('close-popup2');

menuToggle.addEventListener('click', () => menu.classList.toggle('hidden'));

// SPA: przełączanie sekcji
document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const pageId = btn.dataset.page + '-page';
        document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');
        pageTitle.textContent = pageNames[btn.dataset.page] || "IFLS";
        menu.classList.add('hidden');
    });
});

const pageTitle = document.getElementById('page-title');

const pageNames = {
    dashboard: "Panel Kierowcy",
    loading: "Załadunek",
    stats: "Statystyki",
    wms_erp: "WMS/ERP",
    settings: "Ustawienia"
};

// Strzałki
let vehicleState = "dokowanie";
const statusText = document.getElementById('status-text');
const instructionText = document.getElementById('instruction-text');

function updateUI() {
    switch(vehicleState) {
        case "dokowanie":
            statusText.textContent = "DOKOWANIE";
            instructionText.textContent = "Ustaw pojazd w wyznaczonym obszarze";
            break;
        case "ok":
            statusText.textContent = "POZYCJA OK";
            instructionText.textContent = "Zatrzymaj pojazd";
            okPopup.classList.remove('hidden');
            break;
        case "cofanie":
            statusText.textContent = "COFANIE";
            instructionText.textContent = "Cofaj powoli";
            break;
        case "bledny-kat":
            statusText.textContent = "KORYGOWANIE KĄTA";
            instructionText.textContent = "Popraw ustawienie kątowe pojazdu";
            break;
        default:
            statusText.textContent = "BRAK STATUSU";
            instructionText.textContent = "-";
    }
}

['dock','ok','reverse','angle'].forEach(id => {
    document.getElementById('btn-' + id).addEventListener('click', () => {
        vehicleState = id === 'dock' ? 'dokowanie' :
                       id === 'ok' ? 'ok' :
                       id === 'reverse' ? 'cofanie' : 'bledny-kat';
        updateUI();
    });
});

// Animacja strzałek
const colors = ['#10B981','#FBBF24','#EF4444'];
let colorIndex = 0;

const sideArrows = document.querySelectorAll('.side-arrow');
const bottomArrows    = document.querySelectorAll('.bottom-arrow');

let blinkOn = false;

function animateArrows() {

    // STAN OK — bez migania
    if (vehicleState === "ok") {
        [...sideArrows, ...bottomArrows].forEach(a => {
            a.style.opacity = "1";
            a.style.color = "#10B981"; // zielony
        });
        return; // <<< KLUCZOWE
    }

    // pozostałe stany migają
    blinkOn = !blinkOn;

    // reset
    [...sideArrows, ...bottomArrows].forEach(a => {
        a.style.opacity = "0.2";
        a.style.color = "#6B7280";
    });

    if (!blinkOn) return;

    switch (vehicleState) {

        case "dokowanie":
            bottomArrows.forEach(a => {
                a.style.opacity = "1";
                a.style.color = "#FBBF24"; // żółty
            });
            sideArrows.forEach(a => {
                a.style.opacity = "1";
                a.style.color = "#FBBF24";
            });
            break;

        case "cofanie":
            bottomArrows.forEach(a => {
                a.style.opacity = "1";
                a.style.color = "#FBBF24";
            });
            break;

        case "bledny-kat":
            sideArrows.forEach(a => {
                a.style.opacity = "1";
                a.style.color = "#EF4444"; // czerwony
            });
            break;
    }
}



// Start animacji
setInterval(animateArrows, 500);

closePopupBtn1.addEventListener('click', () => {
    okPopup.classList.add('hidden');
});
closePopupBtn2.addEventListener('click', () => {
    okPopup.classList.add('hidden');
});