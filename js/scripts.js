// ARQUIVO: js/scripts.js

window.addEventListener('DOMContentLoaded', event => {

    // ===== CÓDIGO ORIGINAL =====

    // Ativa o Bootstrap scrollspy no elemento de navegação principal
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Recolhe a navbar responsiva quando o toggler está visível
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

    // ===== NOVAS FUNCIONALIDADES =====

    // 1. Inicia a biblioteca de animação (AOS)
    AOS.init({
        duration: 800, // Duração da animação em milissegundos
        once: true      // A animação acontece apenas uma vez
    });

    // 2. Controla o botão "Voltar ao Topo"
    const backToTopButton = document.querySelector('#backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Mostra o botão depois de rolar 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }
    
    // Configuração do Lightbox
    lightbox.option({
      'resizeDuration': 130,
      'wrapAround': true,
      'albumLabel': "Foto %1 de %2"
    })
});
