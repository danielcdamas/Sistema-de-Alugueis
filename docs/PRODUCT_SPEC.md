# ESPECIFICAÇÃO DO PRODUTO — Controle de Aluguéis

> A especificação canônica e detalhada está no `CLAUDE.md` (seção `<product_spec>`). Este documento é um resumo de navegação; em caso de divergência, vale o `CLAUDE.md`.

## Resumo
Web app enxuto (uso pessoal, ~2 pessoas) para controle do **recebimento** mensal de aluguéis: conciliação de demonstrativos × depósitos, divergências, atrasos, taxa de administração esperada × cobrada, pagamentos parciais, Carnê-Leão (controle de processo), repasse de 27% da Sala da Contorno, dashboard, central de pendências, consulta histórica, auditoria e arquivamento lógico.

## Perfis
- **Administrador:** cadastra/edita, registra movimentos, controla Carnê-Leão, fecha/reabre meses, configura, exporta, consulta auditoria.
- **Leitor:** apenas consulta. Não cria, edita, arquiva, paga, configura, fecha nem reabre.

## Interface
pt-BR, reais, datas brasileiras, fuso America/Sao_Paulo, **modo claro**, responsivo (Chrome), acessível. Sem PWA nesta versão.

## Fora do escopo desta versão
Importação assistida, OAuth/sincronização do Gmail, PWA (todos adiáveis, com o núcleo já estável).
