document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const galleryGrid = document.getElementById('galleryGrid');
    const tagContainer = document.getElementById('tagContainer');
    const searchInput = document.getElementById('searchInput');
    const pageDiscovery = document.getElementById('page-discovery');
    const pageDetail = document.getElementById('page-detail');
    const backBtn = document.getElementById('backBtn');
    const themeToggle = document.getElementById('themeToggle');
    const scrollTop = document.getElementById('scrollTop');

    let currentFilter = 'All';

    // Loader Gimmick
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1500);

    // Render Gallery
    function renderGallery(data) {
        galleryGrid.innerHTML = '';
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="card-info">
                    <span class="card-tag">${item.tags[0]}</span>
                    <h4 style="font-size:0.9rem">${item.title}</h4>
                </div>
            `;
            card.onclick = () => showDetail(item);
            galleryGrid.appendChild(card);
        });
    }

    // Render Tags
    function renderTags() {
        const allTags = ['All', ...new Set(galleryData.flatMap(item => item.tags))];
        tagContainer.innerHTML = '';
        allTags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = `tag ${tag === currentFilter ? 'active' : ''}`;
            tagEl.textContent = tag;
            tagEl.onclick = () => {
                currentFilter = tag;
                document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                tagEl.classList.add('active');
                filterGallery();
            };
            tagContainer.appendChild(tagEl);
        });
    }

    // Search & Filter
    function filterGallery() {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = galleryData.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                                 item.tags.some(t => t.toLowerCase().includes(searchTerm));
            const matchesTag = currentFilter === 'All' || item.tags.includes(currentFilter);
            return matchesSearch && matchesTag;
        });
        renderGallery(filtered);
    }

    searchInput.oninput = filterGallery;

    // Navigation to Detail
    function showDetail(item) {
        document.getElementById('detailImage').src = item.image;
        document.getElementById('detailTitle').textContent = item.title;
        document.getElementById('detailAuthor').innerHTML = `<i class="fas fa-user"></i> ` + item.author;
        document.getElementById('detailNarrative').textContent = item.narrative;
        document.getElementById('detailText').textContent = item.text;
        
        const tagsEl = document.getElementById('detailTags');
        tagsEl.innerHTML = item.tags.map(t => `<span class="tag" style="margin-right:5px">${t}</span>`).join('');

        pageDiscovery.classList.remove('active');
        pageDetail.classList.add('active');
        window.scrollTo(0, 0);
    }

    backBtn.onclick = () => {
        pageDetail.classList.remove('active');
        pageDiscovery.classList.add('active');
    };

    // Theme Toggle
    themeToggle.onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-palette"></i>' : '<i class="fas fa-sun"></i>';
    };

    // Scroll Top
    window.onscroll = () => {
        scrollTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    };

    scrollTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Init
    renderGallery(galleryData);
    renderTags();
});
