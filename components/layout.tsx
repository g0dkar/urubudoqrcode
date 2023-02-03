import {SiteHeader} from "@/components/site-header"
import React from "react";

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({children}: LayoutProps) {
    return <>
        <SiteHeader/>
        <main>{children}</main>
    </>
}
