# desativar-igpu.ps1
# Desativa a GPU integrada (iGPU) do Ryzen pra evitar conflito com a RTX 5060.
# VOCE so usa a RTX 5060, entao a iGPU nao serve pra nada.
# Uso: powershell -ExecutionPolicy Bypass -File .\desativar-igpu.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DESATIVAR GPU INTEGRADA (iGPU) DO RYZEN" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Voce usa somente a RTX 5060. A GPU integrada do Ryzen"
Write-Host "(AMD Radeon Graphics) nao serve pra nada e pode causar"
Write-Host "conflito de driver (o dela eh de 2023, bem antigo)."
Write-Host ""
Write-Host "Vamos desativa-la pelo Gerenciador de Dispositivos."
Write-Host "Nao vai desinstalar, so desativar. Pode reativar quando quiser."
Write-Host ""

# Lista as GPUs ativas
Write-Host "GPUs detectadas:" -ForegroundColor Cyan
$gpus = Get-CimInstance Win32_VideoController
foreach ($gpu in $gpus) {
    Write-Host "  - $($gpu.Name)"
}
Write-Host ""

$confirma = Read-Host "Quer desativar a AMD Radeon Graphics? (s/N)"
if ($confirma -ne "s" -and $confirma -ne "S") {
    Write-Host "Cancelado." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Procurando AMD Radeon Graphics..." -ForegroundColor Green

# Usa PnPDevice pra achar e desativar
$amdGpu = Get-PnpDevice | Where-Object {
    $_.FriendlyName -match "AMD Radeon" -and
    $_.Class -eq "Display" -and
    $_.Status -eq "OK"
}

if ($amdGpu) {
    foreach ($gpu in $amdGpu) {
        Write-Host "Desativando: $($gpu.FriendlyName)..." -ForegroundColor Green
        try {
            Disable-PnpDevice -InstanceId $gpu.InstanceId -Confirm:$false -ErrorAction Stop
            Write-Host "  OK - Desativado!" -ForegroundColor Green
        } catch {
            Write-Host "  ERRO: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  Tente abrir o PowerShell como Administrador." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "AMD Radeon Graphics nao encontrada (talvez ja esteja desativada)." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CONCLUIDO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "REINICIE O PC pra a mudanca fazer efeito." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para REATIVAR (se precisar no futuro):" -ForegroundColor DarkGray
Write-Host "  1. Gerenciador de Dispositivos > Adaptadores de video"
Write-Host "  2. Botao direito na AMD Radeon > Ativar dispositivo"
Write-Host ""
Read-Host "Aperte Enter pra fechar"
