// Mobile header nav for: .header / #burger / #navMobile
(function(){
    const header    = document.querySelector('.header');
    const burger    = document.getElementById('burger');
    const navMobile = document.getElementById('navMobile');
    if(!header || !burger || !navMobile) return;

    const closeNav = () => {
        header.classList.remove('header--open');
        burger.setAttribute('aria-expanded','false');
        burger.setAttribute('aria-label','Open menu');
        document.body.style.overflow = '';
    };
    const openNav = () => {
        header.classList.add('header--open');
        burger.setAttribute('aria-expanded','true');
        burger.setAttribute('aria-label','Close menu');
        document.body.style.overflow = 'hidden';
    };

    closeNav(); // closed by default

    burger.addEventListener('click', ()=> header.classList.contains('header--open') ? closeNav() : openNav());
    navMobile.addEventListener('click', (e)=>{ if(e.target.closest('a,button')) closeNav(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeNav(); });
    document.addEventListener('click', (e)=>{ if(!header.contains(e.target)) closeNav(); });

    const mq=window.matchMedia('(min-width:961px)');
    const sync=()=>{ if(mq.matches) closeNav(); };
    mq.addEventListener ? mq.addEventListener('change',sync) : mq.addListener(sync);
})();

// Modal (shared CTA)
(function(){
    const modal = document.getElementById('modal');
    const openers = document.querySelectorAll('[data-open-modal]');
    const form = document.getElementById('leadForm');
    const statusEl = document.getElementById('formStatus');
    if(!modal) return;

    const openModal = () => {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden','false');
        document.body.style.overflow='hidden';
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden','true');
        document.body.style.overflow='';
    };

    openers.forEach(b => b.addEventListener('click', openModal));

    modal.addEventListener('click', (e)=>{
        if (e.target.matches('[data-close-modal], .modal__backdrop, .modal__close')) closeModal();
    });

    document.addEventListener('keydown', (e)=>{
        if (e.key === 'Escape') closeModal();
    });

    // --- Form submit handler ---
    if (form){
        form.addEventListener('submit', async (e)=>{
            e.preventDefault();

            const formData = new FormData(form);

            statusEl.textContent = "Sending...";
            statusEl.classList.add("visible");

            try {
                const response = await fetch("send.php", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data.ok) {
                    statusEl.textContent = "Thanks! We will be in touch within 24 hours.";
                    form.reset();
                } else {
                    statusEl.textContent = "Something went wrong. Please try again.";
                }
            } catch (err) {
                statusEl.textContent = "Error. Please try again later.";
                console.error(err);
            }
        });
    }
})();


// Snake: expand on title/text/ellipsis; collapse on any click inside the box (except buttons)
(function () {
    const root = document.getElementById('snakeSteps');
    if (!root) return;

    function onClick(e) {
        const target = e.target;

        if (target.closest('.btn-mini')) return;

        const box = target.closest('.snake-box');
        if (!box) return;

        const desc = box.querySelector('.snake-desc');
        if (!desc) return;

        const isOpen = box.classList.contains('is-open');

        if (isOpen) {
            box.classList.remove('is-open');
            desc.style.maxHeight = "";   // clear inline if it was set before
            return;
        }

        const canExpand = target.closest('.snake-toggle, .snake-desc, .snake-ellipsis');
        if (!canExpand) return;

        box.classList.add('is-open');
        desc.style.maxHeight = "";       // rely on CSS .snake-box.is-open .snake-desc
    }

    root.addEventListener('click', onClick);
})();
