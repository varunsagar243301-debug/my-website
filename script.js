document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');

    if (startBtn) {
        startBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Form refresh hone se rokne ke liye

            const captchaCheck = document.getElementById("captchaCheck").checked;
    if (!captchaCheck) {
        alert("Please accept the Privacy Policy & Terms to continue.⚠");
        return false;
    }

            // 1. Saare inputs se ekdam saaf values uthana
            const customerName = document.getElementById('user-name').value.trim();
            const ageInput = document.getElementById('user-age').value.trim();
            const gender = document.getElementById('user-gender').value;

            // 🔥 CHECK 1: Sabse pehle khali form ko yahin rok do (VARIABLE NAMES FIXED)
            if (customerName === "" || ageInput === "" || gender === "" || gender === "Select Gender") {
                alert("First fill out the form above, then click on Proceed to Test. 🛑");
                return; // Iske niche ka koi bhi alert ya code chal hi nahi payega!
            }

            // Chhota naam block karo (Minimum 3 letters zaroori hain)
            if (customerName.length <= 2) {
                alert("Oops! Incorrect Name Here 🛑");
                return;
            }

            // Sirf letters aur spaces allowed hain
            const allowedChars = /^[A-Za-z\s]+$/;
            if (!allowedChars.test(customerName)) {
                alert("Oops! Please enter a valid name using letter only! 🛑");
                return;
            }

            // 3 baar akshar repeat hona block (e.g., aaa, bbb)
            const repeatCheck = /([a-zA-Z])\1\1/;
            if (repeatCheck.test(customerName)) {
                alert("Oops! Invalid Name. Characters cannot repeat so many times! 🛑");
                return;
            }

            // VOWEL RATIO CHECK (Real Name Scanner)
            const vowelsCount = (customerName.match(/[aeiouAEIOU]/g) || []).length;
            const vowelRatio = vowelsCount / customerName.length;

            if (vowelRatio < 0.15) {
                alert("Oops! Please enter a valid name. Random typing is not allowed! 🛑");
                return;
            }

            // ==========================================================
            // ⚠️ 3. AGE VALIDATION (10 se 100 tak)
            // ==========================================================
            const age = parseInt(ageInput);
            if (isNaN(age) || age < 10 || age > 100) {
                alert("Please enter a valid age between (10 and 100)! ⚠️");
                return;
            }

            // ==========================================================
            // 💾 4. DATA SAVING TO MEMORY (Sab sahi hone ke baad save hoga)
            // ==========================================================
            localStorage.setItem('userName', customerName);
            localStorage.setItem('userAge', age);
            localStorage.setItem('userGender', gender);

            // ==========================================================
            // 🔥 5. OK AUR CANCEL KA CONFIRM BOX
            // ==========================================================
           const userConfirmed = confirm(
            " Space Academy: Registration Successful ✅\n\n" +
            "To continue, a ₹50 fee payment is required.\n" +
            "Would you like to proceed to the next page?"
        );
            
            if (!userConfirmed) {
                return; // Cancel dabane par Razorpay par jaane se yahin rok dega
            }

            // ==========================================================
            // 🚀 6. RAZORPAY POP-UP FRAMEWORK (Bina kisi bracket error ke)
            // ==========================================================
          var options = {
    "key": "rzp_live_SqZHetYEFPyzEN", // Aapki live key
    "amount": "5000", // Rs 1 = 100 paise
    "currency": "INR",
    "name": "Space Academy",
    "description": "IQ Assessment Test Fees",
    "capture": true, // Isse payment automatic capture ho jayegi
    
    // 🔥 ISSE MOBILE PAR RAZORPAY FULL PAGE MEIN KHULEGA
    "config": {
        "display": {
            "layout": "fullscreen"
        }
    },

    "handler": function (response) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
        localStorage.setItem('paymentDone', 'true'); 
        window.location.href = "instructions.html";
    },
  "prefill": {
    "name": customerName,
    "age": ageInput,
    "gender": gender     // 🔥 YAHAN SE AAKHRI COMMA HATA DIYA
},
    "theme": {
        "color": "#28a745" // Green color
    }
};

          
// 1. Common function redirection ke liye
function goToCalculation() {
    console.log("Redirecting to Calculation Page...");
    window.location.href = "calculation.html";
}

// 2. Submit Button ka function
function confirmSubmission() {
    let userConfirm = confirm("Are you sure you want to submit the test and check your result?");
    if (userConfirm) {
        goToCalculation(); // Yahan se redirection hoga
    }
}

// 3. Timer Logic (Jo auto-redirect karega)
const startFinalTimer = () => {
    let timeLeft = 480; 
    const displayElement = document.getElementById('timer-countdown');
    const boxElement = document.getElementById('timer-box');

    setTimeout(() => {
        if (boxElement) boxElement.style.display = 'block';

        const countdownInterval = setInterval(() => {
            let mins = Math.floor(timeLeft / 60);
            let secs = timeLeft % 60;

            if (displayElement) {
                displayElement.innerText = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
            }

            // Jab time khatam ho jaye
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                alert("Time’s Up! Your result is now being calculated.");
                goToCalculation(true); // Auto redirection yahan se hoga
            }
            timeLeft--;
        }, 1000);
    }, 5000); 
};

window.addEventListener('load', startFinalTimer);


function calculateScore() {
    let score = 0;
    // Sahi answers ki list jo aapne banayi thi
    const answers = {
        q1: "C", q2: "A", q3: "C", q4: "B", q5: "B",
        q6: "B", q7: "C", q8: "B", q9: "B", q10: "A",
        q11: "C", q12: "A", q13: "C", q14: "C", q15: "B",
        q16: "D", q17: "B", q18: "C", q19: "B", q20: "B",
        q21: "D", q22: "C", q23: "A", q24: "B", q25: "C",
        q26: "B", q27: "B", q28: "B", q29: "D", q30: "B"
    };

    // Har question check karo
    for (let i = 1; i <= 30; i++) {
        let selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === answers[`q${i}`]) {
            score += 1; 
        }
    }

  // 1. Timer element se bacha hua time uthao (ID ab sahi wali lagao)
// Pehle yahan 'timer' tha, ise badal kar 'timer-countdown' kar do
let timerDisplay = document.getElementById('timer-countdown').innerText; 

// 2. "08:00" ko split karke seconds nikalo
let parts = timerDisplay.split(":");
let m = parseInt(parts[0]);
let s = parseInt(parts[1]);
let secondsRemaining = (m * 60) + s;

// 3. Asli time spent (Total 8 mins = 480s)
let timeSpent = 480 - secondsRemaining; 

// 4. Memory mein save karo
localStorage.setItem("timeTaken", timeSpent); 

    // Score aur Time dono ko memory mein save karo
    localStorage.setItem("userScore", score);
    localStorage.setItem("timeTaken", timeSpent);
    
    // Purana wala 'mentalAge' bhi save rakhte hain taaki calculation page crash na ho
    localStorage.setItem("mentalAge", score); 
}

// Naya logic jo Timer aur Button dono ko handle karega
async function goToCalculation(skipConfirm = false) {
    let check = false;

    if (skipConfirm === true) {
        // Agar Timer ne bheja hai (Line 120 se), toh permission nahi maangega
        check = true; 
    } else {
        // Agar User ne button dabaya hai, toh permission maangega
        check = confirm("Are you sure you want to submit the test and check your result?");
    }

    if (check) {
        // 1. Pehle marks calculate karo
        calculateScore(); 

        // 2. Video loader dikhao
        const loader = document.getElementById('submitLoader');
        const video = document.getElementById('veerVideo');
        if (loader && video) {
            loader.style.display = 'flex';
            video.play();
        }

      
        setTimeout(() => {
            window.location.href = "calculation.html";
        }, 5000);
    }
}
// ========================================================
// ✨ AUTOMATIC FIRST LETTER CAPITAL (NO ALERT)
// ========================================================
const nameInputBox = document.getElementById('user-name');

if (nameInputBox) {
    nameInputBox.addEventListener('blur', function() {
        let name = this.value.trim();
        if (name.length > 0) {
            // Pehle akshar ko Capital karo aur baaki naam ko waise hi jodo
            this.value = name.charAt(0).toUpperCase() + name.slice(1);
        }
    });
}

            // 2. Data save karo Browser Memory mein
            localStorage.setItem('userName', customerName);
            localStorage.setItem('userAge', age);
            localStorage.setItem('userGender', gender);

         
            // 4. Safe Razorpay Pop-up Framework
            var options = {
                "key": "rzp_live_SqZHetYEFPVzEN", // Aapki verified Live API Key
                "amount": "5000", // ₹1 = 100 paise
                "currency": "INR",
                "name": "Space Academy",
                "description": "IQ Assessment Test Fees",
                "capture": true,
                "handler": function (response){
                    // 🔥 Ye tabhi chalega jab payment SAFALTAपूर्वक HO JAYEGI!
                    alert("Payment Successful! ID: " + response.razorpay_payment_id);
                    window.location.href = "instructions.html"; // Seedha instructions par redirection
                },
                "prefill": {
                    "name": customerName
                },
                "theme": {
                    "color": "#28a745" // Green color ka header/button
                }
            };

            var rzp1 = new Razorpay(options);
            rzp1.open();
        });
    }
});
// 1. Common function redirection ke liye
function goToCalculation() {
    console.log("Redirecting to Calculation Page...");
    window.location.href = "calculation.html";
}

// 2. Submit Button ka function
function confirmSubmission() {
    let userConfirm = confirm("Are you sure you want to submit the test and check your result?");
    if (userConfirm) {
        goToCalculation(); // Yahan se redirection hoga
    }
}

// 3. Timer Logic (Jo auto-redirect karega)
const startFinalTimer = () => {
    if (!window.location.href.includes("test.html")) return;
    let timeLeft = 480; // 10 minutes
    const displayElement = document.getElementById('timer-countdown');
    const boxElement = document.getElementById('timer-box');

    setTimeout(() => {
        if (boxElement) boxElement.style.display = 'block';

        const countdownInterval = setInterval(() => {
            let mins = Math.floor(timeLeft / 60);
            let secs = timeLeft % 60;

            if (displayElement) {
                displayElement.innerText = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
            }

            // Jab time khatam ho jaye
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                alert("Time’s Up! Your result is now being calculated.");
                goToCalculation(true); // Auto redirection yahan se hoga
            }
            timeLeft--;
        }, 1000);
    }, 5000); 
};

window.addEventListener('load', startFinalTimer);


function calculateScore() {
    let score = 0;
    // Sahi answers ki list jo aapne banayi thi
    const answers = {
        q1: "C", q2: "A", q3: "C", q4: "B", q5: "B",
        q6: "B", q7: "C", q8: "B", q9: "B", q10: "A",
        q11: "C", q12: "A", q13: "C", q14: "C", q15: "B",
        q16: "D", q17: "B", q18: "C", q19: "B", q20: "B",
        q21: "D", q22: "C", q23: "A", q24: "B", q25: "C",
        q26: "B", q27: "B", q28: "B", q29: "D", q30: "B"
    };

    // Har question check karo
    for (let i = 1; i <= 30; i++) {
        let selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === answers[`q${i}`]) {
            score += 1; 
        }
    }

  // 1. Timer element se bacha hua time uthao (ID ab sahi wali lagao)
// Pehle yahan 'timer' tha, ise badal kar 'timer-countdown' kar do
let timerDisplay = document.getElementById('timer-countdown').innerText; 

// 2. "08:00" ko split karke seconds nikalo
let parts = timerDisplay.split(":");
let m = parseInt(parts[0]);
let s = parseInt(parts[1]);
let secondsRemaining = (m * 60) + s;

// 3. Asli time spent (Total 8 mins = 480s)
let timeSpent = 480 - secondsRemaining; 

// 4. Memory mein save karo
localStorage.setItem("timeTaken", timeSpent); 

    // Score aur Time dono ko memory mein save karo
    localStorage.setItem("userScore", score);
    localStorage.setItem("timeTaken", timeSpent);
    
    // Purana wala 'mentalAge' bhi save rakhte hain taaki calculation page crash na ho
    localStorage.setItem("mentalAge", score); 
}

// Naya logic jo Timer aur Button dono ko handle karega
async function goToCalculation(skipConfirm = false) {
    let check = false;

    if (skipConfirm === true) {
        // Agar Timer ne bheja hai (Line 120 se), toh permission nahi maangega
        check = true; 
    } else {
        // Agar User ne button dabaya hai, toh permission maangega
        check = confirm("Are you sure you want to submit the test and check your result?");
    }

    if (check) {
        // 1. Pehle marks calculate karo
        calculateScore(); 

        // 2. Video loader dikhao
        const loader = document.getElementById('submitLoader');
        const video = document.getElementById('veerVideo');
        if (loader && video) {
            loader.style.display = 'flex';
            video.play();
        }

        // 3. Firebase data save (Ye morning mein set karenge)
        //await saveStudentReport();

        // 4. 5 second baad redirect
        setTimeout(() => {
            window.location.href = "calculation.html";
        }, 5000);
    }
}

// ========================================================
// ✨ AUTOMATIC FIRST LETTER CAPITAL (NO ALERT)
// ========================================================
const nameInputBox = document.getElementById('user-name');

if (nameInputBox) {
    nameInputBox.addEventListener('blur', function() {
        let name = this.value.trim();
        if (name.length > 0) {
            // Pehle akshar ko Capital karo aur baaki naam ko waise hi jodo
            this.value = name.charAt(0).toUpperCase() + name.slice(1);
        }
    });
}