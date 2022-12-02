export function reducer(state, action) {

    let tenttiKopio = { ...state }

    switch (action.type) {
        case "TENTIN_NIMI_MUUTTUI":
            console.log(tenttiKopio.tentit[action.payload.tentinIndex])
            tenttiKopio.tentit[action.payload.tentinIndex].nimi = action.payload.nimi
            return tenttiKopio

        case "KYSYMYKSEN_NIMI_MUUTTUI":
            console.log(action.payload)
            tenttiKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].kysymys = action.payload.nimi
            return tenttiKopio

        case "VASTAUKSEN_NIMI_MUUTTUI":
            tenttiKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vastaus = action.payload.nimi
            return tenttiKopio
        //Poistetaan kysymys filtteröimällä se pois
        case 'POISTA_KYSYMYS':
            tenttiKopio.tentit[action.payload.tenttiIndex].kysymykset = tenttiKopio.tentit[action.payload.tenttiIndex].kysymykset.filter(kysymys => kysymys.kysymys !== action.payload.kysymys)
            return tenttiKopio
        //Poistetaan vastaus filtteröimällä se pois
        case 'POISTA_VASTAUS':
            tenttiKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset = tenttiKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus => vastaus.vastaus !== action.payload.vastaus)
            return tenttiKopio

        case 'OTA_TENTTI_KAYTTOON':
            tenttiKopio.tentit[action.payload].kaytossa = !tenttiKopio.tentit[action.payload].kaytossa
            return tenttiKopio

        case 'LISAA_TENTTI':
            let idList = tenttiKopio.tentit.map(tentti => Number(tentti.id))
            tenttiKopio.tentit.push({ nimi: '', id: idList.length === 0 ? 1 : Math.max(...idList) + 1, kysymykset: [], kaytossa: false })
            return tenttiKopio

        case 'POISTA_TENTTI':
            action.payload.setToValue(tenttiKopio.tentit[0].id)
            tenttiKopio.tentit = tenttiKopio.tentit.filter(tentti => tentti.id !== action.payload.tenttiId)
            localStorage.setItem('tenttiId', tenttiKopio.tentit[0].id)
            return tenttiKopio

        case 'LISAA_KYSYMYS':
            let idList2 = []
            for (let i = 0; i < tenttiKopio.tentit.length; i++) {
                tenttiKopio.tentit[i].kysymykset.map(kysymys => idList2.push(kysymys.id))
            }
            tenttiKopio.tentit[action.payload].kysymykset.push({ kysymys: "", id: Math.max(...idList2) + 1, vastaukset: [] })
            return tenttiKopio

        case 'LISAA_VASTAUS':
            let idList3 = []
            for (let i = 0; i < tenttiKopio.tentit.length; i++) {
                for (let j = 0; j < tenttiKopio.tentit[i].kysymykset.length; j++) {
                    tenttiKopio.tentit[i].kysymykset[j].vastaukset.map(vastaus => idList3.push(vastaus.id))
                }
            }
            tenttiKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset.push({ id: Math.max(...idList3) + 1, vastaus: "", oikein: false, valinta: false })
            return tenttiKopio

        case 'KYSYMYS_OIKEIN':
            let oikein = !state.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].oikein
            tenttiKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].oikein = oikein
            tenttiKopio.tentit[action.payload.tenttiIndex].kaytossa = false
            return tenttiKopio

        case 'ASETA_VALINTA':
            const idList4 = tenttiKopio.kayttajaVastaukset.map(vastaus => vastaus.id)
            if (!action.payload.valinta) {
                tenttiKopio.kayttajaVastaukset.push({ id: tenttiKopio.kayttajaVastaukset.length === 0 ? 1 : Math.max(...idList4) + 1, user_id: action.payload.kayttajaId, answer_id: action.payload.vastausId, question_id: action.payload.kysymysId, exam_id: action.payload.tenttiId })
            } else {
                tenttiKopio.kayttajaVastaukset = tenttiKopio.kayttajaVastaukset.filter(({ user_id, answer_id }) => !(Number(user_id) === Number(action.payload.kayttajaId) && Number(answer_id) === Number(action.payload.vastausId)))
            }
            return tenttiKopio

        case 'LISAA_KAYTTAJA':
            let tentit12 = { ...state, rekisteröidytään: false }
            tentit12.kayttajat?.push({ kayttajatunnus: action.payload.kayttajatunnus, salasana: action.payload.salasana, admin: action.payload.admin })
            return tentit12

        case 'POISTA_KAYTTAJA':
            tenttiKopio.kayttajat = tenttiKopio.kayttajat.filter(kayttaja => kayttaja.id !== action.payload.id)
            action.payload.setOppilaat(tenttiKopio.kayttajat.filter(kayttaja => Number(kayttaja.admin) !== 1))
            console.log(tenttiKopio)
            return tenttiKopio

        case 'KIRJAUDU':
            let kayttaja = action.payload.kayttaja
            if (kayttaja.length === 0) {
                alert('Nimessä tai salasanassa on virhe')
                return { ...state, }
            }
            kayttaja.kirjauduttu = true
            console.log(state)
            let tentit13 = { ...state, kayttaja: kayttaja, kirjauduttu: true, }
            console.log('sitten kirjaudu')
            localStorage.setItem('tenttiId', tentit13.tentit[0].id)
            action.payload.setValue([tentit13.tentit[0]])
            return tentit13

        case 'REKISTEROIDYTAAN':
            return { ...state, rekisteröidytään: !state.rekisteröidytään }

        case 'POISTU':
            let tentit15 = { ...state, kirjauduttu: false, naytaOppilaat: false }
            let kayttajaData1 = action.payload
            kayttajaData1.kirjauduttu = false
            localStorage.clear()
            return tentit15

        case 'NAYTAOPPILAAT':
            return { ...state, naytaOppilaat: true }

        case 'NAYTATENTIT':
            return { ...state, naytaOppilaat: false }

        case 'LISAA_KUVA':
            tenttiKopio.kuvat.push(action.payload)
            return tenttiKopio

        case 'POISTA_KUVA':
            tenttiKopio.kuvat = tenttiKopio.kuvat.filter(kuva => Object.keys(kuva)[0] !== action.payload)
            return tenttiKopio

        case 'ALUSTA_DATA':
            const tenttiId = JSON.parse(localStorage.getItem('tenttiId'))
            if (tenttiId !== null) {
                let tentti = action.payload.data.tentit?.find(tentti => Number(tentti.id) === tenttiId)
                action.payload.setValue([tentti])
            } else {
                action.payload.setValue([action.payload.data.tentit[0].id])
            }
            let kayttajaData = JSON.parse(localStorage.getItem('kayttaja'))

            return { ...action.payload.data, tietoAlustettu: true, naytaOppilaat: false, kayttaja: kayttajaData, kirjauduttu: kayttajaData?.kirjauduttu }

        case 'PAIVITA_TALLENNUSTILA':
            return tenttiKopio

        case 'PAIVITA_KAYTTAJA':
            return { ...state, kayttaja: action.payload, }

        case 'PAIVITA_VASTAUKSET':
            return { ...state, naytaVastaukset: action.payload, }

        default:
            throw new Error("Learn to code noob")
    }
}