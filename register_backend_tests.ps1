$env:TESTSPRITE_API_KEY = "sk-member-0kxI18XkNLa7QyK-oPuL2Xg3yEYBEdr7HteNXS3kPZo"
$projectId = "e16f07a5-1ce2-4adc-80ad-3cbd5df2ccaf"

$testFiles = @(
    @{ File = "03_swaps_api.py"; Name = "Swaps API - Handshake Protocol" },
    @{ File = "04_initiatives_api.py"; Name = "Initiatives API - Community Actions" },
    @{ File = "05_ratings_api.py"; Name = "Ratings API - Reputation System" },
    @{ File = "06_notifications_api.py"; Name = "Notifications API - Alerts and Push" },
    @{ File = "07_users_api.py"; Name = "Users API - Profile Management" },
    @{ File = "08_tickets_api.py"; Name = "Tickets API - Support Desk" },
    @{ File = "09_alerts_api.py"; Name = "Alerts API - Keyword Subscriptions" },
    @{ File = "10_admin_and_infra.py"; Name = "Admin and Infra - RBAC and Security" }
)

foreach ($test in $testFiles) {
    $relPath = "testsprite_backend_tests/" + $test.File
    Write-Host "Registering: $($test.Name) from $relPath..." -ForegroundColor Yellow
    
    $output = testsprite test create --project $projectId --type backend --name $test.Name --code-file $relPath --output json 2>&1
    Write-Host $output
    Write-Host ""
}

Write-Host "`nAll backend tests registered in TestSprite!" -ForegroundColor Green
