// ARQUIVO ATUALIZADO: js/scripts.js

window.addEventListener('DOMContentLoaded', event => {
    // Este evento garante que todo o código aqui dentro só vai rodar
    // depois que a página HTML estiver completamente carregada.

    // --- Lógica do Tema (Scrollspy e Menu Mobile) ---
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // --- Inicialização da Biblioteca de Animação (AOS) ---
    AOS.init({
        duration: 800,
        once: true 
    });

    // --- Lógica do Botão "Voltar ao Topo" ---
    const backToTopButton = document.querySelector('#backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }
    
    // --- Lógica do Modal Interativo do Portfólio ---
    const portfolioModal = document.getElementById('portfolioModal');
    if (portfolioModal) {
        const modalImage = portfolioModal.querySelector('#portfolioModalImage');
        const planButtons = portfolioModal.querySelectorAll('.plan-button');
        let imageSources = { basico: '', intermediario: '', premium: '' };

        portfolioModal.addEventListener('show.bs.modal', event => {
            const triggerLink = event.relatedTarget;
            imageSources.basico = triggerLink.getAttribute('data-img-basico');
            imageSources.intermediario = triggerLink.getAttribute('data-img-intermediario');
            imageSources.premium = triggerLink.getAttribute('data-img-premium');
            
            modalImage.src = imageSources.intermediario;

            planButtons.forEach(button => {
                button.classList.remove('active');
                if (button.getAttribute('data-plan') === 'intermediario') {
                    button.classList.add('active');
                }
            });
        });

        planButtons.forEach(button => {
            button.addEventListener('click', () => {
                planButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const plan = button.getAttribute('data-plan');
                modalImage.src = imageSources[plan];
            });
        });
    }

    // --- Configuração do Lightbox (para outras galerias) ---
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
          'resizeDuration': 130,
          'wrapAround': true,
          'albumLabel': "Foto %1 de %2"
        });
    }
});