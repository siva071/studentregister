# PowerShell script to test n8n webhook
Write-Host "Testing n8n webhook..." -ForegroundColor Yellow

# Test 1: Basic connectivity
Write-Host "`n1. Testing basic connectivity..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "https://n8nnserver.duckdns.org" -Method GET
    Write-Host "✅ n8n server is accessible!" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot reach n8n server: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 2: Webhook POST
Write-Host "`n2. Testing webhook POST..." -ForegroundColor Cyan
try {
    $body = @{
        test = "powershell_test"
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "https://n8nnserver.duckdns.org/webhook/register" `
                                -Method POST `
                                -ContentType "application/json" `
                                -Body $body
    
    Write-Host "✅ Webhook POST successful!" -ForegroundColor Green
    Write-Host "Response: $response" -ForegroundColor White
} catch {
    Write-Host "❌ Webhook POST failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

# Test 3: Razorpay format
Write-Host "`n3. Testing Razorpay webhook format..." -ForegroundColor Cyan
try {
    $razorpayBody = @{
        event = "payment_link.paid"
        payload = @{
            payment_link = @{
                entity = @{
                    customer = @{
                        name = "Test User"
                        email = "test@example.com"
                        contact = "+919876543210"
                    }
                }
            }
            payment = @{
                entity = @{
                    id = "pay_test_123456"
                    status = "captured"
                    amount = 1900
                    currency = "INR"
                }
            }
        }
    } | ConvertTo-Json -Depth 10
    
    $response = Invoke-RestMethod -Uri "https://n8nnserver.duckdns.org/webhook/register" `
                                -Method POST `
                                -ContentType "application/json" `
                                -Headers @{"x-razorpay-signature" = "test_signature"} `
                                -Body $razorpayBody
    
    Write-Host "✅ Razorpay format successful!" -ForegroundColor Green
    Write-Host "Response: $response" -ForegroundColor White
} catch {
    Write-Host "❌ Razorpay format failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host "`n🔍 Check n8n dashboard → Executions for test results!" -ForegroundColor Yellow
