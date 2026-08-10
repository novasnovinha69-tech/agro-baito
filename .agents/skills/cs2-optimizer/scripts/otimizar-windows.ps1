# otimizar-windows.ps1
# Aplica otimizacoes seguras no Windows para CS2.
# NAO mexe em BIOS nem em arquivos de sistema protegidos.
# Execute como ADMINISTRADOR.
# Uso: powershell -ExecutionPolicy Bypass -File .\otimizar-windows.ps1

$ErrorActionPreference = "SilentlyContinue"

# Verifica se eh admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "=== ATENCAO ===" -ForegroundColor Red
    Write-Host "Este script precisa ser executado como ADMINISTRADOR." -ForegroundColor Yellow
    Write-Host "Feche o PowerShell, clique com botao direito > 'Executar como administrador' e rode de novo."
    Read-Host "Aperte Enter pra sair"
    exit
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  OTIMIZACAO DO WINDOWS PARA CS2" -ForegroundColor Cyan
Write-Host "  Ryzen 7 5700G + RTX 5060 + 32GB RAM" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script vai aplicar otimizacoes SEGURAS."
Write-Host "Nada destrutivo. Tudo pode ser revertido."
Write-Host ""
$confirma = Read-Host "Quer continuar? (s/N)"
if ($confirma -ne "s" -and $confirma -ne "S") {
    Write-Host "Cancelado. Nada foi alterado." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host ">>> [1/8] Plano de energia: Alto desempenho..." -ForegroundColor Green
# Salva o plano atual pra reverter depois
$planoAtual = powercfg /getactivescheme
Write-Host "    Plano anterior: $planoAtual" -ForegroundColor DarkGray
# Ativa Alto Desempenho
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>$null
# Tenta criar/ativar Desempenho Maximo (Ultimate)
$ultimate = powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 2>$null
if ($ultimate) {
    $ultimateGuid = ($ultimate -split " ")[-1] -replace "[():]", ""
    powercfg /setactive $ultimateGuid.Trim() 2>$null
}
Write-Host "    OK - Plano trocado para Alto Desempenho / Desempenho Maximo" -ForegroundColor Green

Write-Host ""
Write-Host ">>> [2/8] Game Mode: ATIVADO..." -ForegroundColor Green
$path = "HKCU:\Software\Microsoft\GameBar"
if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null }
Set-ItemProperty -Path $path -Name "AutoGameModeEnabled" -Value 1 -Type DWord
Write-Host "    OK - Game Mode ativado" -ForegroundColor Green

Write-Host ""
Write-Host ">>> [3/8] Xbox Game DVR / Captura: DESATIVADO..." -ForegroundColor Green
$path1 = "HKCU:\System\GameConfigStore"
if (-not (Test-Path $path1)) { New-Item -Path $path1 -Force | Out-Null }
Set-ItemProperty -Path $path1 -Name "GameDVR_Enabled" -Value 0 -Type DWord

$path2 = "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR"
if (-not (Test-Path $path2)) { New-Item -Path $path2 -Force | Out-Null }
Set-ItemProperty -Path $path2 -Name "AppCaptureEnabled" -Value 0 -Type DWord
Write-Host "    OK - Game DVR desativado (libera overhead de gravacao)" -ForegroundColor Green

Write-Host ""
Write-Host ">>> [4/8] Aceleracao de mouse: DESATIVADA (raw input)..." -ForegroundColor Green
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseSpeed" -Value 0
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold1" -Value 0
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold2" -Value 0
Write-Host "    OK - Mouse sem aceleracao (ideal pra CS2)" -ForegroundColor Green

Write-Host ""
Write-Host ">>> [5/8] HAGS (Agendamento de GPU por hardware): ATIVADO..." -ForegroundColor Green
$hagsPath = "HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers"
Set-ItemProperty -Path $hagsPath -Name "HwSchMode" -Value 2 -Type DWord -ErrorAction SilentlyContinue
Write-Host "    OK - HAGS ativado (precisa reiniciar pra valer)" -ForegroundColor Green

Write-Host ""
Write-Host ">>> [6/8] Telemetria (DiagTrack): DESATIVADA..." -ForegroundColor Green
Stop-Service -Name "DiagTrack" -Force -ErrorAction SilentlyContinue
Set-Service -Name "DiagTrack" -StartupType Disabled -ErrorAction SilentlyContinue
Write-Host "    OK - Servico de telemetria parado e desativado" -ForegroundColor Green

Write-Host ""
Write-Host ">>> [7/8] SysMain (Superfetch): DESATIVADO..." -ForegroundColor Green
Write-Host "    (Voce tem SSD + 32GB RAM, SysMain nao ajuda e pode atrapalhar)" -ForegroundColor DarkGray
Stop-Service -Name "SysMain" -Force -ErrorAction SilentlyContinue
Set-Service -Name "SysMain" -StartupType Disabled -ErrorAction SilentlyContinue
Write-Host "    OK - SysMain parado e desativado" -ForegroundColor Green

Write-Host ""
Write-Host ">>> [8/8] WSearch (Indexacao): DESATIVADO..." -ForegroundColor Green
Write-Host "    (Indexa arquivos em background, consome CPU/DISCO)" -ForegroundColor DarkGray
Stop-Service -Name "WSearch" -Force -ErrorAction SilentlyContinue
Set-Service -Name "WSearch" -StartupType Disabled -ErrorAction SilentlyContinue
Write-Host "    OK - Windows Search parado e desativado" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  OTIMIZACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "RECOMENDACOES:" -ForegroundColor Yellow
Write-Host "  - Reinicie o PC para todas as mudancas fazerem efeito"
Write-Host "  - Ainda falta o mais importante: ATIVAR XMP NA BIOS"
Write-Host "    (sua RAM esta em 2800MT/s, pode ir ate 3200-3600MT/s)"
Write-Host "  - Configure o Painel NVIDIA (desempenho maximo)"
Write-Host "  - Coloque as launch options na Steam"
Write-Host ""
Write-Host "Para REVERTER (se algo der errado):" -ForegroundColor Yellow
Write-Host "  - Plano de energia: powercfg /setactive <guid-anterior>"
Write-Host "  - Servicos: Set-Service -Name SysMain -StartupType Automatic; Start-Service SysMain"
Write-Host "  - O resto eh so reativar no mesmo caminho do registro"
Write-Host ""
Read-Host "Aperte Enter pra fechar"
