import { useState, useEffect, useRef } from "react";

export default function PageUploader({
  containerRef,
  fileInputRef,
  handleSelected,
  imageInfos,
  setImageInfos,
  handleRemove,
  draggedIndex,
  setDraggedIndex,
  handleDrag,
  dragStart,
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [imageOverlayIndex, setImageOverlayIndex] = useState(null);
  const [imageOverlaySize, setImageOverlaySize] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const imageOverlayRef = useRef(null);

  const handleImageClick = (index) => {
    setImageOverlayIndex(index);
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setImageOverlayIndex(null);
    setShowOverlay(false);
  };

  useEffect(() => {
    // Calculate the size of the displayed image when it changes
    if (imageOverlayIndex !== null) {
      const rect = imageOverlayRef.current.getBoundingClientRect();
      setImageOverlaySize({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [imageOverlayIndex]);

  let isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  return (
    <>
      <div
        className="image-container justify-left flex-wrap mb-4"
        ref={containerRef}
      >
        {imageInfos.map((imageInfo, index) => (
          <div
            key={imageInfo.name}
            className={`pages-upload-card flex-grow-0 ${
              draggedIndex === index ? "dragging" : ""
            }`}
            onClick={() => {
              handleImageClick(index);
            }}
            onDragStart={() => {
              setDraggedIndex(index);
            }}
            onDragOver={(e) => handleDrag(e, index)}
            onDragEnd={() => setDraggedIndex(null)}
            onPointerDown={(e) => {
              if (isMobile) dragStart(e, index, imageInfo);
            }}
            draggable="true"
          >
            <div
              className="page"
              style={{
                backgroundImage: `url(${imageInfo.url})`,
              }}
            >
              <div
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </div>
              <div className="drag-button">
                <i className="fa-solid fa-arrows-up-down-left-right"></i>
              </div>
              <div className="image-label">{imageInfo.name}</div>
            </div>
          </div>
        ))}
        <div
          className="input-pages"
          onClick={() => fileInputRef.current.click()}
        >
          <i className="fa-solid fa-plus" />
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleSelected}
        style={{ display: "none" }}
        multiple
      />
      {imageInfos.length > 0 ? (
        <div>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => setImageInfos([])}
          >
            Remove all pages
          </button>
        </div>
      ) : (
        <></>
      )}
      {showOverlay && (
        <div
          className="overlay-container"
          onClick={(e) => {
            e.stopPropagation();
            handleCloseOverlay();
          }}
        >
          <div className="image-overlay">
            <img
              className="centered-image"
              src={imageInfos[imageOverlayIndex].url}
              alt={imageInfos[imageOverlayIndex].name}
              ref={imageOverlayRef}
            />
          </div>
          <div
            className="arrow-overlay"
            style={{
              top: imageOverlaySize.top + "px",
              left: imageOverlaySize.left + "px",
              width: imageOverlaySize.width + "px",
              height: imageOverlaySize.height + "px",
            }}
          >
            {imageOverlayIndex > 0 ? (
              <div
                className="arrow left"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageOverlayIndex(imageOverlayIndex - 1);
                }}
              >
                <i className="fa-solid fa-angle-left p-3" />
              </div>
            ) : (
              <></>
            )}
            {imageOverlayIndex < imageInfos.length - 1 ? (
              <div
                className="arrow right"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageOverlayIndex(imageOverlayIndex + 1);
                }}
              >
                <i className="fa-solid fa-angle-right p-3" />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="close-overlay" onClick={handleCloseOverlay}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
      )}
    </>
  );
}
