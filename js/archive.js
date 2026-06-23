/* ======================================
   نظام إدارة أرشيف التعاميم - JavaScript
   ====================================== */

class NoticeArchive {
    constructor() {
        this.notices = this.loadNotices();
        this.filteredNotices = [...this.notices];
        this.currentNotice = null;
        this.init();
    }

    // تحميل التعاميم من LocalStorage
    loadNotices() {
        const stored = localStorage.getItem('noticesArchive');
        return stored ? JSON.parse(stored) : [];
    }

    // حفظ التعاميم
    saveNotices() {
        localStorage.setItem('noticesArchive', JSON.stringify(this.notices));
    }

    // إضافة تعميم جديد
    addNotice(notice) {
        notice.id = Date.now().toString();
        notice.createdAt = new Date().toISOString();
        this.notices.unshift(notice);
        this.saveNotices();
        this.render();
    }

    // حذف تعميم
    deleteNotice(id) {
        if (confirm('هل أنت متأكد من حذف هذا التعميم؟')) {
            this.notices = this.notices.filter(n => n.id !== id);
            this.saveNotices();
            this.render();
            this.closeModal();
        }
    }

    // البحث والتصفية
    filterNotices() {
        const searchText = document.getElementById('searchInput').value.toLowerCase();
        const company = document.getElementById('companyFilter').value;
        const dateFrom = document.getElementById('dateFromFilter').value;
        const dateTo = document.getElementById('dateToFilter').value;

        this.filteredNotices = this.notices.filter(notice => {
            // البحث في الكلمات المفتاحية
            const matchesSearch = !searchText || 
                notice.title.toLowerCase().includes(searchText) ||
                notice.noticeNo.toLowerCase().includes(searchText) ||
                notice.company.toLowerCase().includes(searchText);

            // تصفية حسب الشركة
            const matchesCompany = !company || notice.company === company;

            // تصفية حسب التاريخ
            const noticeDate = new Date(notice.noticeDate).toISOString().split('T')[0];
            const matchesDateFrom = !dateFrom || noticeDate >= dateFrom;
            const matchesDateTo = !dateTo || noticeDate <= dateTo;

            return matchesSearch && matchesCompany && matchesDateFrom && matchesDateTo;
        });

        this.render();
    }

    // إعادة تعيين الفلاتر
    resetFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('companyFilter').value = '';
        document.getElementById('dateFromFilter').value = '';
        document.getElementById('dateToFilter').value = '';
        this.filteredNotices = [...this.notices];
        this.render();
    }

    // تحديث قائمة الشركات
    updateCompanyFilter() {
        const companies = [...new Set(this.notices.map(n => n.company))];
        const select = document.getElementById('companyFilter');
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">-- جميع الشركات --</option>';
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company;
            option.textContent = company;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    }

    // تحديث الإحصائيات
    updateStats() {
        document.getElementById('totalNotices').textContent = this.filteredNotices.length;
        
        const companies = new Set(this.filteredNotices.map(n => n.company));
        document.getElementById('totalCompanies').textContent = companies.size;

        if (this.filteredNotices.length > 0) {
            const latest = new Date(this.filteredNotices[0].createdAt);
            const formattedDate = latest.toLocaleDateString('ar-SA');
            document.getElementById('latestNotice').textContent = formattedDate;
        } else {
            document.getElementById('latestNotice').textContent = '--';
        }
    }

    // عرض التعاميم
    render() {
        const list = document.getElementById('archiveList');
        
        if (this.filteredNotices.length === 0) {
            list.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <p>📭 لا توجد تعاميم مطابقة للبحث</p>
                </div>
            `;
        } else {
            list.innerHTML = this.filteredNotices.map(notice => this.createNoticeCard(notice)).join('');
        }

        this.updateStats();
    }

    // إنشاء بطاقة التعميم
    createNoticeCard(notice) {
        const date = new Date(notice.createdAt);
        const formattedDate = date.toLocaleDateString('ar-SA');

        return `
            <div class="notice-card" onclick="archive.openModal('${notice.id}')">
                <div class="notice-card-header">
                    <h3>${notice.title}</h3>
                    <p>التعميم: ${notice.noticeNo}</p>
                </div>
                <div class="notice-card-body">
                    <div class="notice-info"><strong>🏢 الشركة:</strong> ${notice.company}</div>
                    <div class="notice-info"><strong>📅 التاريخ:</strong> ${notice.noticeDate}</div>
                    <div class="notice-info"><strong>👤 المعتمد:</strong> ${notice.approvedBy}</div>
                    <div class="notice-info"><strong>⏰ المنصب:</strong> ${notice.position}</div>
                </div>
                <div class="notice-card-footer">
                    <button class="btn-small btn-view" onclick="event.stopPropagation(); archive.openModal('${notice.id}')">👁️ عرض</button>
                    <button class="btn-small btn-delete" onclick="event.stopPropagation(); archive.deleteNotice('${notice.id}')">🗑️ حذف</button>
                </div>
            </div>
        `;
    }

    // فتح Modal لعرض التعميم
    openModal(id) {
        this.currentNotice = this.notices.find(n => n.id === id);
        if (!this.currentNotice) return;

        const modal = document.getElementById('noticeModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class="notice-detail">
                <div class="detail-row">
                    <strong>رقم التعميم:</strong>
                    <span>${this.currentNotice.noticeNo}</span>
                </div>
                <div class="detail-row">
                    <strong>التاريخ:</strong>
                    <span>${this.currentNotice.noticeDate}</span>
                </div>
                <div class="detail-row">
                    <strong>الشركة:</strong>
                    <span>${this.currentNotice.company}</span>
                </div>
                <div class="detail-row">
                    <strong>الفرع:</strong>
                    <span>${this.currentNotice.branch}</span>
                </div>
                <div class="detail-row">
                    <strong>المشرف:</strong>
                    <span>${this.currentNotice.supervisor}</span>
                </div>
                <div class="detail-row">
                    <strong>المدير:</strong>
                    <span>${this.currentNotice.manager}</span>
                </div>
                <div class="detail-row">
                    <strong>الهاتف:</strong>
                    <span>${this.currentNotice.phone}</span>
                </div>
                <div class="detail-row">
                    <strong>ساعات العمل (الأسبوع):</strong>
                    <span>${this.currentNotice.weekday}</span>
                </div>
                <div class="detail-row">
                    <strong>ساعات العمل (نهاية الأسبوع):</strong>
                    <span>${this.currentNotice.weekend}</span>
                </div>
                <div class="detail-row">
                    <strong>العنوان:</strong>
                    <span>${this.currentNotice.title}</span>
                </div>
                <div class="detail-row">
                    <strong>المحتوى:</strong>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 5px;">
                        ${this.currentNotice.content}
                    </div>
                </div>
                <div class="detail-row">
                    <strong>المعتمد:</strong>
                    <span>${this.currentNotice.approvedBy}</span>
                </div>
                <div class="detail-row">
                    <strong>المنصب:</strong>
                    <span>${this.currentNotice.position}</span>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    // إغلاق Modal
    closeModal() {
        document.getElementById('noticeModal').style.display = 'none';
    }

    // تحميل PDF
    downloadPDF() {
        if (!this.currentNotice) return;

        const content = `
            <div style="direction: rtl; text-align: right; padding: 20px; font-family: Arial, sans-serif;">
                <h2>${this.currentNotice.title}</h2>
                <hr>
                <p><strong>رقم التعميم:</strong> ${this.currentNotice.noticeNo}</p>
                <p><strong>التاريخ:</strong> ${this.currentNotice.noticeDate}</p>
                <p><strong>الشركة:</strong> ${this.currentNotice.company}</p>
                <p><strong>المعتمد:</strong> ${this.currentNotice.approvedBy}</p>
                <hr>
                <p>${this.currentNotice.content}</p>
            </div>
        `;

        const element = document.createElement('div');
        element.innerHTML = content;
        
        const opt = {
            margin: 10,
            filename: `${this.currentNotice.noticeNo}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'p', unit: 'mm', format: 'a4' }
        };

        html2pdf().set(opt).from(element).save();
    }

    // التحقق من التعميمات الجديدة من Admin
    checkForNewNotices() {
        const currentNotice = JSON.parse(localStorage.getItem('currentNotice'));
        if (currentNotice && !this.notices.some(n => n.noticeNo === currentNotice.noticeNo)) {
            this.addNotice(currentNotice);
            localStorage.removeItem('currentNotice');
        }
    }

    // تهيئة
    init() {
        this.checkForNewNotices();
        this.updateCompanyFilter();
        this.render();
        this.attachEventListeners();
    }

    // ربط أحداث الاستماع
    attachEventListeners() {
        document.getElementById('searchInput').addEventListener('input', () => this.filterNotices());
        document.getElementById('companyFilter').addEventListener('change', () => this.filterNotices());
        document.getElementById('dateFromFilter').addEventListener('change', () => this.filterNotices());
        document.getElementById('dateToFilter').addEventListener('change', () => this.filterNotices());
        document.getElementById('resetFilters').addEventListener('click', () => this.resetFilters());

        document.querySelector('.close-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalCloseBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalDownloadBtn').addEventListener('click', () => this.downloadPDF());
        document.getElementById('modalDeleteBtn').addEventListener('click', () => {
            const id = this.currentNotice.id;
            this.closeModal();
            this.deleteNotice(id);
        });

        // إغلاق Modal عند الضغط خارجه
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('noticeModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
}

// تهيئة النظام عند تحميل الصفحة
let archive;
document.addEventListener('DOMContentLoaded', () => {
    archive = new NoticeArchive();
});
