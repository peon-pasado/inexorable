(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const input = document.getElementById('tag-search-input');
    if(!input) return;
    const resultsEl = document.getElementById('tag-search-results');
    const dataUrl = window.TAG_SEARCH_DATA_URL || '/assets/data/tags_index.json';

    console.log('Intentando cargar datos desde:', dataUrl);

    fetch(dataUrl)
      .then(r => r.json())
      .then(data => {
        console.log('Datos cargados:', data);
        console.log('Tags disponibles:', data.tags);
        console.log('Posts disponibles:', data.posts.length);
        
        const tagify = new Tagify(input, {
          whitelist: data.tags,
          dropdown: {
            maxItems: 20,
            closeOnSelect: false,
            classname: 'tags-look'
          }
        });

        const render = posts => {
          if(!resultsEl) return;
          console.log('Renderizando posts:', posts.length);
          resultsEl.innerHTML = posts.length ?
            posts.map(p => `<li><a href="${p.url}">${p.title}</a> <time datetime="${p.date}" class="text-muted">${p.date.substring(0,10)}</time></li>`).join('')
            : '<li>No se encontraron entradas.</li>';
        };

        const filterPosts = () => {
          const selected = tagify.value.map(v => v.value);
          console.log('Tags seleccionados:', selected);
          if(selected.length === 0){
            resultsEl.innerHTML = '';
            return;
          }
          const filtered = data.posts.filter(post =>
            selected.every(tag => post.tags.includes(tag))
          );
          console.log('Posts filtrados:', filtered.length);
          render(filtered);
        };

        tagify.on('add', filterPosts);
        tagify.on('remove', filterPosts);
        tagify.on('input', filterPosts);
        tagify.on('dropdown:select', filterPosts);
      })
      .catch(error => {
        console.error('Error cargando datos:', error);
      });
  });
})(); 