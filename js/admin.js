class NoticeManager {
    constructor() {
        this.storageKey = 'notices_data';
        this.initForm();
    }

    initForm() {
        document.getElementById('noticeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNotice();
        });
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
            position: document.getElementById('position').value,
            qrCode: document.getElementById('qrCode').value,
            createdAt: new Date().toISOString(),
            id: 'notice_' + Date.now()
        };

        let notices = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        notices.push(notice);
        localStorage.setItem(this.storageKey, JSON.stringify(notices));
        localStorage.setItem('currentNotice', JSON.stringify(notice));

        alert('✅ تم حفظ التعميم بنجاح');
        window.open('index.html', '_blank');
        document.getElementById('noticeForm').reset();
    }

    getAllNotices() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    displayNotices() {
        const notices = this.getAllNotices();
        const list = document.getElementById('noticesList');
        
        if (notices.length === 0) {
            list.innerHTML = '<p>لا توجد تعاميم</p>';
            return;
        }

        list.innerHTML = notices.map(notice => `
            <div class="notice-item" onclick="viewNotice('${notice.id}')">
                <h3>${notice.title}</h3>
                <p><strong>رقم:</strong> ${notice.noticeNo}</p>
                <p><strong>الشركة:</strong> ${notice.company}</p>
                <p><strong>التاريخ:</strong> ${new Date(notice.noticeDate).toLocaleDateString('ar-SA')}</p>
            </div>
        `).join('');
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
    event.target.classList.add('active');

    if (tabName === 'view') {
        manager.displayNotices();
    }
}

function viewNotice(id) {
    const notices = manager.getAllNotices();
    const notice = notices.find(n => n.id === id);
    if (notice) {
        localStorage.setItem('currentNotice', JSON.stringify(notice));
        window.open('index.html', '_blank');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    manager.displayNotices();
});