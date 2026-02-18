document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const galleryGrid = document.getElementById('galleryGrid');
    const searchInput = document.getElementById('searchInput');
    const pageDiscovery = document.getElementById('page-discovery');
    const pageDetail = document.getElementById('page-detail');
    const backBtn = document.getElementById('backBtn');
    const homeBtn = document.getElementById('homeBtn');
    const themeToggle = document.getElementById('themeToggle');
    const scrollTop = document.getElementById('scrollTop');
    
    const filterBtn = document.getElementById('filterBtn');
    const filterModal = document.getElementById('filterModal');
    const closeModal = document.querySelector('.close-modal');
    const tagChecklist = document.getElementById('tagChecklist');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const activeFiltersDisplay = document.getElementById('activeFilters');

    let selectedTags = [];

    // Loader Gimmick
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1500);

    // Render Gallery
    function renderGallery(data) {
        galleryGrid.innerHTML = '';
        if (data.length === 0) {
            galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No images found...</p>';
            return;
        }
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

    // Initialize Filter Modal
    function initFilterModal() {
        const allTags = [...new Set(galleryData.flatMap(item => item.tags))];
        tagChecklist.innerHTML = '';
        allTags.forEach(tag => {
            const label = document.createElement('label');
            label.className = 'check-item';
            label.innerHTML = `
                <input type="checkbox" value="${tag}" ${selectedTags.includes(tag) ? 'checked' : ''}>
                <span>${tag}</span>
            `;
            tagChecklist.appendChild(label);
        });
    }

    // Filter Logic
    function performFilter() {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = galleryData.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                                 item.author.toLowerCase().includes(searchTerm);
            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
            return matchesSearch && matchesTags;
        });
        renderGallery(filtered);
        updateActiveFiltersUI();
    }

    function updateActiveFiltersUI() {
        activeFiltersDisplay.innerHTML = selectedTags.map(tag => `
            <span class="active-tag">${tag}</span>
        `).join('');
    }

    // Modal Events
    filterBtn.onclick = () => {
        initFilterModal();
        filterModal.classList.add('active');
    };

    closeModal.onclick = () => filterModal.classList.remove('active');
    
    window.onclick = (event) => {
        if (event.target == filterModal) filterModal.classList.remove('active');
    };

    applyFilters.onclick = () => {
        const checkboxes = tagChecklist.querySelectorAll('input[type="checkbox"]:checked');
        selectedTags = Array.from(checkboxes).map(cb => cb.value);
        performFilter();
        filterModal.classList.remove('active');
    };

    resetFilters.onclick = () => {
        const checkboxes = tagChecklist.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        selectedTags = [];
        performFilter();
    };

    searchInput.oninput = performFilter;

    // Navigation
    function showDetail(item) {
        document.getElementById('detailImage').src = item.image;
        document.getElementById('detailTitle').textContent = item.title;
        document.getElementById('detailAuthor').innerHTML = `<i class="fas fa-user"></i> ` + item.author;
        document.getElementById('detailNarrative').textContent = item.narrative;
        document.getElementById('detailText').textContent = item.text;
        
        const tagsEl = document.getElementById('detailTags');
        tagsEl.innerHTML = item.tags.map(t => `<span class="tag">${t}</span>`).join('');

        pageDiscovery.classList.remove('active');
        pageDetail.classList.add('active');
        homeBtn.classList.remove('active');
        window.scrollTo(0, 0);
    }

    function goToHome() {
        pageDetail.classList.remove('active');
        pageDiscovery.classList.add('active');
        homeBtn.classList.add('active');
        window.scrollTo(0, 0);
    }

    backBtn.onclick = goToHome;
    homeBtn.onclick = goToHome;

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

    // Initial Render
    renderGallery(galleryData);
});
