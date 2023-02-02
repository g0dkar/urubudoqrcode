import type {AppProps} from "next/app"
import {Inter as FontSans} from "@next/font/google"
import {ThemeProvider} from "next-themes"

import "@/styles/globals.css"
import "@/styles/index.css"

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
})

const App = ({Component, pageProps}: AppProps) =>
    <>
        <style jsx global>{`
            :root {
                --font-sans: ${fontSans.style.fontFamily};
            }

            }`}</style>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Component {...pageProps} />
        </ThemeProvider>
    </>

export default App
