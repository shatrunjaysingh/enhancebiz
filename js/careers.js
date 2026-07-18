/* Careers page controller:
   • renders EB_JOBS (+ any locally-added roles) into #ebOpenings
   • application modal with resume upload
   • ADMIN "Add opening" tool  →  open careers.html?admin=1 to enable it
   Edit the published list in js/careers-data.js. */
(function () {
  var wrap = document.getElementById('ebOpenings');
  if (!wrap) return;

  var LS = 'eb_jobs_local';
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
  };

  // ----- admin mode: enable with ?admin=1, disable with ?admin=0 (persists) -----
  if (/[?&]admin=1/.test(location.search)) localStorage.setItem('eb_admin', '1');
  if (/[?&]admin=0/.test(location.search)) localStorage.setItem('eb_admin', '0');
  var stored = localStorage.getItem('eb_admin');
  // visible by default (window.EB_ADMIN), unless explicitly turned off with ?admin=0
  var isAdmin = stored === '1' || (stored !== '0' && window.EB_ADMIN === true);

  // ----- data helpers -----
  function localJobs() { try { return JSON.parse(localStorage.getItem(LS) || '[]'); } catch (e) { return []; } }
  function saveLocal(a) { localStorage.setItem(LS, JSON.stringify(a)); }

  function chips(j) {
    var arr = [j.dept, j.type, j.location].concat(Array.isArray(j.tags) ? j.tags : []).filter(Boolean);
    if (!arr.length) return '';
    return '<div class="eb-card__tags" style="margin-top:0;">' +
      arr.map(function (c) { return '<span class="eb-tag">' + esc(c) + '</span>'; }).join('') + '</div>';
  }

  // ----- render -----
  function render() {
    var local = localJobs();
    var jobs = local.concat(window.EB_JOBS || []);
    if (!jobs.length) {
      wrap.innerHTML =
        '<p class="eb-center" style="grid-column:1/-1;color:var(--muted);">' +
        'No open roles right now — but we’re always glad to meet great people. ' +
        '<a href="mailto:shiwesh@enhancebizcx.com?subject=General%20Application" style="color:var(--gold-deep);font-weight:600;">Send us your resume</a>.</p>';
      return;
    }
    wrap.innerHTML = jobs.map(function (j, i) {
      var isLocal = i < local.length;
      var detail = j.detail ? '<p style="margin:0 0 10px;">' + esc(j.detail) + '</p>' : '';
      var badge = (isAdmin && isLocal)
        ? '<span style="display:inline-block;font-family:Nunito;font-size:10px;font-weight:700;color:#8a6d00;background:#fff3cf;border:1px solid #ffe08a;border-radius:100px;padding:2px 9px;margin-bottom:8px;">● Draft — local only</span><br>'
        : '';
      var btn = j.apply
        ? '<a href="' + esc(j.apply) + '" class="eb-btn eb-btn--ghost" target="_blank" rel="noopener">Apply</a>'
        : '<button type="button" class="eb-btn eb-btn--ghost" data-apply="' + esc(j.title) + '">Apply</button>';
      var remove = (isAdmin && isLocal)
        ? '<button type="button" class="eb-btn eb-btn--ghost" data-remove="' + i + '" style="padding:10px 16px;" title="Remove draft"><i class="fa fa-trash-o"></i></button>'
        : '';
      return (
        '<div class="eb-card reveal in" style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">' +
          '<div style="min-width:0;flex:1;">' + badge +
            '<h3 style="margin-bottom:6px;">' + esc(j.title) + '</h3>' + detail + chips(j) +
          '</div>' +
          '<div style="display:flex;gap:8px;">' + btn + remove + '</div>' +
        '</div>'
      );
    }).join('');
  }
  render();

  /* =========================================================================
     APPLICATION MODAL (resume upload)
     ========================================================================= */
  var modal = document.createElement('div');
  modal.className = 'eb-modal';
  modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
  modal.innerHTML =
    '<div class="eb-modal__overlay" data-close></div>' +
    '<div class="eb-modal__dialog">' +
      '<button class="eb-modal__close" data-close aria-label="Close"><i class="fa fa-times"></i></button>' +
      '<h3>Apply now</h3><div class="eb-modal__role" id="ebApplyRole">Role</div>' +
      '<form id="ebApplyForm" novalidate>' +
        '<input type="hidden" name="role" id="ebApplyRoleInput">' +
        '<div class="row2"><input class="eb-input" name="first_name" placeholder="First name" required>' +
        '<input class="eb-input" name="last_name" placeholder="Last name" required></div>' +
        '<div class="row2"><input class="eb-input" type="email" name="email" placeholder="Email" required>' +
        '<input class="eb-input" name="phone" placeholder="Phone (optional)"></div>' +
        '<input class="eb-input" name="link" placeholder="LinkedIn or portfolio URL (optional)">' +
        '<textarea name="message" placeholder="A short note — why this role? (optional)"></textarea>' +
        '<label class="eb-file"><i class="fa fa-paperclip"></i>' +
          '<span class="eb-file__txt" id="ebFileTxt"><strong>Attach your resume</strong> — PDF, DOC, DOCX</span>' +
          '<input type="file" name="resume" accept=".pdf,.doc,.docx,application/pdf" required></label>' +
        '<button type="submit" class="eb-btn eb-btn--primary eb-btn--lg" style="width:100%;"><i class="fa fa-paper-plane"></i> Submit Application</button>' +
        '<div class="success" id="ebApplyOk"><i class="fa fa-check-circle"></i> Thanks! Your application has been received.</div>' +
        '<div class="error" id="ebApplyErr">Something went wrong. Please email <a href="mailto:shiwesh@enhancebizcx.com">shiwesh@enhancebizcx.com</a>.</div>' +
      '</form></div>';
  document.body.appendChild(modal);

  var aForm = modal.querySelector('#ebApplyForm');
  var aRoleLabel = modal.querySelector('#ebApplyRole');
  var aRoleInput = modal.querySelector('#ebApplyRoleInput');
  var aFile = aForm.querySelector('input[type="file"]');
  var aFileTxt = modal.querySelector('#ebFileTxt');
  var aOk = modal.querySelector('#ebApplyOk');
  var aErr = modal.querySelector('#ebApplyErr');

  function openApply(role) {
    aRoleLabel.textContent = role; aRoleInput.value = role; aForm.reset(); aForm.style.display = '';
    aFileTxt.innerHTML = '<strong>Attach your resume</strong> — PDF, DOC, DOCX';
    aOk.style.display = aErr.style.display = 'none';
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function closeApply() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeApply(); });
  aFile.addEventListener('change', function () {
    aFileTxt.innerHTML = aFile.files.length ? '<strong>' + esc(aFile.files[0].name) + '</strong>' : '<strong>Attach your resume</strong> — PDF, DOC, DOCX';
  });
  aForm.addEventListener('submit', function (e) {
    e.preventDefault(); aOk.style.display = aErr.style.display = 'none';
    if (!aForm.checkValidity()) { aForm.reportValidity(); return; }
    var endpoint = window.EB_APPLY_ENDPOINT;
    if (endpoint) {
      var data = new FormData(aForm);
      var sb = aForm.querySelector('button[type="submit"]'); sb.disabled = true; sb.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending…';
      fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw 0; aForm.style.display = 'none'; aOk.style.display = 'block'; })
        .catch(function () { aErr.style.display = 'block'; })
        .finally(function () { sb.disabled = false; sb.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Application'; });
    } else {
      var v = function (n) { var el = aForm.elements[n]; return el ? el.value.trim() : ''; };
      var body = 'Role: ' + aRoleInput.value + '\nName: ' + v('first_name') + ' ' + v('last_name') +
        '\nEmail: ' + v('email') + '\nPhone: ' + v('phone') + '\nLink: ' + v('link') + '\n\n' +
        (v('message') ? v('message') + '\n\n' : '') +
        '(Please attach your resume — ' + (aFile.files[0] ? aFile.files[0].name : 'file') + ' — before sending.)';
      window.location.href = 'mailto:shiwesh@enhancebizcx.com?subject=' +
        encodeURIComponent('Application: ' + aRoleInput.value) + '&body=' + encodeURIComponent(body);
      aOk.innerHTML = '<i class="fa fa-check-circle"></i> Your email draft is ready — attach your resume and hit send.';
      aOk.style.display = 'block';
    }
  });

  // delegated clicks on the grid: Apply (open modal) or Remove (admin draft)
  wrap.addEventListener('click', function (e) {
    var ap = e.target.closest('[data-apply]');
    if (ap) { e.preventDefault(); openApply(ap.getAttribute('data-apply')); return; }
    var rm = e.target.closest('[data-remove]');
    if (rm) {
      var idx = +rm.getAttribute('data-remove');
      var local = localJobs();
      if (idx >= 0 && idx < local.length) { local.splice(idx, 1); saveLocal(local); render(); }
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeApply(); closeAdd(); } });

  /* =========================================================================
     ADMIN — "Add opening" tool (only when admin mode is on)
     ========================================================================= */
  var addModal, snippet = '';
  function closeAdd() { if (addModal) addModal.classList.remove('open'); document.body.style.overflow = ''; }

  if (isAdmin) {
    // toolbar above the grid
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:24px;padding:14px 18px;border:1px dashed var(--gold);background:var(--gold-soft);border-radius:12px;';
    bar.innerHTML =
      '<span style="font-family:Nunito;font-size:13.5px;color:var(--ink-2);"><i class="fa fa-shield" style="color:var(--gold-deep)"></i> <strong>Admin mode</strong> — add roles below. Drafts are saved in this browser; use “Copy code” to publish for everyone.</span>' +
      '<button type="button" id="ebAddBtn" class="eb-btn eb-btn--primary"><i class="fa fa-plus"></i> Add opening</button>';
    wrap.parentNode.insertBefore(bar, wrap);

    // add modal
    addModal = document.createElement('div');
    addModal.className = 'eb-modal';
    addModal.innerHTML =
      '<div class="eb-modal__overlay" data-close></div>' +
      '<div class="eb-modal__dialog">' +
        '<button class="eb-modal__close" data-close aria-label="Close"><i class="fa fa-times"></i></button>' +
        '<h3>Add an opening</h3><div class="eb-modal__role">Fill what you have — only the title is required.</div>' +
        '<form id="ebAddForm" novalidate>' +
          '<input class="eb-input" name="title" placeholder="Job title *" required>' +
          '<div class="row2"><input class="eb-input" name="dept" placeholder="Department (e.g. Data Operations)">' +
          '<input class="eb-input" name="type" placeholder="Type (e.g. Full-time)"></div>' +
          '<div class="row2"><input class="eb-input" name="location" placeholder="Location (e.g. Remote)">' +
          '<input class="eb-input" name="tags" placeholder="Tags, comma-separated"></div>' +
          '<input class="eb-input" name="detail" placeholder="One-line description">' +
          '<input class="eb-input" name="apply" placeholder="Custom apply link (optional — ATS/form URL)">' +
          '<button type="submit" class="eb-btn eb-btn--primary eb-btn--lg" style="width:100%;"><i class="fa fa-plus"></i> Add to page</button>' +
        '</form>' +
        '<div id="ebSnip" style="display:none;margin-top:20px;">' +
          '<p style="font-size:13.5px;color:var(--body);margin-bottom:8px;"><i class="fa fa-check-circle" style="color:#1a9d5b"></i> Added to this page. <strong>To publish for everyone</strong>, copy this and paste it inside <code>window.EB_JOBS = [ … ]</code> in <code>js/careers-data.js</code>:</p>' +
          '<textarea id="ebSnipTxt" readonly style="width:100%;min-height:150px;font-family:monospace;font-size:12.5px;background:var(--bg-alt);border:1px solid var(--border);border-radius:10px;padding:12px;color:var(--ink);"></textarea>' +
          '<button type="button" id="ebSnipCopy" class="eb-btn eb-btn--ghost" style="margin-top:10px;"><i class="fa fa-clipboard"></i> Copy code</button>' +
          '<button type="button" class="eb-btn eb-btn--primary" data-close style="margin-top:10px;margin-left:8px;">Done</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(addModal);

    var addForm = addModal.querySelector('#ebAddForm');
    var snipWrap = addModal.querySelector('#ebSnip');
    var snipTxt = addModal.querySelector('#ebSnipTxt');

    function openAdd() {
      addForm.reset(); addForm.style.display = ''; snipWrap.style.display = 'none';
      addModal.classList.add('open'); document.body.style.overflow = 'hidden';
    }
    document.getElementById('ebAddBtn').addEventListener('click', openAdd);
    addModal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeAdd(); });

    function makeSnippet(j) {
      var L = ['  {', '    title: ' + JSON.stringify(j.title)];
      ['dept', 'type', 'location', 'detail', 'apply'].forEach(function (k) {
        if (j[k]) L.push('    ' + k + ': ' + JSON.stringify(j[k]));
      });
      if (j.tags && j.tags.length) L.push('    tags: ' + JSON.stringify(j.tags));
      L = [L[0]].concat(L.slice(1).join(',\n'));
      return ',\n' + L.join('\n') + '\n  }';
    }

    addForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!addForm.checkValidity()) { addForm.reportValidity(); return; }
      var g = function (n) { return addForm.elements[n].value.trim(); };
      var job = { title: g('title') };
      if (g('dept')) job.dept = g('dept');
      if (g('type')) job.type = g('type');
      if (g('location')) job.location = g('location');
      if (g('detail')) job.detail = g('detail');
      if (g('apply')) job.apply = g('apply');
      var tags = g('tags').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      if (tags.length) job.tags = tags;

      var local = localJobs(); local.unshift(job); saveLocal(local); render();

      snipTxt.value = makeSnippet(job);
      addForm.style.display = 'none';
      snipWrap.style.display = 'block';
    });

    addModal.querySelector('#ebSnipCopy').addEventListener('click', function () {
      snipTxt.select();
      try { document.execCommand('copy'); } catch (e) {}
      if (navigator.clipboard) navigator.clipboard.writeText(snipTxt.value).catch(function () {});
      this.innerHTML = '<i class="fa fa-check"></i> Copied';
      var b = this; setTimeout(function () { b.innerHTML = '<i class="fa fa-clipboard"></i> Copy code'; }, 1600);
    });
  }
})();
