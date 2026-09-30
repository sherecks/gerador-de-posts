import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Gerador de Posts — gerações de carrossel',
  description:
    'Visualizador e gerador local de carrosséis de Instagram, multi-marca (Karaguá Ecotech, ADX): fila de posts, slides na identidade de cada marca e o gate de qualidade do copy engine.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        {/*
          ADX brand fonts (docs/decisions/004): unhosted, same as ADX's own design-system.html.
          crossOrigin="anonymous" on the stylesheet link itself (not just the preconnect) matters
          beyond performance here: html-to-image (export, src/lib/export.ts) reads `cssRules` off
          every loaded stylesheet to inline @font-face as base64 for the exported PNG. Without it,
          the browser treats the stylesheet as opaque to script and that read throws a SecurityError
          — caught internally, so the export still succeeds today via the renderer's font cache, but
          the intended embedding path silently no-ops. This is what makes it actually run.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <header className={styles.header}>
          <div className={styles.headerStart}>
            <Link href="/" className={styles.brand}>
              Gerador de Posts
            </Link>
            <span className={styles.tagline}>gerações · local</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/figuras" className={styles.navLink}>
              Figuras
            </Link>
            <Link href="/pesquisar" className={styles.navLink}>
              Pesquisar pautas
            </Link>
            <Link href="/gerar" className={styles.navLink}>
              Gerar carrossel
            </Link>
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
