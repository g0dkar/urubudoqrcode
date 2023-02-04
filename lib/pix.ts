import crc16 from "@/lib/crc16"

interface PixField {
    id: string
    value: string | Array<PixField>
    description: string
    bacenDescription: string
    computed: string
}

export default class PixQRCode {
    public chave: string = ""
    public nome: string = ""
    public cidade: string = ""
    public valor: number = null

    private PIX_GUI = "BR.GOV.BCB.PIX"
    private CRC_PREFIX = "6304"

    private pixField(field: PixField) {
        let val: string

        if (typeof field.value === "string") {
            val = field.value
        } else {
            val = field.value.reduce((previousValue, currentValue) => previousValue + this.pixField(currentValue), "")
        }

        return field.id + (val.length < 10 ? ("0" + val.length) : val.length) + val
    }

    pixPayload(): PixField {
        const field = {
            id: "00",
            value: "01",
            description: "Campo que indica que este dado é um Pix Copia-e-Cola",
            bacenDescription: "Payload Format Indicator",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    accountInfo(): PixField {
        const field = {
            id: "26",
            value: [
                {
                    id: "00",
                    value: this.PIX_GUI,
                    description: "Valor fixo determinado pelo Banco Central",
                    bacenDescription: "GUI",
                    computed: "",
                },
                {
                    id: "01",
                    value: this.chave,
                    description: "Chave Pix que Receberá a Transação (não precisa ser em maiúsculas) - Se for" +
                        " telefone, deve ser em formato internacional.",
                    bacenDescription: "Chave",
                    computed: "",
                },
            ],
            description: "Informações da Pessoa que Receberá o Pix",
            bacenDescription: "Merchant Account Information",
            computed: "",
        }

        field.value[0].computed = this.pixField(field.value[0])
        field.value[1].computed = this.pixField(field.value[1])
        field.computed = this.pixField(field)

        return field
    }

    category(): PixField {
        const field = {
            id: "52",
            value: "0000",
            description: "Categoria do Recipiente (0000 = Não Informado)",
            bacenDescription: "Merchant Category Code",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    currency(): PixField {
        const field = {
            id: "53",
            value: "986",
            description: "Moeda do Valor do Pix (986 = Real)",
            bacenDescription: "Transaction Currency",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    country(): PixField {
        const field = {
            id: "58",
            value: "BR",
            description: "País onde está ocorrendo a transação (precisa ser em maiúsculas)",
            bacenDescription: "Country Code",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    recipient(): PixField {
        const field = {
            id: "59",
            value: this.nome,
            description: "Nome da Pessoa ou Empresa que Receberá o Pix (não precisa ser em maiúsculas)",
            bacenDescription: "Merchant Name",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    city(): PixField {
        const field = {
            id: "60",
            value: this.cidade.toUpperCase(),
            description: "Cidade da Pessoa ou Empresa que Receberá o Pix (precisa ser em maiúsculas)",
            bacenDescription: "Merchant City",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    value(): PixField {
        const field = {
            id: "62",
            value: [{
                id: "05",
                value: this.valor === null ? "***" : this.valor.toFixed(2),
                description: "Valor do Pix ou '***' caso não esteja presente",
                bacenDescription: "Merchant City",
                computed: "",
            }],
            description: "Informações Adicionais. Normalmente o Valor.",
            bacenDescription: "Merchant City",
            computed: "",
        }

        field.value[0].computed = this.pixField(field.value[0])
        field.computed = this.pixField(field)

        return field
    }

    crc(crcValue: string): PixField {
        const field = {
            id: "63",
            value: crcValue,
            description: "Valor da Verificação Cíclica de Redundância (precisa ser em maiúsculas)",
            bacenDescription: "CRC16",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    codigo() {
        const codigo = {
            fields: [
                this.pixPayload(),
                this.accountInfo(),
                this.category(),
                this.currency(),
                this.country(),
                this.recipient(),
                this.city(),
                this.value(),
            ],
            crc: "",
            pix: "",
        }

        let pix: string = codigo.fields.reduce((previousValue, currentValue) => previousValue + currentValue.computed, "") + this.CRC_PREFIX
        const crcValue = crc16(pix).toString(16).toUpperCase()

        codigo.fields.push(this.crc(crcValue))
        codigo.crc = crcValue
        codigo.pix = pix + crcValue

        return codigo
    }
}
