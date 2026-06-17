# check-deploy.ps1
# 自动查 Vercel 部署状态
# 路径: D:\LvyzWeb\platform\check-deploy.ps1

$ErrorActionPreference = "Stop"

# 1. 读 Vercel token
$tokenPath = "D:\LvyzWeb\platform\verceltoken.txt"
if (-not (Test-Path $tokenPath)) {
  Write-Host "[ERROR] Token file not found: $tokenPath"
  exit 1
}
$token = (Get-Content $tokenPath -Raw).Trim()

# 2. 拿最新 deployment
$projectId = "prj_ddagWLE1q2XsqflDmMKAKoq1P05I"
$deployments = curl.exe -sSL -H "Authorization: Bearer $token" "https://api.vercel.com/v6/deployments?projectId=$projectId&limit=1" 2>&1 | Out-String -Stream

# 3. 解析
$deploy = ($deployments | ConvertFrom-Json).deployments[0]
$state = $deploy.readyState
$commit = $deploy.meta.githubCommitSha
$commitMsg = $deploy.meta.githubCommitMessage
$errorCode = $deploy.errorCode
$errorMessage = $deploy.errorMessage
$errorStep = $deploy.errorStep
$url = $deploy.url

Write-Host "==================================="
Write-Host "Vercel Deploy Status"
Write-Host "==================================="
Write-Host "  Commit: $($commit.Substring(0, 7))"
Write-Host "  Message: $($commitMsg.Substring(0, [Math]::Min(80, $commitMsg.Length)))"
Write-Host "  State: $state"
Write-Host "  URL: $url"

if ($state -eq "ERROR") {
  Write-Host "  Error Code: $errorCode"
  Write-Host "  Error Step: $errorStep"
  Write-Host "  Error: $errorMessage"
  Write-Host ""
  Write-Host "=== Latest 20 build events ==="
  $events = curl.exe -sSL -H "Authorization: Bearer $token" "https://api.vercel.com/v1/deployments/$($deploy.id)/events?limit=2000" 2>&1 | Out-String -Stream

  # 找 error 行
  $events | Select-String -Pattern '"level":"error"' | ForEach-Object {
    $line = $_
    $text = ($line -split '"text":"') | Select-Object -Skip 1 | Select-Object -First 1
    if ($text) {
      $text = ($text -split '"')[0]
      Write-Host "  $text"
    }
  } | Select-Object -Last 20
} elseif ($state -eq "READY") {
  Write-Host ""
  Write-Host "  DEPLOYMENT SUCCESSFUL"
  Write-Host "  Site: https://$url"
  Write-Host "  Production: https://lvyz.org (if alias assigned)"
}
