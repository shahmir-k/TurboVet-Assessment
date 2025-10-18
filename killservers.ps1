# Kill NX Servers Script
# Finds and terminates processes running on specific ports

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Kill NX Servers" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Function to kill process by port
function Kill-ProcessByPort {
    param (
        [int]$Port,
        [string]$Name
    )
    
    Write-Host "Checking port $Port ($Name)..." -ForegroundColor Yellow
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        
        if ($connections) {
            $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            
            foreach ($processId in $processes) {
                try {
                    $processInfo = Get-Process -Id $processId -ErrorAction Stop
                    Write-Host "  Found process: $($processInfo.ProcessName) (PID: $processId)" -ForegroundColor Gray
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                    Write-Host "  Killed process $processId" -ForegroundColor Green
                }
                catch {
                    Write-Host "  Could not kill process $processId" -ForegroundColor Red
                }
            }
        }
        else {
            Write-Host "  No process found on port $Port" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "  Error checking port $Port" -ForegroundColor Red
        Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Kill backend server (port 3000)
Kill-ProcessByPort -Port 3000 -Name "Backend API"

# Kill frontend server (port 4200)
Kill-ProcessByPort -Port 4200 -Name "Frontend"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Done!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To restart servers:" -ForegroundColor Yellow
Write-Host "  Backend:  npx nx serve api" -ForegroundColor Gray
Write-Host "  Frontend: npx nx serve turbovet_shahmir_khan" -ForegroundColor Gray
Write-Host ""
