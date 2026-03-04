//is US
(function () {
  'use strict';

  function getUserCountry() {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      // en-US → US
      const match = locale.match(/-(\w{2})$/);
      return match ? match[1].toUpperCase() : null;
    } catch (e) {
      return null;
    }
  }

  const COPY_US = {
    //country: "United States",
    region: "the United States",
    team_reach: "Dedicated team. Nationwide reach",
    origin: "US-Based",
    market: "US Market",
    currency: "USD"
  };

  function replaceContent(copy) {
    Object.keys(copy).forEach(function (key) {
      var el = document.querySelector('[data-i18n-key="' + key + '"]');
      if (el) {
        el.textContent = copy[key];
      }
    });
  }
  
  function replaceImageForUS() {
    const img = document.querySelector('[data-market-image]');
    if (!img) return;

    img.src = 'assets/img/ChatGPT Image Jan 21, 2026, 03_41_37 PM 1.jpg';
    img.alt = 'US market';
  }

  function removeElementsForUS() {
    const elements = document.querySelectorAll('[data-remove-for-us]');
    elements.forEach(function (el) {
      el.remove();
    });
  }

  var country = getUserCountry();

  if (country === "US") {
    replaceContent(COPY_US);
    replaceImageForUS();
    removeElementsForUS();
  }
})();

(function () {
  'use strict';

  var currencyNodes = document.querySelectorAll('[data-i18n-key="currency"]');

  if (!currencyNodes.length) return;

  currencyNodes.forEach(function (node) {
    node.textContent = 'USD';
  });
})();


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

    // clean any inline max-height left from previous versions
    root.querySelectorAll('.snake-desc').forEach(function (el) {
        el.style.maxHeight = '';
    });

    const TOGGLE_TARGET = '.snake-toggle, .snake-desc, .snake-ellipsis';

    root.addEventListener('click', function (e) {
        if (e.target.closest('.btn-mini')) return;

        const box = e.target.closest('.snake-box');
        if (!box) return;

        if (!e.target.closest(TOGGLE_TARGET)) return;

        const isOpen = box.classList.contains('is-open');
        const willOpen = !isOpen;

        root.querySelectorAll('.snake-box.is-open').forEach(function (other) {
            if (other !== box) {
                other.classList.remove('is-open');
            }
        });

        box.classList.toggle('is-open', willOpen);
    });
})();
