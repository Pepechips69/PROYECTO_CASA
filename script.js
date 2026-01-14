// script.js - Lógica de Usuario Premium
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Navegación Móvil
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // 2. Inicialización del Catálogo con Efecto Loading
    const catalogContainer = document.getElementById('catalog-container');
    if (catalogContainer) {
        setTimeout(() => {
            renderCars(carsData);
        }, 800);
    }

    // 3. Manejo de Tecla ESC para Cerrar Modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // 4. Lógica de Contacto (Auto-selección)
    const selectInterest = document.getElementById('car-interest');
    if (selectInterest) {
        carsData.forEach(car => {
            const opt = document.createElement('option');
            opt.value = `${car.make} ${car.model}`;
            opt.textContent = `${car.make} ${car.model}`;
            selectInterest.appendChild(opt);
        });
        
        const preSelected = new URLSearchParams(window.location.search).get('car');
        if(preSelected) selectInterest.value = preSelected;
    }

    // 5. Buscador Optimizado
    const searchInput = document.getElementById('car-search');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = carsData.filter(car => 
                car.make.toLowerCase().includes(term) || 
                car.model.toLowerCase().includes(term)
            );
            renderCars(filtered);
        });
    }
}

function renderCars(data) {
    const container = document.getElementById('catalog-container');
    if(!container) return;
    
    container.innerHTML = '';

    if(data.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem;"><p style="color: var(--text-muted);">No se encontraron vehículos.</p></div>`;
        return;
    }

    data.forEach(car => {
        const isFav = checkFavorite(car.id) ? 'active' : '';
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <div class="fav-btn ${isFav}" onclick="toggleFavorite(${car.id}, this)">
                <i class="fas fa-heart"></i>
            </div>
            <div class="car-img-wrapper" onclick="openModal(${car.id})">
                <img src="${car.img}" alt="${car.make} ${car.model}" loading="lazy">
            </div>
            <div class="car-info" onclick="openModal(${car.id})">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <small style="color:var(--gold); font-weight:600;">${car.type}</small>
                    <small style="opacity:0.5;">ID: CM-${car.id}</small>
                </div>
                <h3>${car.make} ${car.model}</h3>
                <span class="price">$${car.price.toLocaleString()}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCars(type, btnElement) {
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    const filtered = type === 'all' ? carsData : carsData.filter(car => car.type === type);
    renderCars(filtered);
}

function toggleFavorite(id, element) {
    event.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('chipsFavs')) || [];
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        element.classList.remove('active');
    } else {
        favorites.push(id);
        element.classList.add('active');
    }
    localStorage.setItem('chipsFavs', JSON.stringify(favorites));
}

function checkFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('chipsFavs')) || [];
    return favorites.includes(id);
}

function openModal(id) {
    const car = carsData.find(c => c.id === id);
    const modal = document.getElementById('car-modal');
    
    modal.innerHTML = `
        <div class="modal-content">
            <img src="${car.img}" class="modal-img" alt="${car.make}">
            <div class="modal-details">
                <span class="subtitle">${car.year} | ${car.type}</span>
                <h2>${car.make} <span style="color:var(--gold)">${car.model}</span></h2>
                <p style="margin: 1rem 0; color: var(--text-muted);">${car.desc}</p>
                <div class="specs-grid">
                    <div class="spec-item"><small>Motor</small><strong>${car.engine}</strong></div>
                    <div class="spec-item"><small>Potencia</small><strong>${car.power}</strong></div>
                    <div class="spec-item"><small>Velocidad Máx</small><strong>${car.speed}</strong></div>
                    <div class="spec-item"><small>0-100 km/h</small><strong>${car.acceleration}</strong></div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
                    <a href="contacto.html?car=${car.make} ${car.model}" class="cta-btn primary" style="text-align:center;">Reservar Ahora</a>
                    <div style="display: flex; gap: 1rem;">
                        <a href="simulador.html?carId=${car.id}" class="cta-btn secondary" style="flex:1; text-align:center;">Simular Financiación</a>
                        <button onclick="closeModal()" class="cta-btn secondary" style="flex:0.5;">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('car-modal');
    if(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('car-modal');
    if (event.target == modal) closeModal();
}