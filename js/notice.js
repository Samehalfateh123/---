window.addEventListener('DOMContentLoaded', loadNotice);

function param(name) { const url = new URL(window.location.href); return url.searchParams.get(name); }

function decodeFromLink(encoded) {
    try { const json = decodeURIComponent(escape(LZString.decompressFromBase64(encoded))); return JSON.parse(json); }
    catch (e) {
        try { return JSON.parse(decodeURIComponent(escape(atob(encoded)))); } catch (e2) { try { return JSON.parse(atob(encoded)); } catch (e3) { return null; } }
    }
}

function loadNotice() {
    let notice = null;
    const d = param('d');
    if (d) { notice = decodeFromLink(decodeURIComponent(d)); }

    if (!notice) {
        notice = JSON.parse(localStorage.getItem('currentNotice')) || JSON.parse(localStorage.getItem('notices_data_v2'))?.[0] || null;
    }

    if (!notice) { console.warn('لا توجد بيانات'); document.getElementById('noticeContentView').innerHTML = '<p>لم يتم العثور على التعميم</p>'; return; }

    // prevent back navigation affecting admin: replace history
    try { history.replaceState(null, '', window.location.href); } catch (e) {}

    document.getElementById('noticeNoView').textContent = notice.noticeNo || '---';
    if (notice.noticeDate) document.getElementById('noticeDateView').textContent = new Date(notice.noticeDate).toLocaleDateString('ar-SA');
    document.getElementById('noticeTitle').textContent = notice.title || '';
    document.getElementById('noticeCompany').textContent = notice.company || '';
    document.getElementById('noticeContentView').innerHTML = notice.content || '';
    document.getElementById('branchView').textContent = notice.branch || '';
    document.getElementById('supervisorView').textContent = notice.supervisor || '';
    document.getElementById('managerView').textContent = notice.manager || '';
    document.getElementById('phoneView').textContent = notice.phone || '';
    document.getElementById('weekdayView').textContent = notice.weekday || '';
    document.getElementById('weekendView').textContent = notice.weekend || '';
    document.getElementById('approvedByView').textContent = notice.approvedBy || '';

    if (notice.logo) document.getElementById('companyLogo').src = notice.logo;
    if (notice.themeColor) document.documentElement.style.setProperty('--primary', notice.themeColor);

    if (notice.qrCode) {
        QRCode.toDataURL(notice.qrCode, { errorCorrectionLevel: 'H', type: 'image/jpeg', quality: 0.95, margin: 1, width: 150 }, (err, url) => { if (!err) document.getElementById('qrCodeView').src = url; });
    }

    // show items (قوالب مربعة)
    const itemsArea = document.getElementById('itemsArea');
    itemsArea.innerHTML = '';
    if (Array.isArray(notice.items)) {
        notice.items.forEach(it => {
            const card = document.createElement('div');
            card.className = 'item-view';
            card.textContent = it.title;
            card.style.background = it.bg || '#fff';
            card.style.color = it.color || '#000';
            if (it.fontSize) card.style.fontSize = it.fontSize;
            if (it.width) card.style.width = it.width;
            if (it.height) card.style.height = it.height;
            if (it.bold) card.style.fontWeight = '700';

            // icon
            if (it.icon) {
                const span = document.createElement('div');
                span.style.fontSize = '22px';
                span.style.marginBottom = '6px';
                if (it.icon === 'open') span.textContent = '🏁';
                else if (it.icon === 'clock') span.textContent = '⏰';
                else if (it.icon === 'info') span.textContent = 'ℹ️';
                else if (it.icon === 'warning') span.textContent = '⚠️';
                card.prepend(span);
            }

            // attachment
            if (it.attachment) {
                if (it.attachment.startsWith('data:application/pdf')) {
                    const a = document.createElement('a');
                    a.href = it.attachment;
                    a.textContent = 'عرض مرفق PDF';
                    a.target = '_blank';
                    a.className = 'attachment-link';
                    card.appendChild(a);
                } else if (it.attachment.startsWith('data:image')) {
                    const img = document.createElement('img');
                    img.src = it.attachment;
                    img.alt = it.title || '';
                    img.style.maxWidth = '100%';
                    img.style.borderRadius = '6px';
                    img.addEventListener('click', () => openLightbox(it.attachment));
                    card.appendChild(img);
                }
            }

            itemsArea.appendChild(card);
        });
    }

    // show excel if exists
    if (notice.excelHtml) {
        const div = document.createElement('div');
        div.innerHTML = notice.excelHtml;
        div.className = 'excel-area';
        itemsArea.appendChild(div);
    }

    // make images clickable in the main content
    document.querySelectorAll('#noticeContentView img').forEach(img => img.addEventListener('click', (e) => openLightbox(e.target.src)));

    window.currentNotice = notice;
}

function openLightbox(src) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `<div class="lightbox-close" onclick="this.parentNode.remove()">×</div><img src="${src}" alt="عرض الصورة">`;
    document.body.appendChild(overlay);
}

function closeShareModal() { document.getElementById('shareModal').style.display = 'none'; }

function copyToClipboard() { const input = document.getElementById('shareLink'); input.select(); document.execCommand('copy'); alert('✅ تم نسخ الرابط'); }

document.getElementById('downloadPdf').addEventListener('click', () => {
    const element = document.querySelector('.notice');
    html2pdf().set({ margin: 10, filename: `notice_${window.currentNotice?.noticeNo || 'export'}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' } }).from(element).save();
});

document.getElementById('printBtn').addEventListener('click', () => { window.print(); });

document.getElementById('shareBtn').addEventListener('click', () => {
    const shareLink = window.location.href;
    document.getElementById('shareLink').value = shareLink;
    QRCode.toDataURL(shareLink, { errorCorrectionLevel: 'H', type: 'image/jpeg', quality: 0.95, margin: 1, width: 150 }, (err, url) => { if (!err) document.getElementById('shareQR').src = url; });
    document.getElementById('shareModal').style.display = 'flex';
});

window.addEventListener('click', (e) => { const modal = document.getElementById('shareModal'); if (e.target === modal) closeShareModal(); });
