async function purchaseProduct(productId) {
    if (!confirm('Bu ürünü satın almak istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        const data = await response.json();

        if (data.success) {
            alert('✓ ' + data.message);
            window.location.reload();
        } else {
            alert('✗ ' + data.message);
        }
    } catch (error) {
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        console.error('Purchase error:', error);
    }
}

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });
});
