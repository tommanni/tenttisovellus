const tenttiData = {
    tentit: [
        {
            nimi: "JAVASCRIPTIN PERUSTEET",
            id: 1,
            kysymykset: [
                {
                    kysymys: "Mitä muuttujan näkyvyysalue tarkoittaa?",
                    id: 1,
                    vastaukset: [
                        { id: 1, vastaus: "Sitä, kuinka kaukaa muuttuja näkyy ilman kaukoputkea tai kiikareita", oikein: false },
                        { id: 2, vastaus: "Sitä, missä kohtaa ohjelmaa muuttujaa voi käyttää", oikein: true },
                        { id: 3, vastaus: "Sitä, miten helppo muuttujien käyttöä on synkronoida säikeiden kesken", oikein: false }
                    ]
                },
                {
                    kysymys: "Luokkien hyvä puoli on, että",
                    id: 2,
                    vastaukset: [
                        { id: 1, vastaus: "Niiden avulla koodia on helpompi moduloida", oikein: true },
                        { id: 2, vastaus: "Niiden avulla on helppo uudelleenkäyttää ohjelmakoodia", oikein: true },
                        { id: 3, vastaus: "Niiden avulla on helppo kirjoittaa monisäikeisiä sovelluksia", oikein: false }
                    ]
                },
                {
                    kysymys: "Nuolifunktiot ovat käteviä koska",
                    id: 3,
                    vastaukset: [
                        { id: 1, vastaus: "Ne helpottavat korkeamman asteen funktioiden hyödyntämistä", oikein: true },
                        { id: 2, vastaus: "Ne tukevat funktionaalista ohjelmointityyliä", oikein: true },
                        { id: 3, vastaus: "Niiden avulla on helppoa luoda paikallisia nimettömiä funktioita", oikein: true }
                    ]
                }
            ]

        },
        {
            nimi: "FRISBEEGOLFIN PERUSTEET",
            id: 2,
            kysymykset: [
                {
                    kysymys: "Mikä kiekko kannattaa valita 10 metrin etäisyydeltä korista?",
                    id: 1,
                    vastaukset: [
                        { id: 1, vastaus: "Putteri", oikein: true },
                        { id: 2, vastaus: "Midrange", oikein: false },
                        { id: 3, vastaus: "Driveri", oikein: false }
                    ]
                },
                {
                    kysymys: "Mitkä ovat firsbeenheittotyylejä?",
                    id: 2,
                    vastaukset: [
                        { id: 1, vastaus: "Forehand", oikein: true },
                        { id: 2, vastaus: "Backhand", oikein: true },
                        { id: 3, vastaus: "Uppercut", oikein: false }
                    ]
                },
                {
                    kysymys: "Mikä on frisbeeheiton pituusennätys?",
                    id: 3,
                    vastaukset: [
                        { id: 1, vastaus: "338 metriä", oikein: true },
                        { id: 2, vastaus: "167 kilometriä", oikein: false },
                        { id: 3, vastaus: "18 senttimetriä", oikein: false }
                    ]
                },
                {
                    kysymys: "Paljon painaa täysipainoinen driver",
                    id: 4,
                    vastaukset: [
                        { id: 1, vastaus: "4 kiloa", oikein: false },
                        { id: 2, vastaus: "175 grammaa", oikein: true },
                        { id: 3, vastaus: "100 grammaa", oikein: false }
                    ]
                }
            ]
        }
    ],
    tallennetaanko: false,
    tietoAlustettu: false,
    kayttaja: -1
}

export default tenttiData