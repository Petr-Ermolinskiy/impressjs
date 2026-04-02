//| echo: false

(function () {
    var overviewMode = false;
    var lastRegularStep = null;

    function getImpressRoot() {
        return document.getElementById('impress');
    }

    function getRegularSteps() {
        return Array.from(document.querySelectorAll('.step')).filter(function (step) {
            return step.id !== 'overview';
        });
    }

    function getActiveStep() {
        return document.querySelector('.step.active');
    }

    function getActiveRegularStep() {
        var active = getActiveStep();
        if (active && active.id !== 'overview') {
            return active;
        }
        return lastRegularStep || getRegularSteps()[0] || null;
    }

    function ensureOverviewStep() {
        if (document.getElementById('overview')) return;

        var root = getImpressRoot();
        var steps = getRegularSteps();
        if (!root || !steps.length) return;

        var xs = [];
        var ys = [];

        steps.forEach(function (step) {
            xs.push(parseFloat(step.getAttribute('data-x')) || 0);
            ys.push(parseFloat(step.getAttribute('data-y')) || 0);
        });

        var minX = Math.min.apply(null, xs);
        var maxX = Math.max.apply(null, xs);
        var minY = Math.min.apply(null, ys);
        var maxY = Math.max.apply(null, ys);

        var centerX = (minX + maxX) / 2;
        var centerY = (minY + maxY) / 2;

        var viewportW = window.innerWidth || 1920;
        var viewportH = window.innerHeight || 1080;

        var spreadX = (maxX - minX) + viewportW;
        var spreadY = (maxY - minY) + viewportH;

        var scaleX = spreadX / viewportW;
        var scaleY = spreadY / viewportH;
        var overviewScale = Math.max(scaleX, scaleY, 1) * 1.2;

        var overview = document.createElement('div');
        overview.id = 'overview';
        overview.className = 'step';
        overview.setAttribute('data-x', centerX);
        overview.setAttribute('data-y', centerY);
        overview.setAttribute('data-z', 0);
        overview.setAttribute('data-scale', overviewScale);
        overview.setAttribute('aria-hidden', 'true');

        root.appendChild(overview);
    }

    function gotoStep(step) {
        if (typeof impress !== 'function') return;
        try {
            impress().goto(step);
        } catch (e) {
            // no-op
        }
    }

    // Progress bar functionality
    function initProgressBar() {
        if (document.querySelector('.progress-bar-container')) return;

        // Create progress bar container
        var progressBar = document.createElement('div');
        progressBar.className = 'progress-bar-container';
        progressBar.innerHTML = '<div class="progress-bar-fill"></div>';
        document.body.appendChild(progressBar);

        // Update progress bar on slide change
        function updateProgressBar() {
            var steps = getRegularSteps();
            var currentStep = getActiveRegularStep();

            if (!currentStep || steps.length === 0) return;

            var currentIndex = steps.indexOf(currentStep);
            if (currentIndex < 0) currentIndex = 0;

            var progress = ((currentIndex + 1) / steps.length) * 100;

            var fill = document.querySelector('.progress-bar-fill');
            if (fill) {
                fill.style.width = progress + '%';
                fill.setAttribute('data-progress', Math.round(progress) + '%');
            }
        }

        // Update when impress.js changes slides
        document.addEventListener('impress:stepenter', function (e) {
            if (e.target && e.target.id !== 'overview') {
                lastRegularStep = e.target;
            }
            updateProgressBar();
        });

        // Initial update
        setTimeout(updateProgressBar, 100);

        // Also update on window resize
        window.addEventListener('resize', updateProgressBar);
    }

    function enterOverview() {
        ensureOverviewStep();

        var active = getActiveRegularStep();
        if (active) {
            lastRegularStep = active;
        }

        overviewMode = true;
        document.body.classList.add('overview-mode');

        var overviewStep = document.getElementById('overview');
        if (overviewStep) {
            gotoStep(overviewStep);
        }
    }

    function exitOverview(targetStep) {
        overviewMode = false;
        document.body.classList.remove('overview-mode');

        var step = targetStep || lastRegularStep || getRegularSteps()[0];
        if (step) {
            lastRegularStep = step;
            gotoStep(step);
        }
    }

    function toggleOverview() {
        if (overviewMode) {
            exitOverview();
        } else {
            enterOverview();
        }
    }

    function initControls() {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'o' || e.key === 'O' || e.key === 'о' || e.key === 'О') {
                e.preventDefault();
                toggleOverview();
            }

            if (e.key === 'Escape' && overviewMode) {
                e.preventDefault();
                exitOverview();
            }
        });

        document.addEventListener('click', function (e) {
            if (!overviewMode) return;

            var step = e.target.closest('.step');
            if (!step || step.id === 'overview') return;

            e.preventDefault();
            e.stopPropagation();

            exitOverview(step);
        }, true);
    }

    function init() {
        ensureOverviewStep();
        initProgressBar();
        initControls();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
