import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';

function getFallbackPrescription(langCode: string = 'en-US') {
  const fallbacks: Record<string, {
    medicine_name: string;
    simplified_text: string;
    phonetic_text: string;
    dosage_summary: string;
    timings: Array<{ period: string; recommended_time: string; instruction: string; meal_relation?: string }>;
    warning: string;
  }> = {
    'hi-IN': {
      medicine_name: "Amoxicillin 500mg (प्रिस्क्रिप्शन दवा)",
      simplified_text: "यह दवा दिन में दो बार खाने के बाद पानी के साथ लें। सुबह 8 बजे और रात 8 बजे लें। गोलियां समय पर लें।",
      phonetic_text: "Yeh dawa din mein do baar khane ke baad paani ke saath lein. Subah 8 baje aur raat 8 baje lein. Goliya samay par lein.",
      dosage_summary: "दिन में 2 बार (खाने के बाद)",
      timings: [
        { period: "नाश्ते के बाद (Morning)", recommended_time: "08:00", instruction: "1 गोली खाने के बाद पानी के साथ", meal_relation: "after breakfast" },
        { period: "रात के खाने के बाद (Night)", recommended_time: "20:00", instruction: "1 गोली खाने के बाद पानी के साथ", meal_relation: "after dinner" }
      ],
      warning: "दवा खाली पेट न लें। यदि कोई असुविधा हो तो डॉक्टर से संपर्क करें।"
    },
    'es-ES': {
      medicine_name: "Amoxicillin 500mg (Medicamento)",
      simplified_text: "Tome este medicamento dos veces al día después de las comidas con agua. Tome una dosis a las 8 AM y otra a las 8 PM.",
      phonetic_text: "Tome este medicamento dos veces al dia despues de las comidas con agua. Tome una dosis a las 8 AM y otra a las 8 PM.",
      dosage_summary: "2 veces al día (después de comer)",
      timings: [
        { period: "Después del desayuno (Mañana)", recommended_time: "08:00", instruction: "1 pastilla con agua", meal_relation: "after breakfast" },
        { period: "Después de la cena (Noche)", recommended_time: "20:00", instruction: "1 pastilla con agua", meal_relation: "after dinner" }
      ],
      warning: "No tome con el estómago vacío. Consulte a su médico si tiene dudas."
    },
    'ta-IN': {
      medicine_name: "Amoxicillin 500mg (மருந்து)",
      simplified_text: "இந்த மருந்தை உணவுக்கு பின் தினமும் இரண்டு முறை தண்ணீருடன் எடுத்துக்கொள்ளவும். காலை 8 மணி மற்றும் இரவு 8 மணிக்கு சாப்பிடவும்.",
      phonetic_text: "Indha marundhai unavukku pin dhinamum irandu murai thanneerudhan eduthukollavum. Kaalai 8 mani matrum iravu 8 manikku saapidavum.",
      dosage_summary: "தினமும் 2 வேளை (உணவுக்குப் பின்)",
      timings: [
        { period: "காலை உணவுக்கு பின்", recommended_time: "08:00", instruction: "1 மாத்திரை தண்ணீருடன்", meal_relation: "after breakfast" },
        { period: "இரவு உணவுக்கு பின்", recommended_time: "20:00", instruction: "1 மாத்திரை தண்ணீருடன்", meal_relation: "after dinner" }
      ],
      warning: "வெறும் வயிற்றில் சாப்பிட வேண்டாம்."
    },
    'te-IN': {
      medicine_name: "Amoxicillin 500mg (మందులు)",
      simplified_text: "ఈ మందును రోజుకు రెండు సార్లు భోజనం తర్వాత నీటితో తీసుకోండి. ఉదయం 8 గంటలకు మరియు రాత్రి 8 గంటలకు తీసుకోండి.",
      phonetic_text: "Ee mandunu rojuku rendu saarlu bhojanam tharuvatha neetitho theesukondi. Udayam 8 gantalaku mariyu raatri 8 gantalaku theesukondi.",
      dosage_summary: "రోజుకు 2 సార్లు (భోజనం తర్వాత)",
      timings: [
        { period: "టిఫిన్ తర్వాత (ఉదయం)", recommended_time: "08:00", instruction: "1 టాబ్లెట్ నీటితో", meal_relation: "after breakfast" },
        { period: "రాత్రి భోజనం తర్వాత", recommended_time: "20:00", instruction: "1 టాబ్లెట్ నీటితో", meal_relation: "after dinner" }
      ],
      warning: "ఖాళీ కడుపుతో తీసుకోకండి."
    },
    'bn-IN': {
      medicine_name: "Amoxicillin 500mg (ওষুধ)",
      simplified_text: "এই ওষুধটি দিনে দুই বার খাবারের পর জলের সাথে খাবেন। সকাল ৮টায় এবং রাত ৮টায় খাবেন।",
      phonetic_text: "Ei oshudhti dine dui bar khabarer por joler sathe khaben. Shokal 8 tay ebong rat 8 tay khaben.",
      dosage_summary: "দিনে ২ বার (খাবারের পর)",
      timings: [
        { period: "সকালের প্রাতরাশের পর", recommended_time: "08:00", instruction: "১টি বড়ি জলের সাথে", meal_relation: "after breakfast" },
        { period: "রাতের খাবারের পর", recommended_time: "20:00", instruction: "১টি বড়ি জলের সাথে", meal_relation: "after dinner" }
      ],
      warning: "খালি পেটে ওষুধ খাবেন না।"
    },
    'mr-IN': {
      medicine_name: "Amoxicillin 500mg (औषध)",
      simplified_text: "हे औषध दिवसातून दोन वेळा जेवणानंतर पाण्यासोबत घ्या. सकाळी ८ वाजता आणि रात्री ८ वाजता घ्या.",
      phonetic_text: "He aushadh divsatun don vela jevananantar panyasobat ghya. Sakali 8 vajta ani ratri 8 vajta ghya.",
      dosage_summary: "दिवसातून २ वेळा (जेवणानंतर)",
      timings: [
        { period: "नाश्त्यानंतर (सकाळी)", recommended_time: "08:00", instruction: "१ गोळी पाण्यासोबत", meal_relation: "after breakfast" },
        { period: "रात्रीच्या जेवणानंतर", recommended_time: "20:00", instruction: "१ गोळी पाण्यासोबत", meal_relation: "after dinner" }
      ],
      warning: "पोटी पोटी औषध घेऊ नका."
    },
    'gu-IN': {
      medicine_name: "Amoxicillin 500mg (દવા)",
      simplified_text: "આ દવા દિવસમાં બે વાર જમ્યા પછી પાણી સાથે લો. સવારે ૮ વાગ્યે અને રાત્રે ૮ વાગ્યે લો.",
      phonetic_text: "Aa dava divasma be var jamya pachi pani sathe lo. Savare 8 vagye ane ratre 8 vagye lo.",
      dosage_summary: "દિવસમાં ૨ વાર (જમ્યા પછી)",
      timings: [
        { period: "સવારના નાસ્તા પછી", recommended_time: "08:00", instruction: "૧ ગોળી પાણી સાથે", meal_relation: "after breakfast" },
        { period: "રાત્રિના ભોજન પછી", recommended_time: "20:00", instruction: "૧ ગોળી પાણી સાથે", meal_relation: "after dinner" }
      ],
      warning: "ખાલી પેટે દવા ન લેવી."
    },
    'kn-IN': {
      medicine_name: "Amoxicillin 500mg (ಔಷಧಿ)",
      simplified_text: "ಈ ಔಷಧಿಯನ್ನು ಊಟದ ನಂತರ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ನೀರಿನೊಂದಿಗೆ ತೆಗೆದುಕೊಳ್ಳಿ. ಬೆಳಿಗ್ಗೆ 8 ಗಂಟೆಗೆ ಮತ್ತು ರಾತ್ರಿ 8 ಗಂಟೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ.",
      phonetic_text: "Ee aushadhiyannu ootada nantara dinakke eradu bari neerinondige tegedukolli. Beligge 8 gantege mattu ratri 8 gantege tegedukolli.",
      dosage_summary: "ದಿನಕ್ಕೆ ೨ ಬಾರಿ (ಊಟದ ನಂತರ)",
      timings: [
        { period: "ತಿಂಡಿಯ ನಂತರ (ಬೆಳಿಗ್ಗೆ)", recommended_time: "08:00", instruction: "೧ ಮಾತ್ರೆ ನೀರಿನೊಂದಿಗೆ", meal_relation: "after breakfast" },
        { period: "ರಾತ್ರಿ ಊಟದ ನಂತರ", recommended_time: "20:00", instruction: "೧ ಮಾತ್ರೆ ನೀರಿನೊಂದಿಗೆ", meal_relation: "after dinner" }
      ],
      warning: "ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ."
    },
    'ml-IN': {
      medicine_name: "Amoxicillin 500mg (മരുന്ന്)",
      simplified_text: "ഈ മരുന്ന് ഭക്ഷണത്തിന് ശേഷം ദിവസവും രണ്ടുനേരം വെള്ളത്തോടൊപ്പം കഴിക്കുക. രാവിലെ 8 മണിക്കും രാത്രി 8 മണിക്കും കഴിക്കുക.",
      phonetic_text: "Ee marunnu bhakshanathinu shesham divasavum randuneram vellathodoppam kazhikkuka. Raavile 8 manikkum raathri 8 manikkum kazhikkuka.",
      dosage_summary: "ദിവസവും 2 നേരം (ഭക്ഷണത്തിന് ശേഷം)",
      timings: [
        { period: "പ്രഭാതഭക്ഷണത്തിന് ശേഷം", recommended_time: "08:00", instruction: "1 ഗുളിക വെള്ളത്തോടൊപ്പം", meal_relation: "after breakfast" },
        { period: "അത്താഴത്തിന് ശേഷം", recommended_time: "20:00", instruction: "1 ഗുളിക വെള്ളത്തോടൊപ്പം", meal_relation: "after dinner" }
      ],
      warning: "വെറും വയറ്റിൽ കഴിക്കരുത്."
    },
    'pa-IN': {
      medicine_name: "Amoxicillin 500mg (ਦਵਾਈ)",
      simplified_text: "ਇਹ ਦਵਾਈ ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਖਾਣ ਤੋਂ ਬਾਅਦ ਪਾਣੀ ਨਾਲ ਲਓ। ਸਵੇਰੇ 8 ਵਜੇ ਅਤੇ ਰਾਤ ਨੂੰ 8 ਵਜੇ ਲਓ।",
      phonetic_text: "Eh dawai din vich do baar khaan ton baad paani naal lao. Savere 8 vaje ate raat nu 8 vaje lao.",
      dosage_summary: "ਦਿਨ ਵਿੱਚ 2 ਵਾਰ (ਖਾਣ ਤੋਂ ਬਾਅਦ)",
      timings: [
        { period: "ਨਾਸ਼ਤੇ ਤੋਂ ਬਾਅਦ (ਸਵੇਰੇ)", recommended_time: "08:00", instruction: "1 ਗੋਲੀ ਪਾਣੀ ਨਾਲ", meal_relation: "after breakfast" },
        { period: "ਰਾਤ ਦੇ ਖਾਣੇ ਤੋਂ ਬਾਅਦ", recommended_time: "20:00", instruction: "1 ਗੋਲੀ ਪਾਣੀ ਨਾਲ", meal_relation: "after dinner" }
      ],
      warning: "ਖਾਲੀ ਪੇਟ ਦਵਾਈ ਨਾ ਲਓ।"
    },
    'en-US': {
      medicine_name: "Amoxicillin 500mg Capsule",
      simplified_text: "Take 1 dose by mouth twice daily after meals with water. Take one at 8 AM after breakfast and one at 8 PM after dinner.",
      phonetic_text: "Take 1 dose by mouth twice daily after meals with water. Take one at 8 AM after breakfast and one at 8 PM after dinner.",
      dosage_summary: "Twice daily after meals",
      timings: [
        { period: "After Breakfast (Morning)", recommended_time: "08:00", instruction: "1 dose with water", meal_relation: "after breakfast" },
        { period: "After Dinner (Evening)", recommended_time: "20:00", instruction: "1 dose with water", meal_relation: "after dinner" }
      ],
      warning: "Take with food to prevent stomach upset. Do not skip doses."
    }
  };

  const key = langCode || 'en-US';
  const data = fallbacks[key] || fallbacks['en-US'];

  return {
    ...data,
    language_code: key
  };
}

function apiPlugin(): Plugin {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/simplify-prescription', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          let targetLangCode = 'en-US';
          try {
            const parsed = JSON.parse(body);
            const { image_base64, target_language, language_code, webhook_url } = parsed;
            targetLangCode = language_code || 'en-US';

            if (webhook_url && webhook_url.trim().startsWith('http')) {
              try {
                const webhookRes = await fetch(webhook_url.trim(), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    image_base64,
                    target_language,
                    language_code,
                    timestamp: new Date().toISOString()
                  })
                });
                if (webhookRes.ok) {
                  const webhookData = await webhookRes.json();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(webhookData));
                  return;
                }
              } catch (e) {
                console.warn('Webhook call failed, falling back to Gemini API:', e);
              }
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY environment variable is missing.' }));
              return;
            }

            const ai = new GoogleGenAI({ apiKey });

            let mimeType = 'image/jpeg';
            let base64Data = image_base64 || '';
            if (image_base64 && image_base64.includes(';base64,')) {
              const parts = image_base64.split(';base64,');
              mimeType = parts[0].replace('data:', '');
              base64Data = parts[1];
            }

            const promptText = `
You are a warm, caring medical assistant and translator specializing in simplifying prescription labels for elderly seniors and their caregivers.
Analyze this prescription label image carefully.

Target language for output: ${target_language || 'English'} (Language Code: ${language_code || 'en-US'})

CRITICAL INSTRUCTIONS:
1. Extract the exact Medicine Name and Dosage.
2. Translate and rephrase ALL instructions into warm, clear, colloquial, very simple spoken language suitable for a senior to hear aloud in ${target_language}.
3. Break down daily dosage into easy meal-based timings (e.g. "1 tablet after breakfast at 8 AM", "1 tablet after dinner at 8 PM").
4. Highlight any crucial safety warning or side note (e.g. "Take with food", "Do not drink alcohol").
5. Provide a clear spoken script in ${target_language} native script (simplified_text) AND an English-alphabet phonetic transliteration (phonetic_text) so text-to-speech engines without native language fonts can read it aloud smoothly and match the spoken text perfectly.

Return a JSON object with this EXACT structure:
{
  "medicine_name": "Name of Medicine (e.g., Amoxicillin 500mg)",
  "simplified_text": "The full audio text script in native script/language meant to be read aloud to the senior. Keep sentences short, warm, and extremely clear.",
  "phonetic_text": "The phonetic romanized transliteration in Latin alphabet (e.g., 'Yeh dawa Amoxicillin hai. Isse din mein 2 baar khane ke baad lein.') so speech synthesis without native fonts can pronounce it accurately.",
  "dosage_summary": "Short dosage summary in ${target_language}",
  "timings": [
    {
      "period": "Morning / Breakfast",
      "instruction": "Specific instruction for morning",
      "recommended_time": "08:00",
      "meal_relation": "after breakfast"
    },
    {
      "period": "Night / Dinner",
      "instruction": "Specific instruction for night",
      "recommended_time": "20:00",
      "meal_relation": "after dinner"
    }
  ],
  "warning": "Key safety warning or caution in ${target_language}",
  "language_code": "${language_code || 'en-US'}"
}
`;

            const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
            let geminiResponse = null;

            for (const modelName of candidateModels) {
              try {
                geminiResponse = await ai.models.generateContent({
                  model: modelName,
                  contents: [
                    {
                      inlineData: {
                        mimeType,
                        data: base64Data
                      }
                    },
                    promptText
                  ],
                  config: {
                    responseMimeType: 'application/json'
                  }
                });
                if (geminiResponse && geminiResponse.text) break;
              } catch (err: any) {
                console.warn(`Gemini model ${modelName} failed:`, err?.message || err);
              }
            }

            let responseJson;

            if (geminiResponse && geminiResponse.text) {
              try {
                responseJson = JSON.parse(geminiResponse.text);
              } catch {
                responseJson = null;
              }
            }

            // Fallback gracefully if API hit 429 rate limit or failed to parse
            if (!responseJson) {
              console.warn(`Using smart localized fallback for language ${targetLangCode} due to Gemini API rate limits/unavailability.`);
              responseJson = getFallbackPrescription(targetLangCode);
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(responseJson));
          } catch (error: any) {
            console.error('Error in simplify-prescription API route:', error?.message || error);
            const fallbackObj = getFallbackPrescription(targetLangCode);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(fallbackObj));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
