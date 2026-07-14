# REGRAS DE NEGÓCIO — Controle de Aluguéis

> Fonte da verdade das fórmulas financeiras. Guiam os testes unitários (prioridade máxima). Valores em decimal, R$ com duas casas; nunca ponto flutuante na aritmética.

## Conceitos de tempo (separados)
Competência (mês do aluguel) ≠ Vencimento original ≠ Vencimento ajustado (fim de semana/feriado) ≠ Data do depósito ≠ Mês de recebimento ≠ Referência do Carnê-Leão. **A competência nunca muda porque o depósito atrasou.**

## Grupos
- **A. Componentes do demonstrativo:** bruto devido; ressarcimento de IPTU; taxa de administração; taxa bancária; taxa extra; fundo de reserva; multa; juros; desconto; retenção; outros; informativos.
- **B. Movimentos bancários:** depósito; complemento; estorno; devolução; compensação; ajuste.
- **C. Resultados calculados:** líquido tributável; esperado para depósito; total depositado; saldo pendente; diferença (R$ e %); situação da conciliação.

## Fórmulas (composição configurável)
- **Líquido tributável** = bruto devido − taxa de administração **cobrada** − taxa bancária − taxa extra − fundo de reserva.
- **Esperado para depósito** = líquido tributável + ressarcimento de IPTU.
- **Total depositado** = (depósitos + complementos + compensações positivas) − (estornos + devoluções + compensações negativas).
- **Divergência** = total depositado − esperado para depósito. **Tolerância: R$ 0,01.**

## Situações de divergência
Dentro da tolerância → conciliado; negativa → recebido a menor; positiva → recebido a maior; múltiplos depósitos incompletos → parcial; sem depósito após vencimento → vencido.

## Taxa de administração
Comparar **esperada × cobrada**; usar a **cobrada** no cálculo realizado; destacar divergência; nunca substituir silenciosamente a cobrada pela esperada.

## Carnê-Leão
O sistema controla o **processo**, não calcula imposto. Referência = **mês do efetivo recebimento**. Aviso obrigatório: "Este sistema é uma ferramenta de organização e não substitui orientação contábil ou tributária."

## Repasse — Sala da Contorno
Repasse = líquido tributável **realizado** × **27%**, vinculado ao **ID interno** do imóvel (não ao nome digitado).

## Exemplos de referência (base para testes)
1. **Conciliado:** bruto 2.000 − adm 160 − banco 5 = 1.835; + IPTU 150 = 1.985 esperado; depósito 1.985 → divergência 0,00 → conciliado.
2. **Parcial:** esperado 1.985; depósito 1.000 (saldo 985, parcial) + depósito 985 → 1.985 → conciliado (os dois movimentos coexistem; não sobrescrever).
3. **Estorno:** esperado 1.985; depósito 1.985 − estorno 200 = 1.785 → −200 (−10,08%) → recebido a menor.
4. **Competência × recebimento:** competência junho, depósito 05/jul → atraso em relação a junho; competência permanece junho; Carnê-Leão em julho.
5. **Repasse:** líquido realizado 1.835 × 27% = 495,45.
