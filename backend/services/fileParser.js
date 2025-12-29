const mammoth = require('mammoth');
const pdf = require('pdf-parse');

/**
 * Parse different file formats to text
 * Supports: .txt, .vtt, .docx, .doc, .pdf
 */
const parseFile = async (buffer, filename) => {
  const extension = filename.split('.').pop().toLowerCase();

  try {
    switch (extension) {
      case 'txt':
        return parseTxt(buffer);
      
      case 'vtt':
        return parseVtt(buffer);
      
      case 'docx':
      case 'doc':
        return parseDocx(buffer);
      
      case 'pdf':
        return parsePdf(buffer);
      
      default:
        throw new Error(`Unsupported file format: .${extension}`);
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error(`Failed to parse ${extension} file: ${error.message}`);
  }
};

/**
 * Parse plain text files
 */
const parseTxt = (buffer) => {
  return buffer.toString('utf-8');
};

/**
 * Parse VTT (Video Text Track) files from Zoom
 * Example format:
 * WEBVTT
 * 
 * 00:00:00.000 --> 00:00:05.000
 * Speaker: This is the transcript text
 */
const parseVtt = (buffer) => {
  const text = buffer.toString('utf-8');
  
  // Remove WEBVTT header
  let cleaned = text.replace(/^WEBVTT\s*/i, '');
  
  // Remove timestamp lines (00:00:00.000 --> 00:00:05.000)
  cleaned = cleaned.replace(/\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}/g, '');
  
  // Remove empty lines and extra whitespace
  cleaned = cleaned
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
  
  return cleaned;
};

/**
 * Parse DOCX/DOC files from Google Meet, Teams
 */
const parseDocx = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  
  if (!result.value || result.value.trim().length === 0) {
    throw new Error('No text content found in document');
  }
  
  return result.value.trim();
};

/**
 * Parse PDF files
 */
const parsePdf = async (buffer) => {
  const data = await pdf(buffer);
  
  if (!data.text || data.text.trim().length === 0) {
    throw new Error('No text content found in PDF');
  }
  
  return data.text.trim();
};

module.exports = { parseFile };