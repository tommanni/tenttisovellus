import Checkbox from '@mui/material/Checkbox'

const Kysymys = ({ kysymys, kysymysNimi, dispatch, tenttiId, vastaukset }) => {
    return (
        <div className='kysymys'>
            <p><b>{kysymysNimi}</b><input type="text" onChange={(event) => {
                dispatch({
                    type: "KYSYMYKSEN_NIMI_MUUTTUI",
                    payload: {
                        nimi: event.target.value,
                        tenttiIndex: tenttiId - 1,
                        kysymysIndex: kysymys.id - 1
                    }
                })
            }} />
            </p>
            {kysymys.vastaukset.map(vastaus => <div
                key={kysymys.vastaukset.indexOf(vastaus)}
                className='vastaus'><Checkbox />
                {vastaukset === 1 & vastaus.oikein === true ? <Checkbox defaultChecked color='success' />
                    : vastaukset === 1 & vastaus.oikein === false ? <Checkbox color='success' />
                        : ""}{vastaus.vastaus}</div>)}
        </div>

    )
}

export default Kysymys