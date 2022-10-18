const tenttiData = [
    {
        nimi: "JAVASCRIPTIN PERUSTEET",
        id: 1,
        kysymykset: [
            {
                kysymys: "Mitä muuttujan näkyvyysalue tarkoittaa?",
                id: 1,
                vastaukset: [
                    { vastaus: "Sitä, kuinka kaukaa muuttuja näkyy ilman kaukoputkea tai kiikareita", oikein: false },
                    { vastaus: "Sitä, missä kohtaa ohjelmaa muuttujaa voi käyttää", oikein: true },
                    { vastaus: "Sitä, miten helppo muuttujien käyttöä on synkronoida säikeiden kesken", oikein: false }
                ]
            },
            {
                kysymys: "Luokkien hyvä puoli on, että",
                id: 2,
                vastaukset: [
                    { vastaus: "Niiden avulla koodia on helpompi moduloida", oikein: true },
                    { vastaus: "Niiden avulla on helppo uudelleenkäyttää ohjelmakoodia", oikein: true },
                    { vastaus: "Niiden avulla on helppo kirjoittaa monisäikeisiä sovelluksia", oikein: false }
                ]
            },
            {
                kysymys: "Nuolifunktiot ovat käteviä koska",
                id: 3,
                vastaukset: [
                    { vastaus: "Ne helpottavat korkeamman asteen funktioiden hyödyntämistä", oikein: true },
                    { vastaus: "Ne tukevat funktionaalista ohjelmointityyliä", oikein: true },
                    { vastaus: "Niiden avulla on helppoa luoda paikallisia nimettömiä funktioita", oikein: true }
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
                    { vastaus: "Putteri", oikein: true },
                    { vastaus: "Midrange", oikein: false },
                    { vastaus: "Driveri", oikein: false }
                ]
            },
            {
                kysymys: "Mitkä ovat firsbeen heittotyylejä?",
                id: 2,
                vastaukset: [
                    { vastaus: "Forehand", oikein: true },
                    { vastaus: "Backhand", oikein: true },
                    { vastaus: "Uppercut", oikein: false }
                ]
            },
            {
                kysymys: "Mikä on frisbeeheiton pituusennätys?",
                id: 3,
                vastaukset: [
                    { vastaus: "338 metriä", oikein: true },
                    { vastaus: "167 kilometriä", oikein: false },
                    { vastaus: "18 senttimetriä", oikein: false }
                ]
            },
            {
                kysymys: "Paljon painaa täysipainoinen driver",
                id: 4,
                vastaukset: [
                    { vastaus: "4 kiloa", oikein: false },
                    { vastaus: "175 grammaa", oikein: true },
                    { vastaus: "100 grammaa", oikein: false }
                ]
            }
        ]
    }
]

export default tenttiData