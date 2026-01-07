// API Config
const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

// Elements
const bookContainer = document.getElementById('bookContainer');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const shelfTitle = document.getElementById('shelfTitle');
const loader = document.getElementById('loader');

// Modal Elements
const modal = document.getElementById('bookModal');
const closeModalBtn = document.querySelector('.close-modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalDesc = document.getElementById('modalDesc');
const modalDate = document.getElementById('modalDate');
const modalPages = document.getElementById('modalPages');
const modalRating = document.getElementById('modalRating');
const modalCategory = document.getElementById('modalCategory');
const modalLink = document.getElementById('modalLink');

// --- CORE FUNCTIONS ---

async function fetchBooks(query) {
    showLoader(true);
    bookContainer.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}${query}&maxResults=20`);
        const data = await response.json();

        if (data.items) {
            displayBooks(data.items);
        } else {
            bookContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Sorry, book not found.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error:", error);
        bookContainer.innerHTML = `<p style="text-align:center; color: var(--accent);">Failed to load data. Please check your internet connection.</p>`;
    } finally {
        showLoader(false);
    }
}

function displayBooks(books) {
    books.forEach(book => {
        const info = book.volumeInfo;
        
        const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover';
        const title = info.title || 'Untitled';
        const authors = info.authors ? info.authors.slice(0, 2).join(', ') : 'Unknown Author';
        const year = info.publishedDate ? info.publishedDate.substring(0, 4) : '-';

        const card = document.createElement('div');
        card.classList.add('book-card');
        
        card.innerHTML = `
            <div class="image-container">
                <img src="${thumbnail}" alt="${title}" loading="lazy">
            </div>
            <div class="card-content">
                <h3 class="book-title">${title}</h3>
                <p class="book-author">${authors}</p>
                <div class="card-footer">
                    <span>${year}</span>
                    <span><i class="fas fa-chevron-right"></i></span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => openModal(info));
        
        bookContainer.appendChild(card);
    });
}

// --- MODAL LOGIC ---

function openModal(info) {
    const highResImage = info.imageLinks?.thumbnail 
        ? info.imageLinks.thumbnail.replace('&edge=curl', '') 
        : 'https://via.placeholder.com/128x192';
    
    modalImage.src = highResImage;
    modalTitle.textContent = info.title;
    modalAuthor.textContent = info.authors ? info.authors.join(', ') : 'Unknown Author';
    
    modalDate.textContent = info.publishedDate || '-';
    modalPages.textContent = info.pageCount || '-';
    modalCategory.textContent = info.categories ? info.categories[0] : 'General';
    
    if(info.averageRating) {
        modalRating.innerHTML = `<i class="fas fa-star" style="color:#FFD700"></i> ${info.averageRating}`;
    } else {
        modalRating.innerHTML = `-`;
    }

    const descText = info.description || 'No description available for this book.';
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = descText;
    modalDesc.textContent = tempDiv.textContent || tempDiv.innerText || "";

    modalLink.href = info.previewLink;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

// --- EVENT LISTENERS ---

closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        shelfTitle.textContent = `Search Results: "${query}"`;
        fetchBooks(query);
    }
});

// --- UTILS ---
function showLoader(isShow) {
    if (isShow) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks('subject:architecture'); 
    
    if (!document.querySelector('footer')) {
        const footer = document.createElement('footer');
        footer.style.textAlign = 'center';
        footer.style.padding = '2rem';
        footer.style.marginTop = '2rem';
        footer.style.color = '#777';
        footer.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-[#00ADB5]">Bama Maulana Wibisana</h2>
            <p>&copy; ${new Date().getFullYear()} All rights reserved. Built with curiosity and passion.</p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem;">Powered by Google Books API</p>
        `;
        document.body.appendChild(footer);
    }
});