import crc16 from "@/lib/crc16";

export default class PixQRCode {
    public chave: string = ""
    public nome: string = ""
    public cidade: string = ""
    public valor: number = null

    private PIX_GUI = "BR.GOV.BCB.PIX"

    pixField(id: string, value: string) {
        const len = value.length
        return id + (len < 10 ? ("0" + len) : len) + value
    }

    pixPayload() {
        return this.pixField("00", "01")
    }

    accountInfo() {
        return this.pixField("26", this.pixField("00", this.PIX_GUI) + this.pixField("01", this.chave))
    }

    category() {
        return this.pixField("52", "0000")
    }

    currency() {
        return this.pixField("53", "986")
    }

    country() {
        return this.pixField("58", "BR")
    }

    recipient() {
        return this.pixField("59", this.nome)
    }

    city() {
        return this.pixField("60", this.cidade)
    }

    value() {
        return this.pixField("62", this.pixField("05", this.valor === null ? "***" : this.valor.toFixed(2)))
    }

    crcPrefix() {
        return "6304"
    }

    codigo() {
        const pix = (this.pixPayload() + this.accountInfo() + this.category() + this.currency() + this.country() + this.recipient() + this.city() + this.value() + this.crcPrefix()).toUpperCase()
        return pix + crc16(pix).toString(16).toUpperCase()
    }
}
