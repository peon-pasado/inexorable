# Buscador de Tags - Documentación

## Cómo funciona

El buscador de tags está en `/tag-search/` y usa:
- **JSON de datos**: `/assets/data/tags_index.json`
- **JavaScript**: `/assets/js/tag-search.js`
- **Página HTML**: `/tag-search.html`

## Actualización automática

### En GitHub Pages
Cuando hagas `git push`, Jekyll generará automáticamente el JSON actualizado con todos los nuevos posts y tags. **No necesitas hacer nada manual**.

### Para desarrollo local

Si quieres probar localmente antes de subir:

```bash
python generate_tags_json.py
```

Este comando:
- Lee todos los archivos `.md` en `_posts/` 
- Extrae títulos, tags y fechas
- Genera `/assets/data/tags_index.json`
- Muestra un resumen de lo que encontró

## Añadir nuevos posts

Simplemente crea posts normales en `_posts/` con tags en el front matter:

```yaml
---
layout: post
title: "Mi nuevo post"
tags: [javascript, tutorial, web]
---
```

El buscador se actualizará automáticamente.

## Estructura del JSON generado

```json
{
  "posts": [
    {
      "title": "Título del post",
      "url": "/inexorable/2024-01-01-titulo/",
      "tags": ["tag1", "tag2"],
      "date": "2024-01-01T00:00:00-05:00"
    }
  ],
  "tags": ["tag1", "tag2", "tag3"]
}
```

## Solución de problemas

Si el buscador no funciona:
1. Verifica que el JSON sea válido (usa un validador JSON online)
2. Ejecuta `python generate_tags_json.py` localmente
3. Revisa la consola del navegador para errores 