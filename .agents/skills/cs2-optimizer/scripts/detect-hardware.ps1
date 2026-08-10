# detect-hardware.ps1
# Detecta CPU, GPU, RAM, monitor e SO. Saída em JSON para a skill processar.
# Uso: powershell.exe -ExecutionPolicy Bypass -File detect-hardware.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host "=== DETECCAO DE HARDWARE ===" -ForegroundColor Cyan

# SO
$os = Get-CimInstance Win32_OperatingSystem
$osName = $os.Caption
$osVer = $os.Version
Write-Host "SO: $osName (Build $osVer)"

# CPU
$cpu = Get-CimInstance Win32_Processor
$cpuName = $cpu.Name.Trim()
$cores = $cpu.NumberOfCores
$threads = $cpu.NumberOfLogicalProcessors
$maxClock = [math]::Round($cpu.MaxClockSpeed / 1000, 2)
Write-Host "CPU: $cpuName"
Write-Host "Nucleos/Threads: $cores / $threads  | Clock max: ${maxClock}GHz"

# RAM total
$ram = Get-CimInstance Win32_PhysicalMemory
$totalRAM = [math]::Round(($ram.Capacity | Measure-Object -Sum).Sum / 1GB, 0)
Write-Host "RAM Total: ${totalRAM}GB"

# RAM detalhada (slots, velocidade, XMP indicador)
Write-Host "--- Modulos de RAM ---"
$ram | ForEach-Object {
    $cap = [math]::Round($_.Capacity / 1GB, 0)
    $speed = $_.ConfiguredClockSpeed  # velocidade EFETIVA (se XMP off, fica menor)
    $ratedSpeed = $_.Speed             # velocidade NOMINAL do pente (tag)
    $xmpStatus = if ($speed -lt $ratedSpeed - 100) { "XMP/EXPO PROVAVELMENTE DESATIVADO (rodando a ${speed}MT/s, pente suporta ${ratedSpeed}MT/s)" } else { "OK (${speed}MT/s)" }
    Write-Host "Slot $($_.DeviceLocator): ${cap}GB | Rodando: ${speed}MT/s | Nominal: ${ratedSpeed}MT/s | $xmpStatus"
}

# GPU
$gpus = Get-CimInstance Win32_VideoController
Write-Host "--- GPUs ---"
$gpus | ForEach-Object {
    $vram = if ($_.AdapterRAM) { [math]::Round($_.AdapterRAM / 1GB, 1) } else { 0 }
    # AdapterRAM pode dar valor errado em GPUs > 4GB por bug do WMI, mas serve de base
    Write-Host "GPU: $($_.Name) | VRAM (WMI): ${vram}GB | Driver: $($_.DriverVersion)"
}

# Monitor
$monitors = Get-CimInstance WmiMonitorBasicDisplayParams -Namespace root\wmi
$resolution = (Get-CimInstance Win32_VideoController).CurrentHorizontalResolution | Select-Object -First 1
$resY = (Get-CimInstance Win32_VideoController).CurrentVerticalResolution | Select-Object -First 1
$refresh = (Get-CimInstance Win32_VideoController).CurrentRefreshRate | Select-Object -First 1
Write-Host "--- Monitor ---"
Write-Host "Resolucao atual: ${resolution}x${resY} @ ${refresh}Hz"

# Placa mae (para instrucoes de BIOS)
$mobo = Get-CimInstance Win32_BaseBoard
Write-Host "--- Placa Mae ---"
Write-Host "$($mobo.Manufacturer) $($mobo.Product)"

Write-Host ""
Write-Host "=== FIM DA DETECCAO ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "ATENCAO: Se apareceu 'XMP/EXPO PROVAVELMENTE DESATIVADO', ativar o perfil XMP/EXPO na BIOS pode dar um ganho significativo de FPS (10-20% em titulos CPU-bound como CS2)." -ForegroundColor Yellow
