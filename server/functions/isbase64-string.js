const isBase64Image = (str)=>{
  if (typeof str !== 'string' || str.trim() === '') return false;
  const regex = /^data:image\/(png|jpeg|jpg|gif|webp|bmp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;
  if (regex.test(str)) return true;
  try {
    const decoded = atob(str);
    const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0));
    const header = bytes.slice(0, 4).join(',');
    const imageHeaders = {
      '137,80,78,71': 'image/png',       // PNG
      '255,216,255,224': 'image/jpeg',   // JPG
      '255,216,255,225': 'image/jpeg',   // JPG Canon
      '71,73,70,56': 'image/gif',        // GIF
      '82,73,70,70': 'image/webp',       // WEBP
    };
    return Object.keys(imageHeaders).includes(header);
  } catch {
    return false;
  }
}

module.exports = isBase64Image