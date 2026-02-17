navbar.style.display = "none";

/* LOGIN */
function login() {
  const emailVal = email.value;
  const passwordVal = password.value;
  const roleVal = role.value;

  auth.signInWithEmailAndPassword(emailVal, passwordVal)
    .then(res => {
      navbar.style.display = "flex";
      loginPage.style.display = "none";
      showPage("dashboard");

      // save role
      db.collection("users").doc(res.user.uid).set({
        email: emailVal,
        role: roleVal
      }, { merge: true });

      // role based access
      if (roleVal !== "admin") {
        dashboard.style.display = "none";
        members.style.display = "none";
        showPage("attendance");
        startScanner();
      }
    })
    .catch(err => {
      loginError.innerText = err.message;
    });
}

/* LOGOUT */
function logout(){
  auth.signOut().then(() => location.reload());
}

/* PAGE CONTROL */
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

/* ROLE CHECK (extra safety) */
function checkRole(uid){
  db.collection("users").doc(uid).get().then(doc=>{
    if(doc.exists && doc.data().role !== "admin"){
      members.style.display = "none";
      dashboard.style.display = "none";
    }
  });
}

/* QR GENERATE (ADMIN) */
function generateQR(){
  qrAdmin.innerHTML = "";
  new QRCode(qrAdmin,{
    text: "ATTEND_" + new Date().toISOString().split("T")[0],
    width: 200,
    height: 200
  });
}

/* QR SCANNER (STUDENT) */
let scanner;
function startScanner(){
  scanner = new Html5Qrcode("scanner");
  scanner.start(
    { facingMode: "environment" },
    { fps: 10 },
    code => markAttendance(code)
  );
}

/* ATTENDANCE */
function markAttendance(code){
  const date = new Date().toISOString().split("T")[0];
  db.collection("attendance").doc(date)
    .set({ [auth.currentUser.uid]: "Present" }, { merge: true });
}

/* CHART */
function loadChart(present, absent){
  new Chart(attendanceChart,{
    type: "doughnut",
    data:{
      labels: ["Present", "Absent"],
      datasets:[{
        data:[present, absent],
        backgroundColor:["green","red"]
      }]
    }
  });
}
