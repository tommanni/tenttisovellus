import React from "react";
function Image({ image, key }) {
  return (
    <div>
      <img className="img" alt="" src={image.src} key={key} />
    </div>
  );
}
export default Image;
