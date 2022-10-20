import Kysymys from './Kysymys'

const Tentti = ({ tentti, dispatch, tenttiId, vastaukset, kayttaja }) => {
    return (
        <div>
            {tentti.kysymykset.map((kysymys, index) => <Kysymys
                key={kysymys.id}
                kysymysNimi={kysymys.kysymys}
                kysymys={kysymys}
                dispatch={dispatch}
                tenttiId={tenttiId}
                vastaukset={vastaukset}
                kayttaja={kayttaja}
                kysymysIndex={index}
            />)}
        </div>

    );
}

export default Tentti