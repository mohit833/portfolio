// Temporary diagnostic: reports which provider keys the runtime can see.
// Never returns key values.
export default async function handler(req, res) {
  if (req.query?.probe === 'gemini') {
    try {
      const { GoogleGenAI } = await import('@google/genai')
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY })
      const r = await ai.models.generateContent({ model: 'gemini-flash-latest', contents: 'Say OK.' })
      return res.status(200).json({ ok: true, text: (r.text || '').slice(0, 80) })
    } catch (error) {
      return res.status(200).json({ ok: false, message: String(error?.message || error).slice(0, 400) })
    }
  }
  res.status(200).json({
    claude: !!process.env.ANTHROPIC_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    google: !!process.env.GOOGLE_API_KEY,
    envCount: Object.keys(process.env).length,
    sample: Object.keys(process.env).filter((k) => /API|KEY/i.test(k)),
  })
}
