document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // =========================================================
    // 1. SISTEMA DE PÉTALAS
    // =========================================================
    const estiloSakura = document.createElement('style');
    estiloSakura.innerHTML = `
        .sakura {
            position: fixed;
            background-color: #ffb6c1;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 5px rgba(255, 182, 193, 0.8);
        }
    `;
    document.head.appendChild(estiloSakura);

    function criarPetalas() {
        const container = document.body;
        for (let i = 0; i < 20; i++) {
            const petala = document.createElement("div");
            petala.classList.add("sakura");
            container.appendChild(petala);
            const size = Math.random() * 10 + 5;
            gsap.set(petala, {
                x: Math.random() * window.innerWidth, y: -50, width: size, height: size, opacity: Math.random() * 0.6 + 0.4
            });
            gsap.to(petala, {
                y: window.innerHeight + 100, x: `+=${Math.random() * 100 - 50}`, rotation: Math.random() * 360, duration: Math.random() * 5 + 5, repeat: -1, ease: "none", delay: Math.random() * 5
            });
        }
    }
    criarPetalas();

    // =========================================================
    // 2. FUMAÇA NINJA
    // =========================================================
    function criarFumacaNinja() {
        const ninja = document.querySelector(".kagerou");
        if (!ninja) return;
        const rect = ninja.getBoundingClientRect();
        const centroX = rect.left + rect.width / 2;
        const centroY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const fuma = document.createElement("div");
            fuma.classList.add("smoke-particle");
            document.body.appendChild(fuma);
            const cores = ["#ffffff", "#cccccc", "#999999"];
            fuma.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
            gsap.set(fuma, { x: centroX, y: centroY + 20, scale: Math.random() * 0.5 + 0.5 });
            gsap.to(fuma, {
                x: centroX + (Math.random() * 100 - 50), y: centroY + (Math.random() * 50 - 25), opacity: 0, scale: 2, duration: 0.6, ease: "power2.out", onComplete: () => fuma.remove()
            });
        }
    }

    // =========================================================
    // 3. LÓGICA DO NINJA (MOVIMENTO E ANIMAÇÃO)
    // =========================================================
    const ninja = document.querySelector(".kagerou");
    const hpFill = document.querySelector(".progress-fill");
    const hpText = document.querySelector(".hp-text");
    const heydrich = document.querySelector(".boss-heydrich");
    const caveira = document.querySelector(".caveira-animada");
    
    let ultimaDirecaoScroll = 1;
    let scrollTimeout, keyTimeout;
    let estaDeCostas = false; 

    function ativarEfeitosDeVirada() {
        if (!ninja) return;
        ninja.classList.add("efeito-fumaca");
        setTimeout(() => ninja.classList.remove("efeito-fumaca"), 300);
        criarFumacaNinja();
    }

    if (ninja) {
        ScrollTrigger.create({
            trigger: ".scroll-container", start: "top top", end: "bottom bottom", scrub: 0.3,
            onUpdate: (self) => {
                ninja.classList.add("andando");
                if (self.direction !== ultimaDirecaoScroll) {
                    ativarEfeitosDeVirada();
                    ultimaDirecaoScroll = self.direction;
                }
                if (self.direction === -1) { ninja.classList.add("costas"); estaDeCostas = true; } 
                else { ninja.classList.remove("costas"); estaDeCostas = false; }

                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => { ninja.classList.remove("andando"); ninja.style.backgroundPosition = "0px 0px"; }, 150);

                if (hpFill) {
                    let hp = Math.floor((1 - self.progress) * 100);
                    hpText.innerText = `HP ${Math.max(0, hp)}%`;
                    hpFill.style.width = `${Math.max(0, hp)}%`;
                }
                if (self.progress > 0.85 && heydrich) { heydrich.style.opacity = "1"; caveira.style.opacity = "1"; }
                else if (heydrich) { heydrich.style.opacity = "0"; caveira.style.opacity = "0"; }
            }
        });
    }

    // =========================================================
    // 4. PARALLAX
    // =========================================================
    ScrollTrigger.create({
        trigger: ".scroll-container", start: "top top", end: "bottom bottom", scrub: true,
        onUpdate: (self) => {
            const cenario = document.querySelector(".cenario");
            if (cenario) gsap.set(cenario, { backgroundPositionY: `-${self.progress * 500}px` });
        }
    });

    gsap.utils.toArray(".content").forEach((box) => {
        gsap.from(box, {
            opacity: 0, x: -30, duration: 0.6,
            scrollTrigger: { trigger: box, start: "top 85%", toggleActions: "play none none reverse" }
        });
    });

    // =========================================================
    // 5. CÓDIGOS SECRETOS E COMBOS
    // =========================================================
    const codigoKonami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    const codigoJoe = ["ArrowUp", "ArrowUp", "b", "a", "ArrowDown", "ArrowDown"];
    let inputUsuario = [];

    function animarBotaoVirtual(classeBotao) {
        const btn = document.querySelector(classeBotao);
        if (btn) {
            btn.classList.add('active-key');
            setTimeout(() => btn.classList.remove('active-key'), 200);
        }
    }

    function moverNinjaTeclado(tecla) {
        if (!ninja) return;
        ninja.classList.add("andando");
        let novaDirecaoCostas = estaDeCostas;
        if (tecla === "ArrowUp" || tecla === "ArrowLeft") novaDirecaoCostas = true;
        else if (tecla === "ArrowDown" || tecla === "ArrowRight") novaDirecaoCostas = false;

        if (novaDirecaoCostas !== estaDeCostas) { ativarEfeitosDeVirada(); estaDeCostas = novaDirecaoCostas; }
        if (estaDeCostas) ninja.classList.add("costas"); else ninja.classList.remove("costas");

        clearTimeout(keyTimeout);
        keyTimeout = setTimeout(() => { ninja.classList.remove("andando"); }, 200);
    }

    // --- COMBO DO JOE HIGASHI (VERSÃO 15s COM MÚSICA) ---
    function executarComboJoe() {
        const overlay = document.querySelector('.fighter-overlay');
        const flash = document.querySelector('.impacto-flash');
        const koText = document.querySelector('.ko-text');
        const containerSite = document.querySelector('.scroll-container'); 
        const bg = document.querySelector('.cenario'); 
        const musica = document.getElementById('musica-joe');

        // 1. TOCA A MÚSICA
        if (musica) {
            musica.currentTime = 0;
            musica.volume = 0.5; 
            musica.play().catch(e => console.log("Erro de áudio:", e));
        }

        // 2. ATIVA O JOE
        overlay.classList.add('ativo');
        
        const elementosParaTremer = [containerSite, bg];

        const tl = gsap.timeline({
            onComplete: () => {
                // RESET TOTAL
                overlay.classList.remove('ativo');
                containerSite.classList.remove('tela-destruida');
                
                // Para a música
                if (musica) {
                    musica.pause();
                    musica.currentTime = 0;
                }

                elementosParaTremer.forEach(el => {
                    gsap.set(el, { x: 0, y: 0, filter: "none", rotation: 0, scale: 1, opacity: 1 });
                });
                
                gsap.set(bg, { filter: "brightness(0.5)" });
                gsap.set(koText, { opacity: 0, scale: 0 });
            }
        });

        // 3. ANIMAÇÃO (Duração estendida para 15s)
        tl.add(() => containerSite.classList.add('tela-destruida'))
          
          // SOCANDO (12 segundos)
          .to(elementosParaTremer, { 
              x: 25, y: -25, duration: 0.04, yoyo: true, repeat: 300, ease: "steps(2)" 
          })
          
          // FLASHES (12 segundos)
          .to(flash, { opacity: 0.6, duration: 0.08, backgroundColor: "#ffae00", repeat: 150, yoyo: true }, "<")
          
          // FINALIZAÇÃO (+3 segundos)
          .to(flash, { opacity: 1, duration: 0.1, backgroundColor: "#ffffff" }, "-=0.5")
          .add(() => containerSite.classList.remove('tela-destruida'))
          .to(containerSite, { opacity: 0, duration: 0.2, scale: 1.1 })
          .to(flash, { opacity: 0, duration: 0.5 }) 
          .to(koText, { opacity: 1, scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" }, "-=0.3")
          .to(containerSite, { opacity: 1, scale: 1, duration: 1.0, delay: 2.0 });
    }

    function ativarChuvaLevelUp() {
        const container = document.getElementById('levelup-container');
        if(!container) return;
        const totalMensagens = 50; 
        for (let i = 0; i < totalMensagens; i++) {
            setTimeout(() => {
                const msg = document.createElement('div');
                msg.classList.add('levelup-msg');
                msg.innerText = "LEVEL UP!!";
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                msg.style.left = `${x}px`;
                msg.style.top = `${y}px`;
                const cores = ["#ffff00", "#00ff00", "#ffffff", "#ff4500"];
                msg.style.color = cores[Math.floor(Math.random() * cores.length)];
                container.appendChild(msg);
                setTimeout(() => { msg.remove(); }, 3000);
            }, i * 100);
        }
    }

    // --- VERIFICADOR MESTRE DE CÓDIGOS ---
    window.inputKonami = function(tecla) {
        inputUsuario.push(tecla);
        if (inputUsuario.length > 20) inputUsuario.shift();

        // Verifica JOE (Special Event)
        const joeString = JSON.stringify(codigoJoe);
        const inputRecenteJoe = inputUsuario.slice(-codigoJoe.length);
        if (JSON.stringify(inputRecenteJoe) === joeString) {
            executarComboJoe();
            inputUsuario = [];
            return;
        }

        // Verifica KONAMI (Level Up)
        const konamiString = JSON.stringify(codigoKonami);
        const inputRecenteKonami = inputUsuario.slice(-codigoKonami.length);
        if (JSON.stringify(inputRecenteKonami) === konamiString) {
            ativarChuvaLevelUp();
            inputUsuario = [];
            return;
        }
    };

    document.addEventListener('keydown', (e) => {
        let tecla = e.key;
        const teclasBloqueadas = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "];
        if (teclasBloqueadas.includes(tecla)) e.preventDefault(); 

        if (tecla === "ArrowUp") { animarBotaoVirtual('.btn-dpad.up'); window.inputKonami('ArrowUp'); moverNinjaTeclado(tecla); }
        else if (tecla === "ArrowDown") { animarBotaoVirtual('.btn-dpad.down'); window.inputKonami('ArrowDown'); moverNinjaTeclado(tecla); }
        else if (tecla === "ArrowLeft") { animarBotaoVirtual('.btn-dpad.left'); window.inputKonami('ArrowLeft'); moverNinjaTeclado(tecla); }
        else if (tecla === "ArrowRight") { animarBotaoVirtual('.btn-dpad.right'); window.inputKonami('ArrowRight'); moverNinjaTeclado(tecla); }
        else if (tecla === "b" || tecla === "B") { animarBotaoVirtual('.b-btn'); window.inputKonami('b'); }
        else if (tecla === "a" || tecla === "A") { animarBotaoVirtual('.a-btn'); window.inputKonami('a'); }
    });
});