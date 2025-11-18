import React from 'react';

// This component is designed to be rendered off-screen and converted to a PDF.
// It uses absolute positioning to place data precisely over the background image.
const Certificate = React.forwardRef(({ permitData }, ref) => {
  
  // The container dimensions should ideally match the aspect ratio of the background image.
  // The image is 833x1178 pixels. We use these dimensions to ensure 1:1 mapping.
  const containerStyle = {
    width: '833px',
    height: '1178px',
    position: 'relative',
    backgroundImage: `url('/certificate-template.jpg')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    fontFamily: '"Times New Roman", Times, serif',
    color: 'black',
  };

  // Base style for all text elements to be placed on the certificate.
  const textStyle = {
    position: 'absolute',
    fontSize: '15px', // A base font size that seems to match the document.
    whiteSpace: 'nowrap', // Prevents text from wrapping to the next line.
  };

  return (
    <div ref={ref} style={containerStyle}>
      {/* --- Dynamic Data Placement --- */}
      {/* Each 'span' is an absolutely positioned element. */}
      {/* 'top' and 'left' values are pixels, measured from the top-left corner of the container. */}
      
      {/* Permit No */}
      <span style={{ ...textStyle, top: '215px', left: '595px' }}>
        {permitData.permitNo || 'N/A'}
      </span>

      {/* 1. Name of the permit holder */}
      <span style={{ ...textStyle, top: '246px', left: '380px' }}>
        : {permitData.holderName || 'N/A'}
      </span>

      {/* 2. Address of the permit holder */}
      <span style={{ ...textStyle, top: '267px', left: '380px' }}>
        : {permitData.holderAddress || 'N/A'}
      </span>

      {/* 3. N.I.C. No. of the permit holder */}
      <span style={{ ...textStyle, top: '288px', left: '380px' }}>
        : {permitData.nic || 'N/A'}
      </span>

      {/* 4. Address of the Location */}
      <span style={{ ...textStyle, top: '330px', left: '380px' }}>
        : {permitData.locationAddress || 'N/A'}
      </span>

      {/* 5. Storage Capacity */}
      <span style={{ ...textStyle, top: '372px', left: '380px' }}>
        : {permitData.storageCapacity || 'N/A'}
      </span>

      {/* 6. Permit fee (Rs.) */}
      <span style={{ ...textStyle, top: '393px', left: '380px' }}>
        : Rs. {permitData.fee || 'N/A'}
      </span>

      {/* 7. a) Starting Date */}
      <span style={{ ...textStyle, top: '435px', left: '380px' }}>
        : {permitData.validityStart ? new Date(permitData.validityStart).toLocaleDateString('en-GB') : 'N/A'}
      </span>

      {/* 7. b) Ending Date */}
      <span style={{ ...textStyle, top: '456px', left: '380px' }}>
        : {permitData.validityEnd ? new Date(permitData.validityEnd).toLocaleDateString('en-GB') : 'N/A'}
      </span>

      {/* Paragraph text: application dated */}
      <span style={{ ...textStyle, top: '502px', left: '620px' }}>
        {permitData.applicationDate ? new Date(permitData.applicationDate).toLocaleDateString('en-GB') : 'N/A'}
      </span>
      
      {/* Paragraph text: receipt No. */}
      <span style={{ ...textStyle, top: '523px', left: '340px' }}>
        {permitData.receiptNo || 'N/A'}
      </span>
      
      {/* Paragraph text: receipt dated */}
      <span style={{ ...textStyle, top: '523px', left: '465px' }}>
        {permitData.receiptDate ? new Date(permitData.receiptDate).toLocaleDateString('en-GB') : 'N/A'}
      </span>

      {/* Date at bottom left */}
      <span style={{ ...textStyle, top: '645px', left: '160px' }}>
        {new Date().toLocaleDateString('en-GB')}
      </span>
    </div>
  );
});

Certificate.displayName = 'Certificate';

export default Certificate;
