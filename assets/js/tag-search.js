(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const input = document.getElementById('tag-search-input');
    if(!input) return;
    const resultsEl = document.getElementById('tag-search-results');
    const dataUrl = window.TAG_SEARCH_DATA_URL || '/assets/data/tags_index.json';

    fetch(dataUrl)
      .then(r => r.json())
      .then(data => {
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
          resultsEl.innerHTML = posts.length ?
            posts.map(p => `<li><a href="${p.url}">${p.title}</a> <time datetime="${p.date}" class="text-muted">${p.date.substring(0,10)}</time></li>`).join('')
            : '<li>No se encontraron entradas.</li>';
        };

        const filterPosts = () => {
          const selected = tagify.value.map(v => v.value);
          if(selected.length === 0){
            resultsEl.innerHTML = '';
            return;
          }
          const filtered = data.posts.filter(post =>
            selected.every(tag => post.tags.includes(tag))
          );
          render(filtered);
        };

        // Tagify does not fire a generic "change" event - listen to add/remove
        tagify.on('add', filterPosts);
        tagify.on('remove', filterPosts);
      });
  });
})(); 