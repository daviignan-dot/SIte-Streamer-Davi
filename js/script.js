// Menu interativo - destaque para item ativo
document.addEventListener('DOMContentLoaded', function() {
    // Ativar item do menu conforme a página atual
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-link');
    const menuLength = menuItems.length;
    
    for (let i = 0; i < menuLength; i++) {
        if (menuItems[i].href === currentLocation) {
            menuItems[i].classList.add('active');
            menuItems[i].setAttribute('aria-current', 'page');
        }
    }
    
    // Rolagem suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Função para o carrossel da página inicial
    initCarousel();
    
    // Função para os horários interativos
    initSchedule();
    
    // Função para a galeria de imagens
    initGallery();
});

// Inicializar carrossel
function initCarousel() {
    const myCarousel = document.getElementById('mainCarousel');
    if (myCarousel) {
        const carousel = new bootstrap.Carousel(myCarousel, {
            interval: 5000,
            wrap: true
        });
    }
}

// Inicializar horários interativos
function initSchedule() {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    
    scheduleItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Verificar e destacar o horário atual
    highlightCurrentSchedule();
}

// Destacar horário atual
function highlightCurrentSchedule() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Domingo) a 6 (Sábado)
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Tempo em minutos
    
    // Mapear dias da semana para os IDs dos horários
    const dayMap = {
        0: 'sunday', // Domingo
        3: 'wednesday', // Quarta-feira
        5: 'friday' // Sexta-feira
    };
    
    const currentDayId = dayMap[currentDay];
    if (currentDayId) {
        const scheduleSection = document.getElementById(currentDayId);
        if (scheduleSection) {
            const timeSlots = scheduleSection.querySelectorAll('.schedule-time');
            
            timeSlots.forEach(slot => {
                const timeText = slot.textContent;
                const [hours, minutes] = timeText.split(':').map(Number);
                const slotTime = hours * 60 + minutes;
                
                // Se o horário estiver dentro de 2 horas do atual, destacar
                if (Math.abs(slotTime - currentTime) <= 120) {
                    slot.classList.add('text-success');
                    slot.innerHTML += ' <span class="badge bg-success">AO VIVO</span>';
                }
            });
        }
    }
}

// Inicializar galeria
function initGallery() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Criar modal para visualização de imagem
            const modalHtml = `
                <div class="modal fade" id="imageModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body text-center">
                                <img src="${this.src}" alt="${this.alt}" class="img-fluid">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Adicionar modal ao documento
            document.body.insertAdjacentHTML('beforeend', modalHtml');
            
            // Abrir modal
            const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
            imageModal.show();
            
            // Remover modal após fechar
            document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() {
                this.remove();
            });
        });
    });
}

// Validação do formulário de contato
function validateForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const terms = document.getElementById('terms').checked;
    
    if (name === '' || email === '' || message === '') {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }
    
    if (!terms) {
        alert('Você deve aceitar os termos e condições para enviar o formulário.');
        return false;
    }
    
    // Validar email com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um endereço de email válido.');
        return false;
    }
    
    return true;
}

// Inicializar embed da Twitch
function initTwitchEmbed() {
    // Verificar se o elemento do embed existe
    if (document.getElementById('twitch-embed')) {
        // Carregar script da Twitch
        const script = document.createElement('script');
        script.src = 'https://embed.twitch.tv/embed/v1.js';
        script.onload = function() {
            // Inicializar embed após carregamento do script
            new Twitch.Embed('twitch-embed', {
                width: '100%',
                height: '100%',
                channel: 'daviignan',
                parent: ['localhost', 'daviignan.github.io'] // Adicionar seu domínio aqui :cite[3]
            });
        };
        document.body.appendChild(script);
    }
}

// Chamar inicialização do embed da Twitch quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTwitchEmbed);
} else {
    initTwitchEmbed();
}
// Filtros da galeria
document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // Ativar botão selecionado
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Filtrar itens
        document.querySelectorAll('.galeria-item').forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    });
});
