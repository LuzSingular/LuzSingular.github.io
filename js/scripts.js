/*!
* LUZ SINGULAR - CUSTOM SCRIPT
* ---------------------------------
* Este script gerencia a navegação, o envio de formulários,
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
            const isAbout = targetId === 'about' || targetId === 'page-top';
            
            // Se for "Sobre", mostra a seção "Sobre" e o portfólio e esconde o resto.
            if (isAbout) {
                aboutAndPortfolio.forEach(el => el.style.display = ''); // Reseta para o padrão do CSS
                contentContainer.style.display = 'none';
                 if (targetId === 'about') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
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
                    // Força o recálculo de animações AOS na nova seção visível
                    if (typeof AOS !== 'undefined') {
                        AOS.refreshHard();
                    }
                }
                window.scrollTo(0, 0); // Rola para o topo da nova "página"
            }
            
            // Atualiza o estado ativo dos links
            navLinks.forEach(link => {
                const linkTargetId = link.hash.substring(1);
                const isActive = (isAbout && (linkTargetId === 'about' || linkTargetId === 'page-top')) || (linkTargetId === targetId);
                link.classList.toggle('active', isActive);
            });
        };

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.hash.substring(1);
                
                showSection(targetId);
                
                // Fecha o menu hamburguer em dispositivos móveis após o clique
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });

        // Exibe a seção 'about' e portfólio por padrão ao carregar
        showSection('about');
    }

    /**
     * Função genérica para gerenciar o envio de formulários via AJAX para o Formspree.
     * @param {string} formId - O ID do formulário.
     * @param {string} statusElementId - O ID do elemento que exibirá o status do envio.
     */
    function setupAjaxForm(formId, statusElementId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const formStatus = document.getElementById(statusElementId);
        const submitButton = form.querySelector('button[type="submit"]');

        async function handleSubmit(event) {
            event.preventDefault();
            const formData = new FormData(event.target);

            formStatus.innerHTML = '<p class="text-info">Enviando...</p>';
            if(submitButton) submitButton.disabled = true;

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
                if(submitButton) submitButton.disabled = false;
                 // Limpa a mensagem de status após alguns segundos
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
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
     */
    function setupScrollToTopButton() {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (!scrollToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * Configura o modal de dúvidas para receber o nome do serviço.
     */
    function setupDoubtModal() {
        const doubtModal = document.getElementById('doubtModal');
        if (!doubtModal) return;

        doubtModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const serviceName = button.getAttribute('data-service-name');
            
            const modalTitle = doubtModal.querySelector('.modal-title');
            const serviceNameElement = doubtModal.querySelector('#serviceName');
            const serviceInputElement = doubtModal.querySelector('#serviceInput');

            modalTitle.textContent = 'Dúvida sobre ' + serviceName;
            serviceNameElement.textContent = serviceName;
            serviceInputElement.value = serviceName;
        });
    }

    /**
     * Configura o modal do blog para carregar conteúdo dinamicamente.
     */
    function setupBlogPostModal() {
        const blogPostModal = document.getElementById('blogPostModal');
        if (!blogPostModal) return;

        // Conteúdo de exemplo para os posts. Em um site real, isso viria de um API ou de arquivos.
        const postsContent = {
            1: {
                title: "5 Dicas para um Ensaio Fotográfico Inesquecível",
                content: `
                    <p class="lead">Preparar-se para um ensaio fotográfico pode fazer toda a diferença no resultado final. Aqui estão 5 dicas essenciais para garantir que suas fotos fiquem incríveis e capturem sua verdadeira essência.</p>
                    <h6>1. Escolha o Look Certo</h6>
                    <p>Opte por roupas que te deixem confortável e confiante. Cores neutras ou que harmonizem com o local do ensaio costumam funcionar muito bem. Evite estampas muito chamativas que possam distrair o foco de você.</p>
                    <h6>2. Pense no Local</h6>
                    <p>O cenário é parte da história que a foto conta. Pense em locais que tenham um significado especial para você, seja um parque, uma rua charmosa da cidade ou o conforto da sua casa.</p>
                    <h6>3. Confie no seu Fotógrafo</h6>
                    <p>Relaxe e confie na direção do profissional. Eu estou aqui para te guiar, encontrar os melhores ângulos e capturar sua espontaneidade. A melhor foto muitas vezes acontece quando você esquece que a câmera está ali.</p>
                    <h6>4. A Luz é Tudo</h6>
                    <p>A luz natural do início da manhã ou do final da tarde (a famosa "golden hour") cria uma atmosfera mágica. Se possível, agende seu ensaio para um desses períodos.</p>
                    <h6>5. Divirta-se!</h6>
                    <p>A dica mais importante de todas. Um ensaio fotográfico é uma oportunidade de celebrar quem você é. Sorria, seja você mesmo(a) e aproveite o momento. A alegria transparece nas fotos!</p>
                `
            },
            2: {
                title: "A Importância da Impressão das Suas Fotos",
                content: `
                    <p class="lead">Com milhares de fotos armazenadas em nossos celulares e na nuvem, por que ainda deveríamos nos preocupar em imprimi-las? A resposta é simples: para transformar memórias digitais em tesouros palpáveis.</p>
                    <h6>Memórias que Duram Gerações</h6>
                    <p>Dispositivos eletrônicos falham, arquivos se corrompem e tecnologias se tornam obsoletas. Uma fotografia impressa de qualidade, por outro lado, pode durar mais de 100 anos, tornando-se uma herança de família que passa de geração em geração.</p>
                    <h6>Decoração com Significado</h6>
                    <p>Decorar sua casa com fotos de momentos felizes transforma um simples espaço em um lar cheio de afeto e boas lembranças. Um porta-retrato na mesa ou um quadro na parede são lembretes diários do que realmente importa.</p>
                    <h6>A Experiência Tátil</h6>
                    <p>Há algo de especial em segurar uma fotografia nas mãos, sentir sua textura e ver as cores e detalhes de perto. É uma conexão muito mais profunda e pessoal do que ver uma imagem em uma tela brilhante.</p>
                    <p>Não deixe suas memórias mais preciosas se perderem em um arquivo digital. Selecione suas favoritas e dê a elas a vida que merecem através da impressão.</p>
                `
            },
            3: {
                title: "Como Escolher o Local Perfeito para seu Ensaio",
                content: `
                    <p class="lead">O local de um ensaio fotográfico é como a moldura de uma pintura: ele complementa e realça a beleza do tema principal, que é você. A escolha certa do cenário pode transformar completamente o resultado das suas fotos.</p>
                    <h6>Urbano e Moderno</h6>
                    <p>Para um ensaio com uma pegada mais moderna e descolada, explore o centro da sua cidade. Paredes de tijolos, grafites coloridos, cafés charmosos e a arquitetura dos prédios criam um fundo dinâmico e cheio de personalidade.</p>
                    <h6>Natureza e Tranquilidade</h6>
                    <p>Se você busca por fotos mais leves e românticas, a natureza é o cenário ideal. Parques, praias, campos ou trilhas oferecem uma beleza orgânica e uma luz natural incrível, especialmente durante o nascer ou o pôr do sol.</p>
                    <h6>Em Casa (Lifestyle)</h6>
                    <p>Para um registro mais íntimo e pessoal, realizar o ensaio na sua própria casa é uma excelente opção. O estilo "lifestyle" captura a sua rotina e a sua essência no ambiente onde você se sente mais à vontade, resultando em fotos autênticas e cheias de significado.</p>
                    <p>Converse comigo sobre suas ideias e sua personalidade. Juntos, podemos encontrar o local perfeito que contará a sua história da maneira mais bonita.</p>
                `
            }
        };

        blogPostModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const postId = button.getAttribute('data-post-id');
            const postData = postsContent[postId];

            const modalTitle = blogPostModal.querySelector('#blogPostModalLabel');
            const modalBody = blogPostModal.querySelector('#blogPostModalBody');

            if (postData) {
                modalTitle.textContent = postData.title;
                modalBody.innerHTML = `
                    ${postData.content}
                    <hr>
                    <div id="disqus_thread" class="mt-4"></div>
                `;
            } else {
                modalTitle.textContent = "Post não encontrado";
                modalBody.innerHTML = "<p>Desculpe, não foi possível carregar o conteúdo deste post.</p>";
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
    setupAjaxForm('contactForm', 'form-status');
    setupAjaxForm('doubtForm', 'doubt-form-status');
    setupInteractiveViewer();
    setupScrollIndicator();
    setupScrollToTopButton();
    setupDoubtModal();
    setupBlogPostModal();
    initializeAOS();
    updateFooterYear();
});
