/* ============================================
   MacroMap — Nutrition Label OCR
   Uses OCR.space API for cloud-based OCR
   Falls back to Tesseract.js if API fails
   ============================================ */

const OCR_SPACE_API_KEY = 'K85448043388957';
const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';

export interface OCRResult {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  servingSize?: string;
  rawText: string;
}

/**
 * Convert a File to a base64 data URL for the OCR.space API.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Send image to OCR.space API and get text back.
 */
async function ocrSpaceRecognize(
  file: File,
  language: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  onProgress?.(10);

  const base64 = await fileToBase64(file);
  onProgress?.(30);

  const formData = new FormData();
  formData.append('base64Image', base64);
  formData.append('apikey', OCR_SPACE_API_KEY);
  formData.append('language', language);
  formData.append('isOverlayRequired', 'false');
  formData.append('scale', 'true');         // Upscale for better accuracy
  formData.append('OCREngine', '2');        // Engine 2 is better for labels
  formData.append('isTable', 'true');       // Better for tabular nutrition data

  onProgress?.(50);

  const response = await fetch(OCR_SPACE_URL, {
    method: 'POST',
    body: formData,
  });

  onProgress?.(80);

  if (!response.ok) {
    throw new Error(`OCR.space API error: ${response.status}`);
  }

  const result = await response.json();

  if (result.IsErroredOnProcessing) {
    throw new Error(result.ErrorMessage?.[0] || 'OCR processing failed');
  }

  onProgress?.(100);

  // Combine all parsed results
  const text = result.ParsedResults
    ?.map((r: { ParsedText: string }) => r.ParsedText)
    .join('\n') || '';

  return text;
}

/**
 * Fallback: use Tesseract.js for local OCR if API fails
 */
async function tesseractFallback(
  file: File,
  language: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Convert file to blob for Tesseract compatibility
  const blob = await new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No canvas context')); return; }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // Grayscale + contrast boost
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const contrast = 1.5;
        const adjusted = Math.min(255, Math.max(0, ((gray - 128) * contrast) + 128));
        d[i] = d[i + 1] = d[i + 2] = adjusted;
      }
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Blob creation failed')), 'image/png');
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });

  const Tesseract = await import('tesseract.js');
  const result = await Tesseract.recognize(blob, language, {
    logger: (info: { status: string; progress: number }) => {
      if (info.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(info.progress * 100));
      }
    },
  });
  return result.data.text;
}

/**
 * Parse nutrition values from raw OCR text.
 * Works with common English, Hebrew, Arabic, Spanish, French nutrition labels.
 */
function parseNutritionFromText(text: string): Omit<OCRResult, 'rawText'> {
  const result: Omit<OCRResult, 'rawText'> = {};
  const lines = text.toLowerCase();

  // ── Calories ──
  const calPatterns = [
    /calori(?:es?|as?|ën)[\s:.\-]*(\d+)/i,
    /energy[\s:.\-]*(\d+)\s*kcal/i,
    /kcal[\s:.\-]*(\d+)/i,
    /(\d+)\s*kcal/i,
    /calories?\s*(\d+)/i,
    /קלוריות[\s:.\-]*(\d+)/i,
    /סה"כ קלוריות[\s:.\-]*(\d+)/i,
    /سعرات[\s:.\-]*(\d+)/i,
    /énergie[\s:.\-]*(\d+)/i,
    /amount per serving[\s\S]*?(\d{2,4})/i,
  ];
  for (const pat of calPatterns) {
    const m = lines.match(pat);
    if (m) { result.calories = parseInt(m[1]); break; }
  }

  // ── Protein ──
  const protPatterns = [
    /prote[ií]n[ae]?s?[\s:.\-]*(\d+\.?\d*)\s*g/i,
    /protein[\s:.\-]*(\d+\.?\d*)/i,
    /חלבון[\s:.\-]*(\d+\.?\d*)/i,
    /بروتين[\s:.\-]*(\d+\.?\d*)/i,
    /protéines?[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of protPatterns) {
    const m = lines.match(pat);
    if (m) { result.protein = parseFloat(m[1]); break; }
  }

  // ── Carbs ──
  const carbPatterns = [
    /total\s*carbohydrate[s]?[\s:.\-]*(\d+\.?\d*)/i,
    /carbohydrate[s]?[\s:.\-]*(\d+\.?\d*)\s*g/i,
    /carbs?[\s:.\-]*(\d+\.?\d*)/i,
    /total\s+carb[\w]*[\s:.\-]*(\d+\.?\d*)/i,
    /carbohidratos?[\s:.\-]*(\d+\.?\d*)/i,
    /פחמימות[\s:.\-]*(\d+\.?\d*)/i,
    /كربوهيدرات[\s:.\-]*(\d+\.?\d*)/i,
    /glucides?[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of carbPatterns) {
    const m = lines.match(pat);
    if (m) { result.carbs = parseFloat(m[1]); break; }
  }

  // ── Fat ──
  const fatPatterns = [
    /total\s*fat[\s:.\-]*(\d+\.?\d*)\s*g/i,
    /(?:total\s+)?fat[\s:.\-]*(\d+\.?\d*)\s*g/i,
    /fat[\s:.\-]*(\d+\.?\d*)/i,
    /grasa[s]?[\s:.\-]*(\d+\.?\d*)/i,
    /שומן[\s:.\-]*(\d+\.?\d*)/i,
    /دهون[\s:.\-]*(\d+\.?\d*)/i,
    /lipides?[\s:.\-]*(\d+\.?\d*)/i,
    /matières\s+grasses?[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of fatPatterns) {
    const m = lines.match(pat);
    if (m) { result.fat = parseFloat(m[1]); break; }
  }

  // ── Fiber ──
  const fiberPatterns = [
    /(?:dietary\s+)?fib(?:er|re|ra)[\s:.\-]*(\d+\.?\d*)/i,
    /סיבים[\s:.\-]*(\d+\.?\d*)/i,
    /ألياف[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of fiberPatterns) {
    const m = lines.match(pat);
    if (m) { result.fiber = parseFloat(m[1]); break; }
  }

  // ── Sugar ──
  const sugarPatterns = [
    /sugars?[\s:.\-]*(\d+\.?\d*)\s*g/i,
    /סוכר(?:ים)?[\s:.\-]*(\d+\.?\d*)/i,
    /az[úu]cares?[\s:.\-]*(\d+\.?\d*)/i,
    /sucre[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of sugarPatterns) {
    const m = lines.match(pat);
    if (m) { result.sugar = parseFloat(m[1]); break; }
  }

  // ── Sodium ──
  const sodiumPatterns = [
    /sodium[\s:.\-]*(\d+\.?\d*)\s*m?g/i,
    /נתרן[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of sodiumPatterns) {
    const m = lines.match(pat);
    if (m) { result.sodium = parseFloat(m[1]); break; }
  }

  // ── Potassium ──
  const potassiumPatterns = [
    /potassium[\s:.\-]*(\d+\.?\d*)\s*m?g/i,
    /אשלגן[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of potassiumPatterns) {
    const m = lines.match(pat);
    if (m) { result.potassium = parseFloat(m[1]); break; }
  }

  // ── Calcium ──
  const calciumPatterns = [
    /calcium[\s:.\-]*(\d+\.?\d*)\s*m?g/i,
    /סידן[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of calciumPatterns) {
    const m = lines.match(pat);
    if (m) { result.calcium = parseFloat(m[1]); break; }
  }

  // ── Iron ──
  const ironPatterns = [
    /iron[\s:.\-]*(\d+\.?\d*)\s*m?g/i,
    /ברזל[\s:.\-]*(\d+\.?\d*)/i,
  ];
  for (const pat of ironPatterns) {
    const m = lines.match(pat);
    if (m) { result.iron = parseFloat(m[1]); break; }
  }

  // ── Vitamins ──
  const vitAPatterns = [/vitamin\s*a[\s:.\-]*(\d+\.?\d*)/i];
  for (const pat of vitAPatterns) {
    const m = lines.match(pat);
    if (m) { result.vitaminA = parseFloat(m[1]); break; }
  }

  const vitCPatterns = [/vitamin\s*c[\s:.\-]*(\d+\.?\d*)/i];
  for (const pat of vitCPatterns) {
    const m = lines.match(pat);
    if (m) { result.vitaminC = parseFloat(m[1]); break; }
  }

  const vitDPatterns = [/vitamin\s*d[\s:.\-]*(\d+\.?\d*)/i];
  for (const pat of vitDPatterns) {
    const m = lines.match(pat);
    if (m) { result.vitaminD = parseFloat(m[1]); break; }
  }

  // ── Serving Size ──
  const servingPatterns = [
    /serving\s+size[\s:.\-]*([\d.]+\s*[a-zA-Z()]+(?:\s*[\d.]*\s*[a-zA-Z()]*)*)/i,
    /porción[\s:.\-]*([\d.]+\s*[a-zA-Z]+)/i,
    /portion[\s:.\-]*([\d.]+\s*[a-zA-Z]+)/i,
  ];
  for (const pat of servingPatterns) {
    const m = text.match(pat);
    if (m) { result.servingSize = m[1].trim(); break; }
  }

  return result;
}

/**
 * Scan a nutrition label image and extract macro+micro data.
 * Primary: OCR.space API (fast, accurate, cloud).
 * Fallback: Tesseract.js (local, slower).
 */
export async function scanNutritionLabel(
  file: File,
  language: string = 'eng',
  onProgress?: (pct: number) => void
): Promise<OCRResult> {
  let rawText: string;

  try {
    // Try OCR.space API first
    rawText = await ocrSpaceRecognize(file, language, onProgress);
  } catch (apiError) {
    console.warn('OCR.space API failed, falling back to Tesseract.js:', apiError);
    // Fallback to local Tesseract.js
    rawText = await tesseractFallback(file, language, onProgress);
  }

  const parsed = parseNutritionFromText(rawText);

  return {
    ...parsed,
    rawText,
  };
}
