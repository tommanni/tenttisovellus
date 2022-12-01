import Image from "./Image";
const ShowImage = ({ images, key }) => {
  const show = (image) => {
    return <Image image={image} key={key} />;
  };
  return <div className="container">{images.map(show)}</div>;
};
export default ShowImage;
