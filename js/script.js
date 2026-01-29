// --- CONFIGURACIÓN GLOBAL ---
let viewer;

// Función para inicializar o cargar el visor 3D
function initOrLoadViewer(sceneId) {
    const panoramaElement = document.getElementById('panorama');
    
    if (!panoramaElement) return;

    // Si el visor no existe, lo creamos desde cero
    if (!viewer) {
        viewer = pannellum.viewer('panorama', {
            "default": {
                "firstScene": sceneId,
                "autoLoad": true,
                "autoRotate": -1,
                "draggable": true,
                "mouseZoom": false
            },
            "scenes": {
                "sala": { "title": "Suite Principal", "type": "equirectangular", "panorama": "image/1.jpg" },
                "piscina": { "title": "Piscina Rooftop", "type": "equirectangular", "panorama": "image/2.jpg" },
                "vista": { "title": "Vista Panorámica", "type": "equirectangular", "panorama": "image/3.jpg" },
                "hab.1": { "title": "Habitación 1", "type": "equirectangular", "panorama": "image/4.jpg" }
            }
        });
    } else {
        // Si ya existe, solo cargamos la nueva escena
        viewer.loadScene(sceneId);
    }

    // EL PASO VITAL: Forzar el re-ajuste de tamaño después de que el CSS muestre el div
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 200);
}

// --- FUNCIONES DEL TOUR 3D ---
function startTour(sceneId) {
    const gallery = document.getElementById('gallery-view');
    const viewerCont = document.getElementById('viewer-container');

    if (gallery && viewerCont) {
        gallery.classList.add('hidden'); // Ocultar galería
        viewerCont.classList.remove('hidden'); // Mostrar visor

        // Inicializamos el visor ahora que el contenedor es visible
        initOrLoadViewer(sceneId);
    }
}

function backToGallery() {
    document.getElementById('viewer-container').classList.add('hidden');
    document.getElementById('gallery-view').classList.remove('hidden');
}

function changeScene(sceneId, element) {
    if (viewer) {
        viewer.loadScene(sceneId);
        const titles = { 'sala': 'Suite Principal', 'piscina': 'Piscina Rooftop', 'vista': 'Vista Panorámica', 'hab.1': 'Habitación 1' };
        const titleElem = document.getElementById('scene-title');
        if (titleElem) titleElem.innerText = titles[sceneId];
        
        document.querySelectorAll('.upn-thumb').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
    }
}

// --- LÓGICA DE RESERVAS Y MODALES ---
function openBooking(roomName) {
    const today = new Date().toISOString().split('T')[0];
    const modalCi = document.getElementById('modalCheckin');
    const modalCo = document.getElementById('modalCheckout');
    
    if (modalCi && modalCo) {
        modalCi.setAttribute('min', today);
        modalCo.setAttribute('min', today);
        
        // Sincronizar si hay datos en la barra principal
        const mainCi = document.getElementById('checkin')?.value;
        const mainCo = document.getElementById('checkout')?.value;
        if (mainCi) modalCi.value = mainCi;
        if (mainCo) modalCo.value = mainCo;
    }

    document.getElementById('modalRoomName').innerText = roomName;
    document.getElementById('bookingModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('bookingModal').classList.add('hidden');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
}

const bookingForm = document.getElementById('finalBookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btnSubmit = this.querySelector('button[type="submit"]');
        btnSubmit.innerText = "Procesando...";
        btnSubmit.disabled = true;

        setTimeout(() => {
            closeModal();
            // Llenar mensaje de éxito personalizado
            const cliente = document.getElementById('guestName').value;
            const habitacion = document.getElementById('modalRoomName').innerText;
            const ci = document.getElementById('modalCheckin').value;
            const co = document.getElementById('modalCheckout').value;

            const msg = `Hola ${cliente}, gracias por elegir Hotel Paradiso.\nHemos registrado tu solicitud para la "${habitacion}".\n\n📅 Estadía: ${ci} al ${co}.`;
            
            document.getElementById('successMessage').innerText = msg;
            document.getElementById('successModal').classList.remove('hidden');

            bookingForm.reset();
            btnSubmit.innerText = "Confirmar Reserva";
            btnSubmit.disabled = false;
        }, 1500); 
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button');
        const statusMsg = document.getElementById('contactStatus');
        
        btn.innerText = "Enviando...";
        btn.disabled = true;

        setTimeout(() => {
            if (statusMsg) {
                statusMsg.innerText = "✅ ¡Mensaje enviado! Nos contactaremos pronto.";
                statusMsg.classList.remove('hidden'); // Eliminamos la restricción
                statusMsg.classList.add('success-visible'); // Aplicamos el diseño verde
            }

            contactForm.reset();
            btn.innerText = "Enviar Mensaje";
            btn.disabled = false;
        }, 1200);
    });
}