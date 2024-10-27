import data from './languages.json'
export type Item = {
    value: number | string
    name: string
    example: string
}

export type I18nText = {
    'en-US': string
    'zh-Hans': string
    'pt-BR': string
    'es-ES': string
    'fr-FR': string
    'de-DE': string
    'ja-JP': string
    'ko-KR': string
    'ru-RU': string
    'it-IT': string
    'uk-UA': string
    'vi-VN': string
    'de_DE': string
    'zh_Hant': string
    'ro-RO': string
    'pl-PL': string
    'hi-IN': string
    'fa-IR': string
}

export const languages = data.languages

export const LanguagesSupported = languages.filter(item => item.supported).map(item => item.value)

export const getLanguage = (locale: string) => {
    if (locale === 'zh-Hans')
        return locale.replace('-', '_')

    return LanguagesSupported[0].replace('-', '_')
}

export const NOTICE_I18N = {
    title: {
        en_US: 'Important Notice',
    },
    desc: {
        en_US:
            'Our system will be unavailable from 19:00 to 24:00 UTC on August 28 for an upgrade. For questions, kindly contact our support team (support@dify.ai). We value your patience.'
    },
    href: '#',
}