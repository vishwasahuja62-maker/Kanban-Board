/**
 * ProKanban Elite Workspace Engine (Intelligence Update)
 * Version: 4.1 (Stability + Feature Completion)
 */

class ProKanban {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('pk_elite_tasks')) || [];
        this.history = JSON.parse(localStorage.getItem('pk_elite_logs')) || ["Genesis workspace initialized."];
        this.currentUser = JSON.parse(localStorage.getItem('pk_current_user')) || null;

        this.theme = localStorage.getItem('pk_theme') || 'light';
        this.currentView = 'board';
        this.activeFilter = null;
        this.dragId = null;

        this.avatars = [
            { id: 'u1', name: 'Felix', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
            { id: 'u2', name: 'Aneka', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
            { id: 'u3', name: 'Jasper', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper' },
            { id: 'u4', name: 'Luna', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna' }
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
                url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
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
        localStorage.setItem('pk_elite_logs', JSON.stringify(this.history));
        this.render();
        this.renderLogs();
    }

    log(msg) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.history.unshift(`[${time}] ${msg}`);
        if (this.history.length > 25) this.history.pop();
        localStorage.setItem('pk_elite_logs', JSON.stringify(this.history));
    }

    // --- Core Navigation ---
    switchView(view, event) {
        if (event) event.preventDefault();
        this.currentView = view;

        const views = ['board-view', 'list-view', 'analytics-view'];
        views.forEach(v => {
            const el = document.getElementById(v);
            if (el) el.style.display = (v === view || v.startsWith(view)) ? (view === 'analytics' ? 'block' : 'flex') : 'none';
        });

        const titleMap = { 'board': 'Main Board', 'list': 'Detailed View', 'analytics': 'Business Insights' };
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
        this.render();
        this.log(`Applied layer: ${type || 'full exposure'}`);
    }

    showArchive(event) {
        if (event) event.preventDefault();
        alert("Archive Repository is currently in read-only genesis mode.");
    }

    // --- Dynamic Renderers ---
    render() {
        if (!this.currentUser) return;

        this.renderWorkload();

        if (this.currentView === 'board') this.renderBoard();
        else if (this.currentView === 'list') this.renderList();
        else if (this.currentView === 'analytics') this.renderAnalytics();

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
            const filtered = userTasks.filter(t => t.status === status && t.name.toLowerCase().includes(search));
            filtered.forEach(task => container.appendChild(this.createTaskCard(task)));
            const badge = document.getElementById(`badge-${status}`);
            if (badge) badge.innerText = filtered.length;
        });
    }

    renderList() {
        const tbody = document.getElementById('list-body');
        if (!tbody) return;
        tbody.innerHTML = "";
        const userTasks = this.getUserTasks();
        userTasks.forEach(task => {
            const row = document.createElement('tr');
            const avatar = this.avatars.find(a => a.id === task.assignee)?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.ownerId}`;
            row.innerHTML = `
                <td><div style="font-weight:700">${task.name}</div></td>
                <td><img src="${avatar}" class="u-avatar" style="width:24px; height:24px"></td>
                <td><span class="badge" style="background:var(--primary-light); color:var(--primary)">${task.status}</span></td>
                <td><span class="category-badge cat-${task.category}">${task.category}</span></td>
                <td>${task.due ? this.formatDate(task.due) : '-'}</td>
                <td>
                    <button class="btn-icon-nav" style="width:32px; height:32px" onclick="app.openEditModal('${task.id}')"><i data-lucide="edit-3"></i></button>
                    <button class="btn-icon-nav" style="width:32px; height:32px; color:#ef4444" onclick="app.deleteTask('${task.id}')"><i data-lucide="trash-2"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    createTaskCard(task) {
        const div = document.createElement('div');
        div.className = 'task';
        div.draggable = true;
        const total = task.subtasks?.length || 0;
        const done = task.subtasks?.filter(s => s.done).length || 0;
        const pct = total === 0 ? 0 : (done / total) * 100;
        const avatar = this.avatars.find(a => a.id === task.assignee)?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.ownerId}`;

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
                <img src="${avatar}" class="u-avatar" style="width:24px; height:24px">
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
            this.tasks = this.tasks.map(t => t.id === id ? { ...t, ...data } : t);
        } else {
            this.tasks.push({
                id: 'T-' + Date.now(),
                status: 'todo',
                ...data,
                subtasks: []
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
            <div class="subtask-item" style="display:flex; align-items:center; gap:10px; margin-bottom:10px">
                <input type="checkbox" ${s.done ? 'checked' : ''} onchange="app.toggleSubtask('${task.id}', ${idx})">
                <span style="flex:1; font-size:0.85rem">${s.text}</span>
                <button type="button" onclick="app.removeSubtask('${task.id}', ${idx})" style="color:#ef4444; border:none; background:none; cursor:pointer">&times;</button>
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
    deleteTask(id) {
        if (confirm("Permanently archive this task?")) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.log(`Archived task ID ${id}`);
            this.save();
        }
    }

    clearDone() {
        if (confirm("Purge all completed units from the workspace?")) {
            this.tasks = this.tasks.filter(t => !(t.status === 'done' && t.ownerId === this.currentUser.id));
            this.save();
            this.log("Purged completed repository.");
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
            const t = this.tasks.find(x => x.id === this.dragId);
            if (t && t.status !== status) {
                t.status = status;
                this.log(`Transitioned ${t.name} to ${status}`);
                this.save();
            }
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
