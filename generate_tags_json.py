#!/usr/bin/env python3
"""
Script para generar tags_index.json localmente
Uso: python generate_tags_json.py
"""

import os
import json
import re
from datetime import datetime
import yaml

def extract_frontmatter(content):
    """Extrae el front matter de un archivo markdown"""
    if content.startswith('---'):
        try:
            _, frontmatter, _ = content.split('---', 2)
            return yaml.safe_load(frontmatter)
        except:
            return {}
    return {}

def get_post_data():
    """Obtiene datos de todos los posts"""
    posts = []
    all_tags = set()
    
    posts_dir = '_posts'
    if not os.path.exists(posts_dir):
        print(f"Directorio {posts_dir} no encontrado")
        return posts, list(all_tags)
    
    for filename in os.listdir(posts_dir):
        if filename.endswith('.md'):
            filepath = os.path.join(posts_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            frontmatter = extract_frontmatter(content)
            if not frontmatter:
                continue
                
            # Extraer fecha del nombre del archivo o del frontmatter
            date_match = re.match(r'(\d{4}-\d{2}-\d{2})', filename)
            if date_match:
                date_str = date_match.group(1)
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                iso_date = date_obj.strftime('%Y-%m-%dT00:00:00-05:00')
            else:
                iso_date = "2024-01-01T00:00:00-05:00"  # fecha por defecto
            
            # Crear URL del post
            url_name = filename.replace('.md', '').replace(' ', '-').lower()
            url = f"/inexorable/{url_name}/"
            
            title = frontmatter.get('title', filename.replace('.md', ''))
            tags = frontmatter.get('tags', [])
            
            if isinstance(tags, str):
                tags = [tags]
            
            posts.append({
                'title': title,
                'url': url,
                'tags': tags,
                'date': iso_date
            })
            
            all_tags.update(tags)
    
    # Ordenar posts por fecha (más recientes primero)
    posts.sort(key=lambda x: x['date'], reverse=True)
    
    return posts, sorted(list(all_tags))

def main():
    posts, tags = get_post_data()
    
    data = {
        'posts': posts,
        'tags': tags
    }
    
    # Crear directorio si no existe
    os.makedirs('assets/data', exist_ok=True)
    
    # Escribir JSON
    output_file = 'assets/data/tags_index.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Generado {output_file}")
    print(f"📝 {len(posts)} posts encontrados")
    print(f"🏷️  {len(tags)} tags únicos: {', '.join(tags)}")

if __name__ == '__main__':
    main() 