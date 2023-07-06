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

export const isValidCPF = (cpfStr: string) => {
    if (!cpfStr || typeof cpfStr !== 'string') return false

    cpfStr = cpfStr.replace(/[^\d]+/g, '')
    if (cpfStr.length !== 11 || !!cpfStr.match(/(\d)\1{10}/)) return false

    const cpfNumArr = cpfStr.split('').map(el => +el)
    const remainder = (count) => (
        cpfNumArr.slice(0, count-12).reduce(
            (sum, el, index) => (sum + el * (count-index)), 0 ) * 10) % 11 % 10

    return remainder(10) === cpfNumArr[9] && remainder(11) === cpfNumArr[10]
}

export const isValidCNPJ = (cnpjStr: string) => {
    if (!cnpjStr || typeof cnpjStr !== 'string') return false

    cnpjStr = cnpjStr.replace(/[^\d]+/g, '')
    if (cnpjStr.length !== 14 || !!cnpjStr.match(/(\d)\1{13}/)) return false

    const cnpjNumArr = cnpjStr.split('').map(el => +el)

    const remainder = (count) => {
        return cnpjNumArr.slice(0, count).reduce(
            (sum, el, index) => {
                return sum + el * (count - index - (count - index - 7 > 1 ? 7 : -1))
            }, 0) * 10 % 11 % 10
    }
    return (remainder(12) === cnpjNumArr[12]) && remainder(13) === cnpjNumArr[13];
}

export const isValidEmail = (emailStr: string) => {
    return String(emailStr)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export const isValidChaveAleatoria = (chaveAleatoriaStr: string) => {
    return String(chaveAleatoriaStr)
        .toLowerCase()
        .match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        );
}
