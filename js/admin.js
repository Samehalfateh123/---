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
        this.maxAttachmentInput = document.getElementById('maxAttachmentMB');

        // default max attachment bytes (from MB input)
        this.maxAttachmentBytes = (parseInt(this.maxAttachmentInput?.value) || 8) * 1024 * 1024;
        this.maxAttachmentInput?.addEventListener('change', () => {
            this.maxAttachmentBytes = (parseInt(this.maxAttachmentInput.value) || 8) * 1024 * 1024;
        });

        this.addItemBtn.addEventListener('click', () => this.addItem());
        this.excelFile.addEventListener('change', (e) => this.handleExcel(e));
        document.getElementById('searchNotice').addEventListener('input', (e) => this.filterNotices(e.target.value));
    }
@@
-        attachInput.addEventListener('change', (e) => {
-            const file = e.target.files[0];
-            if (!file) return;
-            if (file.size > 5 * 1024 * 1024) { alert('حجم الملف كبير جداً؛ الحد 5MB'); return; }
-            const reader = new FileReader();
-            reader.onload = (ev) => {
-                const dataUrl = ev.target.result;
-                wrapper.dataset.attachment = dataUrl;
-                if (file.type === 'application/pdf') {
-                    attachPreview.innerHTML = `<a class="attachment-link" href="${dataUrl}" target="_blank">عرض مرفق PDF</a>`;
-                } else {
-                    attachPreview.innerHTML = `<img src="${dataUrl}" style="max-width:100%; border-radius:6px;"/>`;
-                }
-            };
-            reader.readAsDataURL(file);
-        });
+        attachInput.addEventListener('change', (e) => {
+            const file = e.target.files[0];
+            if (!file) return;
+            if (file.size > (this.maxAttachmentBytes || 8 * 1024 * 1024)) {
+                alert(`حجم الملف كبير جداً؛ الحد ${Math.round((this.maxAttachmentBytes||(8*1024*1024))/(1024*1024))}MB`);
+                e.target.value = '';
+                return;
+            }
+            const reader = new FileReader();
+            reader.onload = (ev) => {
+                const dataUrl = ev.target.result;
+                wrapper.dataset.attachment = dataUrl;
+                // default scale
+                wrapper.dataset.attachmentScale = wrapper.dataset.attachmentScale || '1';
+                if (file.type === 'application/pdf') {
+                    attachPreview.innerHTML = `<a class="attachment-link" href="${dataUrl}" target="_blank">عرض مرفق PDF</a>`;
+                } else {
+                    attachPreview.innerHTML = `<div class="attachment-wrap" style="position:relative;display:flex;flex-direction:column;gap:6px;"><img src="${dataUrl}" style="max-width:100%; border-radius:6px;" data-scale="1"/></div>`;
+                }
+
+                // add zoom controls for the attachment
+                const controls = document.createElement('div');
+                controls.className = 'attachment-controls';
+                controls.innerHTML = `<button class="btn-attach-zoom" data-action="-">🔍-</button><button class="btn-attach-zoom" data-action="+">🔍+</button>`;
+                attachPreview.appendChild(controls);
+
+                // attach listeners
+                attachPreview.querySelectorAll('.btn-attach-zoom').forEach(btn => {
+                    btn.addEventListener('click', () => {
+                        const img = attachPreview.querySelector('img');
+                        if (!img) return;
+                        let scale = parseFloat(wrapper.dataset.attachmentScale || '1');
+                        if (btn.dataset.action === '+') scale = Math.min(3, scale * 1.15);
+                        else scale = Math.max(0.2, scale / 1.15);
+                        wrapper.dataset.attachmentScale = scale.toFixed(2);
+                        img.style.width = `${scale * 100}%`;
+                    });
+                });
+            };
+            reader.readAsDataURL(file);
+        });
@@
    collectItems() {
        const items = [];
        this.itemsContainer.querySelectorAll('.item-card').forEach(card => {
            items.push({
                id: card.dataset.id,
                title: card.querySelector('.item-title').value,
                bg: card.querySelector('.item-bg').value,
                color: card.querySelector('.item-color').value,
                fontSize: card.style.fontSize || window.getComputedStyle(card).fontSize,
                width: card.style.width || '',
                height: card.style.height || '',
                bold: card.dataset.bold === '1',
                icon: card.dataset.icon || '',
-                attachment: card.dataset.attachment || ''
+                attachment: card.dataset.attachment || '',
+                attachmentScale: card.dataset.attachmentScale || '1'
            });
        });
        return items;
    }
}
