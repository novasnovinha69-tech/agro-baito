# analyze-windows.ps1
# Analisa configuracoes do Windows que afetam FPS. NAO ALTERA NADA - so le.
# Uso: powershell.exe -ExecutionPolicy Bypass -File analyze-windows.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host "=== ANALISE DO WINDOWS ===" -ForegroundColor Cyan

# Plano de energia
$powerPlan = (powercfg /getactivescheme) -replace "Power Scheme GUID: .*?\(([0-9a-f-]+)\)\s*", ""
Write-Host "Plano de energia atual: $powerPlan"
if ($powerPlan -notmatch "Ultimate|Alto|High") {
    Write-Host "  >> RECOMENDADO: trocar para 'Alto desempenho' ou 'Desempenho Maximo'." -ForegroundColor Yellow
}

# Game Mode
$gameMode = Get-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar" -Name "AutoGameModeEnabled" -ErrorAction SilentlyContinue
$gameModeVal = if ($null -eq $gameMode.AutoGameModeEnabled) { "N/A (padrao)" } else { $gameMode.AutoGameModeEnabled }
Write-Host "Game Mode: $gameModeVal (deve estar 1 = ativado)"

# Xbox Game Bar / DVR
$dvr = Get-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_Enabled" -ErrorAction SilentlyContinue
$dvrVal = if ($null -eq $dvr.GameDVR_Enabled) { "N/A" } else { $dvr.GameDVR_Enabled }
Write-Host "Xbox Game DVR: $dvrVal (0 = desativado, melhor para FPS)"
$bgRec = Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR" -Name "AppCaptureEnabled" -ErrorAction SilentlyContinue
$bgRecVal = if ($null -eq $bgRec.AppCaptureEnabled) { "N/A" } else { $bgRec.AppCaptureEnabled }
Write-Host "Captura em background: $bgRecVal (0 = desativado, melhor)"

# Servicos que costumam pesar e raramente sao essenciais para gaming
Write-Host "--- Servicos pesados rodando ---"
$heavyServices = @("SysMain","DiagTrack","WSearch","WMPNetworkSvc","Fax","lfsvc","MapsBroker","RetailDemo")
foreach ($svc in $heavyServices) {
    $s = Get-Service -Name $svc -ErrorAction SilentlyContinue
    if ($s -and $s.Status -eq "Running") {
        Write-Host "  [RODANDO] $svc ($($s.DisplayName))"
    }
}
Write-Host "  >> SysMain (Superfetch): util em HDD, pode ser desativado em SSD com RAM 16GB+." -ForegroundColor DarkGray
Write-Host "  >> DiagTrack (Telemetria): coleta dados em background, seguro desativar." -ForegroundColor DarkGray
Write-Host "  >> WSearch (Windows Search): indexa arquivos em background. Pause se nao usa busca." -ForegroundColor DarkGray

# Apps de inicializacao com impacto
Write-Host "--- Apps na inicializacao (impacto alto) ---"
$startup = Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location
$startupApps = Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -ErrorAction SilentlyContinue
if ($startupApps) {
    $startupApps.PSObject.Properties | Where-Object { $_.Name -notmatch "^PS" } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Value)"
    }
}
Write-Host "  >> Apps como Spotify, Skype, Cortana, OneDrive etc. consomem RAM/CPU. Desative os que nao usa." -ForegroundColor DarkGray

# Uso atual
$cpuLoad = (Get-CimInstance Win32_Processor).LoadPercentage
$os = Get-CimInstance Win32_OperatingSystem
$freeRAM = [math]::Round($os.FreePhysicalMemory / 1MB, 1)
$totalRAM = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
$usedPct = [math]::Round((($totalRAM - $freeRAM) / $totalRAM) * 100, 0)
Write-Host "--- Uso atual ---"
Write-Host "CPU em uso: ${cpuLoad}%"
Write-Host "RAM: ${usedPct}% usada (${freeRAM}GB livres de ${totalRAM}GB)"

# Processos que mais consomem
Write-Host "--- Top 8 processos por uso de RAM ---"
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 8 | ForEach-Object {
    $ramMB = [math]::Round($_.WorkingSet64 / 1MB, 0)
    Write-Host "  $($_.Name): ${ramMB}MB"
}

# Aceleracao de hardware do mouse (desligar para CS2)
Write-Host "--- Aceleracao de mouse ---"
$mouseSpeed = (Get-ItemProperty "HKCU:\Control Panel\Mouse" -Name "MouseSpeed" -ErrorAction SilentlyContinue).MouseSpeed
$mouseThresh1 = (Get-ItemProperty "HKCU:\Control Panel\Mouse" -Name "MouseThreshold1" -ErrorAction SilentlyContinue).MouseThreshold1
$mouseThresh2 = (Get-ItemProperty "HKCU:\Control Panel\Mouse" -Name "MouseThreshold2" -ErrorAction SilentlyContinue).MouseThreshold2
Write-Host "  MouseSpeed: $mouseSpeed | Threshold1: $mouseThresh1 | Threshold2: $mouseThresh2"
Write-Host "  >> Para CS2, ideal: MouseSpeed=0, Threshold1=0, Threshold2=0 (sem aceleracao)." -ForegroundColor DarkGray

Write-Host ""
Write-Host "=== FIM DA ANALISE (nada foi alterado) ===" -ForegroundColor Cyan
