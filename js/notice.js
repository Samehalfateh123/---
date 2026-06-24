window.addEventListener('DOMContentLoaded', loadNotice);

function loadNotice() {
    const notice = JSON.parse(localStorage.getItem('currentNotice'));

    if (!notice) {
        console.warn('لا توجد بيانات');
        return;
    }

    document.getElementById('noticeNoView').textContent = notice.noticeNo;
    document.getElementById('noticeDateView').textContent = new Date(notice.noticeDate).toLocaleDateString('ar-SA');
    document.getElementById('noticeTitle').textContent = notice.title;
    document.getElementById('noticeCompany').textContent = notice.company;
    document.getElementById('noticeContentView').innerHTML = notice.content;
    document.getElementById('branchView').textContent = notice.branch;
    document.getElementById('supervisorView').textContent = notice.supervisor;
    document.getElementById('managerView').textContent = notice.manager;
    document.getElementById('phoneView').textContent = notice.phone;
    document.getElementById('weekdayView').textContent = notice.weekday;
    document.getElementById('weekendView').textContent = notice.weekend;
    document.getElementById('approvedByView').textContent = notice.approvedBy;
    document.getElementById('positionView').textContent = notice.position;

    if (notice.logo) {
        document.getElementById('companyLogo').src = notice.logo;
    }
    if (notice.themeColor) {
        document.documentElement.style.setProperty('--primary', notice.themeColor);
    }

    if (notice.qrCode) {
        QRCode.toDataURL(notice.qrCode, {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 0.95,
            margin: 1,
            width: 150
        }, (err, url) => {
            if (!err) {
                document.getElementById('qrCodeView').src = url;
            }
        });
    }

    window.currentNotice = notice;
}

document.getElementById('downloadPdf').addEventListener('click', () => {
    const element = document.querySelector('.notice');
    html2pdf().set({
        margin: 10,
        filename: `notice_${window.currentNotice.noticeNo}.pdf`,
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
        if (!err) {
            document.getElementById('shareQR').src = url;
        }
    });

    document.getElementById('shareModal').style.display = 'flex';
});

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function copyToClipboard() {
    const input = document.getElementById('shareLink');
    input.select();
    document.execCommand('copy');
    alert('✅ تم نسخ الرابط');
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('shareModal');
    if (e.target === modal) {
        closeShareModal();
    }
});