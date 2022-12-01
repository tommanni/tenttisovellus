import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isFocused) {
        return '#2196f3';
    }
    return '#eeeeee';
};
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 10px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: rgb(15, 15, 15);
  color: #fff;
  font-weight: bold;
  font-size: 1.4rem;
  outline: none;
  transition: border 0.24s ease-in-out;
`;
function DropBox({ onDrop }) {
    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        open,
        isDragAccept,
        isFocused,
        isDragReject,
    } = useDropzone({
        accept: 'image/*',
        onDrop,
        noClick: true,
        noKeyboard: true,
    });
    /* const lists = acceptedFiles.map((list) => (
        <li key={list.path}>
            {list.path} - {list.size} bytes
        </li>
    )); */
    return (
        <>
            {' '}
            <section className="dropbox">
                <Container
                    className="dropbox"
                    {...getRootProps({ isDragAccept, isFocused, isDragReject })}
                >
                    <form method="post" encType="multipart/form-data">
                        <input name='question_image' type="file" {...getInputProps()} />
                    </form >
                    <p>Vedä ja pudota kuvia tähän</p>
                    <button type="button" className="btn" onClick={open}>
                        Etsi
                    </button>
                </Container>
            </section>
        </>
    );
}
export default DropBox;