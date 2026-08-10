# Hardware, RAM e BIOS

O maior ganho "escondido" de FPS em PCs com CPU Ryzen geralmente está na RAM rodando abaixo da velocidade suportada porque o XMP/EXPO está desativado. Este documento explica como detectar e resolver.

## Por que isso importa tanto para Ryzen

CPUs Ryzen (incluindo o seu 5700G) usam a arquitetura **Infinity Fabric**, que interconecta os núcleos do chip. A velocidade do Infinity Fabric é vinculada à velocidade da RAM. Resultado:

- **RAM rodando a 2133MT/s (padrão JEDEC, XMP off)**: Infinity Fabric lento → latência alta → MENOS FPS
- **RAM rodando a 3200MT/s ou 3600MT/s (XMP/EXPO on)**: Infinity Fabric rápido → latência baixa → MAIS FPS

Em jogos CPU-bound como CS2, esse ganho pode ser de **10 a 20%** — mais do que qualquer tweak do Windows. É de longe o "upgrade grátis" mais impactante.

## Como detectar (o script `detect-hardware.ps1` já faz)

O WMI retorna dois valores por pente de RAM:
- `ConfiguredClockSpeed` → velocidade EFETIVA (o que está rodando agora)
- `Speed` → velocidade NOMINAL do pente (o que ele aguenta com XMP on)

Se `ConfiguredClockSpeed` for bem menor que `Speed` (ex: rodando a 2133 mas o pente suporta 3600), XMP/EXPO está **desativado**.

### Verificar manualmente no Windows
```powershell
# Velocidade rodando agora
Get-CimInstance Win32_PhysicalMemory | Select-Object DeviceLocator, Manufacturer, PartNumber, ConfiguredClockSpeed, Speed, Capacity
```

Exemplo de saída com problema:
```
DeviceLocator : DIMM 0
ConfiguredClockSpeed : 2133    <-- rodando lento
Speed : 3600                   <-- pente suporta 3600
Capacity : 17179869184         <-- 16GB
```
→ **XMP desativado. Ativar vai dar ganho real.**

### Via Task Manager (mais simples)
1. Ctrl+Shift+Esc > Desempenho > Memória
2. Veja "Velocidade". Se estiver em 2133/2400/2666 e seus pentes são 3200/3600+, XMP está off.

## Como ativar XMP / EXPO (na BIOS)

Não dá para fazer por script — é BIOS. Mas o passo-a-passo é simples:

1. **Reinicie o PC** e fique apertando a tecla de BIOS (geralmente **DEL** ou **F2**, às vezes F12 para menu de boot). O script detecta sua placa-mãe; pesquise a tecla exata do fabricante.
2. Entre no modo **Advanced Mode** (geralmente F7 em placas ASUS, ou botão "Advanced" em MSI/Gigabyte).
3. Procure por:
   - **ASUS**: Ai Tweaker > Ai Overclock Tuner = **XMP** (ou XMP I / XMP II). Para AMD: mesmo lugar, escolha **EXPO**.
   - **MSI**: OC > Extreme Memory Profile (XMP) = **Enabled**, ou AMD OC > EXPO.
   - **Gigabyte**: Settings > AMD Overclocking / Tweaker > Extreme Memory Profile (X.M.P.) = **Profile 1**.
   - **ASRock**: OC Tweaker > DRAM Configuration > XMP = **Profile 1**, ou EXPO.
4. Salve e saia (**F10**). O PC vai reiniciar.
5. **Importante**: depois entre no Windows e confirme no Task Manager que a velocidade subiu.

### ⚠️ Possíveis problemas
- **Não dá boot após ligar XMP** (raros pentes ruins): a placa-mãe pode resetar sozinha, ou você precisa dar Clear CMOS (remover bateria da placa-mãe por 30s ou botão Clear CMOS).
- **Instabilidade com 4 pentes em velocidade alta**: Ryzen às vezes não gosta de 4x rank populado em 3600MT/s. Se travar, abaixe para 3200MT/s ou use só 2 pentes.
- **Mix de pentes diferentes**: pode instabilizar. Idealmente use pentes iguais (kit de 2 ou 4).

## Para seu setup específico (Ryzen 7 5700G)

- Sua CPU suporta RAM até **DDR4-3200MHz oficialmente**, e muitos chips aguentam 3600MT/s com overclock manual.
- Com **32GB** você provavelmente tem 2x16GB (ideal) ou 4x8GB.
- **Meta**: rodar entre **3200-3600MT/s** com latência CL16.
- Aumente o limite FCLK (Infinity Fabric) para 1600MHz se for a 3200, ou 1800MHz se for a 3600 (configuração 1:1:1 ideal).

## PBO (Precision Boost Overdrive) — AMD

PBO deixa a CPU turbinar mais agressivamente. Para CS2 (que estressa poucos núcleos intensamente) pode ajudar ~3-5%.

Na BIOS (mesmas seções de overclock):
- **ASUS**: Ai Tweaker > Precision Boost Overdrive = **Advanced** ou **Enabled**
- **MSI**: AMD OC > Precision Boost Overdrive = **Enabled**
- **Gigabyte/ASRock**: AMD Overclocking > Precision Boost Overdrive = **Enabled**

Ou via software no Windows (mais seguro para iniciantes):
- Baixe o **AMD Ryzen Master** oficial.
- Aplique **PBO** com limites maiores (PPT/TDC/EDC).

### ⚠️ Aviso sobre overclock
- PBO é seguro — só aumenta limites de potência, a CPU ainda se protege contra temperaturas altas.
- **Undervolt via Curve Optimizer** (junto com PBO) pode dar melhor desempenho com MENOS calor: Curve Optimizer = All Cores, Negative, -15 a -30 (teste estabilidade).
- Nunca recomendamos overclock manual de frequência (valores fixos) — risco de queima/instabilidade sem ganho proporcional.

## Temperaturas — verificar antes de otimizar

Se a CPU/GPU estiver quente demais, ela reduz o clock (throttling) e você PERDE FPS. Antes de otimizar software, verifique temps:

```powershell
# Temperatura da GPU NVIDIA
nvidia-smi --query-gpu=temperature.gpu,clocks.current.graphics,clocks.max.graphics,power.draw --format=csv

# Para CPU, o WMI nao e confiavel. Use HWMonitor, HWiNFO64 ou Ryzen Master (AMD).
```

Limites saudáveis:
- **CPU Ryzen 5700G**: até ~90°C em jogo (TDP é baixo porque é APU). Idle 40-55°C.
- **RTX 5060**: até ~83°C (se passar disso, melhore ventilação).

Se estiver muito quente:
- Limpe poeira do dissipador/radiadores
- Reaplique pasta térmica (a cada 2-3 anos)
- Configure curva de ventoinhas mais agressiva na BIOS
- Melhore fluxo de ar no gabinete (ventoinhas intake/frontal, exaustão/traseira-superior)

## Resumo de ganhos esperados (realista, para Ryzen + 32GB)

| Otimização | Ganho típico de FPS em CS2 | Dificuldade |
|------------|---------------------------|-------------|
| Ativar XMP/EXPO (se estava off) | **10-20%** | 🟢 BIOS, fácil |
| PBO + Curve Optimizer (-20) | 3-5% | 🟠 AMD Ryzen Master |
| Drivers NVIDIA atualizados | 0-5% (bug fixes) | 🟢 Download oficial |
| Desativar Game DVR/telemetria | 1-3% | 🟢 Script |
| Launch options corretas | 1-3% | 🟢 Steam |
| NVIDIA Reflex Low Latency | -latência (não FPS) | 🟢 In-game |
| Mudança para SSD NVMe (se HDD) | 5-15% (stutter) | 🟠 Hardware |

**Verdade incômoda**: acima disso, ganho real de FPS vem de **upgrade de hardware** (CPU mais forte, GPU melhor), não de tweaks de software. Skills não fazem milagre — mas XMP + PBO + driver atualizado + configs certas entregam o melhor do que você já tem.
