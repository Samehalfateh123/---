project/
│
├── index.html        (صفحة عرض التعميم)
├── admin.html        (لوحة التحكم)
├── style.css         (التصميم)
├── script.js         (الوظائف)
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>لوحة إدارة التعميم</title>

<link rel="stylesheet" href="style.css">

<style>
.admin-box{
max-width:900px;
margin:auto;
background:#fff;
padding:30px;
border-radius:15px;
box-shadow:0 0 15px rgba(0,0,0,.1);
}

input,textarea{
width:100%;
padding:12px;
margin-top:5px;
margin-bottom:15px;
border:1px solid #ddd;
border-radius:8px;
}

button{
background:#003366;
color:#fff;
border:none;
padding:15px;
width:100%;
cursor:pointer;
font-size:18px;
border-radius:10px;
}
</style>

</head>
<body>

<div class="admin-box">

<h2>⚙️ لوحة إنشاء التعميم</h2>

<label>اسم الفرع</label>
<input id="branch">

<label>مشرف الفرع</label>
<input id="supervisor">

<label>مسؤول الفرع</label>
<input id="manager">

<label>رقم الجوال</label>
<input id="phone">

<label>ساعات العمل الأحد - الخميس</label>
<input id="weekday">

<label>ساعات العمل الجمعة - السبت</label>
<input id="weekend">

<label>عنوان التعميم</label>
<input id="title">

<label>نص التعميم</label>
<textarea id="content"></textarea>

<label>رابط الشعار</label>
<input id="logo">

<label>رابط صورة التعميم</label>
<input id="noticeImage">

<label>رابط الخلفية</label>
<input id="background">

<label>لون السمة</label>
<input type="color" id="themeColor" value="#003366">

<button onclick="saveData()">
💾 حفظ التعميم
</button>

</div>

<script>

function saveData(){

localStorage.setItem("branch",branch.value);
localStorage.setItem("supervisor",supervisor.value);
localStorage.setItem("manager",manager.value);
localStorage.setItem("phone",phone.value);
localStorage.setItem("weekday",weekday.value);
localStorage.setItem("weekend",weekend.value);

localStorage.setItem("title",title.value);
localStorage.setItem("content",content.value);

localStorage.setItem("logo",logo.value);
localStorage.setItem("noticeImage",noticeImage.value);
localStorage.setItem("background",background.value);

localStorage.setItem("themeColor",themeColor.value);

alert("تم حفظ التعميم");

window.open("index.html");

}

</script>

</body>
</html>
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">
<title>التعميم</title>

<link rel="stylesheet" href="style.css">

</head>

<body>

<div class="notice">

<div class="header">

<img id="companyLogo">

<h1 id="noticeTitle"></h1>

</div>

<img id="noticeImageView" class="notice-image">

<div class="content-box">
<p id="noticeContent"></p>
</div>

<table>

<tr>
<td class="title">🏢 اسم الفرع</td>
<td id="branch"></td>
</tr>

<tr>
<td class="title">👨‍💼 مشرف الفرع</td>
<td id="supervisor"></td>
</tr>

<tr>
<td class="title">📋 مسؤول الفرع</td>
<td id="manager"></td>
</tr>

<tr>
<td class="title">📱 رقم الجوال</td>
<td id="phone"></td>
</tr>

<tr>
<td class="title">🕒 الأحد - الخميس</td>
<td id="weekday"></td>
</tr>

<tr>
<td class="title">🌙 الجمعة - السبت</td>
<td id="weekend"></td>
</tr>

</table>

</div>

<script src="script.js"></script>

</body>
</html>
:root{
--theme:#003366;
}

body{
font-family:Tahoma;
margin:0;
padding:20px;
background-size:cover;
background-position:center;
background-repeat:no-repeat;
}

.notice{
background:rgba(255,255,255,.95);
max-width:1100px;
margin:auto;
padding:30px;
border-radius:20px;
box-shadow:0 10px 30px rgba(0,0,0,.15);
}

.header{
text-align:center;
border-bottom:5px solid var(--theme);
padding-bottom:20px;
margin-bottom:25px;
}

.header h1{
color:var(--theme);
}

#companyLogo{
max-height:120px;
max-width:300px;
}

.notice-image{
width:100%;
border-radius:15px;
margin-bottom:20px;
}

table{
width:100%;
border-collapse:collapse;
}

table td{
padding:14px;
border:1px solid #ddd;
}

.title{
background:var(--theme);
color:white;
font-weight:bold;
width:35%;
}

.content-box{
background:#f8f8f8;
padding:20px;
border-radius:12px;
margin-bottom:20px;
line-height:2;
}

@media(max-width:768px){

.notice{
padding:15px;
}

.title{
width:45%;
}

}
document.body.style.backgroundImage =
`url('${localStorage.getItem("background")}')`;

document.documentElement.style.setProperty(
'--theme',
localStorage.getItem("themeColor")
);

document.getElementById("companyLogo").src =
localStorage.getItem("logo");

document.getElementById("noticeImageView").src =
localStorage.getItem("noticeImage");

document.getElementById("noticeTitle").innerHTML =
localStorage.getItem("title");

document.getElementById("noticeContent").innerHTML =
localStorage.getItem("content");

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
console.log(localStorage.getItem("branch"));
console.log(localStorage.getItem("supervisor"));

