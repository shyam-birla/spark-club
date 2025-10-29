// src/hooks/useImageUpload.js
import { useState, useCallback, useEffect } from 'react';

const useImageUpload = (imageConfig, dispatch) => {
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    const initialPreviews = {};
    for (const key in imageConfig) {
      const { initialValue, multiple } = imageConfig[key];
      if (initialValue) {
        if (multiple && Array.isArray(initialValue)) {
          initialPreviews[key] = initialValue.map(item => typeof item === 'string' ? item : URL.createObjectURL(item));
        } else if (!multiple && (typeof initialValue === 'string' || initialValue instanceof File)) {
          initialPreviews[key] = typeof initialValue === 'string' ? initialValue : URL.createObjectURL(initialValue);
        }
      }
    }
    setPreviews(initialPreviews);
  }, []);

  const handleImageChange = useCallback((e, imageKey) => {
    const { updateAction, multiple } = imageConfig[imageKey];
    if (multiple) {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        dispatch({ type: updateAction, payload: files });
        setPreviews(prev => ({ ...prev, [imageKey]: [...(prev[imageKey] || []), ...files.map(file => URL.createObjectURL(file))] }));
      }
    } else {
      const file = e.target.files[0];
      if (file) {
        dispatch({ type: updateAction, field: imageKey, value: file });
        setPreviews(prev => ({ ...prev, [imageKey]: URL.createObjectURL(file) }));
      }
    }
  }, [dispatch, imageConfig]);

  const clearImage = useCallback((imageKey, index = null) => {
    const { updateAction, multiple } = imageConfig[imageKey];
    if (multiple) {
      dispatch({ type: 'REMOVE_GALLERY_IMAGE', index });
      setPreviews(prev => ({ ...prev, [imageKey]: prev[imageKey].filter((_, i) => i !== index) }));
    } else {
      dispatch({ type: updateAction, field: imageKey, value: null });
      setPreviews(prev => ({ ...prev, [imageKey]: null }));
    }
  }, [dispatch, imageConfig]);

  return {
    previews,
    handleImageChange,
    clearImage,
  };
};

export default useImageUpload;
