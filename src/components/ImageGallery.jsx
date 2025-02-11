import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const ImageGallery = ({ images = ['https://www.interparts.store/_sysimg/no-photo.png'] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e) => {
    if (isFullscreen) {
      switch(e.key) {
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'Escape':
          toggleFullscreen();
          break;
      }
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen, currentIndex]);

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative group overflow-hidden rounded-lg">
        <div className="relative h-64 w-64">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index + 1}`}
              className={`absolute inset-0 w-full h-64 object-cover rounded-lg cursor-pointer transition-transform duration-500 ${
                index === currentIndex
                  ? 'translate-x-0'
                  : index < currentIndex
                  ? '-translate-x-full'
                  : 'translate-x-full'
              }`}
              onClick={toggleFullscreen}
            />
          ))}
        </div>

        {currentIndex > 0 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            onClick={prevImage}
          >
            <FiChevronLeft className="text-white w-6 h-6" />
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            onClick={nextImage}
          >
            <FiChevronRight className="text-white w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex gap-2 mt-2 overflow-x-auto p-1 max-w-xl mx-auto">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`flex-shrink-0 w-20 h-20 object-cover rounded cursor-pointer transition-opacity ${
              index === currentIndex ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-70'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {isFullscreen && (
        <>
          <div 
            className="fixed inset-0 backdrop-blur-lg bg-black/30 z-40"
            onClick={toggleFullscreen}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full z-50"
              onClick={toggleFullscreen}
            >
              <FiX className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={images[currentIndex]}
                alt={`Fullscreen ${currentIndex + 1}`}
                className="h-96 max-w-full object-contain rounded-lg shadow-2xl"
              />

              {currentIndex > 0 && (
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full"
                  onClick={prevImage}
                >
                  <FiChevronLeft className="text-white w-8 h-8" />
                </button>
              )}

              {currentIndex < images.length - 1 && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full"
                  onClick={nextImage}
                >
                  <FiChevronRight className="text-white w-8 h-8" />
                </button>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGallery;