const STATUS_META = {
    live: {
        label: 'Live',
        className: 'status-live',
        linkLabel: 'Open Live Link'
    },
    building: {
        label: 'Building',
        className: 'status-building',
        linkLabel: 'Open GitHub Repo'
    },
    pilot: {
        label: 'Pilot',
        className: 'status-pilot',
        linkLabel: 'Open Link'
    }
};

const PROJECT_PREVIEW_COUNT = 7;
let allProjects = [];
let projectsExpanded = false;
let isProjectsToggleBound = false;

document.addEventListener('DOMContentLoaded', () => {
    const contentStore = window.PortfolioContentStore;
    const content = contentStore ? contentStore.getContent() : null;

    if (!content) {
        console.error('PortfolioContentStore is not available.');
        return;
    }

    renderPortfolio(content);
    bindNavigation();
    bindCtaWidget();
    bindBackToTop();
    bindRevealObserver();
    bindContactForm(content.contact.email);
    bindImageFallbacks();
    updateYear();
});

function renderPortfolio(content) {
    renderBrand(content.profile.brandName);
    renderHero(content.profile, content.contact.resumeUrl);
    renderAbout(content.profile.aboutParagraphs);
    initializeProjects(content.projects);
    renderStatus(content.projects, content.availability);
    renderAchievements(content.achievements);
    renderEducation(content.education);
    renderContact(content.contact);
}

function initializeProjects(projects) {
    allProjects = Array.isArray(projects) ? projects : [];
    projectsExpanded = false;
    bindProjectsToggle();
    renderProjects();
}

function bindProjectsToggle() {
    if (isProjectsToggleBound) {
        return;
    }

    const toggleButton = document.getElementById('projects-toggle');
    if (!toggleButton) {
        return;
    }

    toggleButton.addEventListener('click', () => {
        projectsExpanded = !projectsExpanded;
        renderProjects();
    });

    isProjectsToggleBound = true;
}

function renderBrand(brandName) {
    const value = (brandName || '').trim() || 'BamietechDev';
    const splitValue = splitSuffix(value, 'Dev');

    setBrandNode(document.getElementById('nav-brand'), splitValue);
    setBrandNode(document.getElementById('footer-brand'), splitValue);
}

function splitSuffix(value, suffix) {
    if (value.endsWith(suffix) && value.length > suffix.length) {
        return {
            lead: value.slice(0, -suffix.length),
            tail: suffix
        };
    }

    return {
        lead: value,
        tail: ''
    };
}

function setBrandNode(node, parts) {
    if (!node) {
        return;
    }

    node.textContent = '';
    node.append(document.createTextNode(parts.lead));

    if (parts.tail) {
        const span = document.createElement('span');
        span.textContent = parts.tail;
        node.append(span);
    }
}

function renderHero(profile, resumeUrl) {
    const heroTag = document.getElementById('hero-tag');
    const heroTitle = document.getElementById('hero-title');
    const heroRoleLine = document.getElementById('hero-role-line');
    const heroDescription = document.getElementById('hero-description');
    const heroMetrics = document.getElementById('hero-metrics');
    const heroResumeLink = document.getElementById('hero-resume-link');

    if (heroTag) {
        heroTag.textContent = '';
        const dot = document.createElement('span');
        dot.className = 'live-dot';
        heroTag.append(dot, document.createTextNode(profile.heroTag || 'Open to product + Web3 collaborations'));
    }

    if (heroTitle) {
        heroTitle.textContent = '';
        const nameParts = (profile.fullName || 'Ibrahim Sobur Bamidele').trim().split(/\s+/);
        const highlight = nameParts.pop() || '';
        const lead = nameParts.join(' ');

        heroTitle.append(document.createTextNode(lead ? `${lead} ` : ''));
        const span = document.createElement('span');
        span.textContent = highlight;
        heroTitle.append(span);
    }

    if (heroRoleLine) {
        heroRoleLine.textContent = profile.roleLine || '';
    }

    if (heroDescription) {
        heroDescription.textContent = profile.heroDescription || '';
    }

    if (heroResumeLink) {
        heroResumeLink.href = resumeUrl || 'assets/Ibrahim_Bamidele_Resume.pdf';
    }

    if (heroMetrics) {
        heroMetrics.textContent = '';
        (profile.stats || []).slice(0, 3).forEach((item) => {
            const metric = document.createElement('li');

            const strong = document.createElement('strong');
            strong.textContent = item.value || '';

            const label = document.createElement('span');
            label.textContent = item.label || '';

            metric.append(strong, label);
            heroMetrics.append(metric);
        });
    }
}

function renderAbout(aboutParagraphs) {
    const aboutText = document.getElementById('about-text');
    if (!aboutText) {
        return;
    }

    aboutText.textContent = '';

    (aboutParagraphs || []).forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        aboutText.append(p);
    });
}

function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsActions = document.getElementById('projects-actions');
    const toggleButton = document.getElementById('projects-toggle');

    if (!projectsGrid) {
        return;
    }

    projectsGrid.textContent = '';

    if (!allProjects.length) {
        projectsGrid.append(createEmptyState('No projects yet.'));
        if (projectsActions) {
            projectsActions.style.display = 'none';
        }
        return;
    }

    const visibleProjects = projectsExpanded
        ? allProjects
        : allProjects.slice(0, PROJECT_PREVIEW_COUNT);

    visibleProjects.forEach((project) => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-reveal', '');
        card.classList.add('is-visible');

        const imageWrap = document.createElement('div');
        imageWrap.className = 'project-image';

        const img = document.createElement('img');
        img.className = 'project-img';
        img.src = project.imageUrl || '';
        img.alt = project.name || 'Project image';

        const status = STATUS_META[project.status] || STATUS_META.pilot;
        const chip = document.createElement('span');
        chip.className = `status-chip ${status.className}`;
        chip.textContent = status.label;

        const overlay = document.createElement('div');
        overlay.className = 'project-overlay';

        const linkData = getProjectLink(project);
        overlay.append(createProjectLinkElement(linkData));

        imageWrap.append(img, chip, overlay);

        const contentWrap = document.createElement('div');
        contentWrap.className = 'project-content';

        const titleRow = document.createElement('div');
        titleRow.className = 'project-title-row';

        const title = document.createElement('h3');
        title.textContent = project.name || 'Untitled Project';

        const track = document.createElement('span');
        track.className = 'project-track';
        track.textContent = project.track || 'General';

        titleRow.append(title, track);

        const description = document.createElement('p');
        description.className = 'project-description';
        description.textContent = project.description || '';

        let descriptionToggle = null;
        if ((project.description || '').length > 145) {
            description.classList.add('is-collapsed');
            descriptionToggle = document.createElement('button');
            descriptionToggle.type = 'button';
            descriptionToggle.className = 'project-read-more';
            descriptionToggle.textContent = 'View more';
            descriptionToggle.addEventListener('click', () => {
                const expanded = description.classList.toggle('is-expanded');
                descriptionToggle.textContent = expanded ? 'View less' : 'View more';
            });
        }

        const tags = document.createElement('div');
        tags.className = 'project-tags';

        (project.tags || []).forEach((tagValue) => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = tagValue;
            tags.append(tag);
        });

        contentWrap.append(titleRow, description);
        if (descriptionToggle) {
            contentWrap.append(descriptionToggle);
        }
        contentWrap.append(tags);
        card.append(imageWrap, contentWrap);
        projectsGrid.append(card);
    });

    if (projectsActions && toggleButton) {
        if (allProjects.length <= PROJECT_PREVIEW_COUNT) {
            projectsActions.style.display = 'none';
        } else {
            projectsActions.style.display = 'flex';
            toggleButton.textContent = projectsExpanded
                ? 'Show Fewer Projects'
                : `View More Projects (${allProjects.length - PROJECT_PREVIEW_COUNT}+)`;
        }
    }

    bindImageFallbacks();
}

function createProjectLinkElement(linkData) {
    if (!linkData.url) {
        const span = document.createElement('span');
        span.className = 'project-link project-link-disabled';
        span.textContent = 'No Link';
        return span;
    }

    const anchor = document.createElement('a');
    anchor.className = 'project-link';
    anchor.href = linkData.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = linkData.label;
    return anchor;
}

function getProjectLink(project) {
    const status = project.status;

    if (status === 'building') {
        return {
            url: project.repoUrl || project.liveUrl || '',
            label: 'GitHub Repo'
        };
    }

    if (status === 'live') {
        return {
            url: project.liveUrl || project.repoUrl || '',
            label: 'Live Link'
        };
    }

    return {
        url: project.liveUrl || project.repoUrl || '',
        label: 'Preview'
    };
}

function renderStatus(projects, availability) {
    const buildingList = document.getElementById('status-building-list');
    const liveList = document.getElementById('status-live-list');
    const availabilityList = document.getElementById('availability-list');
    const timeline = document.getElementById('status-timeline');

    if (!buildingList || !liveList || !availabilityList || !timeline) {
        return;
    }

    buildingList.textContent = '';
    liveList.textContent = '';
    availabilityList.textContent = '';
    timeline.textContent = '';

    const buildingProjects = projects.filter((project) => project.status === 'building' || project.status === 'pilot');
    const liveProjects = projects.filter((project) => project.status === 'live');

    if (!buildingProjects.length) {
        buildingList.append(createEmptyState('No active building/pilot project right now.'));
    } else {
        buildingProjects.forEach((project) => {
            buildingList.append(createStatusItem(project));
        });
    }

    if (!liveProjects.length) {
        liveList.append(createEmptyState('No live project listed yet.'));
    } else {
        liveProjects.forEach((project) => {
            liveList.append(createStatusItem(project));
        });
    }

    if (!availability.length) {
        availabilityList.append(createEmptyState('Add your current availability from the admin panel.'));
    } else {
        availability.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            availabilityList.append(li);
        });
    }

    timeline.append(createTimelineRow('Live', liveProjects.map((item) => item.name).join(', ') || 'No live project listed.', 'status-live'));
    timeline.append(createTimelineRow('Building', projects.filter((item) => item.status === 'building').map((item) => item.name).join(', ') || 'No building project listed.', 'status-building'));
    timeline.append(createTimelineRow('Pilot', projects.filter((item) => item.status === 'pilot').map((item) => item.name).join(', ') || 'No pilot project listed.', 'status-pilot'));
}

function createStatusItem(project) {
    const li = document.createElement('li');
    const status = STATUS_META[project.status] || STATUS_META.pilot;

    const chip = document.createElement('span');
    chip.className = `status-chip ${status.className}`;
    chip.textContent = status.label;

    const paragraph = document.createElement('p');
    paragraph.className = 'status-description';
    const strong = document.createElement('strong');
    strong.textContent = `${project.name || 'Untitled Project'}: `;
    paragraph.append(strong, document.createTextNode(project.description || ''));

    let statusToggle = null;
    if ((project.description || '').length > 120) {
        paragraph.classList.add('is-collapsed');
        statusToggle = document.createElement('button');
        statusToggle.type = 'button';
        statusToggle.className = 'status-read-more';
        statusToggle.textContent = 'View more';
        statusToggle.addEventListener('click', () => {
            const expanded = paragraph.classList.toggle('is-expanded');
            statusToggle.textContent = expanded ? 'View less' : 'View more';
        });
    }

    li.append(chip, paragraph);
    if (statusToggle) {
        li.append(statusToggle);
    }

    const linkData = getProjectLink(project);
    if (linkData.url) {
        const anchor = document.createElement('a');
        anchor.className = 'status-link';
        anchor.href = linkData.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = STATUS_META[project.status]?.linkLabel || 'Open Link';
        li.append(anchor);
    }

    return li;
}

function createTimelineRow(label, description, statusClass) {
    const row = document.createElement('div');
    row.className = 'timeline-row';

    const state = document.createElement('span');
    state.className = `timeline-state status-chip ${statusClass}`;
    state.textContent = label;

    const text = document.createElement('p');
    text.textContent = description;

    row.append(state, text);
    return row;
}

function renderAchievements(achievements) {
    const achievementGrid = document.getElementById('achievement-grid');
    if (!achievementGrid) {
        return;
    }

    achievementGrid.textContent = '';

    if (!achievements.length) {
        achievementGrid.append(createEmptyState('No achievements yet. Add one from the admin panel.'));
        return;
    }

    achievements.forEach((achievement) => {
        const card = document.createElement('article');
        card.className = 'achievement-card';
        card.setAttribute('data-reveal', '');

        const title = document.createElement('h3');
        title.textContent = achievement.title || 'Untitled Achievement';

        const description = document.createElement('p');
        description.textContent = achievement.description || '';

        card.append(title, description);
        achievementGrid.append(card);
    });
}

function renderEducation(educationItems) {
    const educationGrid = document.getElementById('education-grid');
    if (!educationGrid) {
        return;
    }

    educationGrid.textContent = '';

    if (!educationItems.length) {
        educationGrid.append(createEmptyState('No education items yet.'));
        return;
    }

    educationItems.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'education-card';
        card.setAttribute('data-reveal', '');

        const icon = document.createElement('i');
        icon.className = item.icon || 'fas fa-graduation-cap';

        const wrap = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = item.title || 'Untitled Training';

        const institution = document.createElement('p');
        institution.className = 'institution';
        institution.textContent = item.institution || '';

        const duration = document.createElement('p');
        duration.className = 'duration';
        duration.textContent = item.duration || '';

        wrap.append(title, institution, duration);
        card.append(icon, wrap);
        educationGrid.append(card);
    });
}

function renderContact(contact) {
    const whatsappAnchor = document.getElementById('contact-whatsapp');
    const whatsappLabel = document.getElementById('contact-whatsapp-label');
    const emailAnchor = document.getElementById('contact-email');
    const emailLabel = document.getElementById('contact-email-label');
    const twitterAnchor = document.getElementById('contact-twitter');
    const twitterLabel = document.getElementById('contact-twitter-label');
    const facebookAnchor = document.getElementById('contact-facebook');
    const facebookLabel = document.getElementById('contact-facebook-label');

    const footerWhatsapp = document.getElementById('footer-whatsapp');
    const footerTwitter = document.getElementById('footer-twitter');
    const footerFacebook = document.getElementById('footer-facebook');
    const footerGithub = document.getElementById('footer-github');
    const ctaWhatsapp = document.getElementById('cta-whatsapp');
    const ctaEmail = document.getElementById('cta-email');

    if (whatsappAnchor) whatsappAnchor.href = contact.whatsapp.url || '#';
    if (whatsappLabel) whatsappLabel.textContent = contact.whatsapp.label || '';

    if (emailAnchor) emailAnchor.href = `mailto:${contact.email || ''}`;
    if (emailLabel) emailLabel.textContent = contact.email || '';

    if (twitterAnchor) twitterAnchor.href = contact.twitter.url || '#';
    if (twitterLabel) twitterLabel.textContent = contact.twitter.label || '';

    if (facebookAnchor) facebookAnchor.href = contact.facebook.url || '#';
    if (facebookLabel) facebookLabel.textContent = contact.facebook.label || '';

    if (footerWhatsapp) footerWhatsapp.href = contact.whatsapp.url || '#';
    if (footerTwitter) footerTwitter.href = contact.twitter.url || '#';
    if (footerFacebook) footerFacebook.href = contact.facebook.url || '#';
    if (footerGithub) footerGithub.href = contact.github.url || '#';

    if (ctaWhatsapp) ctaWhatsapp.href = contact.whatsapp.url || '#';
    if (ctaEmail) ctaEmail.href = `mailto:${contact.email || ''}`;
}

function bindNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');

    const closeMobileMenu = () => {
        if (!hamburger || !navMenu) {
            return;
        }

        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    const highlightNavLink = () => {
        let activeSection = '';
        const navOffset = navbar ? navbar.offsetHeight + 28 : 100;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - navOffset;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                activeSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) {
                link.classList.remove('active');
                return;
            }
            link.classList.toggle('active', href === `#${activeSection}`);
        });
    };

    const onScroll = () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 18);
        }

        highlightNavLink();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function bindCtaWidget() {
    const floatingCta = document.getElementById('floatingCta');
    const ctaOptions = document.getElementById('ctaOptions');
    const ctaButton = floatingCta ? floatingCta.querySelector('.cta-button') : null;

    if (!floatingCta || !ctaOptions || !ctaButton) {
        return;
    }

    ctaButton.addEventListener('click', (event) => {
        event.stopPropagation();
        ctaOptions.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (!floatingCta.contains(event.target)) {
            ctaOptions.classList.remove('active');
        }
    });
}

function bindBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) {
        return;
    }

    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function bindRevealObserver() {
    const revealTargets = document.querySelectorAll('[data-reveal]');

    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -8% 0px'
        }
    );

    revealTargets.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 35, 280)}ms`;
        revealObserver.observe(item);
    });
}

function bindContactForm(contactEmail) {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        try {
            const response = await fetch('https://formspree.io/f/xyzbblen', {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Formspree request failed');
            }

            showNotification('Message sent. I will get back to you shortly.', 'success');
            contactForm.reset();
        } catch (error) {
            console.error(error);
            showNotification(`Message failed. Please email me directly at ${contactEmail || 'bamiebot@gmail.com'}.`, 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
}

function showNotification(message, type) {
    const existing = document.querySelector('.form-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;

    const color = type === 'success' ? '#00b970' : '#ff6f3c';

    notification.style.cssText = `
        position: fixed;
        top: 96px;
        right: 20px;
        max-width: 360px;
        z-index: 1200;
        background: ${color};
        color: #ffffff;
        padding: 14px 16px;
        border-radius: 12px;
        box-shadow: 0 16px 30px rgba(4, 22, 46, 0.24);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.25s ease;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        border: none;
        background: transparent;
        color: inherit;
        font-size: 1.15rem;
        line-height: 1;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
    `;

    closeBtn.addEventListener('click', () => notification.remove());
    document.body.appendChild(notification);

    window.setTimeout(() => {
        if (notification.isConnected) {
            notification.remove();
        }
    }, 5000);
}

function bindImageFallbacks() {
    const projectImages = document.querySelectorAll('.project-img');
    projectImages.forEach((img) => {
        img.onerror = () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWRmN2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJTcGFjZSBHcm90ZXNrLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmaWxsPSIjMzI0NDY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJvamVjdCBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg==';
        };
    });
}

function updateYear() {
    const yearNode = document.getElementById('year');
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }
}

function createEmptyState(message) {
    const item = document.createElement('p');
    item.className = 'empty-state';
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
