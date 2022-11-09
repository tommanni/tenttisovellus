import axios from "axios"

export function reducer(state, action) {

    switch (action.type) {

        case "TENTIN_NIMI_MUUTTUI":
            let tentit1 = { ...state, tallennetaanko: true, method: "TNMuuttui", idList: [action.payload.tentinId, action.payload.nimi] }
            console.log(tentit1.tentit[action.payload.tentinIndex])
            tentit1.tentit[action.payload.tentinIndex].nimi = action.payload.nimi
            return tentit1

        case "KYSYMYKSEN_NIMI_MUUTTUI":
            let tentit2 = { ...state, tallennetaanko: true, method: "KNMuuttui", idList: [action.payload.tenttiId, action.payload.kysymysId, action.payload.nimi] }
            console.log(action.payload)
            tentit2.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].kysymys = action.payload.nimi
            return tentit2

        case "VASTAUKSEN_NIMI_MUUTTUI":
            let tentit3 = { ...state, tallennetaanko: true, method: "VNMuuttui", idList: [action.payload.kysymysId, action.payload.vastausId, action.payload.nimi] }
            tentit3.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vastaus = action.payload.nimi
            return tentit3
        //Poistetaan kysymys filtteröimällä se pois
        case 'POISTA_KYSYMYS':
            let tentit4 = { ...state, tallennetaanko: true, method: 'PKysymys', idList: [action.payload.tenttiId, action.payload.kysymys, state.kayttaja.id] }
            tentit4.tentit[action.payload.tenttiIndex].kysymykset = tentit4.tentit[action.payload.tenttiIndex].kysymykset.filter(kysymys => kysymys.kysymys !== action.payload.kysymys)
            return tentit4
        //Poistetaan vastaus filtteröimällä se pois
        case 'POISTA_VASTAUS':
            let tentit5 = { ...state, tallennetaanko: true, method: 'PVastaus', idList: [action.payload.kysymysId, action.payload.vastaus, state.kayttaja.id] }
            tentit5.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset = tentit5.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus => vastaus.vastaus !== action.payload.vastaus)
            return tentit5

        case 'LISAA_TENTTI':
            let tentit10 = { ...state, tallennetaanko: true, method: 'LTentti' }
            let idList = tentit10.tentit.map(tentti => Number(tentti.id))
            tentit10.tentit.push({ nimi: '', id: idList.length === 0 ? 1 : Math.max(...idList) + 1, kysymykset: [] })
            console.log(tentit10.tentit)
            return tentit10

        case 'POISTA_TENTTI':
            let tentit11 = { ...state, tallennetaanko: true, method: 'PTentti', idList: [action.payload.tenttiId] }
            action.payload.setValue({})
            tentit11.tentit = tentit11.tentit.filter(tentti => tentti.id !== action.payload.tenttiId)
            return tentit11

        case 'LISAA_KYSYMYS':
            let tentit6 = { ...state, tallennetaanko: true, method: 'LKysymys', idList: [state.tentit[action.payload].id] }
            let idList2 = []
            for (let i = 0; i < tentit6.tentit.length; i++) {
                tentit6.tentit[i].kysymykset.map(kysymys => idList2.push(kysymys.id))
            }
            tentit6.tentit[action.payload].kysymykset.push({ kysymys: "", id: Math.max(...idList2) + 1, vastaukset: [] })
            return tentit6

        case 'LISAA_VASTAUS':
            console.log(action.payload.kysymysId)
            let tentit7 = { ...state, tallennetaanko: true, method: 'LVastaus', idList: [action.payload.kysymysId] }
            let idList3 = []
            for (let i = 0; i < tentit7.tentit.length; i++) {
                for (let j = 0; j < tentit7.tentit[i].kysymykset.length; j++) {
                    tentit7.tentit[i].kysymykset[j].vastaukset.map(vastaus => idList3.push(vastaus.id))
                }
            }
            tentit7.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset.push({ id: Math.max(...idList3) + 1, vastaus: "", oikein: false, valinta: false })
            return tentit7

        case 'KYSYMYS_OIKEIN':
            let oikein = !state.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].oikein
            let tentit8 = { ...state, tallennetaanko: true, method: 'VOikein', idList: [action.payload.vastausId, oikein] }
            tentit8.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].oikein = oikein
            return tentit8

        case 'ASETA_VALINTA':
            let tentit9 = { ...state, tallennetaanko: true }
            tentit9.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].valinta = true
            return tentit9

        case 'LISAA_KAYTTAJA':
            let tentit12 = { ...state, tallennetaanko: true, rekisteröidytään: false }
            const isFound = tentit12.kayttajat.some(kayttaja => {
                if (kayttaja.kayttajatunnus === action.payload.kayttajatunnus) {
                    return true
                }
                return false
            })
            if (isFound) {
                alert('Käyttäjätunnus on varattu')
                return { ...state, tallennetaanko: true }
            }
            tentit12.kayttajat.push({ kayttajatunnus: action.payload.kayttajatunnus, salasana: action.payload.salasana, admin: action.payload.admin })
            axios.post('http://localhost:8080/rekisteroidytaan', { data: false })
            return tentit12

        case 'KIRJAUDU':
            let kayttaja = state.kayttajat.filter(kayttaja => kayttaja.kayttajatunnus === action.payload.kayttajatunnus && kayttaja.salasana === action.payload.salasana)
            if (kayttaja.length === 0) {
                alert('Nimessä tai salasanassa on virhe')
                return { ...state, tallennetaanko: true }
            }
            axios.post('http://localhost:8080/kirjaudu', { data: kayttaja[0] })
            let tentit13 = { ...state, kayttaja: kayttaja[0], kirjauduttu: true, tallennetaanko: true }
            return tentit13

        case 'REKISTEROIDYTAAN':
            let tentit14 = { ...state, rekisteröidytään: true }
            axios.post('http://localhost:8080/rekisteroidytaan', { data: true })
            return tentit14

        case 'POISTU':
            let tentit15 = { ...state, kirjauduttu: false, tallennetaanko: true }
            axios.post('http://localhost:8080/poistu')
            return tentit15

        case 'ALUSTA_DATA':
            if (action.payload.data.tentit.find(tentti => tentti.voimassa === true) !== undefined) {
                action.payload.setValue([action.payload.data.tentit.find(tentti => tentti.voimassa === true)])
            }
            return { ...action.payload.data, tietoAlustettu: true }

        case 'PAIVITA_TALLENNUSTILA':
            return { ...state, tallennetaanko: action.payload }

        case 'PAIVITA_KAYTTAJA':
            return { ...state, kayttaja: action.payload, tallennetaanko: true }

        case 'PAIVITA_VASTAUKSET':
            return { ...state, naytaVastaukset: action.payload, tallennetaanko: true }

        default:
            throw new Error("Learn to code noob")
    }
}