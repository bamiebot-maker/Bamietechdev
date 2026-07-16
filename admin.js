const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

const ADMIN_SESSION_KEY = 'bamietech_admin_session_v1';

document.addEventListener('DOMContentLoaded', () => {
    const store = window.PortfolioContentStore;

    if (!store) {
        console.error('PortfolioContentStore is missing.');
        return;
    }

    let state = store.getContent();

    const refs = {
        loginShell: document.getElementById('admin-login-shell'),
        appShell: document.getElementById('admin-app'),
        loginForm: document.getElementById('admin-login-form'),
        loginUsername: document.getElementById('login-username'),
        loginPassword: document.getElementById('login-password'),
        loginMessage: document.getElementById('login-message'),
        logoutButton: document.getElementById('logout-admin'),

        message: document.getElementById('admin-message'),
        projectsEditor: document.getElementById('projects-editor'),
        achievementsEditor: document.getElementById('achievements-editor'),
        experienceEditor: document.getElementById('experience-editor'),
        educationEditor: document.getElementById('education-editor'),
        saveAll: document.getElementById('save-all'),
        addProject: document.getElementById('add-project'),
        addAchievement: document.getElementById('add-achievement'),
        addExperience: document.getElementById('add-experience'),
        addEducation: document.getElementById('add-education'),
        resetDefaults: document.getElementById('reset-defaults'),
        exportJson: document.getElementById('export-json'),
        importJson: document.getElementById('import-json')
    };

    refs.loginForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = refs.loginUsername?.value.trim() || '';
        const password = refs.loginPassword?.value || '';

        const isValid = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;

        if (!isValid) {
            setLoginMessage(refs, 'Invalid credentials. Use your admin username and password.', 'error');
            return;
        }

        sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
        if (refs.loginPassword) {
            refs.loginPassword.value = '';
        }
        setLoginMessage(refs, '', '');
        openAdmin(refs);
        hydrateForm();
        setAdminMessage(refs, 'Logged in. You can now edit and save your portfolio.', 'success');
    });

    refs.logoutButton?.addEventListener('click', () => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAdminMessage(refs, '', '');
        openLogin(refs);
        setLoginMessage(refs, 'Logged out.', 'success');
    });

    refs.addProject?.addEventListener('click', () => {
        state.projects.unshift(createBlankProject(store));
        renderProjectsEditor();
    });

    refs.addAchievement?.addEventListener('click', () => {
        state.achievements.push(createBlankAchievement(store));
        renderAchievementsEditor();
    });

    refs.addExperience?.addEventListener('click', () => {
        state.experience.push(createBlankExperience(store));
        renderExperienceEditor();
    });

    refs.addEducation?.addEventListener('click', () => {
        state.education.push(createBlankEducation(store));
        renderEducationEditor();
    });

    refs.projectsEditor?.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-remove-project]');
        if (!removeBtn) {
            return;
        }

        const id = removeBtn.getAttribute('data-remove-project');
        state.projects = state.projects.filter((project) => project.id !== id);
        renderProjectsEditor();
    });

    refs.achievementsEditor?.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-remove-achievement]');
        if (!removeBtn) {
            return;
        }

        const id = removeBtn.getAttribute('data-remove-achievement');
        state.achievements = state.achievements.filter((item) => item.id !== id);
        renderAchievementsEditor();
    });

    refs.experienceEditor?.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-remove-experience]');
        if (!removeBtn) {
            return;
        }

        const id = removeBtn.getAttribute('data-remove-experience');
        state.experience = state.experience.filter((item) => item.id !== id);
        renderExperienceEditor();
    });

    refs.educationEditor?.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-remove-education]');
        if (!removeBtn) {
            return;
        }

        const id = removeBtn.getAttribute('data-remove-education');
        state.education = state.education.filter((item) => item.id !== id);
        renderEducationEditor();
    });

    refs.saveAll?.addEventListener('click', () => {
        try {
            const draft = collectStateFromForm(store);
            state = store.saveContent(draft);
            hydrateForm();
            setAdminMessage(refs, 'Saved successfully. Open your main site page to confirm the updates.', 'success');
        } catch (error) {
            console.error(error);
            setAdminMessage(refs, 'Failed to save. Please check your fields and try again.', 'error');
        }
    });

    refs.resetDefaults?.addEventListener('click', () => {
        const confirmed = window.confirm('Reset all edits and restore default portfolio content?');
        if (!confirmed) {
            return;
        }

        state = store.resetContent();
        hydrateForm();
        setAdminMessage(refs, 'Defaults restored.', 'success');
    });

    refs.exportJson?.addEventListener('click', () => {
        try {
            const draft = collectStateFromForm(store);
            const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'portfolio-content-backup.json';
            anchor.click();

            URL.revokeObjectURL(url);
            setAdminMessage(refs, 'JSON backup exported.', 'success');
        } catch (error) {
            console.error(error);
            setAdminMessage(refs, 'Export failed.', 'error');
        }
    });

    refs.importJson?.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            state = store.saveContent(parsed);
            hydrateForm();
            setAdminMessage(refs, 'JSON imported and saved.', 'success');
        } catch (error) {
            console.error(error);
            setAdminMessage(refs, 'Import failed. Ensure the file is valid JSON.', 'error');
        } finally {
            event.target.value = '';
        }
    });

    function hydrateForm() {
        populateTopFields(state);
        renderProjectsEditor();
        renderAchievementsEditor();
        renderExperienceEditor();
        renderEducationEditor();
    }

    function renderProjectsEditor() {
        if (!refs.projectsEditor) {
            return;
        }

        refs.projectsEditor.textContent = '';

        if (!state.projects.length) {
            refs.projectsEditor.append(createEmptyEditorState('No projects added yet.'));
            return;
        }

        state.projects.forEach((project, index) => {
            const card = document.createElement('article');
            card.className = 'editor-card project-editor';
            card.dataset.id = project.id;

            card.innerHTML = `
                <div class="editor-card-head">
                    <h3>Project ${index + 1}</h3>
                    <button type="button" class="remove-btn" data-remove-project="${escapeHtml(project.id)}">Remove</button>
                </div>
                <div class="editor-grid">
                    <label class="field">
                        <span>Name</span>
                        <input type="text" data-key="name" value="${escapeHtml(project.name)}">
                    </label>
                    <label class="field">
                        <span>Track</span>
                        <input type="text" data-key="track" value="${escapeHtml(project.track)}">
                    </label>
                    <label class="field">
                        <span>Status</span>
                        <select data-key="status">
                            ${renderStatusOptions(project.status)}
                        </select>
                    </label>
                    <label class="field">
                        <span>Image URL</span>
                        <input type="text" data-key="imageUrl" value="${escapeHtml(project.imageUrl)}" placeholder="img/projects/example.jpg">
                    </label>
                    <label class="field">
                        <span>Live URL (for live projects)</span>
                        <input type="url" data-key="liveUrl" value="${escapeHtml(project.liveUrl)}" placeholder="https://...">
                    </label>
                    <label class="field">
                        <span>Repo URL (for building projects)</span>
                        <input type="url" data-key="repoUrl" value="${escapeHtml(project.repoUrl)}" placeholder="https://github.com/...">
                    </label>
                    <label class="field full">
                        <span>Description</span>
                        <textarea rows="3" data-key="description">${escapeHtml(project.description)}</textarea>
                    </label>
                    <label class="field full">
                        <span>Tags (comma separated)</span>
                        <input type="text" data-key="tags" value="${escapeHtml((project.tags || []).join(', '))}">
                    </label>
                </div>
            `;

            refs.projectsEditor.append(card);
        });
    }

    function renderAchievementsEditor() {
        if (!refs.achievementsEditor) {
            return;
        }

        refs.achievementsEditor.textContent = '';

        if (!state.achievements.length) {
            refs.achievementsEditor.append(createEmptyEditorState('No achievements added yet.'));
            return;
        }

        state.achievements.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'editor-card achievement-editor';
            card.dataset.id = item.id;

            card.innerHTML = `
                <div class="editor-card-head">
                    <h3>Achievement ${index + 1}</h3>
                    <button type="button" class="remove-btn" data-remove-achievement="${escapeHtml(item.id)}">Remove</button>
                </div>
                <div class="editor-grid">
                    <label class="field full">
                        <span>Title</span>
                        <input type="text" data-key="title" value="${escapeHtml(item.title)}">
                    </label>
                    <label class="field full">
                        <span>Description</span>
                        <textarea rows="3" data-key="description">${escapeHtml(item.description)}</textarea>
                    </label>
                </div>
            `;

            refs.achievementsEditor.append(card);
        });
    }

    function renderExperienceEditor() {
        if (!refs.experienceEditor) {
            return;
        }

        refs.experienceEditor.textContent = '';

        if (!state.experience || !state.experience.length) {
            refs.experienceEditor.append(createEmptyEditorState('No experience added yet.'));
            return;
        }

        state.experience.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'editor-card experience-editor';
            card.dataset.id = item.id;

            card.innerHTML = `
                <div class="editor-card-head">
                    <h3>Experience ${index + 1}</h3>
                    <button type="button" class="remove-btn" data-remove-experience="${escapeHtml(item.id)}">Remove</button>
                </div>
                <div class="editor-grid">
                    <label class="field">
                        <span>Role</span>
                        <input type="text" data-key="role" value="${escapeHtml(item.role)}">
                    </label>
                    <label class="field">
                        <span>Company</span>
                        <input type="text" data-key="company" value="${escapeHtml(item.company)}">
                    </label>
                    <label class="field">
                        <span>Duration</span>
                        <input type="text" data-key="duration" value="${escapeHtml(item.duration)}">
                    </label>
                    <label class="field full">
                        <span>Bullets (one per line)</span>
                        <textarea rows="4" data-key="bullets">${escapeHtml((item.bullets || []).join('\n'))}</textarea>
                    </label>
                </div>
            `;

            refs.experienceEditor.append(card);
        });
    }

    function renderEducationEditor() {
        if (!refs.educationEditor) {
            return;
        }

        refs.educationEditor.textContent = '';

        if (!state.education.length) {
            refs.educationEditor.append(createEmptyEditorState('No education item added yet.'));
            return;
        }

        state.education.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'editor-card education-editor';
            card.dataset.id = item.id;

            card.innerHTML = `
                <div class="editor-card-head">
                    <h3>Education ${index + 1}</h3>
                    <button type="button" class="remove-btn" data-remove-education="${escapeHtml(item.id)}">Remove</button>
                </div>
                <div class="editor-grid">
                    <label class="field">
                        <span>Icon Class</span>
                        <input type="text" data-key="icon" value="${escapeHtml(item.icon)}" placeholder="fas fa-graduation-cap">
                    </label>
                    <label class="field">
                        <span>Title</span>
                        <input type="text" data-key="title" value="${escapeHtml(item.title)}">
                    </label>
                    <label class="field">
                        <span>Institution</span>
                        <input type="text" data-key="institution" value="${escapeHtml(item.institution)}">
                    </label>
                    <label class="field">
                        <span>Duration</span>
                        <input type="text" data-key="duration" value="${escapeHtml(item.duration)}">
                    </label>
                </div>
            `;

            refs.educationEditor.append(card);
        });
    }

    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === '1') {
        openAdmin(refs);
        hydrateForm();
    } else {
        openLogin(refs);
    }
});

function openAdmin(refs) {
    refs.loginShell?.classList.add('is-hidden');
    refs.appShell?.classList.remove('is-hidden');
}

function openLogin(refs) {
    refs.appShell?.classList.add('is-hidden');
    refs.loginShell?.classList.remove('is-hidden');
}

function setLoginMessage(refs, text, tone) {
    if (!refs.loginMessage) {
        return;
    }

    refs.loginMessage.textContent = text;
    refs.loginMessage.className = `admin-message${tone ? ` ${tone}` : ''}`;
}

function setAdminMessage(refs, text, tone) {
    if (!refs.message) {
        return;
    }

    refs.message.textContent = text;
    refs.message.className = `admin-message${tone ? ` ${tone}` : ''}`;
}

function populateTopFields(state) {
    setInputValue('brand-name', state.profile.brandName);
    setInputValue('full-name', state.profile.fullName);
    setInputValue('hero-tag-input', state.profile.heroTag);
    setInputValue('role-line', state.profile.roleLine);
    setInputValue('hero-description-input', state.profile.heroDescription);

    const aboutParagraphs = state.profile.aboutParagraphs || [];
    setInputValue('about-1', aboutParagraphs[0] || '');
    setInputValue('about-2', aboutParagraphs[1] || '');
    setInputValue('about-3', aboutParagraphs[2] || '');

    const stats = state.profile.stats || [];
    setInputValue('stat-1-value', stats[0]?.value || '');
    setInputValue('stat-1-label', stats[0]?.label || '');
    setInputValue('stat-2-value', stats[1]?.value || '');
    setInputValue('stat-2-label', stats[1]?.label || '');
    setInputValue('stat-3-value', stats[2]?.value || '');
    setInputValue('stat-3-label', stats[2]?.label || '');

    setInputValue('contact-whatsapp-label-input', state.contact.whatsapp.label);
    setInputValue('contact-whatsapp-url-input', state.contact.whatsapp.url);
    setInputValue('contact-email-input', state.contact.email);
    setInputValue('contact-twitter-label-input', state.contact.twitter.label);
    setInputValue('contact-twitter-url-input', state.contact.twitter.url);
    setInputValue('contact-facebook-label-input', state.contact.facebook.label);
    setInputValue('contact-facebook-url-input', state.contact.facebook.url);
    setInputValue('contact-github-label-input', state.contact.github.label);
    setInputValue('contact-github-url-input', state.contact.github.url);
    setInputValue('resume-url-input', state.contact.resumeUrl);
    setInputValue('availability-input', (state.availability || []).join('\n'));
}

function collectStateFromForm(store) {
    const draft = store.deepClone(store.getContent());

    draft.profile.brandName = getInputValue('brand-name');
    draft.profile.fullName = getInputValue('full-name');
    draft.profile.heroTag = getInputValue('hero-tag-input');
    draft.profile.roleLine = getInputValue('role-line');
    draft.profile.heroDescription = getInputValue('hero-description-input');

    draft.profile.aboutParagraphs = [
        getInputValue('about-1'),
        getInputValue('about-2'),
        getInputValue('about-3')
    ].filter(Boolean);

    draft.profile.stats = [
        { value: getInputValue('stat-1-value'), label: getInputValue('stat-1-label') },
        { value: getInputValue('stat-2-value'), label: getInputValue('stat-2-label') },
        { value: getInputValue('stat-3-value'), label: getInputValue('stat-3-label') }
    ].filter((item) => item.value || item.label);

    draft.contact = {
        whatsapp: {
            label: getInputValue('contact-whatsapp-label-input'),
            url: getInputValue('contact-whatsapp-url-input')
        },
        email: getInputValue('contact-email-input'),
        twitter: {
            label: getInputValue('contact-twitter-label-input'),
            url: getInputValue('contact-twitter-url-input')
        },
        facebook: {
            label: getInputValue('contact-facebook-label-input'),
            url: getInputValue('contact-facebook-url-input')
        },
        github: {
            label: getInputValue('contact-github-label-input'),
            url: getInputValue('contact-github-url-input')
        },
        resumeUrl: getInputValue('resume-url-input')
    };

    draft.availability = getInputValue('availability-input')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

    draft.projects = Array.from(document.querySelectorAll('.project-editor')).map((card) => {
        const id = card.dataset.id || store.buildId('project');
        const status = store.normalizeProjectStatus(getFieldValue(card, 'status'));

        return {
            id,
            name: getFieldValue(card, 'name'),
            track: getFieldValue(card, 'track'),
            status,
            imageUrl: getFieldValue(card, 'imageUrl'),
            liveUrl: getFieldValue(card, 'liveUrl'),
            repoUrl: getFieldValue(card, 'repoUrl'),
            description: getFieldValue(card, 'description'),
            tags: getFieldValue(card, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean)
        };
    }).filter((project) => project.name);

    draft.achievements = Array.from(document.querySelectorAll('.achievement-editor')).map((card) => ({
        id: card.dataset.id || store.buildId('achievement'),
        title: getFieldValue(card, 'title'),
        description: getFieldValue(card, 'description')
    })).filter((item) => item.title);

    draft.experience = Array.from(document.querySelectorAll('.experience-editor')).map((card) => ({
        id: card.dataset.id || store.buildId('experience'),
        role: getFieldValue(card, 'role'),
        company: getFieldValue(card, 'company'),
        duration: getFieldValue(card, 'duration'),
        bullets: getFieldValue(card, 'bullets').split('\n').map((line) => line.trim()).filter(Boolean)
    })).filter((item) => item.role);

    draft.education = Array.from(document.querySelectorAll('.education-editor')).map((card) => ({
        id: card.dataset.id || store.buildId('education'),
        icon: getFieldValue(card, 'icon'),
        title: getFieldValue(card, 'title'),
        institution: getFieldValue(card, 'institution'),
        duration: getFieldValue(card, 'duration')
    })).filter((item) => item.title);

    return draft;
}

function getFieldValue(card, key) {
    const target = card.querySelector(`[data-key="${key}"]`);
    return target ? target.value.trim() : '';
}

function createBlankProject(store) {
    return {
        id: store.buildId('project'),
        name: '',
        description: '',
        status: 'live',
        track: '',
        imageUrl: '',
        liveUrl: '',
        repoUrl: '',
        tags: []
    };
}

function createBlankAchievement(store) {
    return {
        id: store.buildId('achievement'),
        title: '',
        description: ''
    };
}

function createBlankExperience(store) {
    return {
        id: store.buildId('experience'),
        role: '',
        company: '',
        duration: '',
        bullets: []
    };
}

function createBlankEducation(store) {
    return {
        id: store.buildId('education'),
        icon: 'fas fa-graduation-cap',
        title: '',
        institution: '',
        duration: ''
    };
}

function renderStatusOptions(active) {
    const statuses = [
        { value: 'live', label: 'Live' },
        { value: 'building', label: 'Building' },
        { value: 'pilot', label: 'Pilot' }
    ];

    return statuses.map((item) => {
        const selected = item.value === active ? 'selected' : '';
        return `<option value="${item.value}" ${selected}>${item.label}</option>`;
    }).join('');
}

function setInputValue(id, value) {
    const node = document.getElementById(id);
    if (node) {
        node.value = value || '';
    }
}

function getInputValue(id) {
    const node = document.getElementById(id);
    return node ? node.value.trim() : '';
}

function createEmptyEditorState(message) {
    const item = document.createElement('p');
    item.className = 'section-hint';
    item.textContent = message;
    return item;
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
