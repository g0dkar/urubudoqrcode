import {NavItem} from "@/types/nav"

interface SiteConfig {
    name: string
    description: string
    mainNav: NavItem[]
}

export const siteConfig: SiteConfig = {
    name: "QRCode do Pix",
    description:
        "Um site onde você pode gerar seu QRCode para receber pagamentos via Pix",
    mainNav: [
        {
            title: "Início",
            href: "/",
        },
        {
            title: "Como funciona?",
            href: "/como-funciona",
        },
    ]
}
