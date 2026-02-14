/**
 * ProKanban Elite Workspace Engine (Intelligence Update)
 * Version: 4.1 (Stability + Feature Completion)
 */

class ProKanban {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('pk_elite_tasks')) || [];
        this.archivedTasks = JSON.parse(localStorage.getItem('pk_elite_archived')) || [];
        this.history = JSON.parse(localStorage.getItem('pk_elite_logs')) || ["Genesis workspace initialized."];
        this.currentUser = JSON.parse(localStorage.getItem('pk_current_user')) || null;

        this.theme = localStorage.getItem('pk_theme') || 'light';
        this.currentView = 'board';
        this.activeFilter = null;
        this.dragId = null;

        this.avatars = [
            { id: 'u1', name: 'Felix', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix' },
            { id: 'u2', name: 'Aneka', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka' },
            { id: 'u3', name: 'Jasper', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jasper' },
            { id: 'u4', name: 'Luna', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Luna' }
        ];

        this.init();
    }

    init() {
        try {
            this.applyTheme();
            this.updateAuthUI();
            this.render();
            this.renderLogs();
            this.renderAvatarSelector();
            this.setupEventListeners();
            this.startBackgroundServices();
        } catch (e) {
            console.error("ProKanban initialization failed:", e);
        }
    }

    // --- Authentication Engine ---
    handleAuth(e) {
        e.preventDefault();
        const username = document.getElementById('auth-username').value.trim();
        const errorEl = document.getElementById('auth-error');

        if (username.length < 2) {
            errorEl.innerText = "Identity alias too short.";
            return;
        }

        let userAvatar = this.avatars.find(a => a.name.toLowerCase() === username.toLowerCase());
        if (!userAvatar) {
            userAvatar = {
                id: 'gen-' + Date.now(),
                name: username,
                url: `https://api.dicebear.com/7.x/notionists/svg?seed=${username}`
            };
        }

        this.currentUser = userAvatar;
        localStorage.setItem('pk_current_user', JSON.stringify(this.currentUser));

        this.log(`Authorized access for ${username}`);
        this.updateAuthUI();
        this.render();
    }

    logout() {
        if (confirm("Terminate active session?")) {
            this.log(`Session terminated for ${this.currentUser.name}`);
            this.currentUser = null;
            localStorage.removeItem('pk_current_user');
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const gateway = document.getElementById('auth-gateway');
        const profile = document.getElementById('user-profile');
        const avatarImg = document.getElementById('current-user-avatar');
        const nameText = document.getElementById('current-user-name');
        const body = document.body;

        if (this.currentUser) {
            if (gateway) gateway.style.display = 'none';
            if (profile) profile.style.display = 'flex';
            if (avatarImg) avatarImg.src = this.currentUser.url;
            if (nameText) nameText.innerText = this.currentUser.name;
            body.classList.remove('blur-app');
        } else {
            if (gateway) gateway.style.display = 'flex';
            if (profile) profile.style.display = 'none';
            body.classList.add('blur-app');
        }
    }

    // --- State & Persistence ---
    save() {
        localStorage.setItem('pk_elite_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('pk_elite_archived', JSON.stringify(this.archivedTasks));
        localStorage.setItem('pk_elite_logs', JSON.stringify(this.history));
        this.render();
        this.renderLogs();
    }

    // --- Professional Prompt Engine ---
    customConfirm(title, msg, icon = '⚠️') {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirm-modal');
            const titleEl = document.getElementById('confirm-title');
            const msgEl = document.getElementById('confirm-msg');
            const iconEl = document.getElementById('confirm-icon');
            const btnCancel = document.getElementById('confirm-cancel');
            const btnProceed = document.getElementById('confirm-proceed');

            titleEl.innerText = title;
            msgEl.innerText = msg;
            iconEl.innerText = icon;
            modal.classList.add('active');

            const cleanup = (val) => {
                modal.classList.remove('active');
                btnCancel.removeEventListener('click', onCancel);
                btnProceed.removeEventListener('click', onProceed);
                resolve(val);
            };

            const onCancel = () => cleanup(false);
            const onProceed = () => cleanup(true);

            btnCancel.addEventListener('click', onCancel);
            btnProceed.addEventListener('click', onProceed);
        });
    }

    // --- Background Operations Hub ---
    startBackgroundServices() {
        console.log("Heartbeat Service: Operational");
        // Check every 5 minutes
        setInterval(() => this.runHeartbeat(), 5 * 60 * 1000);
        // Initial run
        setTimeout(() => this.runHeartbeat(), 2000);
    }

    runHeartbeat() {
        if (!this.currentUser) return;
        this.checkDeadlines();
        this.watchStaleTasks();
        this.optimizeStorage();
        this.rebalanceWorkload();
    }

    checkDeadlines() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

        this.tasks.forEach(task => {
            if (task.due && task.status !== 'done') {
                const dueDate = new Date(task.due);
                if (dueDate > now && dueDate <= tomorrow) {
                    if (!this.history.some(log => log.includes(`CRITICAL DEADLINE: ${task.name}`))) {
                        this.log(`CRITICAL DEADLINE: ${task.name} is due within 24 hours!`, true);
                    }
                }
            }
        });
    }

    watchStaleTasks() {
        const now = Date.now();
        const staleLimit = 48 * 60 * 60 * 1000; // 48 Hours

        this.tasks.forEach(task => {
            if (task.status === 'inprogress') {
                // Approximate age from ID if no updated field
                const age = task.updatedAt ? (now - new Date(task.updatedAt).getTime()) : (now - parseInt(task.id.split('-')[1]));
                if (age > staleLimit) {
                    if (!this.history.some(log => log.includes(`STALE UNIT: ${task.name}`))) {
                        this.log(`STALE UNIT: ${task.name} has been in Processing for over 48h. Examine for bottlenecks.`, true);
                    }
                }
            }
        });
    }

    rebalanceWorkload() {
        const userTasks = this.getUserTasks();
        const counts = { todo: 0, inprogress: 0, done: 0 };
        userTasks.forEach(t => counts[t.status]++);

        const activeTotal = counts.todo + counts.inprogress;
        if (activeTotal > 5) { // Threshold for "High Workload"
            if (!this.history.some(log => log.includes("HIGH CAPACITY ALERT"))) {
                this.log("HIGH CAPACITY ALERT: Active load exceeding nominal thresholds. consider rebalancing tasks.");
            }
        }
    }

    optimizeStorage() {
        // Keep only top 50 logs to prevent storage bloating
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
            localStorage.setItem('pk_elite_logs', JSON.stringify(this.history));
            console.log("Storage Service: Pruned historical logs.");
        }
    }

    log(msg, urgent = false) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const prefix = urgent ? "🚨 " : "";
        this.history.unshift(`[${time}] ${prefix}${msg}`);
        this.renderLogs();
        localStorage.setItem('pk_elite_logs', JSON.stringify(this.history));
    }

    // --- Core Navigation ---
    switchView(view, event) {
        if (event) event.preventDefault();
        this.currentView = view;

        const views = ['board-view', 'list-view', 'analytics-view', 'archive-view'];
        views.forEach(v => {
            const el = document.getElementById(v);
            if (el) {
                const isSelected = (v === view || v.startsWith(view));
                if (isSelected) {
                    el.style.display = (view === 'board') ? 'grid' : 'block';
                } else {
                    el.style.display = 'none';
                }
            }
        });

        const titleMap = {
            'board': 'Main Board',
            'list': 'Detailed View',
            'analytics': 'Business Insights',
            'archive': 'Archive Repository'
        };
        const titleEl = document.getElementById('current-view-title');
        if (titleEl) titleEl.innerText = titleMap[view] || 'Workspace';

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.id === `nav-${view}`) item.classList.add('active');
        });

        this.render();
    }

    setFilter(type, event) {
        if (event) event.preventDefault();
        this.activeFilter = this.activeFilter === type ? null : type;

        // Update UI state for sidebar items
        document.querySelectorAll('.nav-group a').forEach(el => {
            if (el.innerText.includes('Urgent Focus')) {
                el.classList.toggle('active', this.activeFilter === 'high');
            }
        });

        this.render();
        this.log(`Critical layer: ${this.activeFilter === 'high' ? 'High Urgency Focus' : 'Standard Exposure'}`);
    }

    showArchive(event) {
        if (event) event.preventDefault();
        this.switchView('archive');
    }

    // --- Dynamic Renderers ---
    render() {
        if (!this.currentUser) return;

        this.renderWorkload();

        if (this.currentView === 'board') this.renderBoard();
        else if (this.currentView === 'list') this.renderList();
        else if (this.currentView === 'analytics') this.renderAnalytics();
        else if (this.currentView === 'archive') this.renderArchive();

        if (window.lucide) lucide.createIcons();
    }

    getUserTasks() {
        return this.tasks.filter(t => t.ownerId === this.currentUser.id);
    }

    renderWorkload() {
        const root = document.getElementById('workload-stats');
        if (!root) return;

        const statuses = ['todo', 'inprogress', 'done'];
        const userTasks = this.getUserTasks();
        const totalCount = userTasks.length || 1;

        root.innerHTML = statuses.map(s => {
            const count = userTasks.filter(t => t.status === s).length;
            const pct = (count / totalCount) * 100;
            return `
                <div class="workload-item">
                    <div class="w-header">
                        <span>${s === 'todo' ? 'Backlog' : s === 'inprogress' ? 'In Work' : 'Shipped'}</span>
                        <span>${Math.round(pct)}%</span>
                    </div>
                    <div class="w-bar-bg">
                        <div class="w-bar-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAnalytics() {
        const userTasks = this.getUserTasks();
        const total = userTasks.length;
        const done = userTasks.filter(t => t.status === 'done').length;
        const high = userTasks.filter(t => t.priority === 'high').length;

        const updateText = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        updateText('stat-total', total);
        updateText('stat-done', done);
        updateText('stat-high', high);

        const velocity = total === 0 ? 0 : (done / total) * 100;
        const bar = document.getElementById('stat-progress-bar');
        if (bar) bar.innerHTML = `<div class="w-bar-bg"><div class="w-bar-fill" style="width: ${velocity}%"></div></div>`;

        const allSubtasks = userTasks.flatMap(t => t.subtasks || []);
        const finishedSub = allSubtasks.filter(s => s.done).length;
        const subPct = allSubtasks.length === 0 ? 0 : (finishedSub / allSubtasks.length) * 100;
        const ring = document.getElementById('subtask-master-progress');
        if (ring) ring.innerHTML = `<div class="master-fill" style="width: ${subPct}%"></div>`;
    }

    renderBoard() {
        const cols = ['todo', 'inprogress', 'done'];
        const search = document.getElementById('global-search')?.value.toLowerCase() || "";
        const userTasks = this.getUserTasks();

        cols.forEach(status => {
            const container = document.getElementById(`list-${status}`);
            if (!container) return;
            container.innerHTML = "";
            let filtered = userTasks.filter(t => t.status === status && t.name.toLowerCase().includes(search));

            if (this.activeFilter === 'high') {
                filtered = filtered.filter(t => t.priority === 'high');
            }

            filtered.forEach(task => container.appendChild(this.createTaskCard(task)));
            const badge = document.getElementById(`badge-${status}`);
            if (badge) badge.innerText = filtered.length;
        });
    }

    renderList() {
        const tbody = document.getElementById('list-body');
        if (!tbody) return;
        tbody.innerHTML = "";
        let userTasks = this.getUserTasks();

        if (this.activeFilter === 'high') {
            userTasks = userTasks.filter(t => t.priority === 'high');
        }

        userTasks.forEach(task => {
            const row = document.createElement('tr');
            const avatar = this.avatars.find(a => a.id === task.assignee)?.url || `https://api.dicebear.com/7.x/notionists/svg?seed=${task.ownerId}`;
            row.innerHTML = `
                <td><div style="font-weight:700">${task.name}</div></td>
                <td><img src="${avatar}" class="u-avatar"></td>
                <td><span class="status-badge">${task.status}</span></td>
                <td><span class="category-badge cat-${task.category}">${task.category}</span></td>
                <td>${task.due ? this.formatDate(task.due) : '-'}</td>
                <td class="action-cell">
                    <div class="actions-wrapper">
                        <button class="btn-icon-nav" onclick="app.openEditModal('${task.id}')"><i data-lucide="edit-3"></i></button>
                        <button class="btn-icon-nav" style="color:#ef4444" onclick="app.deleteTask('${task.id}')"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderArchive() {
        const tbody = document.getElementById('archive-body');
        if (!tbody) return;
        tbody.innerHTML = "";

        const userArchived = this.archivedTasks.filter(t => t.ownerId === this.currentUser.id);

        if (userArchived.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 3rem; color: var(--text-muted)">No intelligence units in archive.</td></tr>`;
            return;
        }

        userArchived.forEach(task => {
            const row = document.createElement('tr');
            const avatar = this.avatars.find(a => a.id === task.assignee)?.url || `https://api.dicebear.com/7.x/notionists/svg?seed=${task.ownerId}`;
            row.innerHTML = `
                <td><div style="font-weight:700">${task.name}</div></td>
                <td><img src="${avatar}" class="u-avatar"></td>
                <td><span class="status-badge">${task.status}</span></td>
                <td><span class="category-badge cat-${task.category}">${task.category}</span></td>
                <td>${task.archivedAt ? this.formatDate(task.archivedAt) : '-'}</td>
                <td class="action-cell">
                    <div class="actions-wrapper">
                        <button class="btn-icon-nav" title="Restore Task" onclick="app.restoreTask('${task.id}')"><i data-lucide="refresh-cw"></i></button>
                        <button class="btn-icon-nav" style="color:#ef4444" title="Purge Permanently" onclick="app.purgeTask('${task.id}')"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        if (window.lucide) lucide.createIcons();
    }

    createTaskCard(task) {
        const div = document.createElement('div');
        div.className = 'task';
        div.draggable = true;
        const total = task.subtasks?.length || 0;
        const done = task.subtasks?.filter(s => s.done).length || 0;
        const pct = total === 0 ? 0 : (done / total) * 100;
        const avatar = this.avatars.find(a => a.id === task.assignee)?.url || `https://api.dicebear.com/7.x/notionists/svg?seed=${task.ownerId}`;

        div.innerHTML = `
            <div class="task-top" style="display:flex; justify-content:space-between; align-items:flex-start">
                <span class="category-badge cat-${task.category}">${task.category}</span>
                <div class="progress-container">
                    <svg class="progress-ring" viewBox="0 0 36 36">
                        <circle class="progress-ring__circle" r="16" cx="18" cy="18"></circle>
                        <circle class="progress-ring__fill" r="16" cx="18" cy="18" style="stroke-dashoffset: ${100 - pct}"></circle>
                    </svg>
                </div>
            </div>
            <h4>${task.name}</h4>
            <div class="task-footer">
                <span class="pri-tag p-${task.priority}">${task.priority}</span>
                <img src="${avatar}" class="u-avatar">
            </div>
        `;
        div.addEventListener('dragstart', () => { this.dragId = task.id; });
        div.addEventListener('dblclick', () => this.openEditModal(task.id));
        return div;
    }

    // --- Modal & Form Interaction ---
    renderAvatarSelector() {
        const root = document.getElementById('avatar-root');
        if (!root) return;
        root.innerHTML = this.avatars.map(a => `
            <img src="${a.url}" class="avatar-opt" data-id="${a.id}" 
                 onclick="app.pickAvatar('${a.id}', this)">
        `).join('');
    }

    pickAvatar(id, el) {
        document.querySelectorAll('.avatar-opt').forEach(a => a.classList.remove('active'));
        if (el) el.classList.add('active');
        const input = document.getElementById('task-assignee');
        if (input) input.value = id;
    }

    openModal() {
        const modal = document.getElementById('task-modal');
        if (modal) modal.classList.add('active');
        const form = document.getElementById('task-form');
        if (form) form.reset();
        const editId = document.getElementById('edit-id');
        if (editId) editId.value = "";
        const list = document.getElementById('subtask-list');
        if (list) list.innerHTML = "";
        this.pickAvatar('u1', document.querySelector('.avatar-opt[data-id="u1"]'));
    }

    openEditModal(id) {
        const t = this.tasks.find(t => t.id === id);
        if (!t) return;
        this.openModal();
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
        setVal('edit-id', t.id);
        setVal('task-name', t.name);
        setVal('task-desc', t.desc || "");
        setVal('task-priority', t.priority);
        setVal('task-category', t.category || "feature");
        setVal('task-due', t.due || "");

        const avatarEl = document.querySelector(`.avatar-opt[data-id="${t.assignee}"]`);
        if (avatarEl) this.pickAvatar(t.assignee, avatarEl);

        this.renderSubtasks(t);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const data = {
            name: document.getElementById('task-name').value,
            desc: document.getElementById('task-desc').value,
            priority: document.getElementById('task-priority').value,
            category: document.getElementById('task-category').value,
            due: document.getElementById('task-due').value,
            assignee: document.getElementById('task-assignee').value,
            ownerId: this.currentUser.id
        };

        if (id) {
            this.tasks = this.tasks.map(t => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t);
        } else {
            this.tasks.push({
                id: 'T-' + Date.now(),
                status: 'todo',
                ...data,
                subtasks: [],
                updatedAt: new Date().toISOString()
            });
        }
        this.save();
        this.closeModal();
        this.log(`${id ? 'Modified' : 'Created'} task: ${data.name}`);
    }

    // --- Subtask Engine ---
    renderSubtasks(task) {
        const subRoot = document.getElementById('subtask-list');
        if (!subRoot) return;
        subRoot.innerHTML = (task.subtasks || []).map((s, idx) => `
            <div class="subtask-item">
                <input type="checkbox" ${s.done ? 'checked' : ''} onchange="app.toggleSubtask('${task.id}', ${idx})">
                <span>${s.text}</span>
                <button type="button" class="btn-remove-sub" onclick="app.removeSubtask('${task.id}', ${idx})">&times;</button>
            </div>
        `).join('');
    }

    addSubtask() {
        const txt = prompt("Define sub-objective:");
        if (!txt) return;
        const id = document.getElementById('edit-id').value;
        if (!id) { alert("Please commit the task first before adding subtasks."); return; }

        const t = this.tasks.find(t => t.id === id);
        if (t) {
            t.subtasks = t.subtasks || [];
            t.subtasks.push({ text: txt, done: false });
            this.renderSubtasks(t);
            this.save();
        }
    }

    toggleSubtask(id, idx) {
        const t = this.tasks.find(t => t.id === id);
        if (t && t.subtasks[idx]) {
            t.subtasks[idx].done = !t.subtasks[idx].done;
            this.save();
        }
    }

    removeSubtask(id, idx) {
        const t = this.tasks.find(t => t.id === id);
        if (t && t.subtasks) {
            t.subtasks.splice(idx, 1);
            this.renderSubtasks(t);
            this.save();
        }
    }

    // --- Utility Hub ---
    async deleteTask(id) {
        if (await this.customConfirm("Relocate to Archive?", "Are you sure you want to move this intelligence unit to the Archive Box?", "📦")) {
            const taskIndex = this.tasks.findIndex(t => t.id === id);
            if (taskIndex > -1) {
                const task = this.tasks.splice(taskIndex, 1)[0];
                task.archivedAt = new Date().toISOString();
                this.archivedTasks.unshift(task);
                this.log(`Archived unit: ${task.name}`);
                this.save();
            }
        }
    }

    restoreTask(id) {
        const taskIndex = this.archivedTasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            const task = this.archivedTasks.splice(taskIndex, 1)[0];
            delete task.archivedAt;
            this.tasks.push(task);
            this.log(`Restored unit from archive: ${task.name}`);
            this.save();
        }
    }

    async purgeTask(id) {
        if (await this.customConfirm("Permanent Purge?", "This intelligence unit will be permanently destroyed. This action is irreversible.", "🔥")) {
            this.archivedTasks = this.archivedTasks.filter(t => t.id !== id);
            this.log(`Permanent purge: ID ${id}`);
            this.save();
        }
    }

    async purgeArchive() {
        if (await this.customConfirm("Total Repository Purge?", "CRITICAL: You are about to destroy the entire Archive Repository. This data cannot be recovered.", "🚨")) {
            this.archivedTasks = this.archivedTasks.filter(t => t.ownerId !== this.currentUser.id);
            this.log("Comprehensive Archive Purge completed.");
            this.save();
        }
    }

    async clearDone() {
        if (await this.customConfirm("Purge Shipped?", "This will remove all completed tasks from the board without archiving them. Proceed?")) {
            this.tasks = this.tasks.filter(t => t.status !== 'done');
            this.log("Full purge of Shipped column.");
            this.save();
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const icon = document.getElementById('theme-icon');
        if (icon) icon.setAttribute('data-lucide', this.theme === 'light' ? 'moon' : 'sun');
        if (window.lucide) lucide.createIcons();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('pk_theme', this.theme);
        this.applyTheme();
    }

    formatDate(d) { return new Date(d).toLocaleDateString(); }

    renderLogs() {
        const root = document.getElementById('log-container');
        if (root) root.innerHTML = this.history.map(l => `<div class="log-entry">${l}</div>`).join('');
    }

    setupEventListeners() {
        document.getElementById('global-search')?.addEventListener('input', () => this.render());
    }

    onDragOver(e) { e.preventDefault(); }
    onDrop(e, status) {
        if (this.dragId) {
            this.updateTaskStatus(this.dragId, status);
        }
    }

    async updateTaskStatus(id, newStatus) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const oldStatus = task.status;
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();
            this.log(`Transitioned ${task.name} to ${newStatus}`);
            this.save();
        }
    }

    closeModal() {
        const modal = document.getElementById('task-modal');
        if (modal) modal.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProKanban();
    if (window.lucide) lucide.createIcons();
});
