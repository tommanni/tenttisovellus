import Kysymys from './Kysymys'

const Tentti = ({ tentti, tenttiId }) => {
    return (
        <div>
            {tentti.kysymykset.map((kysymys, index) => <Kysymys
                key={kysymys.id}
                kysymysNimi={kysymys.kysymys}
                kysymys={kysymys}
                tenttiId={tenttiId}
                kysymysIndex={index}
            />)}
        </div>
    );
}

export default Tentti