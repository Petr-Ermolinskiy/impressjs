//| echo: false

(function() {
    // Progress bar functionality
    function initProgressBar() {
        // Create progress bar container
        var progressBar = document.createElement('div');
        progressBar.className = 'progress-bar-container';
        progressBar.innerHTML = '<div class="progress-bar-fill"></div>';
        document.body.appendChild(progressBar);
        
        // Update progress bar on slide change
        function updateProgressBar() {
            var steps = document.querySelectorAll('.step');
            var currentStep = document.querySelector('.step.active');
            
            if (!currentStep || steps.length === 0) return;
            
            var currentIndex = Array.from(steps).indexOf(currentStep);
            var progress = ((currentIndex + 1) / steps.length) * 100;
            
            var fill = document.querySelector('.progress-bar-fill');
            if (fill) {
                fill.style.width = progress + '%';
            }
        }
        
        // Update when impress.js changes slides
        document.addEventListener('impress:stepenter', function() {
            updateProgressBar();
        });
        
        // Initial update
        setTimeout(updateProgressBar, 100);
        
        // Also update on window resize (just in case)
        window.addEventListener('resize', updateProgressBar);
    }
    
    // Wait for impress to initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProgressBar);
    } else {
        initProgressBar();
    }
    
    // Your existing overview code
    var overviewMode = false;
    
    function toggleOverview() {
        var steps = document.querySelectorAll('.step');
        var impressApi = impress();
        
        if (!overviewMode) {
            var currentStep = document.querySelector('.step.active');
            var currentIndex = Array.from(steps).indexOf(currentStep);
            
            document.body.classList.add('overview-mode');
            steps.forEach(function(step, i) {
                step.style.transition = 'all 0.3s ease';
                step.style.opacity = '0.5';
                step.style.transform = 'scale(0.3) translate(0, 0)';
                step.style.cursor = 'pointer';
                step.onclick = function() {
                    impressApi.goto(i);
                    toggleOverview();
                };
            });
            overviewMode = true;
        } else {
            document.body.classList.remove('overview-mode');
            steps.forEach(function(step) {
                step.style.transition = '';
                step.style.opacity = '';
                step.style.transform = '';
                step.style.cursor = '';
                step.onclick = null;
            });
            overviewMode = false;
        }
    }
    
    document.addEventListener('impress:init', function() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'o' || e.key === 'O') {
                e.preventDefault();
                toggleOverview();
            }
        });
        
        var btn = document.createElement('button');
        btn.textContent = 'Overview';
        btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:#000;color:#fff;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-family:monospace;';
        btn.onclick = toggleOverview;
        document.body.appendChild(btn);
    });
})();
