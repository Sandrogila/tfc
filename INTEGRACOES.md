# 🔌 Manual Técnico de Integrações Futuras — TFC Manager

Este documento fornece detalhes sobre como estender a arquitetura do **TFC Manager** para se integrar com outros sistemas internos da instituição de ensino e APIs externas. O projeto foi estruturado utilizando princípios de injeção de dependência e separação de conceitos (Repository Pattern + Service Layer), o que simplifica acoplar novos módulos.

---

## 1. 🏫 Integração com o Sistema Académico (ERP da Instituição)

### Caso de Uso
1. **Sincronização de Elegibilidade**: Garantir que apenas estudantes regularmente matriculados no último ano e sem pendências financeiras/administrativas possam submeter propostas de TFC.
2. **Lançamento Automático de Notas**: A nota final decidida pela banca examinadora deve ser escrita diretamente na ficha académica do estudante.

### Desenho Técnico Recomendado
* **Método**: Consumo de uma REST API ou SOAP disponibilizada pelo ERP Académico (ex: SAP, Totvs, ou sistema próprio).
* **Fluxo de Elegibilidade**:
  - No `proposta.service.ts`, antes de criar uma proposta, faz-se uma chamada HTTP `GET /api/erp/estudantes/{numero}/status`.
  - Se o retorno indicar que o estudante está inapto, o sistema bloqueia a submissão exibindo a mensagem retornada pelo ERP.
* **Fluxo de Lançamento de Notas**:
  - Webhook ou Server Action ativada no momento em que a coordenação publica a nota da defesa (`banca.service.ts`).
  - Dispara um `POST /api/erp/notas` enviando `{ numeroEstudante, codigoDisciplina, nota, anoLectivo }`.

---

## 2. 📄 Integração com Repositórios Académicos (ex: DSpace)

### Caso de Uso
Após a aprovação final do TFC, o documento em PDF e os dados do projeto (autor, resumo, área, orientador) devem ser arquivados automaticamente na biblioteca digital oficial da instituição.

### Desenho Técnico Recomendado
* **Protocolo**: [SWORD Protocol (Simple Web-service Offering Repository Deposit)](http://swordapp.org/) ou REST API do DSpace.
* **Implementação**:
  - Criar um serviço `services/repository-exporter.service.ts`.
  - Quando a banca ou a coordenação marca o status do TFC como `CONCLUIDO`:
    1. O sistema recolhe os metadados da proposta e o link do ficheiro PDF.
    2. Empacota a informação no formato XML METS.
    3. Faz um request HTTP autenticado para a API do DSpace enviando o pacote.
    4. Grava o link do documento gerado no repositório digital de volta na base de dados do TFC (`proposta.urlRepositorio`).

---

## 3. ✉️ Sistema de Notificações Ativo (Resend & WhatsApp API)

### Caso de Uso
Alertar os utilizadores sobre prazos de entrega, convites de orientação pendentes e pareceres da coordenação em tempo real, sem necessidade de estarem logados no sistema.

### Desenho Técnico Recomendado
* **E-mail (Resend / SendGrid)**:
  - Implementar um utilitário `lib/email.ts` utilizando a SDK do `@resend/node`.
  - Criar templates HTML responsivos para:
    - *Convite para Orientador*: "Olá Docente X, o estudante Y indicou-o como orientador..."
    - *Aprovação de Proposta*: "Parabéns, a sua proposta foi aprovada pela coordenação..."
* **Notificações Push / WhatsApp (Twilio / Z-API)**:
  - Integração via HTTP POST para APIs de mensajeria instantânea.
  - Exemplo de payload enviado ao orientador:
    ```json
    {
      "to": "+2449XXXXXXXX",
      "message": "Olá! Tens uma nova proposta de TFC aguardando a tua aprovação no TFC Manager."
    }
    ```

---

## 4. 🔍 Deteção de Plágio Automatizada (CopySpider / Turnitin API)

### Caso de Uso
Cada ficheiro PDF carregado por um estudante numa entrega de capítulo deve passar por uma análise de originalidade automática antes de ser enviado para a caixa de revisão do orientador.

### Desenho Técnico Recomendado
* **Implementação**:
  - Atualizar o fluxo de upload de arquivos no `entrega.service.ts`.
  - Assim que o arquivo é armazenado em nuvem:
    1. Envia-se o link público do documento para `POST /api/plagiarismo/scan`.
    2. O serviço de plagiarismo processa o arquivo de forma assíncrona.
    3. O TFC Manager recebe um Webhook do parceiro de plágio com o relatório de similaridade:
       ```json
       {
         "entregaId": "cuid_da_entrega",
         "indiceSimilaridade": 12.5,
         "urlRelatorio": "https://turnitin.com/reports/..."
       }
       ```
    4. Atualiza-se o registo da entrega na base de dados com o índice e o link do relatório para consulta do docente.

---

## 📂 5. Armazenamento de Arquivos em Nuvem (Supabase Storage / AWS S3)

### Caso de Uso
Evitar o armazenamento de arquivos binários pesados diretamente no servidor da aplicação ou na base de dados de produção.

### Desenho Técnico Recomendado
* **Armazenamento**: Supabase Storage Buckets.
* **Fluxo de Upload**:
  - Em vez de enviar o arquivo de forma tradicional ao servidor, utiliza-se a SDK do `@supabase/supabase-js`.
  - O arquivo é enviado diretamente ao bucket privado `tfc-documentos/{ano}/{estudanteId}/{entregaId}.pdf`.
  - A base de dados apenas armazena o caminho lógico e a URL assinada temporária para garantir a segurança dos documentos intelectuais.
