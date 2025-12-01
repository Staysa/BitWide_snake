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

    const openModal = () => { modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
    const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };

    openers.forEach(b => b.addEventListener('click', openModal));
    modal.addEventListener('click', (e)=>{
        if (e.target.matches('[data-close-modal], .modal__backdrop, .modal__close')) closeModal();
    });
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

    if (form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            statusEl.textContent = 'Thanks! We will be in touch within 24 hours.';
            form.reset();
        });
    }
})();

// Snake: expand on title/text/ellipsis; collapse on any click inside the box (except buttons)
(function(){
    const root = document.getElementById('snakeSteps');
    if(!root) return;

    function expand(descEl, boxEl){
        const inner = descEl.querySelector('.snake-desc__inner');
        if(!inner) return;
        boxEl.classList.add('is-open');
        descEl.style.maxHeight = '50px';
        requestAnimationFrame(()=>{ descEl.style.maxHeight = (inner.scrollHeight + 2) + 'px'; });
    }
    function collapse(descEl, boxEl){
        const h = descEl.scrollHeight;
        descEl.style.maxHeight = h + 'px';
        requestAnimationFrame(()=>{ descEl.style.maxHeight = '50px'; });
        const done = ()=> boxEl.classList.remove('is-open');
        descEl.addEventListener('transitionend', done, {once:true});
        setTimeout(done, 400);
    }

    root.addEventListener('click', (e)=>{
        if (e.target.closest('.btn-mini')) return;            // ignore step buttons
        const box = e.target.closest('.snake-box'); if(!box) return;
        const desc = box.querySelector('.snake-desc');
        const isOpen = box.classList.contains('is-open');

        if (isOpen){                                          // collapse anywhere inside the box
            collapse(desc, box);
            return;
        }
        const canExpand = e.target.closest('.snake-toggle, .snake-desc, .snake-ellipsis');
        if (canExpand) expand(desc, box);
    });

    let rAF;
    window.addEventListener('resize', ()=>{
        cancelAnimationFrame(rAF);
        rAF=requestAnimationFrame(()=>{
            root.querySelectorAll('.snake-box.is-open .snake-desc').forEach(desc=>{
                const inner = desc.querySelector('.snake-desc__inner');
                if(inner) desc.style.maxHeight = (inner.scrollHeight + 2) + 'px';
            });
        });
    });
})();
