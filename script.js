// RRB NTPC Mock Test Registration - Version 34.0 - FORM + DIRECT PAYMENT LINK
console.log('🚀🚀🚀 SCRIPT V34.0 LOADED - FORM + DIRECT PAYMENT LINK');

document.addEventListener('DOMContentLoaded', function() {
    // Add visual indicator that new version is loaded
    document.body.style.borderTop = '5px solid #ff0000';
    setTimeout(() => {
        document.body.style.borderTop = 'none';
    }, 3000);
    
    const form = document.getElementById('registrationForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const loadingSpinner = document.getElementById('loadingSpinner');
    let isSubmitting = false;

    // Add input event listeners for real-time validation
    const inputs = ['name', 'email', 'phone', 'dob'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateForm);
    });
    
    // Add checkbox event listener
    const termsCheckbox = document.getElementById('terms');
    termsCheckbox.addEventListener('change', validateForm);

    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const dob = document.getElementById('dob').value.trim();
        const terms = document.getElementById('terms').checked;
        const submitBtn = document.getElementById('submitBtn');

        let isValid = true;

        // Name validation - must not be empty
        if (name.length === 0 || name.trim() === '') {
            showError('name');
            isValid = false;
        }

        // Email validation - must not be empty and valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('email');
            isValid = false;
        }

        // Phone validation - must not be empty and 10 digits
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phone || !phoneRegex.test(phone)) {
            showError('phone');
            isValid = false;
        }

        // DOB validation - must not be empty and DD/MM/YYYY format
        const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dob || !dobRegex.test(dob)) {
            showError('dob');
            isValid = false;
        }

        // Terms validation - must be checked
        if (!terms) {
            showError('terms');
            isValid = false;
        }

        // Enable/disable submit button based on validation
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            submitBtn.onclick = function() {
                payNow();
                return false;
            };
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            submitBtn.onclick = null;
        }

        return isValid;
    }

    // Pay Now function
    async function payNow() {
        try {
            const res = await fetch("/create-order", { method: "POST" });
            const order = await res.json();

            const options = {
                key: "rzp_live_xxxxx",
                amount: order.amount,
                currency: "INR",
                order_id: order.id,
                handler: async function (response) {
                    await fetch("/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    alert("Payment Successful");
                },
            };

            const rzp = new Razorpay(options);
            rzp.open();
            
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
        }
    }

    // Show error message and red border
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        
        // Add red border to invalid field
        field.classList.add('border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-gray-300', 'focus:ring-purple-500');
        
        // Remove error when user starts typing
        field.addEventListener('input', function() {
            field.classList.remove('border-red-500', 'focus:ring-red-500');
            field.classList.add('border-gray-300', 'focus:ring-purple-500');
        });
    }

    // Get form data
    function getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            dob: document.getElementById('dob').value.trim()
        };
    }

    // Check for duplicate registration
    async function checkDuplicateRegistration(email, phone) {
        try {
            console.log('🔍 Checking for duplicate registration...');
            
            const response = await fetch('https://n8nnserver.duckdns.org/api/check-duplicate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    phone: phone
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.exists; // true if duplicate found
            } else {
                console.log('❌ Duplicate check failed');
                return false;
            }
        } catch (error) {
            console.log('❌ Error checking duplicate:', error.message);
            return false;
        }
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <div class="text-red-600 text-xl mr-3">⚠️</div>
                <div>
                    <h4 class="text-red-800 font-semibold">Registration Error</h4>
                    <p class="text-red-600 text-sm">${message}</p>
                </div>
            </div>
        `;
        
        // Insert error message before form
        const form = document.getElementById('registrationForm');
        form.parentNode.insertBefore(errorDiv, form);
        
        // Remove error after 10 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 10000);
    }

    // Get payment amount based on selection
    function getPaymentAmount() {
        const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
        return paymentType === 'test' ? 100 : 1900; // ₹1 = 100 paise, ₹19 = 1900 paise
    }

    // Get payment amount text
    function getPaymentAmountText() {
        const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
        return paymentType === 'test' ? '₹1' : '₹19';
    }

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isSubmitting) {
            console.log('⚠️ Form already submitting...');
            return;
        }

        if (!validateForm()) {
            console.log('❌ Form validation failed');
            return;
        }

        isSubmitting = true;
        
        const formData = getFormData();
        
        // Check for duplicates first
        const isDuplicate = await checkDuplicateRegistration(formData.email, formData.phone);
        
        if (isDuplicate) {
            showError('This email or phone number is already registered. Please use different details or contact support.');
            isSubmitting = false;
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.onclick = null;
    }
                document.getElementById('paymentProcessingSection').classList.remove('hidden');
                monitorPaymentStatus(paymentId);
            }

            // Redirect to Razorpay payment link
            window.location.href = orderData.short_url;
            
        } catch (error) {
            console.error('Payment initiation error:', error);
            alert('Failed to initiate payment. Please try again.');
            submitBtn.disabled = false;
            loadingSpinner.classList.remove('show');
            isSubmitting = false;
        }
    });

    // Check payment status from n8n
    async function checkPaymentStatus(paymentId) {
        try {
            console.log('🔍 Checking payment status for:', paymentId);
            
            const response = await fetch(`https://n8nnserver.duckdns.org/api/payment-status/${paymentId}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Payment status:', data);
                return data;
            } else {
                console.log('❌ Payment status check failed');
                return null;
            }
        } catch (error) {
            console.log('❌ Error checking payment status:', error.message);
            return null;
        }
    }

    // Monitor payment status after redirect
    async function monitorPaymentStatus(paymentId, maxAttempts = 10) {
        let attempts = 0;
        
        const checkStatus = async () => {
            attempts++;
            console.log(`🔍 Checking payment status (attempt ${attempts}/${maxAttempts})`);
            
            try {
                const status = await checkPaymentStatus(paymentId);
                
                if (status && status.success) {
                    // Payment successful - show UID
                    showSuccessOnPage(status.uuid);
                    return true;
                } else if (status && status.error) {
                    // Payment failed - show error
                    showPaymentError(status.error || 'Payment processing failed');
                    return true;
                }
            } catch (error) {
                console.log('Status check error:', error.message);
            }
            
            if (attempts < maxAttempts) {
                setTimeout(checkStatus, 3000);
            } else {
                // Max attempts reached
                showPaymentError('Payment verification timed out. Please check your email for your UID.');
                return true;
            }
        };
        
        // Start checking after 5 seconds
        setTimeout(checkStatus, 5000);
    }

    // Show payment success on page
    function showSuccessOnPage(uid) {
        // Hide processing section and show success section
        document.getElementById('paymentProcessingSection').classList.add('hidden');
        document.getElementById('successSection').classList.remove('hidden');
        
        // Set the UID only for successful payment
        document.getElementById('pageUID').textContent = uid;
        
        console.log('✅ Success shown on page with UID:', uid);
        
        // Store UID in localStorage for reference
        localStorage.setItem('last_uid', uid);
        localStorage.setItem('registration_success', 'true');
    }

    // Show payment error on page
    function showPaymentError(message) {
        // Hide processing section and show error
        document.getElementById('paymentProcessingSection').classList.add('hidden');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-6 text-center';
        errorDiv.innerHTML = `
            <div class="text-red-600 text-4xl mb-4">❌</div>
            <h3 class="text-xl font-bold text-red-800 mb-2">Payment Processing Failed</h3>
            <p class="text-red-600 mb-4">${message}</p>
            <button onclick="location.reload()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
                Try Again
            </button>
        `;
        
        // Replace form with error message
        document.getElementById('registrationForm').innerHTML = '';
        document.getElementById('registrationForm').appendChild(errorDiv);
        
        console.log('❌ Payment error shown:', message);
    }

    // Close modal
    function closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

        const checkStatus = async () => {
            attempts++;
            console.log(`🔍 Checking payment status (attempt ${attempts}/${maxAttempts})`);
            
            try {
                const status = await checkPaymentStatus(paymentId);
                
                if (status && status.success) {
                    // Payment processed successfully
                    showSuccessOnPage(status.uuid);
                    return true;
                } else if (status && status.error) {
                    // Payment failed
                    showPaymentError(status.error);
                    return true;
                }
            } catch (error) {
                console.log('Status check error:', error.message);
            }
            
            if (attempts < maxAttempts) {
                // Check again after 3 seconds
                setTimeout(checkStatus, 3000);
            } else {
                // Max attempts reached
                showPaymentError('Payment verification timed out. Please check your email for login details.');
            }
        };
        
        // Start checking after 5 seconds
        setTimeout(checkStatus, 5000);
    }

    // Close modal
    function closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    // Test UID synchronization
    function testUidSync() {
        console.log('🔧 Testing UID synchronization...');
        
        const testUid = Date.now().toString();
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            dob: '01/01/2000',
            paymentId: 'test_payment_' + testUid,
            uid: testUid
        };
        
        console.log('📤 Sending test data:', testData);
        
        fetch('https://n8nnserver.duckdns.org/webhook/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        })
        .then(response => response.json())
        .then(result => {
            console.log('📥 Test response:', result);
            
            if (result[0] && result[0].json && result[0].json.uuid === testUid) {
                console.log('✅ UID synchronization WORKING! Same UID returned:', result[0].json.uuid);
                alert('✅ UID synchronization is working! UID: ' + result[0].json.uuid);
            } else {
                console.log('❌ UID synchronization FAILED! Expected:', testUid, 'Got:', result[0]?.json?.uuid);
                alert('❌ UID synchronization failed! Check n8n code.');
            }
        })
        .catch(error => {
            console.error('❌ Test error:', error);
            alert('❌ Test failed: ' + error.message);
        });
    }

    // Check if we need to show payment processing
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('payment_id');
    
    // Check if user already has a UID (prevent duplicate registration)
    const lastUid = localStorage.getItem('last_uid');
    const hasRegistered = localStorage.getItem('registration_success') === 'true';
    
    if (paymentId) {
        console.log('🔄 Payment detected, monitoring status...');
        document.getElementById('registrationForm').style.display = 'none';
        document.getElementById('paymentProcessingSection').classList.remove('hidden');
        monitorPaymentStatus(paymentId);
    } else if (hasRegistered && lastUid) {
        // User already registered - try to get previous data
        console.log('🔄 User already registered, checking for previous data...');
        document.getElementById('paymentProcessingSection').classList.add('hidden');
        document.getElementById('registrationForm').style.display = 'block';
        document.getElementById('successSection').classList.add('hidden');
        
        // Try to get previous registration data
        getPreviousRegistrationData(lastUid);
    }

    // Get previous registration data
    async function getPreviousRegistrationData(uid) {
        try {
            console.log('🔍 Fetching previous registration data for UID:', uid);
            
            const response = await fetch(`https://n8nnserver.duckdns.org/api/previous-registration/${uid}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Previous registration data found:', data);
                
                // Pre-populate form with previous data
                if (data.email) document.getElementById('email').value = data.email;
                if (data.phone) document.getElementById('phone').value = data.phone;
                if (data.name) document.getElementById('name').value = data.name;
                if (data.dob) document.getElementById('dob').value = data.dob;
                
                // Show info about previous registration
                const infoDiv = document.createElement('div');
                infoDiv.className = 'bg-green-50 border border-green-200 rounded-lg p-4 mb-4';
                infoDiv.innerHTML = `
                    <div class="text-green-800 text-lg font-semibold mb-2">📋 Previous Registration Found</div>
                    <p class="text-green-600 mb-2">Found your previous registration:</p>
                    <div class="bg-white rounded p-3 mb-3">
                        <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
                        <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
                        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
                        <p><strong>UID:</strong> ${uid}</p>
                    </div>
                    <p class="text-green-600 text-sm">You can use the same details or modify them below.</p>
                `;
                
                // Insert info before form
                const form = document.getElementById('registrationForm');
                form.parentNode.insertBefore(infoDiv, form);
                
                // Enable submit button
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                submitBtn.onclick = function() {
                    window.location.href = 'https://rzp.io/rzp/hoLCfCC';
                    return false;
                };
                
            } else {
                console.log('❌ No previous registration data found');
            }
        } catch (error) {
            console.log('❌ Error fetching previous data:', error.message);
        }
    }

    // Add test button (remove in production)
    /*
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test Registration (No Payment)';
    testBtn.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-50';
    testBtn.onclick = testUidSync;
    document.body.appendChild(testBtn);
    */
});
