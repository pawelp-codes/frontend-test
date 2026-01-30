// Hamburger menu
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const okPopup = document.getElementById('ok-popup');
const closePopupBtn1 = document.getElementById('close-popup1');
const closePopupBtn2 = document.getElementById('close-popup2');
const pageTitle = document.getElementById('page-title');

menuToggle.addEventListener('click', () => menu.classList.toggle('hidden'));

// SPA: przełączanie sekcji
const pageNames = {
    dashboard: "Panel Kierowcy",
    loading: "Załadunek",
    stats: "Statystyki",
    wms_erp: "WMS/ERP",
    settings: "Ustawienia"
};

document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const pageId = btn.dataset.page + '-page';
        document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');
        pageTitle.textContent = pageNames[btn.dataset.page] || "IFLS";
        menu.classList.add('hidden');
    });
});

// Status i instrukcja
let vehicleState = "...";
const statusText = document.getElementById('status-text');
const instructionText = document.getElementById('instruction-text');

// Strzałki
const arrows = document.querySelectorAll('.arrow');
const bottomArrows = document.querySelectorAll('.bottom-arrow');
const sideArrows = document.querySelectorAll('.side-arrow');

// Funkcja aktualizująca strzałkę (reset kierunku i kolorów)
function updateArrow(arrow) {
    const dir = arrow.dataset.dir || "down";
    arrow.style.transformOrigin = "center";
    if (dir === "up") arrow.style.transform = "rotate(90deg)";
    if (dir === "down") arrow.style.transform = "rotate(-90deg)";
    if (dir === "right") arrow.style.transform = "rotate(180deg)";
    if (dir === "left") arrow.style.transform = "rotate(0deg)";
    arrow.classList.remove("text-green-400", "text-yellow-400", "text-red-500", "text-gray-400");
}

// Funkcja ustawiająca kolory i widoczność strzałek w zależności od stanu
function updateArrowsColors() {
    // Przy POZ OK → wszystkie zielone
    if(vehicleState === "ok") {
        [...arrows].forEach(a => {
            updateArrow(a);
            a.classList.add("text-green-400");
            a.style.opacity = 1;
        });
        return;
    }

    // Przy dokowaniu → wszystkie żółte
    if(vehicleState === "dokowanie") {
        [...arrows].forEach(a => {
            updateArrow(a);
            a.classList.add("text-yellow-400");
        });
        return;
    }

    // Przy cofaniu → dolne żółte migają, boczne szare
    if(vehicleState === "cofanie") {
        bottomArrows.forEach(a => {
            updateArrow(a);
            a.classList.add("text-yellow-400");
        });
        sideArrows.forEach(a => {
            updateArrow(a);
            a.classList.add("text-gray-400");
            a.style.opacity = 1;
        });
        return;
    }

    // Przy korygowaniu kąta → boczne czerwone migają, dolne szare
    if(vehicleState === "bledny-kat") {
        sideArrows.forEach(a => {
            updateArrow(a);
            a.classList.add("text-red-500");
        });
        bottomArrows.forEach(a => {
            updateArrow(a);
            a.classList.add("text-gray-400");
            a.style.opacity = 1;
        });
        return;
    }

    // Domyślnie → szare
    [...arrows].forEach(a => {
        updateArrow(a);
        a.classList.add("text-gray-400");
        a.style.opacity = 1;
    });
}

// Funkcja aktualizująca UI
function updateUI() {
    switch(vehicleState) {
        case "dokowanie":
            statusText.textContent = "WJAZD";
            instructionText.textContent = "Ustaw pojazd w wyznaczonym obszarze";
            break;
        case "ok":
            statusText.textContent = "POZYCJA OK";
            instructionText.textContent = "Zatrzymaj pojazd";
            okPopup.classList.remove('hidden');
            break;
        case "cofanie":
            statusText.textContent = "DOJAZD";
            instructionText.textContent = "Cofaj powoli";
            break;
        case "bledny-kat":
            statusText.textContent = "KOREKTA KĄTOWA";
            instructionText.textContent = "Popraw ustawienie kątowe pojazdu";
            break;
        default:
            statusText.textContent = "BRAK STATUSU";
            instructionText.textContent = "-";
    }

    // Odśwież kolory strzałek
    updateArrowsColors();
}

// Przyciski sterujące
['dock','ok','reverse','angle'].forEach(id => {
    document.getElementById('btn-' + id).addEventListener('click', () => {
        vehicleState = id === 'dock' ? 'dokowanie' :
                       id === 'ok' ? 'ok' :
                       id === 'reverse' ? 'cofanie' : 'bledny-kat';
        updateUI();
    });
});

// Animacja migania strzałek dla stanów innych niż OK
let blinkOn = false;
function animateArrows() {
    blinkOn = !blinkOn;

    if(vehicleState === "dokowanie") {
        [...arrows].forEach(a => a.style.opacity = blinkOn ? 1 : 0.2);
    }
    else if(vehicleState === "cofanie") {
        bottomArrows.forEach(a => a.style.opacity = blinkOn ? 1 : 0.2);
        sideArrows.forEach(a => a.style.opacity = 1);
    }
    else if(vehicleState === "bledny-kat") {
        sideArrows.forEach(a => a.style.opacity = blinkOn ? 1 : 0.2);
        bottomArrows.forEach(a => a.style.opacity = 1);
    }
    else if(vehicleState === "ok") {
        [...arrows].forEach(a => a.style.opacity = 1);
    }
}
setInterval(animateArrows, 500);

// Popup POZYCJA OK
closePopupBtn1.addEventListener('click', () => okPopup.classList.add('hidden'));
closePopupBtn2.addEventListener('click', () => okPopup.classList.add('hidden'));

// Inicjalizacja strzałek przy starcie
updateArrowsColors();
