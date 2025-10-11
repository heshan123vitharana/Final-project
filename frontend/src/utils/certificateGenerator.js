import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';

// Re-add the logo and the new template image
const LOGO_FILENAME = 'paddy-marketing-board-logo.png';
const BACKGROUND_TEMPLATE_FILENAME = 'new-certificate-template.jpg';
const SEAL_FILENAME = 'certificate-seal.png';

// Helper to resolve full URLs to assets in the public folder
const resolveAssetUrl = (filename) => {
  const base = (typeof import.meta !== 'undefined' && import.meta.env.BASE_URL) || '/';
  return `${base.endsWith('/') ? base : `${base}/`}${filename}`;
};

// Helper to format dates consistently
const formatDate = (value) => {
  if (!value) return 'N/A';
  try {
    return new Date(value).toLocaleDateString('en-GB');
  } catch {
    return 'N/A';
  }
};

// Helper to safely handle and normalize text values
const normalizeText = (value, fallback = 'N/A') => {
  const text = String(value || '').trim();
  return text || fallback;
};

// Helper to draw justified paragraphs
const drawJustifiedParagraph = ({
  page,
  text,
  x,
  topY,
  maxWidth,
  lineHeight,
  font,
  size,
  color,
}) => {
  const words = text.trim().split(/\s+/);
  if (!words.length) {
    return topY;
  }

  const lines = [];
  let currentLine = [];
  let currentWidth = 0;
  const spaceWidth = font.widthOfTextAtSize(' ', size);

  words.forEach((word) => {
    const wordWidth = font.widthOfTextAtSize(word, size);
    if (currentLine.length === 0) {
      currentLine.push(word);
      currentWidth = wordWidth;
      return;
    }

    const nextWidth = currentWidth + spaceWidth + wordWidth;
    if (nextWidth <= maxWidth) {
      currentLine.push(word);
      currentWidth = nextWidth;
    } else {
      lines.push({ words: currentLine.slice(), width: currentWidth });
      currentLine = [word];
      currentWidth = wordWidth;
    }
  });

  if (currentLine.length) {
    lines.push({ words: currentLine, width: currentWidth });
  }

  let baselineY = topY;

  lines.forEach(({ words: lineWords, width }, lineIndex) => {
    const isLastLine = lineIndex === lines.length - 1 || lineWords.length === 1;
    const gaps = lineWords.length - 1;
    const extraSpace = isLastLine || gaps <= 0 ? 0 : (maxWidth - width) / gaps;
    const effectiveSpaceWidth = isLastLine || gaps <= 0 ? spaceWidth : spaceWidth + extraSpace;

    let cursorX = x;
    lineWords.forEach((word, wordIndex) => {
      page.drawText(word, {
        x: cursorX,
        y: baselineY,
        font,
        size,
        color,
      });

      cursorX += font.widthOfTextAtSize(word, size);
      if (wordIndex < lineWords.length - 1) {
        cursorX += effectiveSpaceWidth;
      }
    });

    baselineY -= lineHeight;
  });

  return baselineY + lineHeight; // return baseline of last drawn line
};

const drawFallbackSeal = ({ page, centerX, centerY, outerRadius }) => {
  const outerColor = rgb(0.8, 0.1, 0.1);
  const middleColor = rgb(0.9, 0.2, 0.2);
  const innerColor = rgb(0.8, 0, 0);
  const ringColor = rgb(0.95, 0.8, 0.4);

  page.drawCircle({
    x: centerX,
    y: centerY,
    size: outerRadius,
    color: outerColor,
  });

  page.drawCircle({
    x: centerX,
    y: centerY,
    size: outerRadius * 0.92,
    color: middleColor,
  });

  page.drawCircle({
    x: centerX,
    y: centerY,
    size: outerRadius * 0.82,
    color: ringColor,
  });

  page.drawCircle({
    x: centerX,
    y: centerY,
    size: outerRadius * 0.72,
    color: innerColor,
  });
};

/**
 * Generates the certificate by overlaying dynamic text on the final template image.
 * This approach ensures perfect alignment as all static elements are part of the image.
 * @param {object} permitData - The data for the certificate.
 * @returns {Promise<Uint8Array|null>} The generated PDF bytes or null on error.
 */
export async function generatePermitCertificate(permitData) {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const textColor = rgb(0, 0, 0);

    const loadAssetBytes = async (filename) => {
      const url = resolveAssetUrl(filename);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
        }
        return await response.arrayBuffer();
      } catch (assetError) {
        console.warn(`Unable to load asset ${filename}. Proceeding without it.`, assetError);
        return null;
      }
    };

    const drawCenteredText = ({
      text,
      centerX,
      y,
      size,
      font: fontToUse,
    }) => {
      const fontRef = fontToUse || timesRomanFont;
      const fontSize = size || 12;
      const textWidth = fontRef.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: centerX - textWidth / 2,
        y,
        font: fontRef,
        size: fontSize,
        color: textColor,
      });
    };

    const drawLeftAlignedText = ({ text, x, y, size, font: fontToUse }) => {
      page.drawText(text, {
        x,
        y,
        font: fontToUse || timesRomanFont,
        size: size || 12,
        color: textColor,
      });
    };

    // --- 1. ADD TRANSPARENT BACKGROUND IMAGE ---
    const backgroundBytes = await loadAssetBytes(BACKGROUND_TEMPLATE_FILENAME);
    if (backgroundBytes) {
      const backgroundImage = await pdfDoc.embedJpg(backgroundBytes);
      page.drawImage(backgroundImage, {
        x: 0,
        y: 0,
        width,
        height,
        opacity: 0.35, // Set opacity to 35%
      });
    }

    // --- 2. DRAW DECORATIVE BORDERS ---
    const borderColor = rgb(0.1, 0.5, 0.1); // A dark green color
    const borderWidth = 5;
    const margin = 20;
    page.drawRectangle({
      x: margin,
      y: margin,
      width: width - margin * 2,
      height: height - margin * 2,
      borderColor,
      borderWidth,
    });
    page.drawRectangle({
      x: margin + 5,
      y: margin + 5,
      width: width - (margin + 5) * 2,
      height: height - (margin + 5) * 2,
      borderColor,
      borderWidth: 1,
    });

    // --- 3. ADD HEADER WITH LOGO ---
    const centerX = width / 2;
    let logoY = height - margin - 30;
    const logoBytes = await loadAssetBytes(LOGO_FILENAME);
    if (logoBytes) {
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.16);

      const logoX = centerX - logoDims.width / 2;
      logoY = height - margin - logoDims.height - 30;
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoDims.width,
        height: logoDims.height,
      });
    }

    const headerPrimaryY = logoY - 45;
    const headerSecondaryY = headerPrimaryY - 24;

    drawCenteredText({
      text: 'PADDY MARKETING BOARD',
      centerX,
      y: headerPrimaryY,
      size: 22,
      font: timesRomanBoldFont,
    });
    drawCenteredText({
      text: 'Ministry of Agriculture',
      centerX,
      y: headerSecondaryY,
      size: 16,
      font: timesRomanFont,
    });

    // --- 4. ADD MAIN TITLE (Centered on the full page) ---
    const certificateTitleY = headerSecondaryY - 48;
    const permitTitleY = certificateTitleY - 24;

    drawCenteredText({
      text: 'CERTIFICATE OF REGISTRATION FOR PADDY PURCHASING',
      centerX,
      y: certificateTitleY,
      size: 16,
      font: timesRomanBoldFont,
    });
    drawCenteredText({
      text: `Permit No: ${normalizeText(permitData.permitNo)}`,
      centerX,
      y: permitTitleY,
      size: 11,
      font: timesRomanFont,
    });

    // --- 5. ADD PERMIT DETAILS ---
    const startX = 80;
    let currentY = permitTitleY - 38;
    const lineSpacing = 26;
    const fieldTitleSize = 12;
    const fieldValueSize = 12;

    const addField = (title, value) => {
      drawLeftAlignedText({
        text: title,
        x: startX,
        y: currentY,
        size: fieldTitleSize,
        font: timesRomanBoldFont,
      });
      drawLeftAlignedText({
        text: `: ${normalizeText(value)}`,
        x: startX + 200,
        y: currentY,
        size: fieldValueSize,
        font: timesRomanFont,
      });
      currentY -= lineSpacing;
    };

    addField('1. Name of Permit Holder', permitData.holderName);
    addField('2. Address of Permit Holder', permitData.holderAddress);
    addField('3. NIC of Permit Holder', permitData.nic);
    currentY -= lineSpacing; // Add extra space
    addField('4. Address of Purchasing Location', permitData.locationAddress);
    addField('5. Storage Capacity (MT)', permitData.storageCapacity);
    addField('6. Registration Fee (Rs.)', permitData.fee);
    currentY -= lineSpacing; // Add extra space
    addField('7. Validity Period (Start)', formatDate(permitData.validityStart));
    addField('8. Validity Period (End)', formatDate(permitData.validityEnd));

    // --- 6. ADD DECLARATION AND FOOTER ---
    const paragraphY = currentY - 40;
    const paragraphText = `This is to certify that the above-named individual/entity is registered under the Paddy Marketing Board Act. This permit is granted based on the application dated ${formatDate(permitData.applicationDate)} and the payment receipt No. ${normalizeText(permitData.receiptNo)} dated ${formatDate(permitData.receiptDate)}. The permit holder is authorized to purchase paddy in accordance with the regulations set forth by the board.`;

    const paragraphBaseline = drawJustifiedParagraph({
      page,
      text: paragraphText,
      x: startX,
      topY: paragraphY,
      maxWidth: width - startX * 2,
      lineHeight: 15,
      font: timesRomanFont,
      size: 11,
      color: textColor,
    });

    const sealTargetWidth = 130;
    const sealBottomPadding = 25;
    const sealX = centerX - sealTargetWidth / 2;
    const sealY = margin + sealBottomPadding;
    let effectiveSealHeight = sealTargetWidth;

    let sealImage = null;
    const sealBytes = await loadAssetBytes(SEAL_FILENAME);
    if (sealBytes) {
      try {
        sealImage = await pdfDoc.embedPng(sealBytes);
      } catch (sealEmbedError) {
        console.warn('Unable to embed seal image. Falling back to vector seal.', sealEmbedError);
        sealImage = null;
      }
    }

    if (sealImage) {
      const sealScale = sealTargetWidth / sealImage.width;
      const sealTargetHeight = sealImage.height * sealScale;
      effectiveSealHeight = sealTargetHeight;
      page.drawImage(sealImage, {
        x: sealX,
        y: sealY,
        width: sealTargetWidth,
        height: sealTargetHeight,
      });
    } else {
      const centerXSeal = sealX + sealTargetWidth / 2;
      const centerYSeal = sealY + sealTargetWidth / 2;
      drawFallbackSeal({
        page,
        centerX: centerXSeal,
        centerY: centerYSeal,
        outerRadius: sealTargetWidth / 2,
      });
    }

    const footerY = Math.max(margin + 40, sealY + effectiveSealHeight + 20, paragraphBaseline - 60);
    const signatureLineWidth = 220;
    const signatureX = width - margin - signatureLineWidth;

    drawLeftAlignedText({
      text: `Date Issued: ${formatDate(permitData.issuedDate || new Date())}`,
      x: startX,
      y: footerY,
      size: 12,
      font: timesRomanFont,
    });
    drawLeftAlignedText({
      text: '.................................................',
      x: signatureX,
      y: footerY,
      size: 12,
      font: timesRomanFont,
    });
    drawLeftAlignedText({
      text: 'Authorized Signature',
      x: signatureX,
      y: footerY - 15,
      size: 12,
      font: timesRomanBoldFont,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;

  } catch (error) {
    console.error('Error generating hybrid certificate:', error);
    alert('Failed to generate the certificate. Please ensure all assets (logo, background) are available.');
    return null;
  }
}
