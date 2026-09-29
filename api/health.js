// Temporary diagnostic: reports which provider keys the runtime can see.
// Never returns key values.
export default async function handler(req, res) {
  if (req.query?.probe === 'models') {
    try {
      const { GoogleGenAI } = await import('@google/genai')
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY })
      const names = []
      for await (const m of await ai.models.list()) {
        names.push(m.name)
        if (names.length > 80) break
      }
      return res.status(200).json({ ok: true, models: names })
    } catch (error) {
      return res.status(200).json({ ok: false, message: String(error?.message || error).slice(0, 300) })
    }
  }
  if (req.query?.probe === 'gemini') {
    try {
      const { GoogleGenAI } = await import('@google/genai')
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY })
      const model = req.query?.model || 'gemini-2.5-flash'
      const config = {}
      if (req.query?.tools === '1') {
        config.tools = [
          {
            functionDeclarations: [
              {
                name: 'open_section',
                description: 'Open a section of the site.',
                parametersJsonSchema: {
                  type: 'object',
                  properties: { section: { type: 'string', enum: ['about', 'skills', 'work'] } },
                  required: ['section'],
                },
              },
            ],
          },
        ]
      }
      config.maxOutputTokens = Number(req.query?.max) || 700
      if (req.query?.think === '0') config.thinkingConfig = { thinkingBudget: 0 }
      if (req.query?.think === 'low') config.thinkingConfig = { thinkingLevel: 'LOW' }
      const prompt = req.query?.long === '1' ? 'List five programming languages, comma separated.' : 'Say OK.'
      const started = Date.now()
      const r = await ai.models.generateContent({ model, contents: prompt, config })
      return res.status(200).json({
        ok: true,
        model,
        ms: Date.now() - started,
        text: (r.text || '').slice(0, 120),
        empty: !(r.text || '').trim(),
        usage: r.usageMetadata,
      })
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
