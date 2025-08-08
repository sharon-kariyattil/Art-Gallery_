document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            // --- CORE ---
            this.checkLoginStatus(); // Handles dynamic nav bar
            this.handleModal();      // Handles the "View Details" popup

            // --- FORMS ---
            this.handleAuthForms();  // Handles login and signup
            this.handleUploadForm(); // Handles the art upload form

            // --- FILTERS ---
            this.initMainGalleryFilter();   // Initializes filter on the main gallery page
            this.initMyCollectionFilter();  // Initializes filter on the "My Collection" page
            
            // --- DYNAMIC CONTENT ---
            this.displayMyCollection(); // Displays user-specific art
        },

        //==================== 1. AUTH & NAVIGATION ====================//
        checkLoginStatus() {
            const loggedInUser = localStorage.getItem('loggedInUser');
            const navList = document.getElementById('nav-list');
            if (!navList) return;

            let navLinks = `
                <li class="nav__item"><a href="gallery.html" class="nav__link">Home</a></li>
                <li class="nav__item"><a href="art-display.html" class="nav__link">Gallery</a></li>
            `;

            if (loggedInUser) {
                navLinks += `
                    <li class="nav__item"><a href="upload.html" class="nav__link">Upload Art</a></li>
                    <li class="nav__item"><a href="my-collection.html" class="nav__link">My Collection</a></li>
                    <li class="nav__item"><a href="#" id="logout-btn" class="nav__link">Logout</a></li>
                `;
            } else {
                navLinks += `
                    <li class="nav__item"><a href="login.html" class="nav__link">Login</a></li>
                    <li class="nav__item"><a href="signup.html" class="nav__link">Sign Up</a></li>
                `;
            }
            navList.innerHTML = navLinks;

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to log out?')) {
                        localStorage.removeItem('loggedInUser');
                        alert('You have been logged out.');
                        window.location.href = 'login.html';
                    }
                });
            }
        },

        handleAuthForms() {
            const signupForm = document.getElementById('signup-form');
            const loginForm = document.getElementById('login-form');

            if (signupForm) {
                signupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;

                    if (!name || !email || !password) {
                        alert('Please fill out all fields.');
                        return;
                    }

                    let users = JSON.parse(localStorage.getItem('galleryUsers')) || [];

                    // THE FIX
                    if (users.some(user => user.email === email)) {
                    alert('An account with this email already exists. Please login.');
                    window.location.href = 'login.html'; // This line was missing
                    return;
                }

                    users.push({ name, email, password });
                    localStorage.setItem('galleryUsers', JSON.stringify(users));
                    
                    alert('Sign up successful! Please log in.');
                    window.location.href = 'login.html';
                });
            }

            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    
                    let users = JSON.parse(localStorage.getItem('galleryUsers')) || [];
                    const user = users.find(u => u.email === email && u.password === password);

                    if (user) {
                        localStorage.setItem('loggedInUser', JSON.stringify(user));
                        alert(`Welcome back, ${user.name}!`);
                        window.location.href = 'my-collection.html';
                    } else {
                        alert('Invalid email or password.');
                    }
                });
            }
        },

        //==================== 2. ART MANAGEMENT ====================//
        handleUploadForm() {
            const uploadForm = document.getElementById('upload-form');
            if (!uploadForm) return;

            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            const authorInput = document.getElementById('art-author');

            if (loggedInUser) {
                authorInput.value = loggedInUser.name;
            } else {
                alert('You must be logged in to upload art.');
                window.location.href = 'login.html';
                return;
            }

            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('art-title').value;
                const description = document.getElementById('art-description').value;
                const category = document.getElementById('art-category').value;
                const author = authorInput.value;
                const fileInput = document.getElementById('art-file');
                
                if (fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageSrc = event.target.result;
                        const userArtKey = `artCollection_${loggedInUser.email}`;
                        let myArt = JSON.parse(localStorage.getItem(userArtKey)) || [];
                        
                        myArt.push({ title, description, category, author, imageSrc });
                        localStorage.setItem(userArtKey, JSON.stringify(myArt));
                        
                        alert('Artwork submitted successfully!');
                        window.location.href = 'my-collection.html';
                    }
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    alert('Please select an image file to upload.');
                }
            });
        },
        
        displayMyCollection() {
            const collectionContainer = document.getElementById('my-collection-container');
            if (!collectionContainer) return;

            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                window.location.href = 'login.html';
                return;
            }
            
            document.getElementById('collection-title').textContent = `${loggedInUser.name}'s Collection`;
            const userArtKey = `artCollection_${loggedInUser.email}`;
            const myArt = JSON.parse(localStorage.getItem(userArtKey)) || [];

            if (myArt.length > 0) {
                const artHtml = myArt.map(art => `
                    <div class="art-display__card mix ${art.category}">
                        <div class="art-display__img-wrapper"><img src="${art.imageSrc}" alt="${art.title}" class="art-display__img"></div>
                        <div class="art-display__data">
                            <h3 class="art-display__title">${art.title}</h3>
                            <p class="art-display__category">Category: ${art.category}</p>
                            <button class="button view-details-btn" data-title="${art.title}" data-description="${art.description}">View Details</button>
                        </div>
                    </div>
                `).join('');
                collectionContainer.insertAdjacentHTML('afterbegin', artHtml);
            } else {
                const failMessageEl = collectionContainer.querySelector('.mixitup-fail');
                if (failMessageEl) {
                    failMessageEl.innerHTML = `<h3>You haven't uploaded any artwork yet.</h3><a href="upload.html" class="button" style="margin-top:1rem;">Upload your first piece!</a>`;
                }
            }
        },

        //==================== 3. FILTERS & MODAL ====================//
        initMyCollectionFilter() {
            const container = document.getElementById('my-collection-container');
            const filterControls = document.getElementById('my-collection-filters');
            if (!container || !filterControls) return;

            const artCards = container.querySelectorAll('.art-display__card');
            if (artCards.length === 0) {
                filterControls.style.display = 'none';
                return;
            }

            mixitup(container, {
                selectors: { target: '.art-display__card' },
                animation: { duration: 300 },
                controls: { live: true, scope: 'local' }
            });
        },

        initMainGalleryFilter() {
            const container = document.querySelector('.art-display__container:not(#my-collection-container)');
            if (!container) return;

            const filterControls = container.previousElementSibling; // Assumes filters are right before container
            
            var mixer = mixitup(container, {
                selectors: { target: '.art-display__card' },
                animation: { duration: 400 }
            });
            
            if (filterControls) {
                const filterButtons = filterControls.querySelectorAll('.art-display__item');
                filterButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        filterButtons.forEach(b => b.classList.remove('active-work'));
                        this.classList.add('active-work');
                    });
                });
            }
        },
        
        handleModal() {
            const modal = document.getElementById('art-modal');
            if (!modal) return;

            const modalTitle = document.getElementById('modal-title');
            const modalDescription = document.getElementById('modal-description');
            const closeBtn = document.querySelector('.modal-close-btn');

            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('view-details-btn')) {
                    const button = e.target;
                    modalTitle.textContent = button.dataset.title;
                    modalDescription.textContent = button.dataset.description;
                    modal.style.display = 'block';
                }
            });

            closeBtn.onclick = () => { modal.style.display = 'none'; }
            window.onclick = (e) => {
                if (e.target == modal) {
                    modal.style.display = 'none';
                }
            }
        }
    };

    App.init();
});