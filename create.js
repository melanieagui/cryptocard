(function () {
  var ecoClass = { ETH: 'eth', SOL: 'sol', BTC: 'btc', AVAX: 'avax', ARB: 'arb' };

  function computeTrustScore(data) {
    var score = 0;
    if (data.telegram) score += 10;
    if (data.linkedin) score += 10;
    if (data.twitter) score += 10;
    if (data.yearsInCrypto) score += Math.min(30, data.yearsInCrypto * 5);
    var projectCount = (data.projects && data.projects.length) ? data.projects.length : 0;
    score += Math.min(30, projectCount * 10);
    if (data.wallet && data.wallet.length > 10) score += 20;
    return Math.min(100, score);
  }

  function getTrustLevelLabel(score) {
    if (score >= 71) return 'Verified OG';
    if (score >= 31) return 'Community Trusted';
    return 'New to the Space';
  }

  function getTrustLevelClass(score) {
    if (score >= 71) return 'trust-level-og';
    if (score >= 31) return 'trust-level-community';
    return 'trust-level-new';
  }

  function getFormData() {
    var photo = document.getElementById('photo').value.trim();
    var name = document.getElementById('name').value.trim();
    var bio = document.getElementById('bio').value.trim();
    var years = document.getElementById('years').value.trim();
    var wallet = document.getElementById('wallet').value.trim();
    var ecosystems = [];
    document.querySelectorAll('input[name="eco"]:checked').forEach(function (c) {
      ecosystems.push(c.value);
    });
    var projects = [];
    document.querySelectorAll('.project-block').forEach(function (block) {
      var nameEl = block.querySelector('.project-name-input');
      var roleEl = block.querySelector('.project-role-input');
      var descEl = block.querySelector('.project-desc-input');
      if (nameEl && nameEl.value.trim()) {
        projects.push({
          name: nameEl.value.trim(),
          role: roleEl ? roleEl.value.trim() : '',
          description: descEl ? descEl.value.trim() : ''
        });
      }
    });
    return {
      photo: photo || null,
      name: name || 'Anonymous',
      bio: bio || '',
      yearsInCrypto: years ? parseInt(years, 10) : null,
      wallet: wallet || '',
      ecosystems: ecosystems,
      projects: projects,
      telegram: document.getElementById('telegram').value.trim() || null,
      linkedin: document.getElementById('linkedin').value.trim() || null,
      twitter: document.getElementById('twitter').value.trim() || null
    };
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }
  function escapeAttr(s) {
    if (s == null) return '';
    return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function shortWallet(addr) {
    if (!addr || addr.length < 12) return addr || '—';
    return addr.slice(0, 6) + '…' + addr.slice(-4);
  }

  function renderPreview(data) {
    var score = computeTrustScore(data);
    var levelLabel = getTrustLevelLabel(score);
    var levelClass = getTrustLevelClass(score);

    var avatarSrc = data.photo || ('https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(data.name || ''));
    var ecosystemsHtml = (data.ecosystems || []).map(function (e) {
      var c = ecoClass[e] || '';
      return '<span class="eco-badge ' + c + '">' + escapeHtml(e) + '</span>';
    }).join('');

    var projectsHtml = (data.projects || []).slice(0, 3).map(function (p) {
      return (
        '<div class="project-item">' +
        '<div class="project-name">' + escapeHtml(p.name) + '</div>' +
        (p.role ? '<div class="project-role">' + escapeHtml(p.role) + '</div>' : '') +
        (p.description ? '<div class="project-desc">' + escapeHtml(p.description) + '</div>' : '') +
        '</div>'
      );
    }).join('');

    return (
      '<div class="profile-card-preview" style="max-width: 100%;">' +
        '<img src="' + escapeAttr(avatarSrc) + '" alt="" class="avatar" onerror="this.src=\'https://api.dicebear.com/7.x/identicon/svg?seed=preview\'">' +
        '<span class="trust-level-badge ' + levelClass + '">' + escapeHtml(levelLabel) + '</span>' +
        '<div class="name">' + escapeHtml(data.name || 'Your name') + '</div>' +
        '<div class="bio">' + (data.bio ? escapeHtml(data.bio) : 'Your one-liner bio') + '</div>' +
        (data.yearsInCrypto ? '<span class="badge-years">' + escapeHtml(String(data.yearsInCrypto)) + ' years in crypto</span>' : '') +
        '<div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">Trust score: ' + score + '/100</div>' +
        '<div class="ecosystems">' + (ecosystemsHtml || '<span class="text-muted" style="font-size: 0.85rem;">Select ecosystems</span>') + '</div>' +
        (projectsHtml ? '<div style="margin-top: 16px; text-align: left;">' + projectsHtml + '</div>' : '') +
      '</div>'
    );
  }

  function updatePreview() {
    var data = getFormData();
    document.getElementById('card-preview').innerHTML = renderPreview(data);
  }

  function addProjectBlock() {
    var list = document.getElementById('projects-list');
    var block = document.createElement('div');
    block.className = 'project-block glass-card';
    block.style.cssText = 'padding: 16px; margin-bottom: 12px; border-radius: var(--radius-sm);';
    block.innerHTML =
      '<div class="form-group" style="margin-bottom: 12px;"><input type="text" class="project-name-input" placeholder="Project name" /></div>' +
      '<div class="form-group" style="margin-bottom: 12px;"><input type="text" class="project-role-input" placeholder="Your role" /></div>' +
      '<div class="form-group" style="margin-bottom: 0;"><textarea class="project-desc-input" placeholder="Short description" rows="2"></textarea></div>' +
      '<button type="button" class="btn-ghost btn-icon" style="margin-top: 8px;" data-remove title="Remove">✕</button>';
    list.appendChild(block);

    block.querySelector('[data-remove]').addEventListener('click', function () {
      block.remove();
      updatePreview();
    });
    block.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', updatePreview);
    });
    updatePreview();
  }

  document.getElementById('add-project').addEventListener('click', addProjectBlock);

  document.getElementById('profile-form').querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
  });
  document.querySelectorAll('input[name="eco"]').forEach(function (el) {
    el.addEventListener('change', updatePreview);
  });

  document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var data = getFormData();
    try {
      localStorage.setItem('cryptocard_profile', JSON.stringify(data));
    } catch (err) {}
    window.location.href = 'profile.html';
  });

  updatePreview();
})();
