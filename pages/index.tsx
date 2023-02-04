import Head from "next/head"
import {Layout} from "@/components/layout"
import {Input, InputClassNames} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useEffect, useRef, useState} from "react"
import {IMaskInput} from "react-imask"
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
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {io} from "@/lib/qrcode-kotlin";
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
                className={cn("text-md relative mr-1 mb-1 inline-block cursor-pointer rounded bg-slate-100 py-[0.2rem]" +
                    " px-[0.3rem] font-mono text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400" +
                    " hover:dark:bg-slate-700", className)}>
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
    const [chave, setChave] = useState("")
    const [maskChave, setMaskChave] = useState("000.000.000-00")
    const [nome, setNome] = useState("")
    const [cidade, setCidade] = useState("")
    const [valor, setValor] = useState("0")
    const [semValor, setSemValor] = useState("0")
    const [pix, setPix] = useState(null)
    const [qrcodeDataUrl, setQrcodeDataUrl] = useState("")
    const [comoFunciona, setComoFunciona] = useState(false)
    const chaveRef = useRef(null)
    const valorRef = useRef(null)

    useEffect(() => {
        const chaveInput = chaveRef.current
        if (chaveInput) {
            chaveInput.id = "chave"
            chaveInput.className = InputClassNames
            chaveInput.tabIndex = 2
            chaveInput.placeholder = "Chave Pix (CPF: 000.000.000-00)"
        }

        const valorInput = valorRef.current
        if (valorInput) {
            valorInput.id = "valor"
            valorInput.className = InputClassNames
            valorInput.placeholder = "Valor do Pix"
            valorInput.tabIndex = 6
        }
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
        if (evt) {
            evt.preventDefault()
        }

        const pixQrCode = new PixQRCode()
        pixQrCode.chave = (tipo === "3" ? "+55" : "") + chave
        pixQrCode.nome = nome
        pixQrCode.cidade = cidade
        pixQrCode.valor = semValor === "0" ? null : Number(valor)

        const codigoPix = pixQrCode.codigo()

        setPix(codigoPix)
        const result = new QRCode(codigoPix.pix).render()
        const dataURL = result.toDataURL()
        setQrcodeDataUrl(dataURL)
    }

    const recomecarQRCode = (evt) => {
        evt.preventDefault()
        setPix(null)
        setNome("")
        setCidade("")
        setValor("0")
        setSemValor("0")
        setQrcodeDataUrl("")
        setComoFunciona(false)
        selectTipoChave("0")
        chaveRef.current.focus()
    }

    const copiarPix = (evt) => {
        evt.preventDefault()
        console.log("Copiar pix...")
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
                <div className="col-span-5 lg:col-span-3">
                    <h2 className="mt-10 mb-5 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
                        <FormInput className="mb-1 mr-2 inline-block"/>
                        Informações do Pix
                    </h2>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`chave${tipo === "2" || tipo === "4" ? tipo : ""}`} className="text-md">
                            <Key className="mb-1 mr-1 inline-block w-4"/>
                            Chave Pix <span className="text-sm text-slate-500 dark:text-slate-400">(obrigatório)</span></Label>
                        <div
                            className="flex w-full flex-col items-center space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                            <Select value={tipo} onValueChange={selectTipoChave}>
                                <SelectTrigger className="w-full sm:w-[200px]" tabIndex={1}>
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

                            <div className={cn("w-full", comoFunciona ? "rounded outline outline-2" +
                                " outline-offset-2 outline-lime-700" : "")}>
                                <span className={`w-full${tipo === "2" || tipo === "4" ? " hidden" : ""}`}>
                                    <IMaskInput value={chave} mask={maskChave} unmask={true}
                                                onAccept={(value: string) => setChave(value)} inputRef={chaveRef}/>
                                </span>
                                <span className={`w-full${tipo === "4" ? "" : " hidden"}`}>
                                    <Input type="text" id="chave4" value={chave} onChange={onChangeChave}
                                           placeholder="Chave Pix (Chave Aleatória)" tabIndex={2} maxLength={70}/>
                                </span>
                                <span className={`w-full${tipo === "2" ? "" : " hidden"}`}>
                                    <Input type="email" id="chave2" value={chave} onChange={onChangeChave}
                                           placeholder="Chave Pix (seu.endereco@de-email.com)" tabIndex={2}
                                           maxLength={70}/>
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">Chave Pix que irá receber a transferência.</p>
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
                                   maxLength={25} value={nome} onChange={onChangeNome}/>
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
                                   maxLength={15} value={cidade} onChange={onChangeCidade}/>
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
                            <Select value={semValor} onValueChange={selectSemValor}>
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
                                <IMaskInput value={valor} mask={Number} unmask={true} scale={2} signed={false} min={0}
                                            max={99999} thousandsSeparator="." padFractionalZeros={true}
                                            inputRef={valorRef} normalizeZeros={false}
                                            onAccept={(value: string) => setValor(value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid w-full items-center justify-items-center gap-3 md:flex">
                        <Button
                            className="text-md w-full bg-emerald-500 px-8 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 md:w-fit"
                            disabled={chave === "" || nome === "" || cidade === ""} size="lg"
                            onClick={gerarQRCode}>
                            <QrCode className="mr-2 inline-block w-4"/>
                            Gerar QRCode
                        </Button>
                        <Button variant="outline" className="w-fit px-4" onClick={recomecarQRCode} size="sm">
                            <RefreshCw className="mr-2 inline-block w-4"/>
                            Recomeçar
                        </Button>
                    </div>
                </div>
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
                            <img src={qrcodeDataUrl} className="max-w-full" width={625} height={625} alt="QRCode do Pix"/>
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
                                Copiar
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
