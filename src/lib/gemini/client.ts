import { GoogleGenerativeAI } from "@google/generative-ai"

// Types for better type safety
interface CommodityData {
  id: string
  name: string
  currentPrice: number
  previousPrice: number
  trend: 'up' | 'down' | 'stable'
  percentage: number
  lastUpdated: Date
  source: string[]
  location?: string
}

interface Recommendation {
  commodity: string
  action: 'beli' | 'jual' | 'tahan'
  confidence: number
  reason: string
  expectedReturn: string
  timeframe: string
}

interface GeminiResponse {
  recommendations: Recommendation[]
  marketSentiment: 'positif' | 'negatif' | 'netral'
  volatility: 'rendah' | 'sedang' | 'tinggi'
  insights: string
}

export function createGeminiClient() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set")
  }

  return new GoogleGenerativeAI(apiKey)
}

export async function generatePriceRecommendations(commodityData: CommodityData[]): Promise<GeminiResponse> {
  const genAI = createGeminiClient()
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  
  // Format data untuk prompt yang lebih terstruktur
  const formattedData = commodityData.map(item => ({
    komoditas: item.name,
    hargaSekarang: item.currentPrice,
    hargaSebelumnya: item.previousPrice,
    tren: item.trend,
    persentasePerubahan: item.percentage,
    sumber: item.source.join(', '),
    lokasi: item.location || 'Banyuwangi'
  }))

  const prompt = `
Sebagai AI ahli analisis komoditas pertanian di Banyuwangi, Jawa Timur, analisis data harga komoditas berikut dan berikan rekomendasi yang akurat:

DATA KOMODITAS:
${JSON.stringify(formattedData, null, 2)}

KONTEKS LOKAL:
- Lokasi: Banyuwangi, Jawa Timur
- Fokus: Petani lokal, UMKM, pedagang pasar tradisional
- Musim: Pertimbangkan faktor cuaca dan musim panen lokal
- Kondisi ekonomi: Pasar lokal dan regional Jawa Timur

INSTRUKSI ANALISIS:
1. Analisis tren harga setiap komoditas
2. Pertimbangkan faktor musiman dan lokal Banyuwangi
3. Berikan rekomendasi praktis untuk petani dan pedagang
4. Sertakan tingkat kepercayaan prediksi
5. Pertimbangkan volatilitas pasar

WAJIB RESPONSE DALAM FORMAT JSON BERIKUT (tanpa markdown atau backticks):
{
  "recommendations": [
    {
      "commodity": "nama komoditas",
      "action": "beli/jual/tahan",
      "confidence": 85,
      "reason": "alasan detail berdasarkan analisis tren dan kondisi pasar",
      "expectedReturn": "perkiraan return dalam persen",
      "timeframe": "estimasi waktu dalam hari/minggu"
    }
  ],
  "marketSentiment": "positif/negatif/netral",
  "volatility": "rendah/sedang/tinggi",
  "insights": "insight pasar umum dan prediksi kondisi mendatang untuk Banyuwangi"
}

Pastikan response hanya berupa JSON yang valid tanpa teks tambahan.
  `.trim()

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Clean up response - remove markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    // More robust JSON extraction
    let jsonData: GeminiResponse
    try {
      jsonData = JSON.parse(text)
    } catch (parseError) {
      // Fallback: extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No valid JSON found in response")
      }
    }

    // Validate response structure
    if (!jsonData.recommendations || !Array.isArray(jsonData.recommendations)) {
      throw new Error("Invalid response structure")
    }

    return {
      recommendations: jsonData.recommendations,
      marketSentiment: jsonData.marketSentiment || "netral",
      volatility: jsonData.volatility || "sedang",
      insights: jsonData.insights || "Analisis berhasil diproses"
    }

  } catch (error) {
    console.error("Error generating recommendations:", error)
    
    // Fallback response with mock data based on actual commodity data
    const fallbackRecommendations: Recommendation[] = commodityData.map(item => ({
      commodity: item.name,
      action: item.trend === 'up' ? 'jual' : item.trend === 'down' ? 'beli' : 'tahan',
      confidence: 70,
      reason: `Berdasarkan tren ${item.trend === 'up' ? 'kenaikan' : item.trend === 'down' ? 'penurunan' : 'stabilitas'} harga ${Math.abs(item.percentage)}%`,
      expectedReturn: `${Math.abs(item.percentage)}%-${Math.abs(item.percentage) + 5}%`,
      timeframe: "3-7 hari"
    }))

    return {
      recommendations: fallbackRecommendations,
      marketSentiment: "netral",
      volatility: "sedang",
      insights: "Sistem sedang dalam maintenance, menggunakan analisis dasar berdasarkan tren harga terkini"
    }
  }
}

// Additional utility function for price predictions
export async function generatePricePredictions(commodityData: CommodityData[], days: number = 7): Promise<any> {
  const genAI = createGeminiClient()
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
Sebagai AI predictor harga komoditas untuk wilayah Banyuwangi, prediksi harga ${days} hari ke depan berdasarkan data:

${JSON.stringify(commodityData, null, 2)}

Berikan prediksi dalam format JSON:
{
  "predictions": [
    {
      "commodity": "nama komoditas",
      "currentPrice": harga_saat_ini,
      "predictedPrice": harga_prediksi,
      "confidence": tingkat_kepercayaan,
      "factors": ["faktor1", "faktor2"]
    }
  ]
}
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { predictions: [] }
  } catch (error) {
    console.error("Error generating predictions:", error)
    return { predictions: [] }
  }
}

// Function to extract price data from text using Gemini
export async function extractPriceFromText(textData: string, location: string = "Banyuwangi"): Promise<CommodityData[]> {
  const genAI = createGeminiClient()
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
Ekstrak informasi harga komoditas dari teks berikut untuk wilayah ${location}:

"${textData}"

Format response sebagai JSON array:
[
  {
    "name": "nama komoditas",
    "currentPrice": harga_numerik,
    "unit": "satuan (kg/ikat/dll)",
    "location": "${location}",
    "source": "sumber informasi",
    "lastUpdated": "tanggal_jika_ada"
  }
]
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : []
  } catch (error) {
    console.error("Error extracting price data:", error)
    return []
  }
}