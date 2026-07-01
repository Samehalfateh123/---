class NoticeManager {
    constructor() {
        this.storageKey = 'notices_data_v2';
        this.initForm();
        this.loadElements();
        this.ensureSampleItem();
    }

    loadElements() {
        this.form = document.getElementById('noticeForm');
        this.itemsContainer = document.getElementById('itemsContainer');
        this.addItemBtn = document.getElementById('addItemBtn');
        this.excelFile = document.getElementById('excelFile');
        this.excelPreview = document.getElementById('excelPreview');

        this.addItemBtn.addEventListener('click', () => this.addItem());
        this.excelFile.addEventListener('change', (e) => this.handleExcel(e));
        document.getElementById('searchNotice').addEventListener('input', (e) => this.filterNotices(e.target.value));
    }

    initForm() {
        document.getElementById('noticeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNotice();
        });
    }

    ensureSampleItem() {
        // إذا لم توجد بنود، أضف بندًا افتراضيًا واحدًا
        const items = JSON.parse(localStorage.getItem('notice_items')) || [];
        if (items.length === 0) this.addItem('بند 1', '#ffffff', '#000000');
    }

    createItemElement(item = {}) {
        const id = item.id || ('it_' + Date.now() + Math.floor(Math.random()*1000));
        const wrapper = document.createElement('div');
        wrapper.className = 'item-card';
        wrapper.dataset.id = id;
        wrapper.innerHTML = `
            <input class="item-title" placeholder="نص البند" value="${item.title || ''}">
            <div class="item-controls">
                <label>خلفية: <input type="color" class="item-bg" value="${item.bg || '#ffffff'}"></label>
                <label>نص: <input type="color" class="item-color" value="${item.color || '#000000'}"></label>
                <button class="btn-item-size" data-action="-">➖</button>
                <button class="btn-item-size" data-action="+">➕</button>
                <button class="btn-delete-item">🗑️ حذف</button>
            </div>
        `;

        const titleInput = wrapper.querySelector('.item-title');
        const bgInput = wrapper.querySelector('.item-bg');
        const colorInput = wrapper.querySelector('.item-color');
        const deleteBtn = wrapper.querySelector('.btn-delete-item');
        const sizeBtns = wrapper.querySelectorAll('.btn-item-size');

        // event handlers
        deleteBtn.addEventListener('click', () => {
            wrapper.remove();
        });
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const current = parseInt(wrapper.style.fontSize || '16');
                if (action === '+') wrapper.style.fontSize = (current + 2) + 'px';
                else wrapper.style.fontSize = Math.max(10, current - 2) + 'px';
            });
        });

        return wrapper;
    }

    addItem(title = '', bg = '#ffffff', color = '#000000') {
        const el = this.createItemElement({ title, bg, color });
        this.itemsContainer.appendChild(el);
    }

    handleExcel(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const html = XLSX.utils.sheet_to_html(firstSheet);
            this.excelPreview.innerHTML = html;
            this.currentExcelHtml = html; // حفظ معاينة
        };
        reader.readAsBinaryString(file);
    }

    saveNotice() {
        const notice = {
            noticeNo: document.getElementById('noticeNo').value,
            noticeDate: document.getElementById('noticeDate').value,
            company: document.getElementById('company').value,
            branch: document.getElementById('branch').value,
            supervisor: document.getElementById('supervisor').value,
            manager: document.getElementById('manager').value,
            phone: document.getElementById('phone').value,
            weekday: document.getElementById('weekday').value,
            weekend: document.getElementById('weekend').value,
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            logo: document.getElementById('logo').value,
            noticeImage: document.getElementById('noticeImage').value,
            themeColor: document.getElementById('themeColor').value,
            approvedBy: document.getElementById('approvedBy').value,
            qrCode: document.getElementById('qrCode').value,
            externalLink: document.getElementById('externalLink').value || '',
            items: this.collectItems(),
            excelHtml: this.currentExcelHtml || '',
            createdAt: new Date().toISOString(),
            id: 'notice_' + Date.now()
        };

        // حفظ محلي
        let notices = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        notices.push(notice);
        localStorage.setItem(this.storageKey, JSON.stringify(notices));
        localStorage.setItem('currentNotice', JSON.stringify(notice));

        // توليد رابط قابل للمشاركة باستخدام التشفير base64 (لا يحتاج تسجيل دخول)
        const encoded = this.encodeNoticeForLink(notice);
        const link = `${location.origin}${location.pathname.replace(/admin.html$/, '')}notice.html?d=${encoded}`;

        alert('✅ تم حفظ التعميم. تم إنشاء رابط المشاركة — سيتم نسخه إلى الحافظة.');
        // نسخ الرابط
        this.copyText(link);
        // فتح صفحة العرض في تبويب جديد مع المعاينة
        window.open(link, '_blank');
        this.form.reset();
        this.excelPreview.innerHTML = '';
        this.itemsContainer.innerHTML = '';
        this.ensureSampleItem();
        this.displayNotices();
    }

    collectItems() {
        const items = [];
        this.itemsContainer.querySelectorAll('.item-card').forEach(card => {
            items.push({
                id: card.dataset.id,
                title: card.querySelector('.item-title').value,
                bg: card.querySelector('.item-bg').value,
                color: card.querySelector('.item-color').value,
                fontSize: card.style.fontSize || ''
            });
        });
        return items;
    }

    encodeNoticeForLink(notice) {
        const json = JSON.stringify(notice);
        try {
            return btoa(unescape(encodeURIComponent(json)));
        } catch (e) {
            return btoa(json);
        }
    }

    decodeNoticeFromLink(encoded) {
        try {
            return JSON.parse(decodeURIComponent(escape(atob(encoded))));
        } catch (e) {
            return JSON.parse(atob(encoded));
        }
    }

    copyText(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }

    getAllNotices() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    displayNotices(filter = '') {
        const notices = this.getAllNotices();
        const list = document.getElementById('noticesList');
        const filtered = notices.filter(n => (n.title + ' ' + n.content + ' ' + n.noticeNo + ' ' + n.company).toLowerCase().includes(filter.toLowerCase()));

        if (filtered.length === 0) {
            list.innerHTML = '<p>لا توجد تعاميم</p>';
            return;
        }

        list.innerHTML = filtered.map(notice => `
            <div class="notice-item">
                <h3>${notice.title}</h3>
                <p><strong>رقم:</strong> ${notice.noticeNo}</p>
                <p><strong>الشركة:</strong> ${notice.company}</p>
                <p><strong>التاريخ:</strong> ${new Date(notice.noticeDate).toLocaleDateString('ar-SA')}</p>
                <div class="notice-actions-inline">
                    <button class="btn-view" data-id="${notice.id}">عرض</button>
                    <button class="btn-copy" data-id="${notice.id}">نسخ رابط</button>
                    <button class="btn-delete" data-id="${notice.id}">حذف</button>
                </div>
            </div>
        `).join('');

        // attach events
        list.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => this.openNoticeById(e.target.dataset.id));
        });
        list.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', (e) => this.copyLinkById(e.target.dataset.id));
        });
        list.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteById(e.target.dataset.id));
        });
    }

    openNoticeById(id) {
        const notices = this.getAllNotices();
        const notice = notices.find(n => n.id === id);
        if (!notice) return alert('لم أجد التعميم');
        const encoded = this.encodeNoticeForLink(notice);
        const link = `${location.origin}${location.pathname.replace(/admin.html$/, '')}notice.html?d=${encoded}`;
        window.open(link, '_blank');
    }

    copyLinkById(id) {
        const notices = this.getAllNotices();
        const notice = notices.find(n => n.id === id);
        if (!notice) return alert('لم أجد التعميم');
        const encoded = this.encodeNoticeForLink(notice);
        const link = `${location.origin}${location.pathname.replace(/admin.html$/, '')}notice.html?d=${encoded}`;
        this.copyText(link);
        alert('✅ تم نسخ الرابط');
    }

    deleteById(id) {
        if (!confirm('هل أنت متأكد من حذف هذا التعميم؟')) return;
        let notices = this.getAllNotices();
        notices = notices.filter(n => n.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(notices));
        this.displayNotices();
    }

    filterNotices(query) {
        this.displayNotices(query);
    }
}

const manager = new NoticeManager();

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    // event may be undefined if called programmatically
    if (typeof event !== 'undefined' && event.target) event.target.classList.add('active');

    if (tabName === 'view') {
        manager.displayNotices();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    manager.displayNotices();
});
