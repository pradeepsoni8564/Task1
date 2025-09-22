
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            
            // Toggle hamburger to X
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('mobile-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Scroll-based header styling
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .feature-item, .contact-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Product card interactions
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const overlay = card.querySelector('.product-overlay');
        const buttons = overlay ? overlay.querySelectorAll('.btn') : [];
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                if (this.textContent.includes('View')) {
                    showProductModal(card);
                } else if (this.textContent.includes('Inquire')) {
                    openWhatsApp(card);
                }
            });
        });
        
        // Quote button functionality
        const quoteBtn = card.querySelector('.btn-premium');
        if (quoteBtn) {
            quoteBtn.addEventListener('click', function() {
                openWhatsApp(card);
            });
        }
    });

    // Contact button functionality
    const contactButtons = document.querySelectorAll('.btn');
    
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent.toLowerCase();
            
            if (text.includes('directions')) {
                openGoogleMaps();
            } else if (text.includes('whatsapp')) {
                openWhatsApp();
            } else if (text.includes('schedule') || text.includes('consultation')) {
                openBookingForm();
            } else if (text.includes('call')) {
                window.location.href = 'tel:+919876543210';
            } else if (text.includes('email')) {
                window.location.href = 'mailto:info@shreejigold.com';
            }
        });
    });

    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });
});

// Show product modal
function showProductModal(card) {
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const image = card.querySelector('img').src;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-image">
                    <img src="${image}" alt="${title}">
                </div>
                <div class="modal-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="modal-actions">
                        <button class="btn btn-luxury" onclick="openWhatsApp()">Get Quote</button>
                        <button class="btn btn-elegant" onclick="openBookingForm()">Schedule Visit</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => document.body.removeChild(modal));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) document.body.removeChild(modal);
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Restore body scroll when modal closes
    const observer = new MutationObserver(() => {
        if (!document.contains(modal)) {
            document.body.style.overflow = '';
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true });
}

// Open WhatsApp
function openWhatsApp(card = null) {
    let message = "Hello! I'm interested in your gold jewelry collection.";
    
    if (card) {
        const title = card.querySelector('h3').textContent;
        message = `Hello! I'm interested in your ${title} collection and would like to know more about pricing and availability.`;
    }
    
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Open Google Maps
function openGoogleMaps() {
    const address = "123 Jewelry Street, Zaveri Bazaar, Mumbai, Maharashtra 400002";
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
}

// Open booking form
function openBookingForm() {
    // Simple booking form modal
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3>Schedule Your Visit</h3>
                <form class="booking-form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email">
                    </div>
                    <div class="form-group">
                        <label>Preferred Date</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Preferred Time</label>
                        <select required>
                            <option value="">Select Time</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Message (Optional)</label>
                        <textarea placeholder="Let us know what you're looking for..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-luxury">Schedule Visit</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => document.body.removeChild(modal));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) document.body.removeChild(modal);
    });
    
    // Form submission
    const form = modal.querySelector('.booking-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Create WhatsApp message
        const message = `Hello! I'd like to schedule a visit to your store.
        
Name: ${data.name || form.querySelector('input[type="text"]').value}
Phone: ${data.phone || form.querySelector('input[type="tel"]').value}
Email: ${data.email || form.querySelector('input[type="email"]').value}
Preferred Date: ${data.date || form.querySelector('input[type="date"]').value}
Preferred Time: ${data.time || form.querySelector('select').value}
Message: ${data.message || form.querySelector('textarea').value}

Looking forward to visiting your store!`;
        
        const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        document.body.removeChild(modal);
    });
}

// Add CSS for modals and animations
const style = document.createElement('style');
style.textContent = `
    .product-modal,
    .booking-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease-out;
    }
    
    .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 1;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 12px 12px 0 0;
    }
    
    .modal-info {
        padding: 30px;
    }
    
    .modal-info h3 {
        font-family: 'Playfair Display', serif;
        font-size: 24px;
        margin-bottom: 15px;
        color: var(--foreground);
    }
    
    .modal-info p {
        color: var(--muted-foreground);
        margin-bottom: 25px;
        line-height: 1.6;
    }
    
    .modal-actions {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    
    .booking-form {
        padding: 30px;
    }
    
    .booking-form h3 {
        font-family: 'Playfair Display', serif;
        font-size: 24px;
        margin-bottom: 25px;
        text-align: center;
        color: var(--foreground);
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: var(--foreground);
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
    }
    
    .form-group textarea {
        height: 80px;
        resize: vertical;
    }
    
    .animate-in {
        animation: slideUp 0.6s ease-out;
    }
    
    .header.scrolled {
        background: rgba(26, 22, 17, 0.95);
        backdrop-filter: blur(10px);
    }
    
    .header {
        transition: all 0.3s ease;
    }
    
    .btn.loading {
        position: relative;
        color: transparent;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    @media (max-width: 768px) {
        .nav-links.mobile-active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--secondary);
            flex-direction: column;
            padding: 20px;
            border-top: 1px solid rgba(255, 215, 0, 0.2);
            animation: slideDown 0.3s ease-out;
        }
        
        .modal-actions {
            flex-direction: column;
        }
        
        .modal-actions .btn {
            width: 100%;
            justify-content: center;
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);