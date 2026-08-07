/* ==========================================================
   CONFIGURAÇÃO DE HORÁRIOS OCUPADOS
   ----------------------------------------------------------
   👤 COMO USAR (para o dono da High Line):

   Quando alguém agendar um horário, basta adicionar uma linha
   aqui dentro do array "ocupados" no formato:

       "AAAA-MM-DD HH:MM"

   Onde:
     AAAA = ano (2026)
     MM   = mês (01 a 12)
     DD   = dia (01 a 31)
     HH   = hora (08 a 17)
     MM   = minuto (sempre 00)

   EXEMPLO:
     Se um cliente agendou Polimento para o dia
     12/08/2026 às 09:00, adicione:

       "2026-08-12 09:00"

   💡 Dica: cada horário em uma linha, entre aspas, separado
   por vírgula. Salve o arquivo. O site atualiza sozinho.

   Para "limpar" um horário que ficou livre de novo, basta
   apagar a linha correspondente.
   ========================================================== */

window.HORARIOS_OCUPADOS = [
  // Exemplos de demonstração (apague quando for usar de verdade):
  "2026-08-07 09:00",
  "2026-08-07 14:00",
  "2026-08-08 10:00",
  "2026-08-11 08:00",
  "2026-08-11 15:00",
];
