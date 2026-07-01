const EMOJIS = [
    '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇',
    '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏',
    '😐', '❤️', '💛', '💚', '💙', '💘', '🙏', '👏',
    '🌟', '🎄', '🎉', '🎊', '🎈', '🎋', '🎌', '🎍'
];

let currentSectionId = 1;
let selectedTextFormat = {};

window.addEventListener('DOMContentLoaded', () => {
    initializeEditor();
    loadEmojis();
});

function initializeEditor() {
    document.getElementById('previewBtn').addEventListener('click', togglePreview);
    document.getElementById('saveEditorBtn').addEventListener('click', saveEditorContent);
    document.getElementById('templateSelect').addEventListener('change', applyTemplate);
}

function loadEmojis() {
    const emojiGrid = document.getElementById('emojiGrid');
    EMOJIS.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.onclick = (e) => {
            e.preventDefault();
            selectEmoji(emoji);
        };
        emojiGrid.appendChild(btn);
    });
}

function addNewSection() {
    currentSectionId++;
    const container = document.getElementById('sectionsContainer');
    const newSection = document.createElement('div');
    newSection.className = 'section';
    newSection.dataset.sectionId = `section-${currentSectionId}`;
    newSection.innerHTML = `
        <div class="section-header">
            <input type="text" class="section-title" value="قسم جديد" placeholder="عنوان القسم">
            <button class="btn-remove-section" onclick="removeSection(this)">❌</button>
        </div>
        <div class="section-content">
            <textarea class="section-text" placeholder="اكتب نص القسم..."></textarea>
            <div class="text-formatting">
                <button class="fmt-btn" onclick="toggleBold(this)"><strong>ب</strong></button>
                <button class="fmt-btn" onclick="increaseFontSize(this)">A+</button>
                <button class="fmt-btn" onclick="decreaseFontSize(this)">A-</button>
                <button class="fmt-btn" onclick="insertEmoji(this)">😊</button>
                <button class="fmt-btn" onclick="insertImage(this)">📷</button>
            </div>
        </div>
    `;
    container.appendChild(newSection);
}

function removeSection(btn) {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
        btn.closest('.section').remove();
    }
}

function toggleBold(btn) {
    btn.classList.toggle('active');
}

function increaseFontSize(btn) {
    const textarea = btn.closest('.section-content').querySelector('.section-text');
    if (textarea) {
        const currentSize = parseInt(window.getComputedStyle(textarea).fontSize);
        textarea.style.fontSize = (currentSize + 2) + 'px';
    }
}

function decreaseFontSize(btn) {
    const textarea = btn.closest('.section-content').querySelector('.section-text');
    if (textarea) {
        const currentSize = parseInt(window.getComputedStyle(textarea).fontSize);
        if (currentSize > 12) {
            textarea.style.fontSize = (currentSize - 2) + 'px';
        }
    }
}

function insertEmoji(btn) {
    document.getElementById('emojiModal').style.display = 'flex';
    selectedTextFormat.button = btn;
}

function selectEmoji(emoji) {
    if (selectedTextFormat.button) {
        const textarea = selectedTextFormat.button.closest('.section-content').querySelector('.section-text');
        if (textarea) {
            textarea.value += emoji;
            textarea.focus();
        }
    }
    closeEmojiModal();
}

function insertImage(btn) {
    document.getElementById('imageUploadModal').style.display = 'flex';
    selectedTextFormat.button = btn;
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('imagePreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
            document.querySelector('.image-controls').style.display = 'flex';
            selectedTextFormat.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function updateImagePreview() {
    const size = document.getElementById('imageSize').value;
    document.getElementById('imagePreview').style.width = size + 'px';
    document.getElementById('sizeDisplay').textContent = size + 'px';
}

function confirmImageUpload() {
    if (selectedTextFormat.button && selectedTextFormat.imageUrl) {
        const textarea = selectedTextFormat.button.closest('.section-content').querySelector('.section-text');
        const size = document.getElementById('imageSize').value;
        if (textarea) {
            const imgHtml = `<img src="${selectedTextFormat.imageUrl}" style="width:${size}px; cursor:pointer;" class="section-image">`;
            textarea.value += '\n[IMAGE]\n';
            // حفظ صورة منفصلة
            if (!textarea.dataset.images) {
                textarea.dataset.images = '[]';
            }
            const images = JSON.parse(textarea.dataset.images);
            images.push({
                url: selectedTextFormat.imageUrl,
                size: parseInt(size)
            });
            textarea.dataset.images = JSON.stringify(images);
            textarea.focus();
        }
    }
    closeImageUploadModal();
}

function togglePreview() {
    const panel = document.getElementById('previewPanel');
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
        updatePreview();
    }
}

function updatePreview() {
    const preview = document.getElementById('previewContent');
    const sections = document.querySelectorAll('.section');
    let html = '';

    sections.forEach(section => {
        const title = section.querySelector('.section-title').value;
        const text = section.querySelector('.section-text').value;
        const isBold = section.querySelector('.fmt-btn.active');
        
        html += `<div class="preview-section">
            <h3>${title}</h3>
            <p style="${isBold ? 'font-weight: bold;' : ''}">${text}</p>
        </div>`;
    });

    preview.innerHTML = html;
}

function closePreview() {
    document.getElementById('previewPanel').classList.remove('active');
}

function closeEmojiModal() {
    document.getElementById('emojiModal').style.display = 'none';
}

function closeImageUploadModal() {
    document.getElementById('imageUploadModal').style.display = 'none';
    document.getElementById('imageInput').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

function applyTemplate(event) {
    const template = event.target.value;
    const root = document.documentElement;
    
    const templates = {
        modern: {
            '--primary': '#667eea',
            '--secondary': '#764ba2'
        },
        classic: {
            '--primary': '#2c3e50',
            '--secondary': '#34495e'
        },
        minimal: {
            '--primary': '#ecf0f1',
            '--secondary': '#95a5a6'
        },
        colorful: {
            '--primary': '#e74c3c',
            '--secondary': '#f39c12'
        }
    };
    
    Object.entries(templates[template]).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

function saveEditorContent() {
    const sections = document.querySelectorAll('.section');
    const contentHTML = Array.from(sections).map(section => {
        const title = section.querySelector('.section-title').value;
        const text = section.querySelector('.section-text').value;
        const images = JSON.parse(section.querySelector('.section-text').dataset.images || '[]');
        
        let html = `<div class="content-section"><h3>${title}</h3>`;
        
        const lines = text.split('\n');
        lines.forEach(line => {
            if (line === '[IMAGE]') {
                // وضع الصور هنا
                if (images.length > 0) {
                    const img = images.shift();
                    html += `<img src="${img.url}" style="width:${img.size}px; margin: 10px 0; cursor: pointer;" class="content-image" onclick="openImageModal(this.src)">`;
                }
            } else if (line.trim()) {
                html += `<p>${line}</p>`;
            }
        });
        
        html += '</div>';
        return html;
    }).join('');
    
    // حفظ في localStorage
    const notice = JSON.parse(localStorage.getItem('currentNotice')) || {};
    notice.contentHTML = contentHTML;
    localStorage.setItem('currentNotice', JSON.stringify(notice));
    
    alert('✅ تم حفظ التعميم بنجاح');
    window.location.href = 'index.html';
}

window.addEventListener('click', (e) => {
    if (e.target.id === 'emojiModal') {
        closeEmojiModal();
    }
    if (e.target.id === 'imageUploadModal') {
        closeImageUploadModal();
    }
});