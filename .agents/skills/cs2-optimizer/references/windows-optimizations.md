# Otimizações do Windows para CS2

Este documento lista otimizações do Windows que ajudam FPS no CS2, organizadas por risco. Use junto com `analyze-windows.ps1`. Nunca aplique sem confirmar com o usuário.

## 🟢 Seguras (baixo risco, pode aplicar com confirmação simples)

### Plano de energia — Alto desempenho ou Desempenho Máximo
```powershell
# Listar planos disponiveis
powercfg /list

# Ativar Alto Desempenho (GUID padrao)
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

# OU criar/ativar Desempenho Maximo (Ultimate Performance)
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
```
Anote o plano atual antes para reverter:
```powershell
powercfg /getactivescheme
```

### Game Mode
Deve ficar ATIVADO no Windows 10/11 para gaming.
```powershell
# 1 = ativado
Set-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar" -Name "AutoGameModeEnabled" -Value 1 -Type DWord
```

### Desativar Xbox Game DVR / Captura em background
Reduz overhead de gravação. Seguro se você não usa gravar jogos.
```powershell
Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_Enabled" -Value 0 -Type DWord
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR" -Name "AppCaptureEnabled" -Value 0 -Type DWord
```

### Desativar aceleração de mouse (Enhance Pointer Precision)
Para CS2 o mouse deve estar "raw" — sem aceleracao do Windows.
```powershell
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseSpeed" -Value 0
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold1" -Value 0
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold2" -Value 0
```

### Limpar apps de inicialização
```powershell
# Listar
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"

# Remover um (exemplo - NUNCA rodar sem confirmar com usuario qual app)
# Remove-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "NomeDoApp"
```
Melhor remover pelo Gerenciador de Tarefas > Inicializar (mais seguro e visual).

## 🟠 Cuidado (testar, pode reverter)

### Desativar SysMain (Superfetch) — só em SSD com 16GB+ RAM
Em HDD ou com pouca RAM, SysMain ajuda. Em SSD com RAM folgada, pode desativar.
```powershell
# Confirmar com usuario antes!
Stop-Service -Name "SysMain" -Force
Set-Service -Name "SysMain" -StartupType Disabled
# Para reverter:
# Set-Service -Name "SysMain" -StartupType Automatic
# Start-Service -Name "SysMain"
```

### Desativar DiagTrack (Telemetria conectada do usuário)
Coleta de telemetria em background. Seguro desativar para a maioria.
```powershell
Stop-Service -Name "DiagTrack" -Force
Set-Service -Name "DiagTrack" -StartupType Disabled
```

### Pausar Windows Search (WSearch)
Indexa arquivos em background. Se não usa a busca do Windows com frequência, pode pausar.
```powershell
Stop-Service -Name "WSearch" -Force
Set-Service -Name "WSearch" -StartupType Disabled
# Nao desative se o usuario depende da busca do Windows.
```

## 🔴 Avançado (só com backup e confirmação explícita)

### Limpeza de processos desnecessários
Listar antes de matar:
```powershell
Get-Process | Where-Object { $_.WorkingSet64 -gt 200MB } | Select-Object Name, @{N='RAM_MB';E={[math]::Round($_.WorkingSet64/1MB)}}
```
Não mate processos do sistema (svchost, explorer, etc). Foque em apps de terceiros.

### Desativar animações do Windows
Reduz micro-stutter visualmente, não dá FPS mas deixa mais "snappy".
```powershell
# Visual Effects > Adjust for best performance
Set-ItemProperty "HKCU:\Control Panel\Desktop" -Name "UserPreferencesMask" -Value ([byte[]](0x90,0x12,0x01,0x80))
```

---

## GPU NVIDIA — configurações do Painel de Controle

Estas configurações são GUI (não dá para aplicar via script). Gere um passo-a-passo visual.

Abra o Painel de Controle NVIDIA e em **Gerenciar configurações 3D > Configurações Globais** ajuste:

| Configuração | Valor recomendado | Por quê |
|--------------|-------------------|---------|
| Modo de gerenciamento de energia | Preferir desempenho máximo | Mantém GPU em clock alto |
| Filtro de textura - qualidade | Alto desempenho | Menos overhead na GPU |
| Modo de controle vertical | Desativado | Reduz input lag |
| Renderização de GPU múltipla | Ativado (se suportado) | Pode ajudar |
| Otimização thread | Ativado | Melhora uso de CPU |
| Low Latency Mode | Ultra (ou On) | Reduz input lag |
| PowerMizer | Preferir desempenho máximo | Evita throttling |

Para CS2 especificamente, em **Configurações do Programa** adicione `cs2.exe` e ajuste o mesmo.

**DLSS / Reflex**: o CS2 suporta NVIDIA Reflex — mantenha ativado in-game (`nvidia_reflex_boost "1"` no console ou via configuração).

## GPU AMD — configurações do Adrenalin

Abra AMD Adrenalin > **Jogos > Gráficos**:

| Configuração | Valor | Por quê |
|--------------|-------|---------|
| Radeon Anti-Lag | Ativado | Reduz input lag |
| Radeon Boost | Testar | Reduz resolução em movimento |
| Aguardo atualização vertical | Desativado | Menos input lag |
| Filtragem de textura | Desempenho | Overhead menor |
| Surface Format Optimization | Ativado | Ajuda |

**AMD FSR**: o CS2 suporta FSR — teste em qualidade (pode aumentar FPS mantendo visual aceitável).

## Quando NÃO aplicar cada otimização

- **SysMain off**: se o usuário tem HDD como disco principal ou < 16GB RAM.
- **Game DVR off**: se o usuário grava clipes do CS2 para revisar/treinar.
- **Low Latency Ultra**: em GPUs fracas pode causar stutter — teste antes.
- **Fullscreen optimizations off**: alguns usuários relatam PIOR FPS, outros melhor. Teste.
- **`-high` priority**: em CPUs com poucos núcleos (< 6 threads) pode piorar. Em 6+ threads ok.
