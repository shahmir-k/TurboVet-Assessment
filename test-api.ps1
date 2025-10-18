# TurboVet API Test Script

Write-Host "TurboVet Backend API Test" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login as Owner
Write-Host "1. Testing login as Owner..." -ForegroundColor Yellow
$loginBody = @{
    email    = "owner@turbovet.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "SUCCESS: Login successful!" -ForegroundColor Green
    Write-Host "User: $($loginResponse.user.firstName) $($loginResponse.user.lastName)" -ForegroundColor Gray
    Write-Host "Role: $($loginResponse.user.roleType)" -ForegroundColor Gray
    $token = $loginResponse.accessToken
}
catch {
    Write-Host "FAILED: Could not log in" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Create a Task
Write-Host "2. Creating a new task..." -ForegroundColor Yellow
$taskBody = @{
    title       = "Test Task from API"
    description = "This task was created via API test"
    status      = "todo"
    category    = "work"
    priority    = 8
} | ConvertTo-Json

try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $createResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method Post -Body $taskBody -ContentType "application/json" -Headers $headers
    Write-Host "SUCCESS: Task created!" -ForegroundColor Green
    Write-Host "Task ID: $($createResponse.id)" -ForegroundColor Gray
    Write-Host "Title: $($createResponse.title)" -ForegroundColor Gray
    $taskId = $createResponse.id
}
catch {
    Write-Host "FAILED: Could not create task" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Test 3: Get All Tasks
Write-Host "3. Retrieving all tasks..." -ForegroundColor Yellow
try {
    $tasksResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method Get -Headers $headers
    Write-Host "SUCCESS: Retrieved $($tasksResponse.Count) task(s)" -ForegroundColor Green
}
catch {
    Write-Host "FAILED: Could not retrieve tasks" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Test 4: View Audit Logs
Write-Host "4. Retrieving audit logs..." -ForegroundColor Yellow
try {
    $auditResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/audit-log" -Method Get -Headers $headers
    Write-Host "SUCCESS: Retrieved $($auditResponse.Count) audit log(s)" -ForegroundColor Green
}
catch {
    Write-Host "FAILED: Could not retrieve audit logs" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "API Testing Complete!" -ForegroundColor Cyan
