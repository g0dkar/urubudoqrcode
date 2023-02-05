import {Head, Html, Main, NextScript} from "next/document"

const Document = () =>
    <Html lang="en">
        <Head>
            <meta charSet="utf-8"/>
            <link rel="shortcut icon" href="/favicon.ico"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
            <meta name="robots" content="index,follow"/>
            <meta property="og:type" content="article"/>
            <meta property="og:title" content="QRCode do Pix: Gere um QRCode para receber Pix no seu negócio"/>
            <meta property="og:site_name" content="QRCode do Pix"/>
            <meta property="og:url" content="https://qrcodedopix.com.br"/>
            <meta property="og:image" content="/images/logo-pix-512.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
        </Head>
        <body
            className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <Main/>
        <NextScript/>
        </body>
    </Html>

export default Document
