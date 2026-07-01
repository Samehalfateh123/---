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
-                    img.style.maxWidth = '100%';
+                    img.style.maxWidth = '100%';
+                    // apply saved scale
+                    const scale = parseFloat(it.attachmentScale || '1');
+                    img.style.width = `${scale * 100}%`;
                    img.style.borderRadius = '6px';
                    img.addEventListener('click', () => openLightbox(it.attachment));
+                    // add inline zoom controls for public view
+                    const zc = document.createElement('div');
+                    zc.className = 'attachment-controls';
+                    zc.innerHTML = `<button class="btn-attach-zoom" data-action="-">🔍-</button><button class="btn-attach-zoom" data-action="+">🔍+</button>`;
+                    zc.querySelectorAll('.btn-attach-zoom').forEach(btn => {
+                        btn.addEventListener('click', () => {
+                            let cur = parseFloat(img.style.width || '100%') / 100;
+                            if (btn.dataset.action === '+') cur = Math.min(3, cur * 1.15);
+                            else cur = Math.max(0.2, cur / 1.15);
+                            img.style.width = `${cur * 100}%`;
+                        });
+                    });
+                    const container = document.createElement('div');
+                    container.style.display = 'flex';
+                    container.style.flexDirection = 'column';
+                    container.style.gap = '6px';
+                    container.appendChild(img);
+                    container.appendChild(zc);
+                    card.appendChild(container);
+                    itemsArea.appendChild(card);
+                    return; // skip default append below since we've appended
                }
            }

            itemsArea.appendChild(card);
        });
    }
