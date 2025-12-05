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
    var root = document.getElementById('snakeSteps');
    if (!root) return;

    var raf = window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };
    var caf = window.cancelAnimationFrame || clearTimeout;

    function findAncestorWithClass(node, className, stopNode) {
        while (node && node !== stopNode) {
            if (node.nodeType === 1 && node.classList && node.classList.contains(className)) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    function expand(descEl, boxEl) {
        var inner = descEl.querySelector('.snake-desc__inner');
        if (!inner) return;

        boxEl.classList.add('is-open');
        descEl.style.maxHeight = '50px';

        raf(function () {
            descEl.style.maxHeight = (inner.scrollHeight + 2) + 'px';
        });
    }

    function collapse(descEl, boxEl) {
        var h = descEl.scrollHeight;
        descEl.style.maxHeight = h + 'px';

        raf(function () {
            descEl.style.maxHeight = '50px';
        });

        var done = function () {
            boxEl.classList.remove('is-open');
        };

        descEl.addEventListener('transitionend', done, { once: true });
        setTimeout(done, 400);
    }

    root.addEventListener('click', function (e) {
        var target = e.target;

        // ignore clicks on step buttons
        if (findAncestorWithClass(target, 'btn-mini', root)) {
            return;
        }

        var box = findAncestorWithClass(target, 'snake-box', root);
        if (!box) return;

        var desc = box.querySelector('.snake-desc');
        if (!desc) return;

        var isOpen = box.classList.contains('is-open');

        if (isOpen) {
            // collapse on any click inside box (except buttons above)
            collapse(desc, box);
            return;
        }

        // allow expand only when clicking title, text or ellipsis
        var inToggleArea =
            findAncestorWithClass(target, 'snake-toggle', box) ||
            findAncestorWithClass(target, 'snake-desc', box) ||
            findAncestorWithClass(target, 'snake-ellipsis', box);

        if (inToggleArea) {
            expand(desc, box);
        }
    }, false);

    var pending;
    window.addEventListener('resize', function () {
        if (pending) caf(pending);

        pending = raf(function () {
            var openDescs = root.querySelectorAll('.snake-box.is-open .snake-desc');
            for (var i = 0; i < openDescs.length; i++) {
                var desc = openDescs[i];
                var inner = desc.querySelector('.snake-desc__inner');
                if (inner) {
                    desc.style.maxHeight = (inner.scrollHeight + 2) + 'px';
                }
            }
        });
    });
})();
