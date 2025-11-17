const fs = require("fs");
const path = require("path");

const pdfUploader = async(pdfBase64)=>{ 
    try {
// Extract Base64 content (remove the prefix like "data:application/pdf;base64,")
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
    // Create folder if not exist
    const uploadDir = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    // Create unique filename
    const fileName = `pdf_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);
    // Write PDF file
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
    return{
      message: "PDF uploaded successfully!",
      filePath,
      fileName,
      success : true,
    }
  } catch (error) {
    console.error(error);
    return {
        success : false,
        message :error 
    }
  }
}

const deletePDF  = async(file) =>{
    try {
        const filePath = path.join(__dirname,"../uploads/"+file)
        if (!fs.existsSync(filePath)) throw new Error('No file found');
        fs.unlinkSync(filePath)
        return true
    } catch (err) {
        console.error('Error:', err);
        return false
    }
}



module.exports = {pdfUploader,deletePDF}