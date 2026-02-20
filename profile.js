(function () {
  var ENDORSEMENT_OPTIONS = ['Legit Builder', 'Great Collaborator', 'Trusted Dev', 'Community Leader', 'Strong Marketer'];

  var EXAMPLES = {
    alex: {
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      name: 'Alex Chen',
      bio: 'DeFi builder & governance nerd. Long ETH. Building in public.',
      yearsInCrypto: 5,
      wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      ecosystems: ['ETH', 'SOL', 'ARB'],
      projects: [
        { name: 'Governance DAO', role: 'Core Contributor', description: 'On-chain governance and treasury management.' },
        { name: 'Liquid Staking Protocol', role: 'Smart Contract Dev', description: 'Staking derivatives and yield strategies.' }
      ],
      telegram: 'https://t.me/alexchen',
      linkedin: 'https://linkedin.com/in/alexchen',
      twitter: 'https://twitter.com/alexchen'
    },
    sam: {
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam',
      name: 'Sam Rivera',
      bio: 'NFT artist & collector. Building the metaverse one pixel at a time.',
      yearsInCrypto: 3,
      wallet: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
      ecosystems: ['ETH', 'SOL'],
      projects: [
        { name: 'Pixel Legends NFT', role: 'Artist & Founder', description: 'Generative art collection on Ethereum.' },
        { name: 'Metaverse Studio', role: 'Creative Lead', description: '3D assets and virtual experiences.' }
      ],
      telegram: 'https://t.me/samrivera',
      linkedin: 'https://linkedin.com/in/samrivera',
      twitter: 'https://twitter.com/samrivera'
    },
    jordan: {
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
      name: 'Jordan Kim',
      bio: 'Infrastructure & L2s. Here for the long run.',
      yearsInCrypto: 7,
      wallet: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      ecosystems: ['ETH', 'BTC', 'AVAX'],
      projects: [
        { name: 'L2 Bridge Protocol', role: 'Protocol Engineer', description: 'Cross-chain messaging and liquidity.' },
        { name: 'Node Infrastructure', role: 'DevOps', description: 'Validator and RPC infrastructure.' }
      ],
      telegram: 'https://t.me/jordankim',
      linkedin: 'https://linkedin.com/in/jordankim',
      twitter: 'https://twitter.com/jordankim'
    }
  };

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

  function getTrustScoreLabel(score) {
    if (score >= 71) return 'Verified';
    if (score >= 31) return 'Trusted';
    return 'New';
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

  function getTrustRingClass(score) {
    if (score >= 71) return 'trust-verified';
    if (score >= 31) return 'trust-trusted';
    return 'trust-new';
  }

  function getEndorsements(profileId) {
    try {
      var raw = localStorage.getItem('cryptocard_endorsements_' + profileId);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function setEndorsements(profileId, counts) {
    try {
      localStorage.setItem('cryptocard_endorsements_' + profileId, JSON.stringify(counts));
    } catch (e) {}
  }

  function shortWallet(addr) {
    if (!addr || addr.length < 12) return addr || '—';
    return addr.slice(0, 6) + '…' + addr.slice(-4);
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s == null ? '' : s;
    return div.innerHTML;
  }
  function escapeAttr(s) {
    if (s == null) return '';
    return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function iconCheck() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  }
  function iconTelegram() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.69 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>';
  }
  function iconLinkedIn() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  }
  function iconTwitter() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
  }

  function renderProfile(data, profileId) {
    var score = computeTrustScore(data);
    var scoreLabel = getTrustScoreLabel(score);
    var levelLabel = getTrustLevelLabel(score);
    var levelClass = getTrustLevelClass(score);
    var ringClass = getTrustRingClass(score);
    var endorsements = getEndorsements(profileId || 'saved');

    var projectsHtml = (data.projects || []).map(function (p) {
      return (
        '<div class="project-item">' +
        '<div class="project-name">' + escapeHtml(p.name) + '</div>' +
        '<div class="project-role">' + escapeHtml(p.role) + '</div>' +
        '<div class="project-desc">' + escapeHtml(p.description || '') + '</div>' +
        '</div>'
      );
    }).join('');

    var ecosystemsHtml = (data.ecosystems || []).map(function (e) {
      var c = ecoClass[e] || '';
      return '<span class="eco-badge ' + c + '">' + escapeHtml(e) + '</span>';
    }).join('');

    var trustScoreHtml =
      '<div class="trust-score-wrap">' +
        '<div class="trust-score-ring ' + ringClass + '" aria-label="Trust score ' + score + '">' + score + '</div>' +
        '<span class="trust-score-label">' + escapeHtml(scoreLabel) + '</span>' +
      '</div>';
    var trustLevelHtml = '<span class="trust-level-badge ' + levelClass + '">' + escapeHtml(levelLabel) + '</span>';

    var walletRowContent = (data.wallet && data.wallet.length > 10)
      ? '<span class="wallet-address mono" data-full="' + escapeAttr(data.wallet) + '">' + escapeHtml(shortWallet(data.wallet)) + '</span>' +
        '<span class="verified-pill">' + iconCheck() + ' Wallet Verified</span>' +
        '<button type="button" class="btn-copy" aria-label="Copy address">Copy</button>'
      : '<span class="wallet-address mono" data-full="">—</span>' +
        '<button type="button" class="btn-copy" aria-label="Copy address" disabled>Copy</button>';

    var walletDisclaimerHtml = (data.wallet && data.wallet.length > 10)
      ? '<div class="wallet-disclaimer wallet-ok">No community reports found</div>'
      : '<div class="wallet-disclaimer wallet-empty">Wallet not provided — add one on your card for trust signals.</div>';

    var socialParts = [];
    if (data.telegram) socialParts.push('<span class="social-link-wrap"><a href="' + escapeAttr(data.telegram) + '" class="social-link" target="_blank" rel="noopener">' + iconTelegram() + ' Telegram</a><span class="verified-pill">' + iconCheck() + ' Telegram Verified</span></span>');
    if (data.linkedin) socialParts.push('<span class="social-link-wrap"><a href="' + escapeAttr(data.linkedin) + '" class="social-link" target="_blank" rel="noopener">' + iconLinkedIn() + ' LinkedIn</a><span class="verified-pill">' + iconCheck() + ' LinkedIn Verified</span></span>');
    if (data.twitter) socialParts.push('<span class="social-link-wrap"><a href="' + escapeAttr(data.twitter) + '" class="social-link" target="_blank" rel="noopener">' + iconTwitter() + ' Twitter</a><span class="verified-pill">' + iconCheck() + ' Twitter Verified</span></span>');
    var socialHtml = socialParts.join('');

    var endorsementBadgesHtml = ENDORSEMENT_OPTIONS.filter(function (key) {
      return endorsements[key] && endorsements[key] > 0;
    }).map(function (key) {
      return '<span class="endorsement-badge">🔥 ' + escapeHtml(key) + ' <span class="count">x' + endorsements[key] + '</span></span>';
    }).join('');

    var endorsementOptionsHtml = ENDORSEMENT_OPTIONS.map(function (opt) {
      return '<option value="' + escapeAttr(opt) + '">' + escapeHtml(opt) + '</option>';
    }).join('');

    var endorsementsSectionHtml =
      '<div class="profile-section">' +
        '<h3>Endorsements</h3>' +
        '<div class="endorsement-badges" id="endorsement-badges">' + endorsementBadgesHtml + '</div>' +
        '<div class="endorsement-actions">' +
          '<select id="endorse-select" aria-label="Choose endorsement type">' +
            '<option value="">Endorse for…</option>' + endorsementOptionsHtml +
          '</select>' +
          '<button type="button" class="btn-endorse" id="endorse-btn">Endorse</button>' +
        '</div>' +
        '<input type="hidden" id="profile-id" value="' + escapeAttr(profileId || 'saved') + '">' +
      '</div>';

    return (
      '<div class="glass-card" style="max-width: 640px; margin: 0 auto 24px;">' +
        '<div class="profile-header">' +
          '<img src="' + escapeAttr(data.photo || '') + '" alt="" class="avatar" onerror="this.src=\'https://api.dicebear.com/7.x/identicon/svg?seed=' + escapeAttr(data.name || '') + '\'">' +
          trustScoreHtml +
          trustLevelHtml +
          '<h1 class="name">' + escapeHtml(data.name || 'Anonymous') + '</h1>' +
          '<p class="bio">' + escapeHtml(data.bio || '') + '</p>' +
          (data.yearsInCrypto ? '<span class="badge-years">' + escapeHtml(String(data.yearsInCrypto)) + ' years in crypto</span>' : '') +
        '</div>' +
        '<div class="profile-section">' +
          '<h3>Wallet</h3>' +
          '<div class="wallet-row">' + walletRowContent + '</div>' +
          walletDisclaimerHtml +
        '</div>' +
        (ecosystemsHtml ? '<div class="profile-section"><h3>Ecosystems</h3><div class="ecosystems">' + ecosystemsHtml + '</div></div>' : '') +
        (projectsHtml ? '<div class="profile-section"><h3>Projects</h3>' + projectsHtml + '</div>' : '') +
        (socialHtml ? '<div class="profile-section"><h3>Social</h3><div class="social-links">' + socialHtml + '</div></div>' : '') +
        endorsementsSectionHtml +
      '</div>'
    );
  }

  function showToast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg || 'Copied!';
    el.classList.add('show');
    setTimeout(function () { el.classList.remove('show'); }, 2000);
  }

  function initCopy() {
    document.getElementById('profile-content').addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-copy');
      if (!btn || btn.disabled) return;
      var row = btn.closest('.wallet-row');
      var full = row && row.querySelector('.wallet-address');
      var addr = full && full.getAttribute('data-full');
      if (!addr) return;
      navigator.clipboard.writeText(addr).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        showToast('Address copied!');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  function renderEndorsementBadges(profileId) {
    var endorsements = getEndorsements(profileId);
    var html = ENDORSEMENT_OPTIONS.filter(function (key) {
      return endorsements[key] && endorsements[key] > 0;
    }).map(function (key) {
      return '<span class="endorsement-badge">🔥 ' + escapeHtml(key) + ' <span class="count">x' + endorsements[key] + '</span></span>';
    }).join('');
    var el = document.getElementById('endorsement-badges');
    if (el) el.innerHTML = html || '';
  }

  function initEndorsements() {
    var btn = document.getElementById('endorse-btn');
    var select = document.getElementById('endorse-select');
    var profileIdEl = document.getElementById('profile-id');
    if (!btn || !select || !profileIdEl) return;
    var profileId = profileIdEl.value || 'saved';
    btn.addEventListener('click', function () {
      var key = select.value;
      if (!key) return;
      var counts = getEndorsements(profileId);
      counts[key] = (counts[key] || 0) + 1;
      setEndorsements(profileId, counts);
      renderEndorsementBadges(profileId);
      select.value = '';
      showToast('Endorsement added!');
    });
  }

  function loadProfile() {
    var params = new URLSearchParams(window.location.search);
    var user = params.get('user');
    var data = null;
    var profileId = user || 'saved';

    if (user && EXAMPLES[user]) {
      data = EXAMPLES[user];
    } else {
      try {
        var saved = localStorage.getItem('cryptocard_profile');
        if (saved) data = JSON.parse(saved);
      } catch (err) {}
    }

    if (!data) {
      data = EXAMPLES.alex;
      profileId = 'alex';
    }

    document.getElementById('profile-content').innerHTML = renderProfile(data, profileId);
    initCopy();
    initEndorsements();
  }

  loadProfile();
})();
