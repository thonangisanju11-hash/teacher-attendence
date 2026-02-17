/*************************
 * GLOBAL ELEMENTS
 *************************/
const pages = document.querySelectorAll(".page");
const navbar = document.getElementById("navbar");
const loginPage = document.getElementById("loginPage");
const loginError = document.getElementById("error");
const navLinks = document.getElementById("navLinks");

const ADMIN_EMAIL = "admin@attendance.com";
let scanner = null;

/*************************
 * PAGE CONTROL
 *************************/
navbar.style.display = "none";

function showPage(id) {
  pages.forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function toggleMenu() {
  navLinks.classList.toggle("show");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

/*************************
 * LOGIN
 *************************/
function login() {
  const emailVal = email.value.trim();
  const passwordVal = password.value.trim();
  const roleVal = role ? role.value : "student";
  const remember = rememberMe ? rememberMe.checked : false;

  loginError.innerText = "";

  auth.setPersistence(
    remember
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION
  )
  .then(() => auth.signInWithEmailAndPassword(emailVal, passwordVal))
  .then(res => {
    navbar.style.display = "flex";
    loginPage.style.display = "none";

    // Save role
    db.collection("users").doc(res.user.uid).set({
      email: emailVal,
      role: emailVal === ADMIN_EMAIL ? "admin" : roleVal
    }, { merge: true });

    if (emailVal === ADMIN_EMAIL) {
      showPage("dashboard");   // ADMIN
      return;
    }

    // STUDENT
    hideAdminUI();
    showPage("attendance");
    startScanner();
  })
  .catch(err => showError(err.code));
}

/*************************
 * AUTO LOGIN ON REFRESH
 *************************/
auth.onAuthStateChanged(user => {
  if (!user) return;

  navbar.style.display = "flex";
  loginPage.style.display = "none";

  if (user.email === ADMIN_EMAIL) {
    showPage("dashboard");
  } else {
    hideAdminUI();
    showPage("attendance");
    startScanner();
  }
});

/*************************
 * LOGOUT
 *************************/
function logout() {
  auth.signOut().then(() => location.reload());
}

/*************************
 * ROLE / UI CONTROL
 *************************/
function hideAdminUI() {
  const dashboard = document.getElementById("dashboard");
  const members = document.getElementById("members");
  if (dashboard) dashboard.style.display = "none";
  if (members) members.style.display = "none";
}

/*************************
 * ERROR HANDLING
 *************************/
function showError(code) {
  const errors = {
    "auth/user-not-found": "User not found",
    "auth/wrong-password": "Wrong password",
    "auth/invalid-email": "Invalid email address",
    "auth/network-request-failed": "Network error"
  };
  loginError.innerText = errors[code] || "Login failed";
}

/*************************
 * QR GENERATE (ADMIN)
 *************************/
function generateQR() {
  const qrAdmin = document.getElementById("qrcode");
  qrAdmin.innerHTML = "";

  new QRCode(qrAdmin, {
    text: "ATTEND_" + today(),
    width: 200,
    height: 200
  });
}

/*************************
 * QR SCANNER (STUDENT)
 *************************/
function startScanner() {
  if (scanner) return;

  scanner = new Html5Qrcode("scanner");
  scanner.start(
    { facingMode: "environment" },
    { fps: 10 },
    code => markAttendance(code)
  );
}

/*************************
 * ATTENDANCE
 *************************/
function markAttendance(code) {
  const date = today();

  db.collection("attendance").doc(date).set({
    [auth.currentUser.uid]: "Present"
  }, { merge: true });

  alert("Attendance Marked");
  if (scanner) scanner.stop();
}

/*************************
 * CHART
 *************************/
function loadChart(present, absent) {
  new Chart(attendanceChart, {
    type: "doughnut",
    data: {
      labels: ["Present", "Absent"],
      datasets: [{
        data: [present, absent],
        backgroundColor: ["green", "red"]
      }]
    }
  });
}

/*************************
 * UTILS
 *************************/
function today() {
  return new Date().toISOString().split("T")[0];
}
