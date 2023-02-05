import crc16 from "@/lib/crc16"

interface PixField {
    id: string
    name: string
    value: string | Array<PixField>
    valueStr?: string
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
            val = this.normalizar(field.value)
        } else {
            val = field.value.reduce((previousValue, currentValue) => previousValue + this.pixField(currentValue), "")
        }

        return field.id + this.zeroPad(val, 2) + val
    }

    private normalizar(str: string) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    }

    private zeroPad(str: string, size: number) {
        const padSize = size - str.length

        if (padSize > 0) {
            return "0".repeat(padSize).concat(str)
        } else {
            return str
        }
    }

    pixPayload(): PixField {
        const field = {
            id: "00",
            name: "Payload",
            value: "01",
            description: "Campo que indica que este dado é um Pix Copia-e-Cola ou QRCode (chamado de \"Pix Estático\"" +
                " pelo BaCen)",
            bacenDescription: "Payload Format Indicator (obrigatório)",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    accountInfo(): PixField {
        const field = {
            id: "26",
            name: "Recebedor - Pix",
            valueStr: "",
            value: [
                {
                    id: "00",
                    name: "Campo Fixo: GUI Pix",
                    value: this.PIX_GUI,
                    description: "Valor fixo determinado pelo Banco Central",
                    bacenDescription: "GUI",
                    computed: "",
                },
                {
                    id: "01",
                    name: "Chave Pix",
                    value: this.chave,
                    description: "Chave Pix que Receberá a Transação (não precisa ser em maiúsculas) - Se for" +
                        " telefone, deve ser em formato internacional.",
                    bacenDescription: "Chave",
                    computed: "",
                },
            ],
            description: "Informações da Pessoa que Receberá o Pix. É composto por 2 sub-campos. Um é fixo e tem ID" +
                " 0 e valor \"BR.GOV.BCB.PIX\". O outro tem ID 1 e é a chave Pix que receberá esta transação.",
            bacenDescription: "Merchant Account Information (obrigatório)",
            computed: "",
        }

        field.value[0].computed = this.pixField(field.value[0])
        field.value[1].computed = this.pixField(field.value[1])
        field.valueStr = field.value[0].computed + field.value[1].computed
        field.computed = this.pixField(field)

        return field
    }

    category(): PixField {
        const field = {
            id: "52",
            name: "Categoria",
            value: "0000",
            description: "Categoria do Recipiente (0000 = Não Informado)",
            bacenDescription: "Merchant Category Code (obrigatório)",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    currency(): PixField {
        const field = {
            id: "53",
            name: "Moeda",
            value: "986",
            description: "Moeda do Valor do Pix (986 = Real)",
            bacenDescription: "Transaction Currency (obrigatório)",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    value(): PixField {
        const field = {
            id: "54",
            name: "Valor",
            value: this.valor === null ? "0" : this.valor.toFixed(2),
            description: "Valor da transação. Se este campo for omitido ou o valor for \"0\", isso significa que o" +
                " recebedor expressou que não informou um valor para a transação.",
            bacenDescription: "Transaction Amount (opcional)",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    country(): PixField {
        const field = {
            id: "58",
            name: "País",
            value: "BR",
            description: "País onde está ocorrendo a transação (precisa ser em maiúsculas)",
            bacenDescription: "Country Code (obrigatório)",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    recipient(): PixField {
        const field = {
            id: "59",
            name: "Recebedor - Nome",
            value: this.nome,
            description: "Nome da Pessoa ou Empresa que Receberá o Pix (não precisa ser em maiúsculas; deve estar sem" +
                " acentos)",
            bacenDescription: "Merchant Name (obrigatório)",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    city(): PixField {
        const field = {
            id: "60",
            name: "Recebedor - Cidade",
            value: this.cidade,
            description: "Cidade da Pessoa ou Empresa que Receberá o Pix (não precisa ser em maiúsculas; deve estar" +
                " sem acentos)",
            bacenDescription: "Merchant City (obrigatório)",
            computed: "",
        }

        field.computed = this.pixField(field)

        return field
    }

    txid(): PixField {
        const field = {
            id: "62",
            name: "Info. Adicionais - ID da Transação",
            valueStr: "",
            value: [
                {
                    id: "05",
                    name: "TxID",
                    value: "***",
                    description: "ID da Transação a ser usado por um sistema do Recebedor",
                    bacenDescription: "Reference Label",
                    computed: "",
                }
            ],
            description: "Informações Adicionais. Normalmente utilizado para fazer integrações com sistemas do" +
                " recebedor. Por exemplo, você pode colocar o número do pedido neste campo e identificar que um" +
                " determinado Pix está relacionado a um determinado pedido através desta informação. Neste caso, ele" +
                " está sendo ignorado :)",
            bacenDescription: "Additional Data Field Template (obrigatório)",
            computed: "",
        }

        field.value[0].computed = this.pixField(field.value[0])
        field.valueStr = field.value[0].computed
        field.computed = this.pixField(field)

        return field
    }

    crc(crcValue: string): PixField {
        const field = {
            id: "63",
            name: "4 Dígitos Verificadores",
            value: crcValue,
            description: "Valor da Verificação Cíclica de Redundância (precisa ser em maiúsculas). Campo especial." +
                " O valor deste campo é calculado pegando-se todos os campos anteriores + '6304'" +
                " e calculando-se o CRC16 (polinômio 0x1021, valor inicial 0xFFFF) disso. O valor do campo, então," +
                " torna-se 6304[CRC16].",
            bacenDescription: "CRC16 (obrigatório)",
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
                this.value(),
                this.country(),
                this.recipient(),
                this.city(),
                this.txid(),
            ],
            crc: "",
            pix: "",
        }

        let pix: string = codigo.fields.reduce((previousValue, currentValue) => previousValue + currentValue.computed, "") + this.CRC_PREFIX
        const crcValue = this.zeroPad(crc16(pix).toString(16).toUpperCase(), 4)

        codigo.fields.push(this.crc(crcValue))
        codigo.crc = crcValue
        codigo.pix = pix + crcValue

        return codigo
    }
}
