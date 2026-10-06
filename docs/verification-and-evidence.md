# Verificação e evidência

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Resumo: [03-arquitetura.md](03-arquitetura.md). Bridge local: [13-governed-bridge.md](13-governed-bridge.md). Roadmap: [05-roadmap.md](05-roadmap.md).

## Princípios
- `implementation != proof`: código escrito não demonstra que o requisito foi atendido.
- `proof != authority to close`: evidência suficiente não fecha o trabalho; o fechamento é uma decisão de autoridade.
- `author != verifier`: quem implementou não verifica o próprio trabalho.
- Não existe PASS automático: ausência de falha, timeout ou evidência faltante significam não comprovado.

## Contrato-alvo

### Sensors
Testes, linters, verificações de tipo, scripts e CI funcionam como Sensors. Os Sensors exigidos são declarados por Work Item e por risco antes da execução. Um Sensor deve discriminar: precisa falhar quando o requisito não é atendido.

### Vínculo por caminho e hash
Cada evidência registra os caminhos e hashes dos inputs e a revisão verificada. Se algum input mudar, a evidência é invalidada; veja [conceitos e estado](concepts-and-state.md).

### Níveis de risco

| Nível | Contexto | Verificação mínima |
|---|---|---|
| LIGHT | mínimo, alvo direto, regras bloqueantes | Sensor exigido |
| STANDARD | spec/plan escopado, vizinhança no grafo, regras relevantes | Sensors e verificação independente |
| CRITICAL | domínio, arquitetura, blast radius, authority e permissões | Sensors mais fortes e revisão independente reforçada |

O risco domina o tamanho do diff. Risco desconhecido não é tratado como LIGHT.

### Evidência exata
A evidência registra o que foi executado e o que aconteceu: comando, código de saída, trecho relevante da saída, revisão, caminhos e hashes. Paráfrases como tudo passou não são evidência.

### Adjudicação independente
O Orchestrator adjudica o resultado estruturado com `CONTINUE`, `RETRY`, `OWNER_REQUIRED` ou `STOP`. O executor relata; não se aprova.

### Retry e OWNER_REQUIRED
`RETRY` é limitado e precisa de nova evidência. Falha repetida, ambiguidade material ou necessidade de autoridade levam a `OWNER_REQUIRED` ou `STOP`. Falhas relevantes podem gerar lições com proveniência; um PASS limpo não gera lição.

## Implementação local inicial

| Item | Estado |
|---|---|
| Runner local: resultado estruturado e adjudicação | CURRENT (experimental, local); coberto por `tools/bridge/bridge.test.mjs` |
| Transporte via GitHub/cloud | PLANNED; não comprovado |
| Vínculo por hash com invalidação automática | PLANNED |
| Verificador independente e Sensors por risco | PLANNED |
| Risk Router LIGHT / STANDARD / CRITICAL | PLANNED |

O runner local não é produto pronto. Para saber o que ele cobre hoje, veja [13-governed-bridge.md](13-governed-bridge.md).
