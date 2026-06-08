/**
 * 高校业务认知手册 - 交互脚本 v2
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    initBusinessTabs();
    initReadingLevels();
    initBackToTop();
    highlightNumbers();
});

/* ======================================
   导航切换
   ====================================== */
function initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/* ======================================
   搜索功能
   ====================================== */
function initSearch() {
    const searchBtn = document.querySelector('.btn-search');
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');
    const backdrop = document.querySelector('.search-backdrop');
    const results = document.getElementById('searchResults');

    const searchData = [
        { title: '教务管理', desc: '教学运行、课程管理', tab: 'business', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>' },
        { title: '学生管理', desc: '学籍管理、奖助贷', tab: 'business', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
        { title: '师资队伍', desc: '人才引进、职称评审', tab: 'business', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
        { title: '科研项目', desc: '项目申报、过程管理', tab: 'business', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>' },
        { title: '学科建设', desc: '学科评估、一流学科', tab: 'business', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' },
        { title: '财务管理', desc: '预算、核算、决算', tab: 'business', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
        { title: '数据治理', desc: '数据标准、数据质量', tab: 'business', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>' },
        { title: '决策链', desc: '关键人、决策流程', tab: 'sales', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' },
        { title: '采购流程', desc: '预算来源、招投标', tab: 'sales', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
        { title: '政策驱动', desc: '教育部数据上报', tab: 'sales', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
    ];

    searchBtn.addEventListener('click', () => {
        modal.classList.add('active');
        setTimeout(() => input.focus(), 100);
    });

    backdrop.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            modal.classList.add('active');
            setTimeout(() => input.focus(), 100);
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        input.value = '';
        results.innerHTML = '';
    }

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) { results.innerHTML = ''; return; }

        const filtered = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.desc.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            results.innerHTML = '<div class="search-result-item" style="justify-content:center;color:var(--text-muted)">未找到相关内容</div>';
            return;
        }

        results.innerHTML = filtered.map(item => `
            <div class="search-result-item" data-tab="${item.tab}">
                <div class="search-result-icon">${item.icon}</div>
                <div>
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-desc">${item.desc}</div>
                </div>
            </div>
        `).join('');

        results.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', () => {
                const tab = el.dataset.tab;
                document.querySelectorAll('.nav-tab').forEach(t => {
                    t.classList.toggle('active', t.dataset.tab === tab);
                });
                document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
                document.getElementById(tab).classList.add('active');
                closeModal();
            });
        });
    });
}

/* ======================================
   业务Tab切换
   ====================================== */
function initBusinessTabs() {
    const tabs = document.querySelectorAll('.biz-tab');
    const details = document.querySelectorAll('.biz-detail');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.target;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            details.forEach(d => d.classList.remove('active'));
            document.getElementById('detail-' + target).classList.add('active');
        });
    });
}

/* ======================================
   阅读层级切换
   ====================================== */
function initReadingLevels() {
    document.querySelectorAll('.read-levels').forEach(container => {
        const btns = container.querySelectorAll('.read-btn');
        const parent = container.parentElement;
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.dataset.level;
                
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                parent.querySelectorAll('.read-content').forEach(c => c.classList.remove('active'));
                
                const target = parent.querySelector(`[id*="${level}"]`);
                if (target) target.classList.add('active');
            });
        });
    });
}

/* ======================================
   返回顶部
   ====================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 200);
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ======================================
   工具函数
   ====================================== */
function navigateToTab(tab) {
    document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ======================================
   数值自动高亮
   ====================================== */
function highlightNumbers() {
    // 选择器：段落、列表项、表格单元格
    const proseElements = document.querySelectorAll('.read-lead, .feature-list li, .role-item, .timeline-body p, .softbus-card p, .decision-row span, .policy-card p, .budget-card p');
    
    // 排除列表（不应被高亮的内容）
    const excludeSelectors = '.data-num, .data-time, .stat-number, .org-node, .tag, .biz-tag, .budget-tag';
    
    proseElements.forEach(el => {
        // 跳过已处理的元素
        if (el.querySelector('.data-num') || el.querySelector('.data-time')) return;
        if (el.closest(excludeSelectors)) return;
        
        let html = el.innerHTML;
        
        // 分割HTML为文本和标签
        const parts = html.split(/(<[^>]+>)/);
        
        const processed = parts.map(part => {
            // 跳过HTML标签
            if (part.startsWith('<')) return part;
            // 跳过已处理的内容
            if (part.includes('data-num') || part.includes('data-time')) return part;
            
            let result = part;
            
            // Step 1: 时间字段（必须在数值之前）
            // 匹配: 2025年, 2025年4月, 2025年1-4月, 2024-2025年
            result = result.replace(
                /(\d{4}(?:年(?:\d{1,2}(?:[-–]\d{1,2})?月?)?|\s*[-–]\s*\d{4}年?))/g,
                '<span class="data-time">$1</span>'
            );
            
            // Step 2: 数值范围（带单位）
            // 匹配: 22.98-24.98万, 35-45万, 1-5%
            result = result.replace(
                /(\d[\d,]*(?:\.\d+)?\s*[-–]\s*\d[\d,]*(?:\.\d+)?(?:万|%|辆|台|元|亿元|所|人次|项|个))/g,
                '<span class="data-num">$1</span>'
            );
            
            // Step 3: 单个数值（带单位）
            // 匹配: 589,107辆, 71.8%, 32%, 42万, 3,000所
            result = result.replace(
                /(\d[\d,]*(?:\.\d+)?(?:万|亿|%|‰|辆|台|元|亿元|所|人次|项|个|人|名|条))/g,
                '<span class="data-num">$1</span>'
            );
            
            // Step 4: 独立的较大数字（无单位，但看起来像统计数据）
            // 匹配: 3,000+, 147, 250+ 等
            result = result.replace(
                /(?<![a-zA-Z])(\d{1,3}(?:,\d{3})+(?:\+)?)(?![a-zA-Z\d])/g,
                '<span class="data-num">$1</span>'
            );
            result = result.replace(
                /(?<![a-zA-Z\d])(\d{2,4}(?:\+)?)(?![a-zA-Z\d%])/g,
                (match, num) => {
                    // 过滤掉年份（1900-2099）
                    if (parseInt(num) >= 1900 && parseInt(num) <= 2099) return match;
                    // 过滤掉太小的数字
                    if (parseInt(num) < 10) return match;
                    return `<span class="data-num">${num}</span>`;
                }
            );
            
            return result;
        });
        
        el.innerHTML = processed.join('');
    });
}

/* ======================================
   折叠组件交互
   ====================================== */
function toggleCollapse(header) {
    const collapsible = header.closest('.collapsible');
    collapsible.classList.toggle('expanded');
}

// 初始化折叠组件（可选：默认展开第一个）
document.addEventListener('DOMContentLoaded', () => {
    // 如果需要默认展开某个折叠组件，取消下面的注释
    // const firstCollapsible = document.querySelector('.collapsible');
    // if (firstCollapsible) {
    //     firstCollapsible.classList.add('expanded');
    // }
});
