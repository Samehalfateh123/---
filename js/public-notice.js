window.addEventListener('DOMContentLoaded', loadPublicNotice);

function loadPublicNotice() {
    const urlParams = new URLSearchParams(window.location.search);
    const noticeId = urlParams.get('id');

    let notice;
    if (noticeId) {
        const notices = JSON.parse(localStorage.getItem('notices_data')) || [];
        notice = notices.find(n => n.id === noticeId);
    } else {
        notice = JSON.parse(localStorage.getItem('currentNotice'));
    }

    if (!notice) {
        document.getElementById('noticeContent').innerHTML = '<p>لم يتم العثور على التعميم</p>';
        return;
    }

    displayNotice(notice);
    window.currentNotice = notice;
}

function displayNotice(notice) {
    document.getElementById('noticeNoView').textContent = notice.noticeNo;
    document.getElementById('noticeDateView').textContent = new Date(notice.noticeDate).toLocaleDateString('ar-SA');
    document.getElementById('noticeTitle').textContent = notice.title;
    document.getElementById('noticeCompany').textContent = notice.company;
    
    // عرض المحتوى مع التنسيق الربطي
    const contentDiv = document.getElementById('noticeContentView');
    contentDiv.innerHTML = notice.contentHTML || notice.content;
    
    // إضافة event listeners للصور
    contentDiv.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src);
        });
    });

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
}

function openImageModal(src) {
    document.getElementById('modalImage').src = src;
    document.getElementById('imageModal').style.display = 'flex';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

const downloadBtn = document.getElementById('downloadPdf');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const element = document.querySelector('.notice');
        html2pdf().set({
            margin: 10,
            filename: `notice_${window.currentNotice.noticeNo}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        }).from(element).save();
    });
}

const printBtn = document.getElementById('printBtn');
if (printBtn) {
    printBtn.addEventListener('click', () => {
        window.print();
    });
}

const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        const currentUrl = window.location.href;
        const shareLink = currentUrl.includes('?') ? currentUrl : 
                         `${window.location.origin}${window.location.pathname}?id=${window.currentNotice.id}`;
        
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
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function copyToClipboard() {
    const input = document.getElementById('shareLink');
    input.select();
    document.execCommand('copy');
    alert('✅ تم نسخ الرابط بنجاح');
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('shareModal');
    if (e.target === modal) {
        closeShareModal();
    }
    
    const imageModal = document.getElementById('imageModal');
    if (e.target === imageModal) {
        closeImageModal();
    }
});