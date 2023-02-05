import {NumberFormatBase} from "react-number-format";
import {formatCurrency} from "@/lib/utils";

export const CurrencyInput = (props) => {
    const format = (numStr: string) => {
        if (numStr === "") {
            return ""
        }

        return formatCurrency(Number(numStr))
    }

    return <NumberFormatBase {...props} format={format}/>
}
