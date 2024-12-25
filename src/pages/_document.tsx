import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/images/reddex-dark.svg" />
          <script
            defer
            data-domain="reddex.app"
            src="https://plausible.io/js/script.js"
          ></script>
        </Head>
        <body className="bg-background">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
