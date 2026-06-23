/* ======================================
   لوحة التحكم - نظام إدارة التعاميم
   ====================================== */

function saveData(){
    
    const notice = {
        
        noticeNo: document.getElementById("noticeNo").value,
        noticeDate: document.getElementById("noticeDate").value,
        
        company: document.getElementById("company").value,
        
        branch: document.getElementById("branch").value,
        supervisor: document.getElementById("supervisor").value,
        manager: document.getElementById("manager").value,
        phone: document.getElementById("phone").value,
        
        weekday: document.getElementById("weekday").value,
        weekend: document.getElementById("weekend").value,
        
        title: document.getElementById("title").value,
        content: document.getElementById("content").value,
        
        logo: document.getElementById("logo").value,
        noticeImage: document.getElementById("noticeImage").value,
        background: document.getElementById("background").value,
        
        themeColor: document.getElementById("themeColor").value,
        
        approvedBy: document.getElementById("approvedBy").value,
        position: document.getElementById("position").value,
        
        createdAt: new Date().toISOString()
        
    };
    
    // حفظ في LocalStorage للعرض المباشر
    localStorage.setItem(
        "currentNotice",
        JSON.stringify(notice)
    );

    // إضافة إلى الأرشيف
    let archive = JSON.parse(localStorage.getItem('noticesArchive')) || [];
    
    // تجنب التكرار
    if (!archive.some(n => n.noticeNo === notice.noticeNo)) {
        notice.id = Date.now().toString();
        archive.unshift(notice);
        localStorage.setItem('noticesArchive', JSON.stringify(archive));
    }
    
    // إظهار رسالة تأكيد
    showNotification('✅ تم حفظ التعميم بنجاح!');
    
    // فتح صفحة العرض
    setTimeout(() => {
        window.open("index.html","_blank");
    }, 1000);
}

// دالة عرض الإخطارات
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// تحميل البيانات المحفوظة
function loadSavedData() {
    const saved = JSON.parse(localStorage.getItem("currentNotice"));
    if (saved) {
        document.getElementById("noticeNo").value = saved.noticeNo || '';
        document.getElementById("noticeDate").value = saved.noticeDate || '';
        document.getElementById("company").value = saved.company || '';
        document.getElementById("branch").value = saved.branch || '';
        document.getElementById("supervisor").value = saved.supervisor || '';
        document.getElementById("manager").value = saved.manager || '';
        document.getElementById("phone").value = saved.phone || '';
        document.getElementById("weekday").value = saved.weekday || '';
        document.getElementById("weekend").value = saved.weekend || '';
        document.getElementById("title").value = saved.title || '';
        document.getElementById("content").value = saved.content || '';
        document.getElementById("approvedBy").value = saved.approvedBy || '';
        document.getElementById("position").value = saved.position || '';
    }
}

// إضافة أنماط للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadSavedData);
