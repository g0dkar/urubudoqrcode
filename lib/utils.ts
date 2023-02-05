import {ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const brlCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
})

export const removeNumberMask = (numberStr: string) => numberStr.replace(/[\D+]/g, "")

export const formatCurrency = (number: number) => {
    if (!Number(number)) {
        return ""
    }

    const numberFormatted = number.toString().replace(/\D/g, "")
    const numberResult = Number(numberFormatted) / 100

    return brlCurrencyFormatter.format(numberResult)
}
