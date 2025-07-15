document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const achievementsChartCtx = document.getElementById('achievementsChart').getContext('2d');
    let achievementsChart;

    const achievementsData = {
        labels: ['Security', 'Performance', 'Feature Development', 'Troubleshooting'],
        datasets: [{
            label: 'Achievement Focus',
            data: [3, 2, 2, 2],
            backgroundColor: ['#a1a1aa', '#87ceeb', '#ff7f50', '#d4d4d8'],
            highlightTextColor: ['#ffffff', '#1e293b', '#ffffff', '#1e293b'],
            borderWidth: 4,
        }]
    };

    function updateChartTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        const chartBorderColor = isDark ? '#1a1410' : '#fdf6f0';
        const legendColor = isDark ? '#a8a29e' : '#475569';

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: { position: 'bottom', labels: { padding: 20, color: legendColor, font: { size: 14 } } },
                tooltip: { bodyFont: { size: 14 }, titleFont: { size: 16 } }
            }
        };

        if (achievementsChart) {
            achievementsChart.destroy();
        }
        achievementsData.datasets[0].borderColor = chartBorderColor;
        achievementsChart = new Chart(achievementsChartCtx, { type: 'doughnut', data: achievementsData, options: chartOptions });
    };

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        } else {
            document.body.classList.remove('dark-mode');
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        }
        updateChartTheme();
    };

    function toggleTheme() {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    themeToggleBtn.addEventListener('click', toggleTheme);

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.style.display === 'none' || mobileMenu.style.display === '';
        mobileMenu.style.display = isHidden ? 'block' : 'none';
    });

    const experienceItems = document.querySelectorAll('.experience-list li');
    const resetButton = document.getElementById('reset-filter');
    let activeFilter = null;

    function filterAchievements(category, color, textColor) {
        activeFilter = category;
        experienceItems.forEach(item => {
            if (item.dataset.category === category) {
                item.style.backgroundColor = color;
                item.style.borderColor = color;
                item.style.color = textColor;
                item.style.transform = 'scale(1.02)';
            } else {
                item.style.backgroundColor = '';
                item.style.borderColor = '';
                item.style.color = '';
                item.style.transform = '';
            }
        });
        resetButton.style.display = 'block';
    }

    function resetFilter() {
        activeFilter = null;
        experienceItems.forEach(item => {
            item.style.backgroundColor = '';
            item.style.borderColor = '';
            item.style.color = '';
            item.style.transform = '';
        });
        resetButton.style.display = 'none';
    }

    document.getElementById('achievementsChart').onclick = (evt) => {
        const activePoints = achievementsChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
        if (activePoints.length) {
            const firstPoint = activePoints[0];
            const label = achievementsChart.data.labels[firstPoint.index];
            const color = achievementsChart.data.datasets[0].backgroundColor[firstPoint.index];
            const textColor = achievementsChart.data.datasets[0].highlightTextColor[firstPoint.index];
            if (activeFilter === label) {
                resetFilter();
            } else {
                filterAchievements(label, color, textColor);
            }
        }
    };

    resetButton.addEventListener('click', resetFilter);
});