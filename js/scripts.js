/*!
* Engenharia de Código por Gemini
* Lógica de navegação dinâmica (SPA-like) com correção do botão do modal.
*/
window.addEventListener('DOMContentLoaded', event => {

    // --- Lógica de Navegação Dinâmica (SPA-like) ---
    const navLinks = document.querySelectorAll('#mainNav .nav-link, .nav-link-internal');
    const contentContainer = document.getElementById('content-container');
    const mainContentSections = contentContainer ? contentContainer.querySelectorAll('.page-section') : [];
    const aboutSection = document.getElementById('about');

    const showSection = (targetId) => {
        const isAbout = targetId === 'about';

        if (aboutSection) aboutSection.style.display = isAbout ? 'flex' : 'none';
        if (contentContainer) contentContainer.style.display = isAbout ? 'none' : 'block';

        if (!isAbout) {
            mainContentSections.forEach(section => {
                section.classList.remove('active');
            });
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                AOS.refresh();
            }
        }
        
        document.querySelectorAll('#mainNav .nav-link').forEach(link => {
            if (link.hash === `#${targetId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        window.scrollTo(0, 0);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.hash.substring(1);
            showSection(targetId);
            
            const navbarToggler = document.body.querySelector('.navbar-toggler');
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    showSection('about');

    // --- Inicialização da Biblioteca de Animação (AOS) ---
    AOS.init({
        duration: 800,
        once: true 
    });
    
    // --- Lógica do Modal Interativo do Portfólio ---
    const portfolioModal = document.getElementById('portfolioModal');
    if (portfolioModal) {
        const modalImage = portfolioModal.querySelector('#portfolioModalImage');
        const planButtonsContainer = portfolioModal.querySelector('.d-grid');
        let currentTriggerButton = null;

        portfolioModal.addEventListener('show.bs.modal', event => {
            currentTriggerButton = event.relatedTarget;
            const initialImage = currentTriggerButton.getAttribute('data-img-intermediario');
            modalImage.src = initialImage;

            const buttons = planButtonsContainer.querySelectorAll('.plan-button');
            buttons.forEach(button => {
                const isIntermediario = button.getAttribute('data-plan') === 'intermediario';
                button.classList.toggle('active', isIntermediario);
            });
        });

        planButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.plan-button');
            if (!clickedButton) return;

            planButtonsContainer.querySelectorAll('.plan-button').forEach(btn => btn.classList.remove('active'));
            clickedButton.classList.add('active');

            const plan = clickedButton.getAttribute('data-plan');
            const imagePath = currentTriggerButton.getAttribute(`data-img-${plan}`);
            
            if (imagePath) {
                modalImage.src = imagePath;
            }
        });

        const goToServicesBtn = document.getElementById('goToServicesBtn');
        if (goToServicesBtn) {
            goToServicesBtn.addEventListener('click', () => {
                showSection('servicos');
            });
        }
    }

    // --- Configuração do Lightbox ---
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
          'resizeDuration': 200,
          'wrapAround': true,
          'albumLabel': "Foto %1 de %2"
        });
    }

    // --- Atualização Dinâmica do Ano no Rodapé ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
