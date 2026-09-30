import { GerarForm } from '@/components/GerarForm';
import { brandSchema } from '@/lib/carousel';
import styles from './page.module.css';

type Params = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function GerarPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const brandParam = brandSchema.safeParse(first(params.brand));

  return (
    <>
      <h1 className={styles.title}>Gerar carrossel</h1>
      <p className={styles.lede}>
        Roda o motor de copy da marca escolhida contra a OpenAI: a pauta e a fonte entram aqui, o modelo escreve
        os slides no contrato de <code>src/lib/carousel.ts</code>, o gate confere o que dá para provar
        automaticamente e o carrossel abre no visualizador. Precisa de <code>OPENAI_API_KEY</code> em{' '}
        <code>web/.env.local</code>.
      </p>
      <GerarForm
        defaults={{
          brand: brandParam.success ? brandParam.data : undefined,
          fonteUrl: first(params.fonteUrl),
          fonteTitulo: first(params.fonteTitulo),
          fontePublisher: first(params.fontePublisher),
          fonteData: first(params.fonteData),
          resumo: first(params.resumo),
        }}
      />
    </>
  );
}
