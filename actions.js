// ── Modal HTML inject ──
window._initModals = function() {
  var t = document.getElementById('transferModalOverlay');
  var c = document.getElementById('closeModalOverlay');
  if (t) t.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:360px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.2)">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">'
    + '<div style="width:36px;height:36px;background:#fef3c7;border-radius:50%;display:flex;align-items:center;justify-content:center"><i class="fas fa-arrows-rotate" style="color:#f59e0b"></i></div>'
    + '<div style="font-size:15px;font-weight:700;color:#1e293b">অন্য Admin-এ Transfer</div></div>'
    + '<div style="font-size:12px;color:#64748b;margin-bottom:12px">ক্লায়েন্টকে জানানো হবে যে অন্য একজন Admin সাহায্য করবেন।</div>'
    + '<textarea id="transferReasonInput" placeholder="কারণ লিখুন..." rows="3" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;resize:none;outline:none;color:#1e293b"></textarea>'
    + '<div style="display:flex;gap:8px;margin-top:14px">'
    + '<button onclick="closeTransferModal()" style="flex:1;padding:10px;border:1.5px solid #e2e8f0;background:#fff;border-radius:8px;font-size:13px;font-weight:600;color:#64748b;cursor:pointer">বাতিল</button>'
    + '<button onclick="confirmTransfer()" style="flex:1;padding:10px;background:#f59e0b;border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer">Transfer করুন</button>'
    + '</div></div>';
  if (c) c.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:360px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.2)">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">'
    + '<div style="width:36px;height:36px;background:#fef2f2;border-radius:50%;display:flex;align-items:center;justify-content:center"><i class="fas fa-circle-xmark" style="color:#dc2626"></i></div>'
    + '<div style="font-size:15px;font-weight:700;color:#1e293b">আবেদন Close করুন</div></div>'
    + '<div style="font-size:12px;color:#64748b;margin-bottom:12px">ক্লায়েন্টকে জানানো হবে এবং tracking code বন্ধ হয়ে যাবে।</div>'
    + '<textarea id="closeReasonInput" placeholder="কারণ লিখুন (ঐচ্ছিক)..." rows="3" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;resize:none;outline:none;color:#1e293b"></textarea>'
    + '<div style="display:flex;gap:8px;margin-top:14px">'
    + '<button onclick="closeCloseModal()" style="flex:1;padding:10px;border:1.5px solid #e2e8f0;background:#fff;border-radius:8px;font-size:13px;font-weight:600;color:#64748b;cursor:pointer">বাতিল</button>'
    + '<button onclick="confirmClose()" style="flex:1;padding:10px;background:#dc2626;border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer">Close করুন</button>'
    + '</div></div>';
}
document.addEventListener('DOMContentLoaded', window._initModals);

window._getEl = function(id) { return document.getElementById(id); }

// ── Three-dot menu ──
window.openChatActionMenu = function(e) {
  e.stopPropagation();
  var menu = _getEl('chatActionMenu');
  if (!menu) return;
  var isOpen = menu.style.display === 'flex';
  menu.style.display = isOpen ? 'none' : 'flex';
  menu.style.flexDirection = 'column';
  if (!isOpen) {
    setTimeout(function() {
      document.addEventListener('click', function h(ev) {
        if (!menu.contains(ev.target)) { menu.style.display = 'none'; document.removeEventListener('click', h); }
      });
    }, 0);
  }
}

// ── Transfer ──
window.openTransferModal = function() {
  var menu = _getEl('chatActionMenu');
  if (menu) menu.style.display = 'none';
  _initModals();
  var o = _getEl('transferModalOverlay');
  if (o) o.style.display = 'flex';
}
window.closeTransferModal = function() {
  var o = _getEl('transferModalOverlay');
  if (o) o.style.display = 'none';
}
window.confirmTransfer = async function() {
  var appId = window._activeChatAppId;
  if (!appId) return;
  var inp = _getEl('transferReasonInput');
  var reason = inp ? inp.value.trim() : '';
  if (!reason) { if (inp) { inp.style.borderColor = '#f59e0b'; inp.focus(); } return; }
  var btn = document.querySelector('#transferModalOverlay button:last-child');
  if (btn) { btn.disabled = true; btn.textContent = 'পাঠানো হচ্ছে...'; }
  try {
    var db = window._db, mods = window._fbModules;
    var html = '<div style="padding:0;overflow:hidden;border-radius:12px;max-width:290px;box-shadow:0 2px 12px rgba(245,158,11,.15)">'
      + '<div style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:10px 14px;display:flex;align-items:center;gap:8px">'
      + '<i class="fas fa-arrows-rotate"></i><span style="font-weight:700;font-size:13px">আবেদন স্থানান্তর</span></div>'
      + '<div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:12px 14px;font-size:13px;color:#1e293b">'
      + '<div style="margin-bottom:8px">দুঃখিত, <strong>' + reason + '</strong>।</div>'
      + '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:9px 11px;font-size:12px;color:#92400e">'
      + 'আমাদের অন্য একজন Admin শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</div></div></div>';
    await mods.addDoc(mods.collection(db, 'applications', appId, 'messages'), {
      from: 'admin', isHtml: true, text: html,
      time: new Date().toLocaleTimeString('bn-BD', {hour:'2-digit',minute:'2-digit'}),
      timeStr: new Date().toLocaleTimeString('bn-BD', {hour:'2-digit',minute:'2-digit'}),
      createdAt: mods.serverTimestamp()
    });
    await mods.updateDoc(mods.doc(db, 'applications', appId), { acceptedBy: null, status: -1 });
    closeTransferModal();
    if (typeof chatBackToList === 'function') chatBackToList();
    if (typeof showToast === 'function') showToast('Transfer সম্পন্ন', 'আবেদনটি pool-এ ফিরে গেছে।', 'success');
  } catch(e) {
    console.error('confirmTransfer error:', e);
    if (btn) { btn.disabled = false; btn.textContent = 'Transfer করুন'; }
    if (typeof showToast === 'function') showToast('সমস্যা হয়েছে', e.message || 'আবার চেষ্টা করুন।', 'error');
  }
}

// ── Close ──
window.openCloseModal = function() {
  var menu = _getEl('chatActionMenu');
  if (menu) menu.style.display = 'none';
  _initModals();
  var o = _getEl('closeModalOverlay');
  if (o) o.style.display = 'flex';
}
window.closeCloseModal = function() {
  var o = _getEl('closeModalOverlay');
  if (o) o.style.display = 'none';
}
window.confirmClose = async function() {
  var appId = window._activeChatAppId;
  if (!appId) return;
  var inp = _getEl('closeReasonInput');
  var reason = inp ? inp.value.trim() : '';
  var btn = document.querySelector('#closeModalOverlay button:last-child');
  if (btn) { btn.disabled = true; btn.textContent = 'বন্ধ হচ্ছে...'; }
  try {
    var db = window._db, mods = window._fbModules;
    var reasonHtml = reason
      ? '<div style="margin-top:6px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:9px 11px;font-size:12px;color:#991b1b"><strong>কারণ:</strong> ' + reason + '</div>'
      : '';
    var html = '<div style="padding:0;overflow:hidden;border-radius:12px;max-width:290px;box-shadow:0 2px 12px rgba(220,38,38,.15)">'
      + '<div style="background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;padding:10px 14px;display:flex;align-items:center;gap:8px">'
      + '<i class="fas fa-circle-xmark"></i><span style="font-weight:700;font-size:13px">আবেদন বন্ধ</span></div>'
      + '<div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:12px 14px;font-size:13px;color:#1e293b">'
      + '<div>দুঃখিত, আপনার আবেদনটি বন্ধ করা হয়েছে।</div>' + reasonHtml
      + '<div style="margin-top:8px;font-size:11px;color:#94a3b8">এই ট্র্যাকিং কোডটি আর ব্যবহার করা যাবে না।</div></div></div>';
    await mods.addDoc(mods.collection(db, 'applications', appId, 'messages'), {
      from: 'admin', isHtml: true, text: html,
      time: new Date().toLocaleTimeString('bn-BD', {hour:'2-digit',minute:'2-digit'}),
      timeStr: new Date().toLocaleTimeString('bn-BD', {hour:'2-digit',minute:'2-digit'}),
      createdAt: mods.serverTimestamp()
    });
    setTimeout(async function() {
      try {
        await mods.updateDoc(mods.doc(db, 'applications', appId), {
          trackingDisabled: true, deliveryCompleted: true,
          deliveryCompletedAt: new Date().toISOString(),
          status: 3, closedByAdmin: true, closeReason: reason || ''
        });
        if (typeof window.fbDeleteChatData === 'function') await window.fbDeleteChatData = function(appId);
      } catch(e2) { console.error('close cleanup error:', e2); }
    }, 3000);
    closeCloseModal();
    if (typeof chatBackToList === 'function') chatBackToList();
    if (typeof showToast === 'function') showToast('আবেদন বন্ধ', 'ক্লায়েন্টকে জানানো হয়েছে।', 'success');
  } catch(e) {
    console.error('confirmClose error:', e);
    if (btn) { btn.disabled = false; btn.textContent = 'Close করুন'; }
    if (typeof showToast === 'function') showToast('সমস্যা হয়েছে', e.message || 'আবার চেষ্টা করুন।', 'error');
  }
    }
