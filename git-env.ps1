# Load the project-local Git and GitHub CLI tools into the current PowerShell session.
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$GitPath = Join-Path $Root ".tools\git\cmd"
$GhPath = Join-Path $Root ".tools\gh\bin"

if (-not (Test-Path (Join-Path $GitPath "git.exe"))) {
    Write-Error "Project-local Git was not found at $GitPath. Reinstall or restore .tools."
    exit 1
}

if (-not (Test-Path (Join-Path $GhPath "gh.exe"))) {
    Write-Error "Project-local GitHub CLI was not found at $GhPath. Reinstall or restore .tools."
    exit 1
}

$env:Path = "$GitPath;$GhPath;$env:Path"
Write-Host "Project Git environment loaded." -ForegroundColor Green
git --version
gh --version
