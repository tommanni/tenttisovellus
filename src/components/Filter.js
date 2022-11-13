const Filter = ({ value, onChange }) => {
    return (
        <div>
            Etsi <input
                type={'text'}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default Filter