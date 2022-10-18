import Kysymys from './Kysymys'

const Tentti = ({ tentti, dispatch, tenttiId, vastaukset }) => {
    return (
        <div>
            {tentti.kysymykset.map(kysymys => <Kysymys
                key={kysymys.id}
                kysymysNimi={kysymys.kysymys}
                kysymys={kysymys} dispatch={dispatch}
                tenttiId={tenttiId}
                vastaukset={vastaukset}
            />)}
        </div>

    );
}

export default Tentti