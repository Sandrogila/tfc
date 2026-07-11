"use client";

import { useActionState, useState } from "react";
import { submeterEntregaAction } from "@/actions/entrega.actions";
import { Loader2, ArrowLeft, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NovaEntregaFormProps {
  propostaId: string;
}

export function NovaEntregaForm({ propostaId }: NovaEntregaFormProps) {
  const [state, action, isPending] = useActionState(submeterEntregaAction, null);

  // Estados locais para controlar o upload do arquivo PDF
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileMetadata, setFileMetadata] = useState<{
    urlFicheiro: string;
    nomeArquivo: string;
    tamanhoBytes: number;
  } | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("PRE_PROJETO");

  // Handler para lidar com o upload do arquivo PDF antes de submeter o formulário
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setUploadError("Apenas arquivos PDF são permitidos.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("O arquivo deve ter no máximo 10MB.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Erro no upload.");
      }

      setFileMetadata({
        urlFicheiro: data.urlFicheiro,
        nomeArquivo: data.nomeArquivo,
        tamanhoBytes: data.tamanhoBytes,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao fazer upload do arquivo.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <input type="hidden" name="propostaId" value={propostaId} />

      {/* Inputs ocultos com metadados retornados da API de upload */}
      {fileMetadata && (
        <>
          <input type="hidden" name="urlFicheiro" value={fileMetadata.urlFicheiro} />
          <input type="hidden" name="nomeArquivo" value={fileMetadata.nomeArquivo} />
          <input type="hidden" name="tamanhoBytes" value={fileMetadata.tamanhoBytes} />
        </>
      )}

      {/* Alerta de erro */}
      {(state && !state.sucesso) || uploadError ? (
        <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
          <p className="text-sm text-red-400 font-medium">{uploadError || state?.erro}</p>
        </div>
      ) : null}


      {/* Alerta de sucesso */}
      {state && state.sucesso && (
        <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20">
          <p className="text-sm text-emerald-400 font-medium">
            Entrega submetida com sucesso! Redirecionando...
          </p>
          <script
            dangerouslySetInnerHTML={{
              __html: `setTimeout(() => { window.location.href = '/entregas'; }, 1500)`,
            }}
          />
        </div>
      )}

      <div className="glass rounded-xl p-6 space-y-5 border border-border/40">
        {/* Título da Entrega */}
        <div className="space-y-1.5">
          <label htmlFor="titulo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Título da Entrega
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={isPending || isUploading}
            placeholder="Ex: Entrega do Capítulo 1 - Introdução"
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
              (isPending || isUploading) && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Tipo e Descrição */}
        <div className="space-y-1.5">
          <label htmlFor="tipo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tipo de Documento (Etapa)
          </label>
          <select
            id="tipo"
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            disabled={isPending || isUploading}
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
              (isPending || isUploading) && "opacity-50 pointer-events-none",
            )}
          >
            <option value="PRE_PROJETO">Pré-Projeto</option>
            <option value="PARCIAL">Relatório Parcial</option>
            <option value="FINAL">Documento Final</option>
          </select>
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <label htmlFor="descricao" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Observações / Descrição da Entrega (Opcional)
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={isPending || isUploading}
            placeholder="Adicione notas adicionais para o seu orientador, se necessário..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[80px]",
              (isPending || isUploading) && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Upload de PDF */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Ficheiro PDF (Máx 10MB)
          </span>

          {!fileMetadata ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-6 bg-background/20 hover:bg-background/40 transition-all cursor-pointer">
              <Upload className={cn("h-8 w-8 text-muted-foreground mb-2", isUploading && "animate-bounce text-primary")} />
              <span className="text-xs font-semibold text-foreground">
                {isUploading ? "Fazendo upload do PDF..." : "Selecionar arquivo PDF"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1">
                Apenas documentos formato PDF
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={isPending || isUploading}
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {fileMetadata.nomeArquivo}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium">
                  Upload concluído com sucesso • {Math.round(fileMetadata.tamanhoBytes / 1024)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFileMetadata(null)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary"
              >
                Alterar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/entregas"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <button
          type="submit"
          disabled={isPending || isUploading || !fileMetadata}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 ml-auto disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Submeter Entrega"
          )}
        </button>
      </div>
    </form>
  );
}
