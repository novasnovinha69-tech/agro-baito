---
name: cs2-optimizer
description: Otimiza PCs Windows 10/11 para jogos, com foco em mais FPS no Counter-Strike 2 (CS2). Usa quando o usuário mencionar "otimizar PC", "melhorar FPS", "mais FPS no CS2", "otimizar Windows para jogos", "configurar CS2", "PC lento para jogar", ou qualquer pedido relacionado a performance em jogos/análise de hardware para gaming. Detecta hardware real (CPU, GPU, RAM), analisa configurações do Windows, drivers de GPU, launch options e configs do CS2, aplica otimizações guiadas e gera relatório. Funciona em qualquer PC de forma adaptativa.
---

# CS2 Optimizer — Otimização de PC para Counter-Strike 2

Esta skill otimiza computadores Windows 10/11 para maximizar FPS no CS2 de forma **adaptativa e segura**. Ela detecta o hardware real e ajusta as recomendações — o que ajuda num Ryzen 5700G pode não ajudar num Intel i5, então nada é aplicado cegamente.

## Princípios (NÃO pular)

1. **Detectar antes de recomendar.** Nunca aplique otimização genérica sem saber o hardware. Execute `scripts/detect-hardware.ps1` primeiro.
2. **Modo guiado.** Aplicações que mudam o sistema (desativar serviços, mudar registro) exigem confirmação do usuário. Mostre o que será feito ANTES de executar.
3. **Não destrutivo.** Sempre ofereça reverter. Documente o estado anterior quando possível (ex: nome do plano de energia atual antes de trocar).
4. **Honesto sobre limites.** Uma skill não faz milagre. Se o gargalo é hardware antigo, diga. Não prometa " dobrar o FPS".
5. **Português.** Todo output em português do Brasil.

## Fluxo principal

Execute as fases em ordem. Após cada fase, resuma os achados para o usuário.

### Fase 1 — Detecção de hardware

Rode via PowerShell (Git Bash precisa chamar `powershell.exe -ExecutionPolicy Bypass -File`):

```
powershell.exe -ExecutionPolicy Bypass -File "<caminho_da_skill>/scripts/detect-hardware.ps1"
```

Captura: CPU (modelo + núcleos/threads), GPU (modelo + VRAM), RAM (total + velocidade + se XMP está ativo comparando velocidade reportada vs a tag da RAM), resolução do monitor, e se é Windows 10 ou 11.

Com base nisso, classifique o PC:
- **Low-end**: GPU equivalente a GTX 1050/1650 ou inferior, ou sem GPU dedicada (APU).
- **Mid**: GTX 1660/RTX 3050/3060, RX 6600, ou similar (ex: RTX 5060 8GB).
- **High**: RTX 3070+ ou RX 6700+.

A classificação define presets de qualidade do CS2 (ver `references/cs2-configs.md`).

### Fase 2 — Análise do Windows

Rode:

```
powershell.exe -ExecutionPolicy Bypass -File "<caminho_da_skill>/scripts/analyze-windows.ps1"
```

Verifica: plano de energia atual, Game Mode status, serviços desnecessários rodando (SysMain/DiagTrack/WSearch etc), apps na inicialização com impacto alto, Xbox Game Bar/DVR, e uso atual de CPU/RAM.

Apresente os achados como uma **lista de ações propostas**, cada uma com:
- O que será mudado
- Por que ajuda (1 linha)
- Nível de risco (🟢 seguro / 🟠 cuidado / 🔴 avançado)

**Só aplique após o usuário confirmar** (ele pode escolher quais).

### Fase 3 — GPU e drivers

Rode:

```
powershell.exe -ExecutionPolicy Bypass -File "<caminho_da_skill>/scripts/analyze-gpu.ps1"
```

Detecta fabricante (NVIDIA/AMD/Intel), versão do driver, e se o painel de controle está acessível.

Para **NVIDIA**: recomende mudanças no Painel de Controle NVIDIA — consulte `references/windows-optimizations.md` (seção GPU NVIDIA) e gere um passo-a-passo visual, pois o painel é GUI.

Para **AMD**: equivalente com AMD Adrenalin.

Recomende também baixar o driver mais recente via link oficial se a versão for antiga.

### Fase 4 — CS2 específico

Esta fase NÃO roda scripts — é baseada em conhecimento. Leia `references/cs2-configs.md` e gere:

1. **Launch options** personalizadas para o hardware detectado (ex: `-novid -tickrate 128 -high`, com avisos sobre `-threads`).
2. **Arquivo `autoexec.cfg`** com binds/recomendações de performance prontas para colar.
3. **Configurações de vídeo in-game** baseadas na classificação do PC (Low/Mid/High).
4. O caminho onde o CS2 guarda configs: `...\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\`.

### Fase 5 — Hardware/BIOS

Leia `references/hardware-ram-bios.md` e verifique se a RAM está rodando abaixo da velocidade suportada (XMP/EXPO desativado). Isso é **muito comum** e dá um ganho real de FPS.

Como não dá para mexer na BIOS por script, gere instruções claras de como ativar XMP/EXPO + perfis PBO (AMD) ou equivalentes Intel.

### Fase 6 — Relatório

Gere o relatório em **dois formatos**:

1. **Na tela** — Markdown resumido com tudo que foi feito, recomendado, e pendente.
2. **Em PDF** — Use a skill `pdf` (ou `document-skills:pdf`) para gerar um relatório detalhado. Salve como `relatorio-otimizacao-cs2-<data>.pdf` na pasta do usuário (Documents ou a pasta atual).

O relatório deve incluir:
- Hardware detectado
- Classificação do PC
- Tabela do que foi aplicado (com ✓)
- Tabela do que ficou pendente (precisa de ação manual, ex: BIOS)
- Expectativa de ganho realista (não prometa números)
- Como reverter cada mudança

## O que NUNCA fazer

- Não execute `Disable-Service` ou `Set-Service` sem confirmar com o usuário serviço por serviço.
- Não mexa no registro sem backup (`reg export` antes).
- Não recomende overclock automático de GPU/CPU — só explique os riscos se o usuário perguntar.
- Não aplique otimizações "de forum" sem contexto (ex: `-threads X` errado pode PIORAR o FPS).
- Não diga "isso funciona em qualquer PC" sem qualificar — sempre baseie no hardware detectado.

## Caminhos dos arquivos da skill

- Scripts PowerShell: `scripts/detect-hardware.ps1`, `scripts/analyze-windows.ps1`, `scripts/analyze-gpu.ps1`
- Referências: `references/windows-optimizations.md`, `references/cs2-configs.md`, `references/hardware-ram-bios.md`

O caminho absoluto da skill pode ser descoberto procurando o diretório `cs2-optimizer` em `~/.agents/skills/` ou `~/.zcode/skills/`.
