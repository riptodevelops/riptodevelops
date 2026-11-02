/**
 * Ripto Develops — Application Engine
 */

(function () {
  // ── State ──
  const S = { view: 'home', modal: null, bill: 'mo' };

  const views = {
    home: document.getElementById('v-home'),
    login: document.getElementById('v-login'),
    request: document.getElementById('v-request')
  };

  const modals = {
    changelog: document.getElementById('m-changelog'),
    privacy: document.getElementById('m-privacy'),
    terms: document.getElementById('m-terms')
  };

  const cmdk = document.getElementById('cmdk');

  // ── View Router ──
  function go(name, push) {
    if (push === undefined) push = true;
    if (!views[name]) name = 'home';
    S.view = name;
    Object.entries(views).forEach(([k, el]) => el.classList.toggle('on', k === name));
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (push) {
      const p = name === 'home' ? '/' : name === 'request' ? '/request-access' : '/' + name;
      if (location.pathname !== p) history.pushState({ v: name }, '', p);
    }
  }

  window.addEventListener('popstate', function () {
    const p = location.pathname.replace(/^\//, '');
    go(p === 'login' ? 'login' : (p === 'request' || p === 'request-access') ? 'request' : 'home', false);
  });

  // ── Modal ──
  function openModal(key) {
    closeModal();
    var m = modals[key];
    if (!m) return;
    S.modal = key;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!S.modal) return;
    var m = modals[S.modal];
    if (m) m.classList.remove('open');
    S.modal = null;
    document.body.style.overflow = '';
  }

  // ── Command Palette ──
  function openCmd() {
    closeCmdk();
    cmdk.classList.add('open');
    document.body.style.overflow = 'hidden';
    var inp = document.getElementById('cmdk-in');
    if (inp) { inp.value = ''; setTimeout(function () { inp.focus(); }, 40); }
  }

  function closeCmdk() {
    cmdk.classList.remove('open');
    if (!S.modal) document.body.style.overflow = '';
  }

  function execCmd(target) {
    closeCmdk();
    if (!target) return;
    if (target === 'home') go('home');
    else if (target === 'login') go('login');
    else if (target === 'request') go('request');
    else if (target === 'changelog') openModal('changelog');
    else if (['features', 'architecture', 'pricing'].indexOf(target) !== -1) {
      if (S.view !== 'home') go('home');
      setTimeout(function () {
        var el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  }

  // ── Scroll Reveal (IntersectionObserver) ──
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  // ── Hero Staggered Entrance ──
  function initHeroEntrance() {
    requestAnimationFrame(function () {
      setTimeout(function () {
        document.querySelectorAll('.hero-enter').forEach(function (el) {
          el.classList.add('in');
        });
      }, 80);
    });
  }

  // ── Cursor Spotlight on Cards ──
  function initSpotlights() {
    document.querySelectorAll('.glow-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var spot = card.querySelector('.card-spotlight');
        if (spot) {
          spot.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          spot.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }
      });
    });
  }

  // ── Stage Code Tabs ──
  var codeTS = document.getElementById('code-block') ? document.getElementById('code-block').innerHTML : '';

  var codeJSON = '<code>' +
    '<span class="ln">{</span>\n' +
    '<span class="ln">  <span class="tk-kw">"name"</span>: <span class="tk-st">"rag-ingestion"</span>,</span>\n' +
    '<span class="ln">  <span class="tk-kw">"cluster"</span>: <span class="tk-st">"ap-south-1"</span>,</span>\n' +
    '<span class="ln">  <span class="tk-kw">"sandbox"</span>: {</span>\n' +
    '<span class="ln">    <span class="tk-kw">"type"</span>: <span class="tk-st">"micro-vm.nitro"</span>,</span>\n' +
    '<span class="ln">    <span class="tk-kw">"vcpu"</span>: <span class="tk-nm">2</span>,</span>\n' +
    '<span class="ln">    <span class="tk-kw">"memoryMb"</span>: <span class="tk-nm">512</span></span>\n' +
    '<span class="ln">  },</span>\n' +
    '<span class="ln">  <span class="tk-kw">"models"</span>: [</span>\n' +
    '<span class="ln">    <span class="tk-st">"aws-bedrock/claude-3.5-sonnet"</span>,</span>\n' +
    '<span class="ln">    <span class="tk-st">"openai/gpt-4o"</span></span>\n' +
    '<span class="ln">  ],</span>\n' +
    '<span class="ln">  <span class="tk-kw">"persistence"</span>: {</span>\n' +
    '<span class="ln">    <span class="tk-kw">"vector"</span>: <span class="tk-st">"pgvector"</span>,</span>\n' +
    '<span class="ln">    <span class="tk-kw">"snapshots"</span>: <span class="tk-st">"s3-standard"</span></span>\n' +
    '<span class="ln">  }</span>\n' +
    '<span class="ln">}</span>' +
    '</code>';

  function initStageTabs() {
    var tabs = document.querySelectorAll('[data-tab]');
    var block = document.getElementById('code-block');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        if (block) block.innerHTML = tab.dataset.tab === 'json' ? codeJSON : codeTS;
      });
    });
  }

  // ── Stage Runner (streaming simulation) ──
  function initStageRunner() {
    var runBtn = document.getElementById('btn-run');
    var runLbl = document.getElementById('run-lbl');
    var out = document.getElementById('stream-out');
    var badge = document.getElementById('stream-badge');
    var meta = document.getElementById('stage-meta');

    if (!runBtn) return;
    runBtn.addEventListener('click', function () {
      runLbl.textContent = 'Running...';
      runBtn.style.opacity = '0.6';
      badge.textContent = 'STREAMING';
      badge.style.color = '#fbbf24';
      badge.style.borderColor = 'rgba(251,191,36,0.3)';
      badge.style.background = 'rgba(251,191,36,0.08)';
      out.innerHTML = '<div class="s-dim">[init] Allocating Nitro micro-VM...</div>';

      var steps = [
        { t: 140, cls: 's-info', msg: '[0.17ms] Microkernel boot verified (arm64 KVM)' },
        { t: 300, cls: 's-ok', msg: '[11ms] Bedrock route active: claude-3.5-sonnet' },
        { t: 480, cls: 's-info', msg: '[26ms] Streaming 428 tokens @ 118 t/s' },
      ];

      steps.forEach(function (step) {
        setTimeout(function () {
          out.innerHTML += '<div class="' + step.cls + '">' + step.msg + '</div>';
          out.scrollTop = out.scrollHeight;
        }, step.t);
      });

      setTimeout(function () {
        var lat = 38 + Math.floor(Math.random() * 7);
        var mem = 108 + Math.floor(Math.random() * 12);
        var hex = Math.random().toString(16).substring(2, 7);
        out.innerHTML +=
          '<div class="s-ok">[' + lat + 'ms] pgvector indexed + S3 snapshot committed</div>' +
          '<span class="s-json">{ "wf_id": "wf_' + hex + '", "status": 200, "latency": "' + lat + 'ms" }</span>';
        out.scrollTop = out.scrollHeight;

        badge.textContent = '200 OK';
        badge.style.color = 'var(--green)';
        badge.style.borderColor = 'rgba(0,220,130,0.2)';
        badge.style.background = 'rgba(0,220,130,0.1)';
        runLbl.textContent = 'Run';
        runBtn.style.opacity = '1';
        if (meta) meta.textContent = lat + 'ms \u2022 ' + mem + 'MB \u2022 14.8KB egress';
      }, 650);
    });
  }

  // ── Copy Buttons ──
  function initCopy() {
    // CLI pill
    var cliEl = document.getElementById('cli-copy');
    var cliTxt = document.getElementById('cli-txt');
    if (cliEl) {
      cliEl.addEventListener('click', function () {
        navigator.clipboard.writeText('pnpm add @ripto/sdk').then(function () {
          var orig = cliTxt.textContent;
          cliTxt.textContent = 'Copied!';
          cliEl.style.borderColor = 'var(--green)';
          setTimeout(function () {
            cliTxt.textContent = orig;
            cliEl.style.borderColor = '';
          }, 1600);
        }).catch(function () {});
      });
    }

    // Code copy
    var copyBtn = document.getElementById('btn-copy-code');
    var copyLbl = document.getElementById('copy-lbl');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var raw = "import { RiptoClient } from '@ripto/sdk';\n\nconst client = new RiptoClient({\n  apiKey: process.env.RIPTO_API_KEY,\n  cluster: 'ap-south-1'\n});\n\nexport const pipeline = client.workflow('rag-ingestion', {\n  sandbox: 'micro-vm.nitro',\n  timeout: 45_000,\n  models: ['aws-bedrock/claude-3.5-sonnet', 'openai/gpt-4o'],\n  fallback: 'auto'\n});\n\nawait pipeline.execute({\n  documents: ['s3://corpus/v2/chunk_891.parquet'],\n  vectorStore: 'pgvector.prod.internal'\n});";
        navigator.clipboard.writeText(raw).then(function () {
          copyLbl.textContent = 'Copied!';
          setTimeout(function () { copyLbl.textContent = 'Copy'; }, 1500);
        }).catch(function () {});
      });
    }

    // Request ID copy
    var ridBtn = document.getElementById('copy-rid');
    if (ridBtn) {
      ridBtn.addEventListener('click', function () {
        navigator.clipboard.writeText('req_94x8a').then(function () {
          ridBtn.textContent = 'Copied!';
          setTimeout(function () { ridBtn.textContent = 'Copy Request ID'; }, 1500);
        }).catch(function () {});
      });
    }
  }

  // ── Model Pill Switcher ──
  function initModelPills() {
    var pills = document.querySelectorAll('[data-prov]');
    var modelEl = document.getElementById('prov-model');
    var latEl = document.getElementById('prov-lat');
    var provData = {
      bedrock: { m: 'Claude 3.5 Sonnet', l: '42ms' },
      anthropic: { m: 'Claude 3.5 Haiku', l: '26ms' },
      openai: { m: 'GPT-4o', l: '34ms' }
    };
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('on'); });
        pill.classList.add('on');
        var d = provData[pill.dataset.prov];
        if (d && modelEl && latEl) {
          modelEl.textContent = d.m;
          latEl.textContent = d.l;
        }
      });
    });
  }

  // ── Billing Toggle ──
  function initBilling() {
    var opts = document.querySelectorAll('[data-bill]');
    var proAmt = document.getElementById('pro-amt');
    var proPer = document.getElementById('pro-per');
    var entAmt = document.getElementById('ent-amt');
    var entPer = document.getElementById('ent-per');
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        opts.forEach(function (o) { o.classList.remove('on'); });
        opt.classList.add('on');
        S.bill = opt.dataset.bill;
        if (S.bill === 'yr') {
          if (proAmt) proAmt.textContent = '$24';
          if (proPer) proPer.textContent = '/mo billed annually';
          if (entAmt) entAmt.textContent = '$79';
          if (entPer) entPer.textContent = '/mo billed annually';
        } else {
          if (proAmt) proAmt.textContent = '$29';
          if (proPer) proPer.textContent = '/mo';
          if (entAmt) entAmt.textContent = '$99';
          if (entPer) entPer.textContent = '/mo';
        }
      });
    });
  }

  // ── Nav & Routing Bindings ──
  function initNav() {
    document.getElementById('go-home').addEventListener('click', function () { go('home'); });

    document.querySelectorAll('[data-scroll]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.scroll;
        if (S.view !== 'home') go('home');
        setTimeout(function () {
          var el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      });
    });

    document.getElementById('btn-signin').addEventListener('click', function () { go('login'); });
    document.getElementById('btn-request-nav').addEventListener('click', function () { go('request'); });
    document.getElementById('btn-request-hero').addEventListener('click', function () { go('request'); });

    document.querySelectorAll('[data-go]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = document.getElementById('f-req');
        var ok = document.getElementById('req-ok');
        if (f) { f.reset(); f.style.display = ''; }
        if (ok) ok.style.display = 'none';
        go(btn.dataset.go);
      });
    });

    document.querySelectorAll('.plan-cta').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tier = btn.dataset.tier;
        var sel = document.getElementById('rt');
        if (sel) sel.value = tier;
        go('request');
      });
    });

    // Modals
    document.getElementById('nav-changelog').addEventListener('click', function () { openModal('changelog'); });
    document.getElementById('f-cl').addEventListener('click', function () { openModal('changelog'); });
    document.getElementById('f-pp').addEventListener('click', function () { openModal('privacy'); });
    document.getElementById('f-ts').addEventListener('click', function () { openModal('terms'); });

    document.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
    Object.values(modals).forEach(function (m) {
      if (m) m.addEventListener('click', function (e) { if (e.target === m) closeModal(); });
    });
    cmdk.addEventListener('click', function (e) { if (e.target === cmdk) closeCmdk(); });
  }

  // ── Command Palette Logic ──
  function initCmdk() {
    // Keyboard shortcut
    window.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        cmdk.classList.contains('open') ? closeCmdk() : openCmd();
      }
      if (e.key === 'Escape') {
        if (cmdk.classList.contains('open')) closeCmdk();
        else if (S.modal) closeModal();
      }
    });

    var inp = document.getElementById('cmdk-in');
    var list = document.getElementById('cmdk-list');

    inp.addEventListener('input', function () {
      var q = inp.value.toLowerCase().trim();
      var items = list.querySelectorAll('.cmdk-item');
      var first = null;
      items.forEach(function (item) {
        var match = item.textContent.toLowerCase().indexOf(q) !== -1;
        item.style.display = match ? '' : 'none';
        item.classList.remove('sel');
        if (match && !first) first = item;
      });
      if (first) first.classList.add('sel');
    });

    inp.addEventListener('keydown', function (e) {
      var visible = Array.from(list.querySelectorAll('.cmdk-item')).filter(function (i) {
        return i.style.display !== 'none';
      });
      if (!visible.length) return;
      var idx = visible.findIndex(function (i) { return i.classList.contains('sel'); });
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var nxt = (idx + 1) % visible.length;
        visible.forEach(function (i) { i.classList.remove('sel'); });
        visible[nxt].classList.add('sel');
        visible[nxt].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prv = (idx - 1 + visible.length) % visible.length;
        visible.forEach(function (i) { i.classList.remove('sel'); });
        visible[prv].classList.add('sel');
        visible[prv].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var sel = visible[idx] || visible[0];
        if (sel) execCmd(sel.dataset.cmd);
      }
    });

    list.addEventListener('click', function (e) {
      var item = e.target.closest('.cmdk-item');
      if (item) execCmd(item.dataset.cmd);
    });
  }

  // ── Login Form ──
  function initLoginForm() {
    var form = document.getElementById('f-login');
    var btn = document.getElementById('login-btn');
    var txt = document.getElementById('login-txt');
    var sp = document.getElementById('login-sp');
    var err = document.getElementById('login-err');
    var ghBtn = document.getElementById('gh-btn');
    var ghNote = document.getElementById('gh-notice');

    if (ghBtn) ghBtn.addEventListener('click', function () {
      ghNote.style.display = 'block';
      err.style.display = 'none';
    });

    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.style.display = 'none';
      ghNote.style.display = 'none';
      var email = document.getElementById('le').value.trim();
      var pw = document.getElementById('lp').value;
      if (!email || !pw) {
        err.textContent = 'Both fields are required.';
        err.style.display = 'block';
        return;
      }
      btn.disabled = true;
      txt.style.display = 'none';
      sp.style.display = 'inline-block';
      setTimeout(function () {
        btn.disabled = false;
        txt.style.display = '';
        sp.style.display = 'none';
        err.textContent = 'Error 403: Workspace not found or pending cluster allocation. If your team recently applied for early access, check your inbox for the invite token.';
        err.style.display = 'block';
      }, 1200);
    });
  }

  // ── Request Form ──
  function initReqForm() {
    var form = document.getElementById('f-req');
    var btn = document.getElementById('req-btn');
    var txt = document.getElementById('req-txt');
    var sp = document.getElementById('req-sp');
    var ok = document.getElementById('req-ok');

    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('rn').value.trim();
      var em = document.getElementById('re').value.trim();
      var gh = document.getElementById('rg').value.trim();
      if (!n || !em || !gh) return;
      btn.disabled = true;
      txt.style.display = 'none';
      sp.style.display = 'inline-block';
      setTimeout(function () {
        btn.disabled = false;
        txt.style.display = '';
        sp.style.display = 'none';
        form.style.display = 'none';
        ok.style.display = 'block';
      }, 1500);
    });
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function () {
    initHeroEntrance();
    initReveals();
    initSpotlights();
    initStageTabs();
    initStageRunner();
    initCopy();
    initModelPills();
    initBilling();
    initNav();
    initCmdk();
    initLoginForm();
    initReqForm();

    // Initial route
    var p = location.pathname.replace(/^\//, '');
    if (p === 'login') go('login', false);
    else if (p === 'request' || p === 'request-access') go('request', false);
    else go('home', false);
  });
})();
