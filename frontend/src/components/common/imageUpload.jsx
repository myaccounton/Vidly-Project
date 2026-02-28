import React, { useRef, useState, useEffect } from 'react';

const ImageUpload = ({
  name,
  label,
  value, // URL string for existing image
  onChange,
  error,
  accept = "image/*",
  preview = true
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(value || null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (value && typeof value === 'string') {
      setPreviewUrl(value);
    }
  }, [value]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Call onChange with file object
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: file,
          type: 'file'
        }
      };
      onChange(syntheticEvent);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: null,
          type: 'file'
        }
      };
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="form-group mb-3">
      <label htmlFor={name} className="form-label">{label}</label>
      
      {preview && previewUrl && (
        <div className="mb-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="img-thumbnail"
            style={{
              maxWidth: '300px',
              maxHeight: '400px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          {selectedFile && (
            <button
              type="button"
              className="btn btn-sm btn-danger mt-2"
              onClick={handleRemove}
            >
              Remove Image
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        id={name}
        accept={accept}
        onChange={handleFileChange}
        className={`form-control ${error ? 'is-invalid' : ''}`}
      />
      
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      
      <small className="form-text text-muted">
        Supported formats: JPG, PNG, JPEG (Max size: 5MB)
      </small>
    </div>
  );
};

export default ImageUpload;
