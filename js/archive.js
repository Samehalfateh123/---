window.addEventListener('DOMContentLoaded', loadArchive);

function loadArchive() {
    const notices = JSON.parse(localStorage.getItem('notices_data')) || [];
    displayArchive(notices);
    setupFilters();
    updateStats(notices);
}

function displayArchive(notices) {
    const list = document.getElementById('archiveList');

    if (notices.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>📭 لا توجد تعاميم مؤرشفة حتى الآن</p></div>';
        return;
    }

    list.innerHTML = notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((notice, index) => `
        <div class="archive-card" onclick="openModal('${notice.id}')">
            <div class="card-header">
                <span class="card-number">#${index + 1}</span>
                <span class="card-date">${new Date(notice.noticeDate).toLocaleDateString('ar-SA')}</span>
            </div>
            <div class="card-body">
                <h3>${notice.title}</h3>
                <p class="notice-no">رقم: ${notice.noticeNo}</p>
                <p class="company-info">الشركة: ${notice.company}</p>
                <p class="content-preview">${notice.content.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const companyFilter = document.getElementById('companyFilter');
    const dateFromFilter = document.getElementById('dateFromFilter');
    const dateToFilter = document.getElementById('dateToFilter');
    const resetBtn = document.getElementById('resetFilters');

    if (searchInput) searchInput.addEventListener('input', filterArchive);
    if (companyFilter) companyFilter.addEventListener('change', filterArchive);
    if (dateFromFilter) dateFromFilter.addEventListener('change', filterArchive);
    if (dateToFilter) dateToFilter.addEventListener('change', filterArchive);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
}

function filterArchive() {
    const notices = JSON.parse(localStorage.getItem('notices_data')) || [];
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const company = document.getElementById('companyFilter')?.value || '';
    const dateFrom = document.getElementById('dateFromFilter')?.value || '';
    const dateTo = document.getElementById('dateToFilter')?.value || '';

    const filtered = notices.filter(notice => {
        const matchSearch = notice.noticeNo.includes(searchTerm) ||
                          notice.title.toLowerCase().includes(searchTerm) ||
                          notice.company.toLowerCase().includes(searchTerm);
        
        const matchCompany = !company || notice.company === company;
        
        const noticeDate = new Date(notice.noticeDate);
        const matchDateFrom = !dateFrom || noticeDate >= new Date(dateFrom);
        const matchDateTo = !dateTo || noticeDate <= new Date(dateTo);

        return matchSearch && matchCompany && matchDateFrom && matchDateTo;
    });

    displayArchive(filtered);
}

function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const companyFilter = document.getElementById('companyFilter');
    const dateFromFilter = document.getElementById('dateFromFilter');
    const dateToFilter = document.getElementById('dateToFilter');

    if (searchInput) searchInput.value = '';
    if (companyFilter) companyFilter.value = '';
    if (dateFromFilter) dateFromFilter.value = '';
    if (dateToFilter) dateToFilter.value = '';
    loadArchive();
}

function updateStats(notices) {
    const totalNoticesEl = document.getElementById('totalNotices');
    const totalCompaniesEl = document.getElementById('totalCompanies');
    const latestNoticeEl = document.getElementById('latestNotice');

    if (totalNoticesEl) totalNoticesEl.textContent = notices.length;
    
    if (totalCompaniesEl) {
        const companies = new Set(notices.map(n => n.company));
        totalCompaniesEl.textContent = companies.size;
    }
    
    if (latestNoticeEl && notices.length > 0) {
        const latest = notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        latestNoticeEl.textContent = new Date(latest.noticeDate).toLocaleDateString('ar-SA');
    }
}

function openModal(id) {
    const notices = JSON.parse(localStorage.getItem('notices_data')) || [];
    const notice = notices.find(n => n.id === id);
    
    if (notice) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalDownloadBtn = document.getElementById('modalDownloadBtn');
        const modalDeleteBtn = document.getElementById('modalDeleteBtn');
        const noticeModal = document.getElementById('noticeModal');

        if (modalTitle) modalTitle.textContent = notice.title;
        if (modalBody) {
            modalBody.innerHTML = `
                <p><strong>رقم التعميم:</strong> ${notice.noticeNo}</p>
                <p><strong>الشركة:</strong> ${notice.company}</p>
                <p><strong>التاريخ:</strong> ${new Date(notice.noticeDate).toLocaleDateString('ar-SA')}</p>
                <p><strong>المحتوى:</strong></p>
                <div>${notice.content}</div>
            `;
        }
        
        if (modalDownloadBtn) modalDownloadBtn.onclick = () => downloadPDF(notice);
        if (modalDeleteBtn) modalDeleteBtn.onclick = () => deleteNotice(notice.id);
        if (noticeModal) noticeModal.style.display = 'flex';
    }
}

const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('noticeModal');
        if (modal) modal.style.display = 'none';
    });
}

const modalCloseBtn = document.getElementById('modalCloseBtn');
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        const modal = document.getElementById('noticeModal');
        if (modal) modal.style.display = 'none';
    });
}

function downloadPDF(notice) {
    const content = `
        <h1>${notice.title}</h1>
        <p><strong>رقم التعميم:</strong> ${notice.noticeNo}</p>
        <p><strong>الشركة:</strong> ${notice.company}</p>
        <p><strong>التاريخ:</strong> ${new Date(notice.noticeDate).toLocaleDateString('ar-SA')}</p>
        <div>${notice.content}</div>
    `;
    
    const element = document.createElement('div');
    element.innerHTML = content;
    
    html2pdf().set({
        margin: 10,
        filename: `notice_${notice.noticeNo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }).from(element).save();
}

function deleteNotice(id) {
    if (confirm('هل تريد حذف هذا التعميم؟')) {
        let notices = JSON.parse(localStorage.getItem('notices_data')) || [];
        notices = notices.filter(n => n.id !== id);
        localStorage.setItem('notices_data', JSON.stringify(notices));
        const modal = document.getElementById('noticeModal');
        if (modal) modal.style.display = 'none';
        loadArchive();
    }
}