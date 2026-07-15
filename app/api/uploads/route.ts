import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import * as path from "path";

// API Route para Upload de Documentos PDF (RF06)

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // 1. Validar tipo MIME (apenas PDF)
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Tipo de arquivo inválido. Apenas PDFs são permitidos." },
        { status: 400 },
      );
    }

    // 2. Validar tamanho (limite de 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Tamanho excedido. O arquivo deve ter no máximo 10MB." },
        { status: 400 },
      );
    }

    // 3. Gerar nome de arquivo único
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const uniqueName = `${crypto.randomUUID()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Criar pasta de upload se não existir
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Já existe ou outro erro
    }

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const urlFicheiro = `/uploads/${uniqueName}`;

    return NextResponse.json({
      sucesso: true,
      urlFicheiro,
      nomeArquivo: file.name,
      tamanhoBytes: file.size,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Falha ao processar o upload do ficheiro." },
      { status: 500 },
    );
  }
}
