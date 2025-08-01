// Initialize localStorage
if (!localStorage.getItem("loanApplications")) {
    localStorage.setItem("loanApplications", JSON.stringify([]));
}

// Calculate age from DOB
function calculateAge(dob) {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const age = new Date(ageDiff).getUTCFullYear() - 1970;
    return age;
}

// Check loan eligibility
function checkEligibility() {
    try {
        const fullName = document.getElementById("fullName").value;
        const dob = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;
        const salary = parseFloat(document.getElementById("salary").value);
        const loanAmount = parseFloat(document.getElementById("loanAmount").value);
        const duration = parseInt(document.getElementById("duration").value);
        const interest = parseFloat(document.getElementById("interest").value);
        const currency = document.getElementById("currency").value;

        const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
        let sources = Array.from(checkboxes).map(cb => cb.value);
        if (document.getElementById("otherCheck").checked) {
            sources.push(document.getElementById("otherText").value || "Other");
        }

        // Validate required fields
        if (!fullName || !dob || !gender || !salary || !loanAmount || !duration || !interest || sources.length === 0) {
            document.getElementById("result").innerHTML =
                "<p class='not-eligible'>All fields are required.</p>";
            return;
        }

        const age = calculateAge(dob);
        if (age < 18 || age > 60) {
            document.getElementById("result").innerHTML =
                "<p class='not-eligible'>Not eligible: Age must be 18-60.</p>";
            return;
        }

        if (salary < 20000) {
            document.getElementById("result").innerHTML =
                "<p class='not-eligible'>Not eligible: Salary must be ≥ 20,000 JMD.</p>";
            return;
        }

        if (loanAmount > salary * 20) {
            document.getElementById("result").innerHTML =
                "<p class='not-eligible'>Not eligible: Loan exceeds 20x salary.</p>";
            return;
        }

        // EMI Calculation
        const R = interest / 12 / 100;
        const N = duration * 12;
        const EMI = (loanAmount * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);

        document.getElementById("result").innerHTML = `
        <p class="eligible">
            ✅ Khouri Hart (ID: 2202451, CIT2011)<br>
            Congratulations ${fullName}, you are eligible!<br>
            Monthly EMI: ${currency} ${EMI.toFixed(2)}<br>
            Duration: ${duration} years
        </p>`;
    } catch (err) {
        alert("Error: " + err.message);
    }
}

// Save Data
function saveData() {
    const applications = JSON.parse(localStorage.getItem("loanApplications"));
    const data = {
        name: document.getElementById("fullName").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        salary: document.getElementById("salary").value,
        loanAmount: document.getElementById("loanAmount").value,
        duration: document.getElementById("duration").value,
        interest: document.getElementById("interest").value,
        timestamp: new Date().toLocaleString()
    };
    applications.push(data);
    localStorage.setItem("loanApplications", JSON.stringify(applications));
    alert("Data saved!");
}

// View Data
function viewData() {
    const applications = JSON.parse(localStorage.getItem("loanApplications"));
    let display = "<h3>Saved Applications:</h3><ul>";
    applications.forEach(app => {
        display += `<li>${app.name} - Loan: ${app.loanAmount}</li>`;
    });
    display += "</ul>";
    document.getElementById("storageDisplay").innerHTML = display;
}

// Clear Storage
function clearData() {
    if (confirm("Delete all stored applications?")) {
        localStorage.setItem("loanApplications", JSON.stringify([]));
        document.getElementById("storageDisplay").innerHTML = "";
    }
}

// Exit Application
function exitApp() {
    if (confirm("Are you sure you want to exit the application?")) {
        window.close();
    }
}