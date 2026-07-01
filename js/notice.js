window.addEventListener('DOMContentLoaded', loadNotice);

function param(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function decodeFromLink(encoded) {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {
        try { return JSON.parse(atob(encoded)); } catch (e2) { return null; }
    }
}

function loadNotice() {
    let notice = null;
    const d = param('d');
    if (d) {
        notice = decodeFromLink(d);
    }

    if (!notice) {
        notice = JSON.parse(localStorage.getItem('currentNotice')) || JSON.parse(localStorage.getItem('notices_data_v2'))?.[0] || null;
    }

    if (!notice) {
        console.warn('لا توجد بيانات');
        document.getElementById('noticeContentView').innerHTML = '<p>لم يتم العثور على التعميم</p>';
        return;
    }

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
        QRCode.toDataURL(notice.qrCode, {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 0.95,
            margin: 1,
            width: 150
        }, (err, url) => {
            if (!err) document.getElementById('qrCodeView').src = url;
        });
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

    window.currentNotice = notice;
}

document.getElementById('downloadPdf').addEventListener('click', () => {
    const element = document.querySelector('.notice');
    html2pdf().set({
        margin: 10,
        filename: `notice_${window.currentNotice?.noticeNo || 'export'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }).from(element).save();
});

document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

document.getElementById('shareBtn').addEventListener('click', () => {
    const shareLink = window.location.href;
    document.getElementById('shareLink').value = shareLink;

    QRCode.toDataURL(shareLink, {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.95,
        margin: 1,
        width: 150
    }, (err, url) => {
        if (!err) document.getElementById('shareQR').src = url;
    });

    document.getElementById('shareModal').style.display = 'flex';
});

function closeShareModal() { document.getElementById('shareModal').style.display = 'none'; }

function copyToClipboard() {
    const input = document.getElementById('shareLink');
    input.select();
    document.execCommand('copy');
    alert('✅ تم نسخ الرابط');
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('shareModal');
    if (e.target === modal) closeShareModal();
});
