import * as React from "react"
import {useTheme} from "next-themes"

import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

const ThemeToggle = () => {
    const {setTheme,theme} = useTheme()

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
                <Icons.sun className="hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"/>
                <span className="sr-only">Mudar Tema</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" forceMount>
            <DropdownMenuItem onClick={() => setTheme("light")} className={theme == 'light' ? "bg-slate-200 dark:bg-slate-600" : ""}>
                <Icons.sun className="mr-2 h-4 w-4"/>
                <span>Tema Claro</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className={theme == 'dark' ? "bg-slate-200 dark:bg-slate-600" : ""}>
                <Icons.moon className="mr-2 h-4 w-4"/>
                <span>Tema Escuro</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className={theme == 'system' ? "bg-slate-200 dark:bg-slate-600" : ""}>
                <Icons.laptop className="mr-2 h-4 w-4"/>
                <span>Mesmo do Sistema</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}

export default ThemeToggle
