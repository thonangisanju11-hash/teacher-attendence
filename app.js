const pages = document.querySelectorAll(".page");
const navbar = document.getElementById("navbar");
navbar.style.display = "none";

function showPage(id){
  pages.forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function toggleMenu(){
  navLinks.classList.toggle("show");
}

function toggleTheme(){
  document.body.classList.toggle("dark");
}

function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(res => {
      navbar.style.display = "flex";
      login.style.display = "none";
      showPage("attendance");
      checkRole(res.user.uid);
    })
    .catch(err => loginError.innerText = err.message);
}

function logout(){
  auth.signOut();
  location.reload();
}

/* ROLE BASED */
function checkRole(uid){
  db.collection("users").doc(uid).get().then(doc=>{
    if(doc.data()?.role !== "admin"){
      members.style.display = "none";
      dashboard.style.display = "none";
    }
  });
}

/* QR */
function generateQR(){
  qrAdmin.innerHTML = "";
  new QRCode(qrAdmin,{
    text: "ATTEND_"+new Date().toISOString().split("T")[0],
    width:200,height:200
  });
}

/* SCAN */
new Html5Qrcode("scanner").start(
  { facingMode:"environment" },
  { fps:10 },
  code => markAttendance(code)
);

function markAttendance(code){
  const date = new Date().toISOString().split("T")[0];
  db.collection("attendance").doc(date)
    .set({ [auth.currentUser.uid]:"Present" },{merge:true});
}

/* CHART */
function loadChart(present, absent){
  new Chart(attendanceChart,{
    type:"doughnut",
    data:{
      labels:["Present","Absent"],
      datasets:[{data:[present,absent],backgroundColor:["green","red"]}]
    }
  });
}
