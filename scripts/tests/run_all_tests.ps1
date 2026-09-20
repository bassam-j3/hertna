$env:TESTSPRITE_API_KEY="sk-member-0kxI18XkNLa7QyK-oPuL2Xg3yEYBEdr7HteNXS3kPZo"
$tunnelClient = "2777bf44-afac-4550-95be-6d541de052d4"
$port = 5173

$testIds = @(
    "a3ff4b3f-00b2-43e9-9c8a-12a59f673ac4",
    "aa7b937a-a98f-485a-888b-a917c41a8dde",
    "cd1940a5-c3f0-4129-9c8f-107ca775ad85",
    "ea0a2bc0-65b5-4e1a-88d9-6e04c6faecb9",
    "52f4a1df-c8f4-4e80-8b5d-f8d39f1c868e",
    "37df4a3c-7768-467c-bb9b-b2ac718abd4f",
    "2b2dd96c-13cf-467c-ac49-5848de1d249d",
    "8041aa9d-d540-4f4a-adbb-4c5ff1442ab9",
    "c75d27da-2ee1-4fe8-a233-a37e6feb13ec",
    "056efb5f-f87c-43e2-930c-4f2a56824109",
    "68e93eb3-d34b-4890-ae72-3d8c516c2bd8",
    "05b1e289-4cbe-4951-9f72-4560b942e234",
    "6fa91d96-c841-401e-ac24-4aa6bb02321a",
    "12e70b8d-b35b-466a-87fa-2dc5f6cccbb1",
    "543c6910-45e2-46bb-a58c-71a47c0383c8"
)

$testNames = @(
    "Login Page Loads",
    "Registration Flow",
    "Home Feed Display",
    "Category Filtering",
    "Search Functionality",
    "Map View",
    "Post Detail Modal",
    "Bottom Navigation",
    "Community Initiatives",
    "RTL Arabic Layout",
    "Mobile Responsive",
    "Urgent Posts",
    "Dark Mode Theme",
    "Privacy Pledge",
    "No Errors On Load"
)

$results = @()
for ($i = 0; $i -lt $testIds.Count; $i++) {
    $id = $testIds[$i]
    $name = $testNames[$i]
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "[$($i+1)/$($testIds.Count)] Running: $name" -ForegroundColor Yellow
    Write-Host "Test ID: $id" -ForegroundColor Gray
    Write-Host "========================================" -ForegroundColor Cyan
    
    $output = testsprite test run $id --local $port --tunnel-client $tunnelClient --timeout 300 --output json 2>&1
    $exitCode = $LASTEXITCODE
    
    Write-Host $output
    
    $status = if ($exitCode -eq 0) { "PASSED" } else { "FAILED" }
    $results += [PSCustomObject]@{
        Index = $i + 1
        Name = $name
        Status = $status
        ExitCode = $exitCode
    }
    
    Write-Host "`nResult: $status (exit code: $exitCode)" -ForegroundColor $(if ($exitCode -eq 0) { "Green" } else { "Red" })
}

Write-Host "`n`n========================================"  -ForegroundColor Cyan
Write-Host "FINAL RESULTS SUMMARY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
$results | Format-Table -AutoSize
$passed = ($results | Where-Object { $_.Status -eq "PASSED" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAILED" }).Count
Write-Host "Total: $($results.Count) | Passed: $passed | Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
