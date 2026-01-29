// Configuración de Pannellum
const viewer = pannellum.viewer('panorama', {
    "default": {
        "firstScene": "sala",
        "autoLoad": true,
        "autoRotate": -1
    },
    "scenes": {
        "sala": {
            "title": "Suite Principal",
            "type": "equirectangular",
            "panorama": "image/1.jpg"
        },
        "piscina": {
            "title": "Piscina Rooftop",
            "type": "equirectangular",
            "panorama": "image/2.jpg"
        },
        "vista": {
            "title": "Vista Panorámica",
            "type": "equirectangular",
            "panorama": "image/3.jpg"
        },
        "hab.1": {
            "title": "Habitación 1",
            "type": "equirectangular",
            "panorama": "image/4.jpg"
        },
    }
    
});

// Función profesional para cambiar entre pestañas
function showPage(pageId) {
    // 1. Ocultar todas las secciones
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });

    // 2. Mostrar la seleccionada
    document.getElementById(pageId).classList.remove('hidden');

    // 3. Actualizar menú navegación
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById('link-' + pageId).classList.add('active');

    // 4. Corrección importante: Re-ajustar el 3D si se muestra esa pestaña
    if(pageId === 'vista3d') {
        window.dispatchEvent(new Event('resize'));
    }
}

// Cambiar escena desde miniatura
function changeScene(sceneId, element) {
    // 1. Cargar la escena en el visor
    viewer.loadScene(sceneId);
    
    // 2. Actualizar el título
    const titles = { 'sala': 'Suite Principal', 'piscina': 'Piscina Rooftop' };
    document.getElementById('scene-title').innerText = titles[sceneId];

    // 3. Cambiar la miniatura activa visualmente
    document.querySelectorAll('.upn-thumb').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

// ... (Mantén tu configuración de Pannellum igual)

function startTour(sceneId) {
    // 1. Ocultar galería y mostrar visor
    document.getElementById('gallery-view').classList.add('hidden');
    document.getElementById('viewer-container').classList.remove('hidden');
    
    // 2. Cargar la escena elegida
    viewer.loadScene(sceneId);
    
    // 3. Forzar ajuste de tamaño
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 100);
}

function backToGallery() {
    document.getElementById('viewer-container').classList.add('hidden');
    document.getElementById('gallery-view').classList.remove('hidden');
}

// Función para cambiar de pestaña (ajustada)
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    document.getElementById('link-' + pageId).classList.add('active');

    // Siempre regresar a la galería al entrar a la pestaña 3D desde fuera
    if(pageId === 'vista3d') backToGallery();
}