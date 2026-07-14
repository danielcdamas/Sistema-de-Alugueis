# MODELO DE DADOS — Controle de Aluguéis

> Estado: **planejado** (apresentado antes de implementar, conforme o charter). Ainda não há tabelas nem migrações. Convenções gerais: chave primária; timestamps `created_at`/`updated_at`; **arquivamento lógico** via `archived_at` (nunca DELETE em dado financeiro); dinheiro em `numeric`; FKs, índices, checks e unicidade.

## Entidades e relações

### Acesso
- `users` — conta de login.
- `profiles` — perfil (administrador/leitor), 1:1 com `users`. Papel definido e verificado no servidor/banco.

### Cadastros
- `real_estate_agencies` — imobiliárias.
- `properties` — imóveis (FK imobiliária atual).
- `property_agency_history` — histórico imóvel↔imobiliária, com início/fim (preserva o período).
- `rental_contracts` — contratos (FK imóvel + imobiliária; vencimento, regra de fim de semana/feriado, % taxa de administração esperada, IPTU, reajuste).

### Núcleo financeiro
- `monthly_rent_periods` — competências. **`UNIQUE(property_id, competencia)`** (idempotência). Guarda a "fotografia" das regras do contrato e a imobiliária do período.
- `financial_component_types` — catálogo configurável (afeta esperado? afeta base tributável? ressarcimento/despesa/acréscimo/desconto/informativo; exige descrição/documento).
- `statement_components` — linhas do demonstrativo (FK competência + tipo).
- `bank_movements` — movimentos: depósito, complemento, estorno, devolução, compensação, ajuste (FK competência).

### Repasses
- `transfer_rules` — regras extensíveis (ex.: Sala da Contorno = 27%, ligada ao **ID interno** do imóvel).
- `transfers` — repasses (pendente/realizado; data, comprovante).

### Carnê-Leão
- `tax_month_controls` — controle por **mês de recebimento** (pendente/calculado/agendado/pago/não aplicável).

### Operação (Fase 2)
- `attachments` (privados), `monthly_notes`, `email_templates`, `collection_attempts`, `monthly_closures`.

### Transversais
- `holidays` — feriados configuráveis.
- `audit_logs` — auditoria (usuário, data, entidade, ação, valores antes/depois, justificativa, origem). Não alterável pela interface normal.
- `application_settings` — configurações não secretas.

*(Sem a entidade `imports` — importação assistida adiada nesta versão.)*
