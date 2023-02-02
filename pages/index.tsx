import Head from "next/head"
import {Layout} from "@/components/layout"
import {Input, InputClassNames} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useEffect, useRef, useState} from "react"
import {IMaskInput} from "react-imask"
import {Button} from "@/components/ui/button";
import {QrCode} from "lucide-react";
import PixQRCode from "@/lib/pix";

const Index = () => {
    const [tipo, setTipo] = useState("0")
    const [chave, setChave] = useState("")
    const [maskChave, setMaskChave] = useState("000.000.000-00")
    const [nome, setNome] = useState("")
    const [cidade, setCidade] = useState("")
    const [valor, setValor] = useState("0")
    const [semValor, setSemValor] = useState("0")
    const [pix, setPix] = useState("...")
    const chaveRef = useRef(null)
    const valorRef = useRef(null)

    useEffect(() => {
        const chaveInput = chaveRef.current
        if (chaveInput) {
            chaveInput.id = "chave"
            chaveInput.className = InputClassNames
            chaveInput.tabIndex = 2
        }

        const valorInput = valorRef.current
        if (valorInput) {
            valorInput.id = "valor"
            valorInput.className = InputClassNames
            valorInput.placeholder = "Valor do Pix"
            valorInput.tabIndex = 6
        }

        selectTipoChave("0")
    }, [])

    const selectTipoChave = (selected: string) => {
        setTipo(selected)
        setChave("")

        if (selected === "1") {
            setMaskChave("00.000.000/0000-00")
            chaveRef.current.placeholder = "Chave Pix (CNPJ: 00.000.000/0000-00)"
        } else if (selected === "3") {
            setMaskChave("(00) [0]0000-0000")
            chaveRef.current.placeholder = "Chave Pix (Telefone Celular ou Fixo)"
        } else {
            setMaskChave("000.000.000-00")
            chaveRef.current.placeholder = "Chave Pix (CPF: 000.000.000-00)"
        }
    }

    const onChangeChave = (evt) => {
        evt.preventDefault()
        setChave(evt.target.value)
    }

    const onChangeNome = (evt) => {
        evt.preventDefault()
        setNome(evt.target.value)
    }

    const onChangeCidade = (evt) => {
        evt.preventDefault()
        setCidade(evt.target.value)
    }

    const selectSemValor = (selected: string) => {
        setSemValor(selected)
    }

    const gerarQRCode = (evt) => {
        evt.preventDefault()
        const pixQrCode = new PixQRCode()
        pixQrCode.chave = chave
        pixQrCode.nome = nome
        pixQrCode.cidade = cidade
        pixQrCode.valor = semValor === "0" ? null : Number(valor)

        const codigoPix = pixQrCode.codigo()

        setPix(codigoPix)
    }

    // @ts-ignore
    return <Layout>
        <Head>
            <title>QRCode do Pix</title>
            <meta name="description" content="Next.js template for building apps with Radix UI and Tailwind CSS"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>
        <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
            <div className="flex max-w-[980px] flex-col items-start gap-2">
                <h1 className="logo-grad text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
                    QRCode do Pix
                </h1>
                <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
                    Seguro, Prático, Rápido e Gratuito! Crie um QRCode para receber pagamentos Pix em seu negócio
                    agora mesmo - <span className="text-lg font-semibold text-slate-900 dark:text-slate-50">Todo o processo
                    é offline e acontece no seu navegador!</span>
                </p>
            </div>
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`chave${tipo === "2" || tipo === "4" ? tipo : ""}`} className="text-md">Chave Pix <span
                            className="text-sm text-slate-500 dark:text-slate-400">(obrigatório)</span></Label>
                        <div className="flex w-full items-center space-x-2">
                            <Select value={tipo} onValueChange={selectTipoChave}>
                                <SelectTrigger className="w-[200px]" tabIndex={1}>
                                    <SelectValue placeholder="Tipo de Chave"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">CPF</SelectItem>
                                    <SelectItem value="1">CNPJ</SelectItem>
                                    <SelectItem value="2">E-mail</SelectItem>
                                    <SelectItem value="3">Telefone</SelectItem>
                                    <SelectItem value="4">Aleatória</SelectItem>
                                </SelectContent>
                            </Select>

                            <span className={`w-full ${tipo === "2" || tipo === "4" ? "hidden" : ""}`}>
                                <IMaskInput value={chave} mask={maskChave} unmask={true}
                                            onAccept={(value: string) => setChave(value)} inputRef={chaveRef}/>
                            </span>
                            <span className={`w-full ${tipo === "4" ? "" : "hidden"}`}>
                                <Input type="text" id="chave4" value={chave} onChange={onChangeChave}
                                       placeholder="Chave Pix (Chave Aleatória)" tabIndex={2} maxLength={70}/>
                            </span>
                            <span className={`w-full ${tipo === "2" ? "" : "hidden"}`}>
                                <Input type="email" id="chave2" value={chave} onChange={onChangeChave}
                                       placeholder="Chave Pix (seu.endereco@de-email.com)" tabIndex={2} maxLength={70}/>
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">Chave Pix que irá receber a transferência.</p>
                    </div>

                    <div className="mt-6 grid w-full items-center gap-1.5">
                        <Label htmlFor="nome" className="text-md">Nome do(a) Beneficiário(a) <span
                            className="text-sm text-slate-500 dark:text-slate-400">(obrigatório)</span></Label>
                        <Input type="text" id="nome" placeholder="Nome do(a) Beneficiário(a)" tabIndex={3}
                               maxLength={32} value={nome} onChange={onChangeNome}/>
                        <p className="text-sm text-slate-500">
                            <span
                                className="pr-3 font-medium leading-none text-slate-700 dark:text-slate-300">Tamanho: {nome.length}/32</span>
                            Nome da pessoa ou empresa que irá receber o Pix
                        </p>
                    </div>

                    <div className="mt-6 grid w-full items-center gap-1.5">
                        <Label htmlFor="cidade" className="text-md">Cidade do(a) Beneficiário(a) <span
                            className="text-sm text-slate-500 dark:text-slate-400">(obrigatório)</span></Label>
                        <Input type="text" id="cidade" placeholder="Cidade do(a) Beneficiário(a)" tabIndex={4}
                               maxLength={15} value={cidade} onChange={onChangeCidade}/>
                        <p className="text-sm text-slate-500">
                            <span
                                className="pr-3 font-medium leading-none text-slate-700 dark:text-slate-300">Tamanho: {cidade.length}/15</span>
                            Cidade onde encontra-se a pessoa ou empresa que irá receber o Pix
                        </p>
                    </div>

                    <div className="mt-6 grid w-full items-center gap-1.5">
                        <Label htmlFor="selectValor" className="text-md">Valor do Pix</Label>

                        <Select value={semValor} onValueChange={selectSemValor}>
                            <SelectTrigger id="selectValor" className="w-auto" tabIndex={5}>
                                <SelectValue placeholder="Pedir valor?"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Sem valor definido</SelectItem>
                                <SelectItem value="1">Definir um valor específico</SelectItem>
                            </SelectContent>
                        </Select>

                        <div
                            className={`mt-2 flex max-w-[300px] items-center space-x-4 rounded-md border border-slate-300 p-4 dark:border-slate-600${semValor === "0" ? " hidden" : ""}`}>
                            <Label htmlFor="valor">Valor:</Label>
                            <IMaskInput value={valor} mask={Number} unmask={true} scale={2} signed={false} min={0}
                                        max={99999} thousandsSeparator="." padFractionalZeros={true}
                                        inputRef={valorRef} normalizeZeros={false}
                                        onAccept={(value: string) => setValor(value)}/>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button className="text-md px-10" disabled={chave === "" || nome === "" || cidade === ""}
                                onClick={gerarQRCode}>
                            <QrCode className="mr-2 h-4 w-4"/> Gerar QRCode
                        </Button>
                    </div>
                </div>
                <div>
                    <h2>QRCode</h2>
                    <p>Pix copia e cola: {pix}</p>
                </div>
            </div>
        </section>
    </Layout>
}

export default Index
