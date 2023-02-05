# QRCode do Pix / Urubu do QRCode!

![Urubu do QRCode](public/images/urubu-do-qrcode.png "Logo do Projeto")

Este é um projeto de final de semana que fiz para gerar QRCodes para recebimento de pagamentos Pix.

>**O nome do repositório é uma brincadeira com o meme do Urubu do Pix... caso não tenha dado para notar :P**

## Partes interessantes:

- [`pix.ts`](lib/pix.ts): Arquivo que define a classe `PixField`, a qual é usada para compor o código Pix.
- [`crc16.ts`](lib/crc16.ts): Implementação do algorítimo CRC16 acompanhado da tabela de polinômio `0x1021` e
  inicializado com `0xFFFF`. Esses valores são os valores requeridos pelo Banco Central (BaCen) para se calcular os
  dígitos verificadores do Pix.

## Links e Referências

- Gerador de QRCode: [QRCode-Kotlin](https://qrcodekotlin.com)
- [Documentação do BaCen](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf)
- [Shadcn UI](https://ui.shadcn.com/)

## Agradecimentos

Um imenso agradecimento ao mano @jaffrito, que não só deu a ideia como todo o apoio, ajudou a testar e divulgar esse
projeto :)

## Licença

Este código é licenciado via [MIT License](https://rafaellins.mit-license.org/2021/).

[//]: # (# next-template)

[//]: # ()
[//]: # (A Next.js 13 template for building apps with Radix UI and Tailwind CSS.)

[//]: # ()
[//]: # (## Features)

[//]: # ()
[//]: # (- Radix UI Primitives)

[//]: # (- Tailwind CSS)

[//]: # (- Fonts with `@next/font`)

[//]: # (- Icons from [Lucide]&#40;https://lucide.dev&#41;)

[//]: # (- Dark mode with `next-themes`)

[//]: # (- Automatic import sorting with `@ianvs/prettier-plugin-sort-imports`)

[//]: # ()
[//]: # (## Tailwind CSS Features)

[//]: # ()
[//]: # (- Class merging with `taiwind-merge`)

[//]: # (- Animation with `tailwindcss-animate`)

[//]: # (- Conditional classes with `clsx`)

[//]: # (- Variants with `class-variance-authority`)

[//]: # (- Automatic class sorting with `eslint-plugin-tailwindcss`)

[//]: # ()
[//]: # (## Import Sort)

[//]: # ()
[//]: # (The starter comes with `@ianvs/prettier-plugin-sort-imports` for automatically sort your imports.)

[//]: # ()
[//]: # (### Input)

[//]: # ()
[//]: # (```tsx)

[//]: # (import * as React from "react")

[//]: # (import Link from "next/link")

[//]: # ()
[//]: # (import { siteConfig } from "@/config/site")

[//]: # (import { buttonVariants } from "@/components/ui/button")

[//]: # (import "@/styles/globals.css")

[//]: # (import { twMerge } from "tailwind-merge")

[//]: # ()
[//]: # (import { NavItem } from "@/types/nav")

[//]: # (import { cn } from "@/lib/utils")

[//]: # (```)

[//]: # ()
[//]: # (### Output)

[//]: # ()
[//]: # (```tsx)

[//]: # (import * as React from "react")

[//]: # (// React is always first.)

[//]: # (import Link from "next/link")

[//]: # (// Followed by next modules.)

[//]: # (import { twMerge } from "tailwind-merge")

[//]: # ()
[//]: # (// Followed by third-party modules)

[//]: # (// Space)

[//]: # (import "@/styles/globals.css")

[//]: # (// styles)

[//]: # (import { NavItem } from "@/types/nav")

[//]: # (// types)

[//]: # (import { siteConfig } from "@/config/site")

[//]: # (// config)

[//]: # (import { cn } from "@/lib/utils")

[//]: # (// lib)

[//]: # (import { buttonVariants } from "@/components/ui/button")

[//]: # ()
[//]: # (// components)

[//]: # (```)

[//]: # ()
[//]: # (### Class Merging)

[//]: # ()
[//]: # (The `cn` util handles conditional classes and class merging.)

[//]: # ()
[//]: # (### Input)

[//]: # ()
[//]: # (```ts)

[//]: # (cn&#40;"px-2 bg-slate-100 py-2 bg-slate-200"&#41;)

[//]: # (// Outputs `p-2 bg-slate-200`)

[//]: # (```)

[//]: # ()
[//]: # (## License)

[//]: # ()
[//]: # (Licensed under the [MIT license]&#40;https://github.com/shadcn/ui/blob/main/LICENSE.md&#41;.)
