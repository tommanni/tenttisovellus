import React from "react";
function Image({ image }) {
  return (
    <div>
      <img className="img" alt="" src={image.src} />
    </div>
  );
}
export default Image;
