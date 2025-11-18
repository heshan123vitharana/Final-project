import { useEffect } from 'react';
import ImageGalleryManager from './ImageGalleryManager';

const ImageGalleryManagerOld = (props) => {
  useEffect(() => {
    const mode = import.meta.env?.MODE ?? 'development';

    if (mode !== 'production') {
      console.warn('[ImageGalleryManagerOld] This component is deprecated. Please migrate to ImageGalleryManager.');
    }
  }, []);

  return <ImageGalleryManager {...props} />;
};

export default ImageGalleryManagerOld;
