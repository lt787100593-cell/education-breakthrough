/**
 * 高校业务认知手册 - 交互脚本 v2
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
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
function navigateToTab(tab, bizTarget) {
    // 切换主导航Tab
    document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    
    // 如果指定了业务专题，切换到对应专题
    if (bizTarget) {
        document.querySelectorAll('.biz-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.target === bizTarget);
        });
        document.querySelectorAll('.biz-detail').forEach(d => d.classList.remove('active'));
        document.getElementById('detail-' + bizTarget).classList.add('active');
    }
    
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
    const toggleSpan = header.querySelector('.collapsible-toggle span');
    if (toggleSpan) {
        toggleSpan.textContent = collapsible.classList.contains('expanded') ? '收起详情' : '展开详情';
    }
}

// 初始化折叠组件
document.addEventListener('DOMContentLoaded', () => {
    // 为默认展开的折叠组件设置按钮文本
    document.querySelectorAll('.collapsible.expanded').forEach(collapsible => {
        const toggleSpan = collapsible.querySelector('.collapsible-toggle span');
        if (toggleSpan) {
            toggleSpan.textContent = '收起详情';
        }
    });
});
