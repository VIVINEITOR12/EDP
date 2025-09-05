import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const response = await fetch('http://www.bcv.org.ve')
    const html = await response.text()
    
    // Buscar el patrón que contiene la tasa USD
    const usdPattern = /Bs\/USD[\s\S]*?<strong>\s*([\d.,]+)\s*<\/strong>/i
    const match = html.match(usdPattern)
    
    if (!match || !match[1]) {
      throw new Error('No se encontró la tasa USD en la página del BCV')
    }
    
    // Limpiar el formato: quitar puntos de miles y cambiar coma por punto
    let rateStr = match[1].trim()
    rateStr = rateStr.replace(/\./g, '').replace(',', '.')
    const rate = parseFloat(rateStr)
    
    if (!rate || isNaN(rate) || rate <= 0) {
      throw new Error('Tasa extraída no es válida')
    }

    return new Response(
      JSON.stringify({
        success: true,
        rate: rate,
        source: 'BCV',
        timestamp: new Date().toISOString(),
        formatted: rate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Error scraping BCV:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        fallback_rate: 36.5
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
