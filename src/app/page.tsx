export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Etapa 1 — Fundação
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Controle de Aluguéis
        </h1>
        <p className="mt-4 text-slate-600">
          Ambiente base configurado com Next.js, TypeScript e Tailwind CSS. As
          funcionalidades da Fase 1 serão adicionadas em etapas curtas e
          aprováveis.
        </p>
        <p className="mt-6 text-xs text-slate-400">
          Ferramenta de organização — não substitui orientação contábil ou
          tributária.
        </p>
      </section>
    </main>
  );
}
