param([Parameter(Mandatory = $true)][string] $Tarball)
$ErrorActionPreference = 'Stop'
$testRoot = Join-Path $env:RUNNER_TEMP 'tg ready install'
$prefix = Join-Path $testRoot 'npm prefix'
$secondPrefix = Join-Path $testRoot 'npm ignored scripts'
$env:CI = 'true'
$env:TG_CONFIG_DIR = Join-Path $testRoot 'config'
$env:TG_STATE_DIR = Join-Path $testRoot 'state'
$env:TG_CACHE_DIR = Join-Path $testRoot 'cache'
$env:MESSAGING_STORE = Join-Path $testRoot 'messages.db'
$env:TG_INSTALL_AGENT = 'all'
$env:TG_NO_UPDATE_CHECK = '1'
$node = (Get-Command node | Select-Object -First 1).Source
$powershell = (Get-Command powershell.exe | Select-Object -First 1).Source
$nodeDirectory = Split-Path $node -Parent
$key = [Microsoft.Win32.Registry]::CurrentUser.CreateSubKey('Environment')
$sentinel = '%LOCALAPPDATA%\WireCat existing folder'
$key.SetValue('Path', $sentinel, [Microsoft.Win32.RegistryValueKind]::ExpandString)
$key.Dispose()
if (Get-Command tg -ErrorAction SilentlyContinue) { throw 'Expected tg to be absent before install.' }

# The actual packed npm lifecycle hook must persist PATH and install skills without login.
& npm.cmd install --global --prefix $prefix --allow-scripts=@leemour/tg-cli --foreground-scripts $Tarball
if ($LASTEXITCODE -ne 0) { throw 'Packed global npm install failed.' }
$key = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey('Environment')
$userPath = [string] $key.GetValue('Path', '', [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
$kind = $key.GetValueKind('Path')
$key.Dispose()
if (-not $userPath.Contains($sentinel) -or -not $userPath.Contains($prefix)) { throw 'User PATH was lost or not repaired.' }
if ($kind -ne [Microsoft.Win32.RegistryValueKind]::ExpandString) { throw 'PATH registry type changed.' }
foreach ($dir in @('.agents', '.claude')) {
    $file = Join-Path $env:USERPROFILE "$dir/skills/tg-cli/SKILL.md"
    if (-not (Test-Path $file) -or (Get-Content $file -Raw) -notmatch 'name: tg-cli') { throw 'Install did not install the skill.' }
}
if (Test-Path (Join-Path $prefix 'tg.ps1')) { throw 'Unsigned PowerShell shim still shadows tg.cmd.' }

# Rebuild PATH from persistent registry values, not the installer or npm process environment.
$env:Path = [Environment]::ExpandEnvironmentVariables("$([Environment]::GetEnvironmentVariable('Path', 'Machine'));$userPath")
& $powershell -NoProfile -ExecutionPolicy Restricted -Command 'tg --version; if ($LASTEXITCODE -ne 0) { exit 1 }; tg skill show | Out-Null; if ($LASTEXITCODE -ne 0) { exit 1 }'
if ($LASTEXITCODE -ne 0) { throw 'Fresh restricted PowerShell cannot run bare tg.' }

$installer = Join-Path $prefix 'node_modules/@leemour/tg-cli/install/windows.ps1'
$before = $userPath
& $installer -RepairOnly -Prefix $prefix -NodeDirectory $nodeDirectory -Json
if ($LASTEXITCODE -ne 0) { throw 'Repeated PATH repair failed.' }
$key = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey('Environment')
$after = [string] $key.GetValue('Path', '', [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
$key.Dispose()
if ($before -cne $after) { throw 'Repeated repair duplicated or rewrote PATH.' }

# Explicit installer must complete even when npm lifecycle scripts are disabled.
$env:npm_config_ignore_scripts = 'true'
$result = & $installer -Prefix $secondPrefix -PackageSpec $Tarball -Agent codex -Json
if ($LASTEXITCODE -ne 0) { throw 'Installer did not handle disabled lifecycle scripts.' }
$result = ($result -join "`n") | ConvertFrom-Json
if ($result.tool -ne 'tg' -or $result.written.Count -ne 1) { throw 'Installer result is incomplete.' }
& tg --version
if ($LASTEXITCODE -ne 0) { throw 'Current shell cannot run bare tg after installer.' }
Write-Output 'PASS: persistent and current PATH, restricted PowerShell, automatic skills, repeat install, disabled scripts'
