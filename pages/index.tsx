import Head from "next/head"
import {Layout} from "@/components/layout"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useState} from "react"
import {Button, buttonVariants} from "@/components/ui/button"
import {
    Building,
    ChevronsRight,
    Copy,
    DollarSign,
    Download,
    FormInput,
    Key,
    Pencil,
    QrCode,
    RefreshCw,
    User
} from "lucide-react"
import PixQRCode from "@/lib/pix"
import {Checkbox} from "@/components/ui/checkbox"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {io} from "@/lib/qrcode-kotlin"
import {PatternFormat} from "react-number-format";
import {CurrencyInput} from "@/components/ui/currency-input";
import QRCode = io.github.g0dkar.qrcode.QRCode;

const CampoPix = ({show, campo, className = ""}) => {
    const campoValue = campo?.valueStr || campo?.value

    if (!show) {
        return <code
            className="text-md relative bg-slate-100 py-[0.2rem] font-mono text-slate-900 first:rounded-l first:pl-[0.3rem] last:rounded-r last:pr-[0.3rem] dark:bg-slate-800 dark:text-slate-400">
            {campo?.computed}
        </code>
    } else {
        return <Popover>
            <PopoverTrigger
                className={cn("text-sm text-left max-w-full relative mr-1 mb-1 inline-block" +
                    " cursor-pointer rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-slate-900" +
                    " hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 hover:dark:bg-slate-700", className)}>
                {campo?.computed}
            </PopoverTrigger>
            <PopoverContent className="w-80 border border-slate-200 shadow-md dark:border-slate-700">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-bold leading-none">{campo?.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{campo?.description}</p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="pixCampoID">ID</Label>
                            <Input id="pixCampoID" value={campo?.id} className="col-span-2 h-8" readOnly={true}
                                   disabled={true}/>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="pixCampoTam">Tamanho</Label>
                            <Input id="pixCampoTam" value={campoValue?.length} className="col-span-2 h-8"
                                   readOnly={true} disabled={true}/>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="pixCampoVal">Valor</Label>
                            <Input id="pixCampoVal" value={campoValue} className="col-span-2 h-8" readOnly={true}
                                   disabled={true}/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs italic text-slate-500 dark:text-slate-400">Descrição deste campo segundo o
                            BaCen: {campo?.bacenDescription}</p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    }
}

const Index = () => {
    const [tipo, setTipo] = useState("0")

    const [chaveCpf, setChaveCpf] = useState("")
    const [chaveCnpj, setChaveCnpj] = useState("")
    const [chaveCelular, setChaveCelular] = useState("")
    const [chaveFixo, setChaveFixo] = useState("")
    const [chaveEmail, setChaveEmail] = useState("")
    const [chaveAleatorio, setChaveAleatorio] = useState("")

    const [nome, setNome] = useState("")
    const [cidade, setCidade] = useState("")
    const [valor, setValor] = useState(0.00)
    const [semValor, setSemValor] = useState("0")
    const [pix, setPix] = useState(null)
    const [qrcodeDataUrl, setQrcodeDataUrl] = useState("")
    const [comoFunciona, setComoFunciona] = useState(false)
    const [btnCopiarTxt, setBtnCopiarTxt] = useState("Copiar")
    const [gerandoQrCode, setGerandoQrCode] = useState(false)

    const chave = () => {
        if (tipo === "0") {
            return chaveCpf
        } else if (tipo === "1") {
            return chaveCnpj
        } else if (tipo === "2") {
            return "+55" + chaveCelular
        } else if (tipo === "3") {
            return "+55" + chaveFixo
        } else if (tipo === "4") {
            return chaveEmail
        } else if (tipo === "5") {
            return chaveAleatorio
        }

        return ""
    }

    const gerarQRCode = (evt) => {
        if (evt) {
            evt.preventDefault()
        }

        if (!gerandoQrCode) {
            setGerandoQrCode(true)
            setTimeout(executarGeracao, 50)
        }
    }

    const executarGeracao = () => {
        const pixQrCode = new PixQRCode()
        pixQrCode.chave = chave()
        pixQrCode.nome = nome
        pixQrCode.cidade = cidade
        pixQrCode.valor = semValor === "0" ? null : Number(valor)

        const codigoPix = pixQrCode.codigo()

        setPix(codigoPix)
        const result = new QRCode(codigoPix.pix).render()
        const dataURL = result.toDataURL()
        setQrcodeDataUrl(dataURL)

        setGerandoQrCode(false)
    }

    const recomecarQRCode = (evt) => {
        if (evt) {
            evt.preventDefault()
        }

        setTipo("0")

        setChaveCpf("")
        setChaveCnpj("")
        setChaveCelular("")
        setChaveFixo("")
        setChaveEmail("")
        setChaveAleatorio("")

        setNome("")
        setCidade("")
        setValor(0.00)
        setSemValor("0")
        setPix(null)
        setQrcodeDataUrl("")
        setComoFunciona(false)
        setBtnCopiarTxt("Copiar")
        setGerandoQrCode(false)
    }

    const copiarPix = (evt) => {
        evt.preventDefault()
        navigator.clipboard.writeText(pix.pix).then(() => {
            setBtnCopiarTxt("Copiado!")
            setTimeout(() => setBtnCopiarTxt("Copiar"), 5000)
        })
    }

    return <Layout>
        <Head>
            <title>QRCode do Pix</title>
            <meta name="description" content="Next.js template for building apps with Radix UI and Tailwind CSS"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>
        <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
            <div className="flex max-w-full flex-col items-start gap-2">
                <h1 className="logo-grad text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
                    QRCode do Pix
                </h1>
                <div className="grid w-full grid-cols-5 gap-4">
                    <div className="col-span-5 lg:col-span-3">
                        <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
                            Seguro, Prático, Rápido e Gratuito! Crie um QRCode para receber pagamentos Pix em seu
                            negócio
                            agora mesmo - <span className="text-lg font-semibold text-slate-900 dark:text-slate-50">Todo o processo
                            é offline e acontece no seu navegador!</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid w-full grid-cols-5 gap-4">
                <form className="col-span-5 lg:col-span-3" onSubmit={gerarQRCode}>
                    <h2 className="mt-10 mb-5 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
                        <FormInput className="mb-1 mr-2 inline-block"/>
                        Informações do Pix
                    </h2>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="chave" className="text-md">
                            <Key className="mb-1 mr-1 inline-block w-4"/>
                            Chave Pix <span className="text-sm text-slate-500 dark:text-slate-400">(obrigatório)</span></Label>
                        <div
                            className="flex w-full flex-col items-center space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                            <Select value={tipo} onValueChange={(selected) => setTipo(selected)}>
                                <SelectTrigger className="w-full sm:w-[200px]" tabIndex={1}>
                                    <SelectValue placeholder="Tipo de Chave"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">CPF</SelectItem>
                                    <SelectItem value="1">CNPJ</SelectItem>
                                    <SelectItem value="2">E-mail</SelectItem>
                                    <SelectItem value="3">Celular</SelectItem>
                                    <SelectItem value="4">Telefone Fixo</SelectItem>
                                    <SelectItem value="5">Aleatória</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className={cn("w-full", comoFunciona ? "rounded outline outline-2" +
                                " outline-offset-2 outline-lime-700" : "")}>

                                {tipo === "0" ?
                                    <PatternFormat value={chaveCpf} format="###.###.###-##" mask="_" id="chave"
                                                   tabIndex={2} valueIsNumericString
                                                   placeholder="Chave Pix - 000.000.000-00"
                                                   onValueChange={(values) => setChaveCpf(values.value)}
                                                   customInput={Input} disabled={gerandoQrCode}/>
                                    : <></>}
                                {tipo === "1" ?
                                    <PatternFormat value={chaveCnpj} format="##.###.###/####-##" mask="_"
                                                   valueIsNumericString id="chave" tabIndex={2}
                                                   placeholder="Chave Pix - 00.000.000/0000-00"
                                                   onValueChange={(values) => setChaveCnpj(values.value)}
                                                   customInput={Input} disabled={gerandoQrCode}/>
                                    : <></>}
                                {tipo === "2" ?
                                    <PatternFormat value={chaveCelular} format="(##) #####-####" mask="_"
                                                   valueIsNumericString id="chave" tabIndex={2}
                                                   placeholder="Chave Pix - (00) 00000-0000"
                                                   onValueChange={(values) => setChaveCelular(values.value)}
                                                   customInput={Input} disabled={gerandoQrCode}/>
                                    : <></>}
                                {tipo === "3" ?
                                    <PatternFormat value={chaveFixo} format="(##) ####-####" mask="_"
                                                   valueIsNumericString id="chave" tabIndex={2}
                                                   placeholder="Chave Pix - (00) 0000-0000"
                                                   onValueChange={(values) => setChaveFixo(values.value)}
                                                   customInput={Input} disabled={gerandoQrCode}/>
                                    : <></>}
                                {tipo === "4" ?
                                    <Input type="email" id="chave" value={chaveEmail}
                                           onChange={(evt) => setChaveEmail(evt.target.value)}
                                           placeholder="Chave Pix - seu.endereco@de-email.com" tabIndex={2}
                                           maxLength={70} disabled={gerandoQrCode}/>
                                    : <></>}
                                {tipo === "5" ?
                                    <Input type="text" id="chave" value={chaveAleatorio}
                                           onChange={(evt) => setChaveAleatorio(evt.target.value)}
                                           placeholder="Chave Pix - Chave Aleatória" tabIndex={2} maxLength={70}
                                           disabled={gerandoQrCode}/>
                                    : <></>}
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">
                            <span
                                className="pr-3 font-medium leading-none text-slate-700 dark:text-slate-300">Tamanho: {nome.length}/25</span>
                            Chave Pix que irá receber a transferência.</p>
                    </div>

                    <div className="mt-6 grid w-full items-center gap-1.5">
                        <Label htmlFor="nome" className="text-md">
                            <User className="mb-1 mr-1 inline-block w-4"/>
                            Nome do(a) Beneficiário(a) <span
                            className="text-sm text-slate-500 dark:text-slate-400">(obrigatório)</span>
                        </Label>
                        <div className={cn("w-full", comoFunciona ? "rounded outline outline-2" +
                            " outline-offset-2 outline-sky-700" : "")}>
                            <Input type="text" id="nome" placeholder="Nome do(a) Beneficiário(a)" tabIndex={3}
                                   maxLength={25} value={nome} onChange={(evt) => setNome(evt.target.value)}
                                   disabled={gerandoQrCode}/>
                        </div>
                        <p className="text-sm text-slate-500">
                            <span
                                className="pr-3 font-medium leading-none text-slate-700 dark:text-slate-300">Tamanho: {nome.length}/25</span>
                            Nome da pessoa ou empresa que irá receber o Pix
                        </p>
                    </div>

                    <div className="mt-6 grid w-full items-center gap-1.5">
                        <Label htmlFor="cidade" className="text-md">
                            <Building className="mb-1 mr-1 inline-block w-4"/>
                            Cidade do(a) Beneficiário(a) <span
                            className="text-sm text-slate-500 dark:text-slate-400">(obrigatório)</span>
                        </Label>
                        <div className={cn("w-full", comoFunciona ? "rounded outline outline-2" +
                            " outline-offset-2 outline-yellow-700" : "")}>
                            <Input type="text" id="cidade" placeholder="Cidade do(a) Beneficiário(a)" tabIndex={4}
                                   maxLength={15} value={cidade} onChange={(evt) => setCidade(evt.target.value)}
                                   disabled={gerandoQrCode}/>
                        </div>
                        <p className="text-sm text-slate-500">
                            <span
                                className="pr-3 font-medium leading-none text-slate-700 dark:text-slate-300">Tamanho: {cidade.length}/15</span>
                            Cidade onde encontra-se a pessoa ou empresa que irá receber o Pix
                        </p>
                    </div>

                    <div className="mt-6 grid w-full items-center gap-1.5">
                        <Label htmlFor="selectValor" className="text-md">
                            <DollarSign className="mb-1 mr-1 inline-block w-4"/>
                            Valor do Pix
                        </Label>

                        <div className={cn("w-full", comoFunciona ? "rounded outline outline-2" +
                            " outline-offset-2 outline-pink-700" : "")}>
                            <Select value={semValor} onValueChange={(selected) => setSemValor(selected)}
                                    disabled={gerandoQrCode}>
                                <SelectTrigger id="selectValor" className="w-full" tabIndex={5}>
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
                                <CurrencyInput value={valor} customInput={Input} disabled={gerandoQrCode}
                                               onValueChange={(val) => setValor(Number(val.value / 100))}/>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid w-full items-center justify-items-center gap-3 md:flex">
                        <Button type="submit"
                                disabled={gerandoQrCode || chave() === "" || nome === "" || cidade === ""} size="lg"
                                className="text-md w-full bg-emerald-500 px-8 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 md:w-fit"
                                onClick={gerarQRCode}>
                            <QrCode className="mr-2 inline-block w-4"/>
                            {gerandoQrCode ? "Gerando..." : "Gerar QRCode"}
                        </Button>
                        <Button variant="outline" className="w-fit px-4" onClick={recomecarQRCode}
                                disabled={gerandoQrCode} size="sm">
                            <RefreshCw className="mr-2 inline-block w-4"/>
                            Recomeçar
                        </Button>
                    </div>
                </form>
                <div className="col-span-5 lg:col-span-2">
                    <h2 className="mt-10 mb-5 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
                        <ChevronsRight className="mb-1 mr-2 inline-block"/>
                        Seu QRCode
                    </h2>
                    <div className={pix === null ? 'hidden' : ''}>
                        <h3>
                            <QrCode className="mr-2 mb-1 inline-block w-4"/>
                            QRCode:
                        </h3>

                        <div className="my-2 rounded bg-white p-4 text-black">
                            <img src={qrcodeDataUrl} className="max-w-full" width={625} height={625}
                                 alt="QRCode do Pix"/>
                        </div>

                        <a href={qrcodeDataUrl} download="qrcode.png" className={cn(buttonVariants({
                            variant: "default",
                            size: "lg",
                            className: "w-full bg-emerald-500 px-8 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        }))}>
                            <Download className="mr-2 inline-block w-4"/>
                            Baixar QRCode
                        </a>

                        <p className="py-4 text-center text-xs italic text-slate-600 dark:text-slate-400">
                            Dica: Para testar, abra o aplicativo do seu banco e leia esse QRCode!
                        </p>

                        <h3>
                            <Pencil className="mr-2 mb-1 inline w-4"/>
                            Pix Copia-e-Cola:
                        </h3>
                        <div className="break-words rounded-md border border-emerald-300 p-4 dark:border-emerald-900">
                            <div>
                                <CampoPix show={comoFunciona} campo={pix?.fields[0]}/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[1]}
                                          className="border border-lime-300 text-lime-900 hover:border-lime-400 dark:border-lime-900 dark:text-lime-500 hover:dark:border-lime-800"/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[2]}/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[3]}/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[4]}
                                          className="border border-pink-300 text-pink-900 hover:border-pink-400 dark:border-pink-900 dark:text-pink-500 hover:dark:border-pink-800"/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[5]}/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[6]}
                                          className="border border-sky-300 text-sky-900 hover:border-sky-400 dark:border-sky-900 dark:text-sky-500 hover:dark:border-sky-800"/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[7]}
                                          className="border border-yellow-300 text-yellow-900 hover:border-yellow-400 dark:border-yellow-900 dark:text-yellow-500 hover:dark:border-yellow-800"/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[8]}/>
                                <CampoPix show={comoFunciona} campo={pix?.fields[9]}/>
                            </div>

                            <div
                                className={"text-xs mt-2 text-slate-500 dark:text-slate-400" + (!comoFunciona ? " hidden" : "")}>
                                Cada campo é composto por ID + Tamanho do Valor (sempre 2 dígitos) + Valor. Clique em
                                cada um para saber mais sobre eles!
                            </div>
                        </div>
                        <div className="mt-1 flex items-center">
                            <div className="flex w-full items-center space-x-2">
                                <Checkbox id="curiosidade"
                                          onCheckedChange={(val) => setComoFunciona(typeof val == "boolean" ? val : false)}/>
                                <Label htmlFor="curiosidade">
                                    Como funciona?
                                </Label>
                            </div>
                            <Button variant="outline" className="px-4" onClick={copiarPix} size="sm">
                                <Copy className="mr-2 w-4"/>
                                {btnCopiarTxt}
                            </Button>
                        </div>
                    </div>
                    <div
                        className={`rounded-md border border-emerald-300 p-4 dark:border-emerald-900${pix === null ? '' : ' hidden'}`}>
                        <p>Preencha as informações e clique em <span
                            className="font-bold text-emerald-600">Gerar QRCode</span> para ter seu QRCode e começar a
                            receber Pix :)</p>
                    </div>
                </div>
            </div>
        </section>
    </Layout>
}

export default Index
