<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>نظام التعاميم - الفروع</title>

<style>
*{
    box-sizing:border-box;
    font-family:'Tahoma',sans-serif;
}

body{
    margin:0;
    background:#f4f6f9;
    padding:20px;
}

.container{
    display:grid;
    grid-template-columns:400px 1fr;
    gap:20px;
    max-width:1400px;
    margin:auto;
}

.card{
    background:white;
    padding:20px;
    border-radius:12px;
    box-shadow:0 3px 12px rgba(0,0,0,.1);
}

h2{
    margin-top:0;
    color:#003366;
}

label{
    display:block;
    margin-top:12px;
    font-weight:bold;
}

input{
    width:100%;
    padding:10px;
    border:1px solid #ccc;
    border-radius:6px;
    margin-top:5px;
}

button{
    width:100%;
    margin-top:20px;
    padding:12px;
    border:none;
    background:#003366;
    color:white;
    border-radius:6px;
    cursor:pointer;
    font-size:16px;
}

.notice{
    border:2px solid #003366;
    border-radius:10px;
    padding:30px;
}

.notice-header{
    text-align:center;
    border-bottom:2px solid #003366;
    margin-bottom:20px;
    padding-bottom:15px;
}

.notice-header h1{
    margin:0;
    color:#003366;
}

table{
    width:100%;
    border-collapse:collapse;
}

td{
    border:1px solid #ddd;
    padding:12px;
}

.title{
    background:#f1f5f9;
    font-weight:bold;
    width:35%;
}

.footer{
    margin-top:20px;
    line-height:2;
}
</style>
</head>

<body>

<div class="container">

<div class="card">

<h2>إدخال بيانات التعميم</h2>

<label>اسم الفرع</label>
<input type="text" id="branch">

<label>مشرف الفرع</label>
<input type="text" id="supervisor">

<label>اسم مسؤول الفرع</label>
<input type="text" id="manager">

<label>رقم جوال مسؤول الفرع</label>
<input type="text" id="phone">

<label>وقت العمل (الأحد - الخميس)</label>
<input type="text" id="weekdays"
placeholder="09:00 صباحاً - 11:00 مساءً">

<label>وقت العمل (الجمعة - السبت)</label>
<input type="text" id="weekend"
placeholder="04:00 مساءً - 12:00 منتصف الليل">

<button onclick="generateNotice()">
إنشاء التعميم
</button>

</div>

<div class="card">

<div class="notice">

<div class="notice-header">
<h1>تعميم ساعات عمل الفرع</h1>
<p>بيانات الفرع التشغيلية</p>
</div>

<table>
<tr>
<td class="title">اسم الفرع</td>
<td id="vBranch">-</td>
</tr>

<tr>
<td class="title">مشرف الفرع</td>
<td id="vSupervisor">-</td>
</tr>

<tr>
<td class="title">اسم مسؤول الفرع</td>
<td id="vManager">-</td>
</tr>

<tr>
<td class="title">رقم الجوال</td>
<td id="vPhone">-</td>
</tr>

<tr>
<td class="title">أوقات العمل (الأحد - الخميس)</td>
<td id="vWeekdays">-</td>
</tr>

<tr>
<td class="title">أوقات العمل (الجمعة - السبت)</td>
<td id="vWeekend">-</td>
</tr>
</table>

<div class="footer">
<p>
نفيدكم بأن بيانات الفرع الموضحة أعلاه هي البيانات المعتمدة للتشغيل،
ويرجى الالتزام بأوقات العمل المحددة والتواصل مع مسؤول الفرع عند الحاجة.
</p>

<p>
مع خالص التحية والتقدير
<br>
إدارة العمليات
</p>
</div>

</div>

</div>

</div>

<script>

function generateNotice(){

document.getElementById('vBranch').innerText =
document.getElementById('branch').value;

document.getElementById('vSupervisor').innerText =
document.getElementById('supervisor').value;

document.getElementById('vManager').innerText =
document.getElementById('manager').value;

document.getElementById('vPhone').innerText =
document.getElementById('phone').value;

document.getElementById('vWeekdays').innerText =
document.getElementById('weekdays').value;

document.getElementById('vWeekend').innerText =
document.getElementById('weekend').value;

}

</script>
project/
│
├── index.html       (صفحة عرض التعميم)
├── admin.html       (صفحة إدخال البيانات)
├── style.css
└── script.js
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>لوحة إدارة التعاميم</title>

<style>
body{
font-family:tahoma;
background:#f5f7fa;
padding:30px;
}

.container{
max-width:800px;
margin:auto;
background:white;
padding:25px;
border-radius:12px;
box-shadow:0 0 15px rgba(0,0,0,.1);
}

input{
width:100%;
padding:12px;
margin-top:5px;
margin-bottom:15px;
border:1px solid #ccc;
border-radius:6px;
}

button{
background:#003366;
color:white;
padding:12px 20px;
border:none;
border-radius:6px;
cursor:pointer;
}
</style>

</head>
<body>

<div class="container">

<h2>إدخال بيانات التعميم</h2>

<label>اسم الفرع</label>
<input id="branch">

<label>مشرف الفرع</label>
<input id="supervisor">

<label>اسم مسؤول الفرع</label>
<input id="manager">

<label>رقم الجوال</label>
<input id="phone">

<label>دوام الأحد - الخميس</label>
<input id="weekday">

<label>دوام الجمعة - السبت</label>
<input id="weekend">

<button onclick="saveData()">
حفظ ونشر التعميم
</button>

</div>

<script>

function saveData(){

localStorage.setItem("branch",
document.getElementById("branch").value);

localStorage.setItem("supervisor",
document.getElementById("supervisor").value);

localStorage.setItem("manager",
document.getElementById("manager").value);

localStorage.setItem("phone",
document.getElementById("phone").value);

localStorage.setItem("weekday",
document.getElementById("weekday").value);

localStorage.setItem("weekend",
document.getElementById("weekend").value);

window.location.href="index.html";

}

</script>

</body>
</html>

</body>
</html>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>تعميم الفرع</title>

<style>

body{
font-family:tahoma;
background:#eef2f7;
padding:30px;
}

.notice{
max-width:900px;
margin:auto;
background:white;
padding:40px;
border-radius:12px;
box-shadow:0 0 15px rgba(0,0,0,.1);
}

.header{
text-align:center;
border-bottom:3px solid #003366;
padding-bottom:15px;
margin-bottom:20px;
}

.header h1{
color:#003366;
}

table{
width:100%;
border-collapse:collapse;
}

td{
border:1px solid #ddd;
padding:12px;
}

.title{
font-weight:bold;
background:#f5f7fa;
width:35%;
}

.printBtn{
margin-top:20px;
background:#28a745;
color:white;
padding:10px 20px;
border:none;
border-radius:6px;
cursor:pointer;
}

</style>
</head>
<body>

<div class="notice">

<div class="header">
<h1>تعميم ساعات عمل الفرع</h1>
</div>

<table>

<tr>
<td class="title">اسم الفرع</td>
<td id="branch"></td>
</tr>

<tr>
<td class="title">مشرف الفرع</td>
<td id="supervisor"></td>
</tr>

<tr>
<td class="title">مسؤول الفرع</td>
<td id="manager"></td>
</tr>

<tr>
<td class="title">رقم الجوال</td>
<td id="phone"></td>
</tr>

<tr>
<td class="title">الأحد - الخميس</td>
<td id="weekday"></td>
</tr>

<tr>
<td class="title">الجمعة - السبت</td>
<td id="weekend"></td>
</tr>

</table>

<button class="printBtn"
onclick="window.print()">
طباعة التعميم
</button>

</div>

<script>

document.getElementById("branch").innerHTML =
localStorage.getItem("branch");

document.getElementById("supervisor").innerHTML =
localStorage.getItem("supervisor");

document.getElementById("manager").innerHTML =
localStorage.getItem("manager");

document.getElementById("phone").innerHTML =
localStorage.getItem("phone");

document.getElementById("weekday").innerHTML =
localStorage.getItem("weekday");

document.getElementById("weekend").innerHTML =
localStorage.getItem("weekend");

</script>

</body>
</html>
