/*!
* LUZ SINGULAR - CUSTOM SCRIPT
* ---------------------------------
* Este script gerencia a navegação, o envio do formulário de contato,
* a inicialização de bibliotecas e outras funcionalidades interativas.
* ---------------------------------
*/

window.addEventListener('DOMContentLoaded', () => {

    /**
     * Gerencia a navegação, mostrando a seção "Sobre" e o portfólio
     * ou as outras seções como uma SPA.
     */
    function setupNavigation() {
        const navLinks = document.querySelectorAll('#mainNav .nav-link');
        const contentContainer = document.getElementById('content-container');
        const mainContentSections = contentContainer.querySelectorAll('.page-section');
        const aboutAndPortfolio = document.querySelectorAll('#about, #portfolio');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.getElementById('navbarResponsive');

        const showSection = (targetId) => {
            const isAbout = targetId === 'about';
            
            // Se for "Sobre", mostra a seção "Sobre" e o portfólio e esconde o resto.
            if (isAbout) {
                aboutAndPortfolio.forEach(el => el.style.display = ''); // Reseta para o padrão do CSS
                contentContainer.style.display = 'none';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Se for outra seção, esconde "Sobre" e portfólio e mostra o container SPA.
                aboutAndPortfolio.forEach(el => el.style.display = 'none');
                contentContainer.style.display = 'block';

                mainContentSections.forEach(section => {
                    section.classList.remove('active');
                });
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                }
                window.scrollTo(0, 0);
            }
            
            // Atualiza o estado ativo dos links
            navLinks.forEach(link => {
                link.classList.toggle('active', link.hash === `#${targetId}`);
            });
        };

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.hash.substring(1);
                
                showSection(targetId);
                
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });

        // Exibe a seção 'about' e portfólio por padrão
        showSection('about');
    }

    /**
     * Gerencia o envio do formulário de contato via AJAX para o Formspree.
     */
    function setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const formStatus = document.getElementById('form-status');
        const submitButton = document.getElementById('submitButton');

        async function handleSubmit(event) {
            event.preventDefault();
            const formData = new FormData(event.target);

            formStatus.innerHTML = '<p class="text-info">Enviando sua mensagem...</p>';
            submitButton.disabled = true;

            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.innerHTML = '<p class="text-success">Obrigado! Sua mensagem foi enviada com sucesso.</p>';
                    form.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        const errorMessages = data["errors"].map(error => error["message"]).join(", ");
                        throw new Error(errorMessages);
                    } else {
                        throw new Error('Oops! Houve um problema ao enviar seu formulário.');
                    }
                }
            } catch (error) {
                formStatus.innerHTML = `<p class="text-danger">${error.message || 'Oops! Houve um erro. Tente novamente mais tarde.'}</p>`;
            } finally {
                submitButton.disabled = false;
            }
        }
        form.addEventListener("submit", handleSubmit);
    }

    /**
     * Gerencia a funcionalidade do visualizador de imagem interativo.
     */
    function setupInteractiveViewer() {
        const portfolioItems = document.querySelectorAll('.portfolio-item-interactive');

        portfolioItems.forEach(item => {
            const imageContainer = item.querySelector('.portfolio-image-container');
            const imageElement = item.querySelector('.portfolio-image');
            const planButtons = item.querySelectorAll('.plan-button');

            planButtons.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.classList.contains('active')) return;

                    planButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    const selectedPlan = button.getAttribute('data-plan');
                    const imagePath = imageContainer.getAttribute(`data-img-${selectedPlan}`);
                    
                    if (imagePath && imageElement.src !== new URL(imagePath, window.location.href).href) {
                        imageElement.classList.add('fading');
                        setTimeout(() => {
                            imageElement.src = imagePath;
                            imageElement.onload = () => {
                                imageElement.classList.remove('fading');
                            };
                        }, 300);
                    }
                });
            });
        });
    }

    /**
     * Adiciona rolagem suave ao indicador de scroll.
     */
    function setupScrollIndicator() {
        const indicator = document.querySelector('.scroll-down-indicator');
        if (indicator) {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = indicator.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    /**
     * Gerencia o botão "Voltar ao Topo".
     * Ele aparece ao rolar a página para baixo e some no topo.
     */
    function setupScrollToTopButton() {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (!scrollToTopBtn) return;

        // Mostra ou esconde o botão baseado na posição da rolagem
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Aparece depois de rolar 300px
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Ação de clique para rolar suavemente ao topo
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = scrollToTopBtn.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                 targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /**
     * Inicializa a biblioteca Animate On Scroll (AOS).
     */
    function initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true 
            });
        }
    }

    /**
     * Atualiza o ano no rodapé para o ano corrente.
     */
    function updateFooterYear() {
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- Execução de Todas as Funções de Inicialização ---
    setupNavigation();
    setupContactForm();
    setupInteractiveViewer();
    setupScrollIndicator();
    setupScrollToTopButton(); // Adicionando a nova função
    initializeAOS();
    updateFooterYear();
});
