project/
│
├── index.html           صفحة عرض التعميم
├── admin.html           لوحة التحكم
├── archive.html         أرشيف التعاميم
│
├── css/
│   └── style.css
│
├── js/
│   ├── admin.js
│   ├── notice.js
│   └── archive.js
│
├── notices/
│   └── notice-001.json
│
└── assets/
    ├── logos/
    └── images/
    <label>رقم التعميم</label>
<input id="noticeNo">

<label>تاريخ التعميم</label>
<input type="date" id="noticeDate">

<label>اسم الشركة</label>
<input id="company">

<label>رابط QR Code</label>
<input id="qrCode">

<label>اسم المعتمد</label>
<input id="approvedBy">

<label>منصب المعتمد</label>
<input id="position">
function saveData(){

const notice = {

noticeNo: noticeNo.value,
noticeDate: noticeDate.value,

company: company.value,

branch: branch.value,
supervisor: supervisor.value,
manager: manager.value,
phone: phone.value,

weekday: weekday.value,
weekend: weekend.value,

title: document.getElementById("title").value,
content: content.value,

logo: logo.value,
noticeImage: noticeImage.value,
background: background.value,

themeColor: themeColor.value,

approvedBy: approvedBy.value,
position: position.value,

createdAt: new Date().toISOString()

};

localStorage.setItem(
"currentNotice",
JSON.stringify(notice)
);

window.open("index.html","_blank");

}
const data = JSON.parse(
localStorage.getItem("currentNotice")
);

if(data){

document.body.style.backgroundImage =
`url('${data.background}')`;

document.documentElement.style.setProperty(
'--theme',
data.themeColor
);

companyLogo.src = data.logo;

noticeImageView.src = data.noticeImage;

noticeTitle.innerHTML = data.title;

noticeContent.innerHTML = data.content;

branch.innerHTML = data.branch;

supervisor.innerHTML = data.supervisor;

manager.innerHTML = data.manager;

phone.innerHTML = data.phone;

weekday.innerHTML = data.weekday;

weekend.innerHTML = data.weekend;

}
<div class="top-bar">

<div>
رقم التعميم:
<span id="noticeNoView"></span>
</div>

<div>
التاريخ:
<span id="noticeDateView"></span>
</div>

</div>
.top-bar{
display:flex;
justify-content:space-between;
background:#f3f6fa;
padding:15px;
border-radius:10px;
margin-bottom:20px;
font-weight:bold;
}
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<button id="downloadPdf">
📄 تحميل PDF
</button>
document.getElementById("downloadPdf")
.addEventListener("click",()=>{

html2pdf().from(
document.querySelector(".notice")
).save();

});
<button onclick="shareNotice()">
📤 مشاركة
</button>
.notice{

backdrop-filter: blur(15px);

border:1px solid rgba(255,255,255,.4);

box-shadow:
0 20px 60px rgba(0,0,0,.15);

}

.header h1{

font-size:38px;

font-weight:700;

}

table tr:hover{

background:#f8fbff;

transition:.3s;

}

button{

transition:.3s;

}

button:hover{

transform:translateY(-2px);

}


