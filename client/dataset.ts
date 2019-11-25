import countries from 'i18n-iso-countries'

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

const LANG = 'en'

export const getCountryNames = () => {
    return countries.getNames(LANG) // {code: name}
}

export const codeToCountryName = (code: string) => {
    return countries.getName(code, LANG)
}
