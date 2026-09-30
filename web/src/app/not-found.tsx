import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1>Geração não encontrada</h1>
      <p>Esse carrossel não está em disco.</p>
      <Link href="/">← todas as gerações</Link>
    </>
  );
}
