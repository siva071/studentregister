const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (data) => {
    try {
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: data.email,
            subject: '🎉 RRB NTPC Mock Test Registration Successful - Job Alerts Telugu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">🎉 Registration Successful!</h1>
                        <p style="margin: 10px 0; font-size: 16px;">Welcome to Job Alerts Telugu - RRB NTPC Mock Test Platform</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f9f9f9; border-radius: 10px; margin: 20px 0;">
                        <h2 style="color: #333; margin-top: 0;">Your Registration Details</h2>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
                            <p style="margin: 10px 0;"><strong>🔢 Unique ID (UID):</strong> <span style="background: #667eea; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">${data.uuid}</span></p>
                            <p style="margin: 10px 0;"><strong>👤 Name:</strong> ${data.name}</p>
                            <p style="margin: 10px 0;"><strong>📧 Email:</strong> ${data.email}</p>
                            <p style="margin: 10px 0;"><strong>📱 Phone:</strong> ${data.phone || 'Not provided'}</p>
                            <p style="margin: 10px 0;"><strong>🎂 Date of Birth:</strong> ${data.dob}</p>
                            <p style="margin: 10px 0;"><strong>💳 Payment ID:</strong> ${data.paymentId || 'Pending'}</p>
                            <p style="margin: 10px 0;"><strong>📅 Registration Date:</strong> ${new Date(data.registeredAt).toLocaleDateString()}</p>
                            <p style="margin: 10px 0;"><strong>📊 Test Status:</strong> <span style="color: #28a745; font-weight: bold;">${data.testStatus}</span></p>
                        </div>
                        
                        <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
                            <h3 style="margin-top: 0; color: #007bff;">� What You'll Get After Exam Completion:</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li><strong>🏆 Detailed Performance Analysis:</strong> Complete breakdown of your performance</li>
                                <li><strong>📈 Your Rank & Position:</strong> Know where you stand among all test takers</li>
                                <li><strong>🎯 Improvement Suggestions:</strong> Specific topics to focus on for better scores</li>
                                <li><strong>📚 Subject-wise Performance:</strong> Detailed analysis of each section</li>
                                <li><strong>⏰ Time Management Report:</strong> Analysis of your speed and accuracy</li>
                            </ul>
                        </div>
                        
                        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0;">
                            <h3 style="margin-top: 0; color: #856404;">�🔐 Important Instructions</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Save your UID <strong>${data.uuid}</strong> for future login</li>
                                <li>Use this UID to access your test dashboard</li>
                                <li>Keep your payment ID for reference</li>
                                <li>Check your email for test schedules and results</li>
                                <li>Performance report will be sent immediately after exam completion</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                🚀 Go to Test Dashboard
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
                        <p>Best regards,<br>Job Alerts Telugu Team</p>
                        <p>📧 support@jobalertstelugu.com | 🌐 www.jobalertstelugu.com</p>
                        <p>🚆 Preparing you for RRB NTPC Success!</p>
                    </div>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('📧 Welcome email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('❌ Email service error:', error.message);
        throw new Error('Failed to send welcome email');
    }
};

module.exports = { sendWelcomeEmail };
