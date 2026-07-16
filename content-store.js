(() => {
    const STORAGE_KEY = 'bamietech_portfolio_content';
    const LEGACY_STORAGE_KEYS = [
        'bamietech_portfolio_content_v3',
        'bamietech_portfolio_content_v2',
        'bamietech_portfolio_content_v1'
    ];

    const DEFAULT_CONTENT = {
        profile: {
            brandName: 'BamietechDev',
            fullName: 'Ibrahim Sobur Bamidele',
            heroTag: 'Open to product + Web3 collaborations',
            roleLine: 'Software Engineer | Web Developer | AI Prompt Engineer | Web3 Solidity Developer',
            heroDescription: 'I build secure, high-performance web applications, robust APIs, and interactive user experiences across Web2 and Web3 with user flows that feel fast and clear on every device.',
            aboutParagraphs: [
                'I am Ibrahim Sobur Bamidele, a software engineer from Ekiti State, Nigeria. I lived in Akure and currently study in Dutse while building useful systems across Web2 and Web3.',
                'I focus on shipping practical products where backend logic, frontend clarity, and blockchain workflows connect cleanly. Every build targets reliability first, then scale.',
                'Outside core development, I mentor peers and lead teams in hackathons and community technical spaces.'
            ],
            stats: [
                { value: '10+', label: 'Shipped projects' },
                { value: '3+', label: 'Years of building' },
                { value: '24/7', label: 'Iteration mindset' }
            ]
        },
        contact: {
            whatsapp: {
                label: '+2349129324801',
                url: 'https://wa.me/2349129324801'
            },
            email: 'bamiebot@gmail.com',
            twitter: {
                label: '@bamietech_dev',
                url: 'https://twitter.com/bamietech_dev'
            },
            facebook: {
                label: 'Ibrahim Bamidele',
                url: 'https://facebook.com/IbrahimBamidele'
            },
            github: {
                label: 'bamiebot-maker',
                url: 'https://github.com/bamiebot-maker/'
            },
            resumeUrl: 'assets/Ibrahim_Sobur_Bamidele_Resume.pdf'
        },
        availability: [
            'Freelance: Open for product builds and feature delivery.',
            'Collaboration: Open to startup and hackathon teams.',
            'Best-fit work: Full-stack products, Web3 integrations, rapid MVP launches.'
        ],
        projects: [
            {
                id: 'owlvault',
                name: 'Owlvault',
                description: 'Secure digital vault application for transferring digital data and managing sensitive information.',
                status: 'live',
                track: 'Security App',
                imageUrl: 'img/projects/owlvault.jpg',
                liveUrl: 'https://owl-vault.vercel.app/',
                repoUrl: '',
                tags: ['Security', 'Web App', 'Production']
            },
            {
                id: 'logie-app',
                name: 'Logie App',
                description: 'Rental apartment management system currently in development with management-focused workflows.',
                status: 'building',
                track: 'PropTech',
                imageUrl: 'img/projects/logie.jpg',
                liveUrl: '',
                repoUrl: 'https://github.com/bamiebot-maker/lodgie-hostel-app',
                tags: ['In Progress', 'Rental System', 'Backend Logic']
            },
            {
                id: 'bamiedata',
                name: 'Bamiedata',
                description: 'VTU platform for seamless airtime and data transactions with customer service focus.',
                status: 'live',
                track: 'Commerce',
                imageUrl: 'img/projects/bamiedata.jpg',
                liveUrl: 'https://bamiedata.com.ng',
                repoUrl: '',
                tags: ['VTU', 'E-commerce', 'Operations']
            },
            {
                id: 'fud-security-portal',
                name: 'FUD Security Portal',
                description: 'Security portal for Federal University Dutse designed to improve campus safety workflows.',
                status: 'pilot',
                track: 'Gov / Edu',
                imageUrl: 'img/projects/fud-security.jpg',
                liveUrl: '',
                repoUrl: '',
                tags: ['Security', 'University', 'Internal Use']
            },
            {
                id: 'fudblo',
                name: 'FudBlo',
                description: 'Campus navigation system for Federal University Dutse to reduce friction for movement and orientation.',
                status: 'live',
                track: 'Navigation',
                imageUrl: 'img/projects/fudmap.jpg',
                liveUrl: 'https://fudblo.onrender.com/',
                repoUrl: '',
                tags: ['Mapping', 'University', 'Public Access']
            },
            {
                id: 'mindpal',
                name: 'Mindpal',
                description: 'AI-powered mental wellness application focused on personalized support and guided interactions.',
                status: 'pilot',
                track: 'AI Wellness',
                imageUrl: 'img/projects/mindpal.jpg',
                liveUrl: 'https://bit.ly/mind_pal/',
                repoUrl: '',
                tags: ['AI', 'Wellness', 'Prototype']
            },
            {
                id: 'kestrelpay',
                name: 'Kestrelpay',
                description: 'Web3 dApp for secure crypto transactions, currently being improved from hackathon build to stronger product version.',
                status: 'building',
                track: 'Web3 dApp',
                imageUrl: 'img/projects/kestrelpay.jpg',
                liveUrl: '',
                repoUrl: 'https://github.com/bamiebot-maker/kestrelpay',
                tags: ['Web3', 'Blockchain', 'Hackathon']
            },
            {
                id: 'spoovault',
                name: 'SpooVault',
                description: "SpooVault secures critical documents for everyday control while you're alive, with guardian-governed emergency and inheritance release when needed.",
                status: 'live',
                track: 'Document Security',
                imageUrl: 'img/projects/spoovault.png',
                liveUrl: 'https://spoolvault.web.app',
                repoUrl: 'https://github.com/bamiebot-maker/spoovault',
                tags: ['Security', 'Document Vault', 'Web App']
            },
            {
                id: 'silentcall',
                name: 'SilentCall',
                description: 'Privacy-focused communication project currently in active build phase.',
                status: 'building',
                track: 'Privacy Communication',
                imageUrl: 'img/projects/silentcall.svg',
                liveUrl: '',
                repoUrl: 'https://github.com/bamiebot-maker/silentcall',
                tags: ['Building', 'Privacy', 'Communication']
            },
            {
                id: 'abovert',
                name: 'AboVert',
                description: 'AboVert is a smart plant-health app that instantly scans plants to detect existing diseases and predict potential viral infections. It helps farmers and gardeners identify problems early and protect plants before damage spreads.',
                status: 'live',
                track: 'AgriTech AI',
                imageUrl: 'img/projects/abovert.png',
                liveUrl: 'https://abovert.web.app',
                repoUrl: 'https://github.com/bamiebot-maker/AboVert',
                tags: ['Plant Health', 'Disease Detection', 'AI']
            },
            {
                id: 'mynavio',
                name: 'MyNavio',
                description: 'Campus navigator map with handouts and essential resources for students.',
                status: 'live',
                track: 'Campus Navigation',
                imageUrl: 'img/projects/mynavio.png',
                liveUrl: 'https://mynavio.web.app',
                repoUrl: 'https://github.com/bamiebot-maker/myfudnavio',
                tags: ['Campus Map', 'Resources', 'Student Tools']
            },
            {
                id: 'cognitivia',
                name: 'Cognitivia',
                description: 'Cognitivia is a frontend-only web app that turns notes into flashcards and quizzes, runs study sessions, and tracks progress over time with local persistence.',
                status: 'live',
                track: 'EdTech',
                imageUrl: 'img/projects/cognitivia.png',
                liveUrl: 'https://cognitivia.web.app',
                repoUrl: 'https://github.com/bamiebot-maker/Cognitivia',
                tags: ['Flashcards', 'Quizzes', 'Study Tracker']
            },
            {
                id: 'cholerai',
                name: 'Cholerai',
                description: 'Cholera detection platform powered by data and designed for early cholera detection.',
                status: 'live',
                track: 'HealthTech',
                imageUrl: 'img/projects/cholerai.png',
                liveUrl: 'https://chorai.web.app',
                repoUrl: 'https://github.com/bamiebot-maker/cholerai',
                tags: ['Health AI', 'Early Detection', 'Data-driven']
            },
            {
                id: 'push-or-pass',
                name: 'Push or Pass',
                description: "A community-driven daily game where your votes shape tomorrow's challenge. Vote today, play tomorrow.",
                status: 'live',
                track: 'Social Game',
                imageUrl: 'img/projects/push-or-pass.svg',
                liveUrl: 'https://push-or-pass.vercel.app',
                repoUrl: 'https://github.com/bamiebot-maker/push-or-pass',
                tags: ['Community', 'Daily Challenge', 'Voting']
            }
        ],
        achievements: [
            {
                id: 'owner-bamiedata',
                title: 'Owner of Bamiedata',
                description: 'Founded and manage a VTU platform serving customers across regions.'
            },
            {
                id: 'team-leader-eagle-devs',
                title: 'Team Leader at Eagle Devs',
                description: 'Lead developer teams in hackathon competitions and delivery sprints.'
            },
            {
                id: 'top-devcrib-alpha',
                title: 'Top 1 (DevCrib Alpha)',
                description: 'Ranked top position within DevCrib Community at Federal University Dutse.'
            },
            {
                id: 'member-gdg-fud',
                title: 'Member, GDG FUD',
                description: 'Active member in Google Developer Group community activities.'
            },
            {
                id: 'fessu-senator',
                title: 'FESSU Senator, FUD',
                description: 'Represented Federal University Dutse in student governance leadership.'
            },
            {
                id: 'secretary-general-msso',
                title: 'Secretary General, MSSO B-Zone',
                description: 'Coordinated administration and leadership execution for zonal operations.'
            },
            {
                id: 'ach-blockdag',
                title: 'Winner, BlockDAG Buildathon',
                description: 'First place winner in the BlockDAG ecosystem buildathon.'
            },
            {
                id: 'ach-devcrib-top2',
                title: 'Top 2 Developer – Devcrib',
                description: 'Recognized as one of the top 2 active developer community members.'
            },
            {
                id: 'ach-se-hub',
                title: 'Software Engineering (Programming Hub)',
                description: 'Certified software engineering graduate from Programming Hub.'
            },
            {
                id: 'ach-tribex',
                title: 'Tribe X Full Stack Dev Training',
                description: 'Graduated from intensive Tribe X web development bootcamp.'
            },
            {
                id: 'ach-huawei',
                title: 'Huawei AI Bootcamp',
                description: 'Completed specialized AI concepts and models training.'
            },
            {
                id: 'ach-boosha',
                title: 'Boosha Certification',
                description: 'Certified blockchain developer and participant.'
            }
        ],
        education: [
            {
                id: 'fud-software',
                icon: 'fas fa-graduation-cap',
                title: 'Software Engineering',
                institution: 'Federal University Dutse',
                duration: 'Penultimate Student'
            },
            {
                id: 'trybe-bootcamp',
                icon: 'fas fa-laptop-code',
                title: 'Web Development',
                institution: 'Trybe_X Bootcamp',
                duration: '2024'
            },
            {
                id: 'codebro-youtube',
                icon: 'fab fa-youtube',
                title: 'Codebro Tutorials',
                institution: 'Self-paced Learning',
                duration: 'Ongoing'
            },
            {
                id: 'udemy-courses',
                icon: 'fas fa-book',
                title: 'Udemy Courses',
                institution: 'Various Instructors',
                duration: 'Self-paced Learning'
            },
            {
                id: 'w3schools-practice',
                icon: 'fas fa-globe',
                title: 'W3Schools Practice',
                institution: 'Online Resource',
                duration: 'Continuous'
            },
            {
                id: 'opectrat-ai',
                icon: 'fas fa-robot',
                title: 'Opectrat AI Learning',
                institution: 'AI Education Platform',
                duration: '2025'
            }
        ],
        experience: [
            {
                id: 'exp-kindlepath',
                role: 'Software Developer',
                company: 'KindlePath Initiative',
                duration: '2024',
                bullets: [
                    'Developed and maintained modern, highly responsive web applications.',
                    'Collaborated with cross-functional teams to build custom software projects.',
                    'Implemented frontend solutions and optimized application features for performance.'
                ]
            },
            {
                id: 'exp-northdemy',
                role: 'SIWES Intern (Software Development)',
                company: 'Northdemy Limited',
                duration: '2025 - Present',
                bullets: [
                    'Currently undergoing intensive industrial software engineering training.',
                    'Actively contributing to full-stack software development pipelines.',
                    'Supporting web application builds and integrating AI-related workflows.'
                ]
            },
            {
                id: 'exp-drips-grantfox',
                role: 'Open Source Contributor',
                company: 'Drips & Grantfox',
                duration: '2023 - Present',
                bullets: [
                    'Contributed to decentralized funding protocols and ecosystem infrastructure tools.',
                    'Collaborated with global developer communities on code reviews, features, and optimization.'
                ]
            }
        ]
    };

    const deepClone = (value) => JSON.parse(JSON.stringify(value));

    const buildId = (prefix = 'item') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ensureArray = (value) => (Array.isArray(value) ? value : []);

    const slugify = (value) => String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');

    const getCanonicalProjectKey = (project) => {
        const id = slugify(project && project.id);
        const name = slugify(project && project.name);
        const liveUrl = slugify(project && project.liveUrl);
        const repoUrl = slugify(project && project.repoUrl);
        const haystack = `${id} ${name} ${liveUrl} ${repoUrl}`;

        if (haystack.includes('spoovault') || haystack.includes('spoolvault')) return 'spoovault';
        if (haystack.includes('mynavio') || haystack.includes('myfudnavio')) return 'mynavio';
        if (haystack.includes('abovert')) return 'abovert';
        if (haystack.includes('cholerai') || haystack.includes('chorai')) return 'cholerai';
        if (haystack.includes('kestrelpay')) return 'kestrelpay';
        if (haystack.includes('silentcall')) return 'silentcall';
        if (haystack.includes('pushorpass')) return 'push-or-pass';
        if (haystack.includes('fudblo')) return 'fudblo';
        return '';
    };

    const ensureOriginInAboutParagraphs = (paragraphs) => {
        const items = ensureArray(paragraphs).filter(Boolean).slice(0, 3);
        const originLine = 'I am Ibrahim Sobur Bamidele, a software engineer from Ekiti State, Nigeria. I lived in Akure and currently study in Dutse while building useful systems across Web2 and Web3.';
        const hasOrigin = items.some((item) => {
            const normalized = String(item || '').toLowerCase();
            return normalized.includes('ekiti') || normalized.includes('akure') || normalized.includes('dutse');
        });

        if (hasOrigin) {
            return items;
        }

        return [originLine, ...items].slice(0, 3);
    };

    const sanitizeProjects = (projects) => ensureArray(projects)
        .filter((project) => project && getCanonicalProjectKey(project) !== 'fudblo');

    const getStoredRawContent = () => {
        const candidateKeys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
        for (const key of candidateKeys) {
            const raw = localStorage.getItem(key);
            if (!raw) {
                continue;
            }

            if (key !== STORAGE_KEY) {
                localStorage.setItem(STORAGE_KEY, raw);
            }

            return raw;
        }
        return null;
    };

    const clearLegacyStorage = () => {
        LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    };

    const normalizeProjectStatus = (status) => {
        const safe = String(status || '').toLowerCase();
        if (safe === 'live' || safe === 'building' || safe === 'pilot') {
            return safe;
        }
        return 'pilot';
    };

    const normalizeContent = (raw) => {
        const base = deepClone(DEFAULT_CONTENT);
        const data = raw && typeof raw === 'object' ? raw : {};

        const profile = data.profile && typeof data.profile === 'object' ? data.profile : {};
        const useCustomAbout = Array.isArray(profile.aboutParagraphs);
        const useCustomStats = Array.isArray(profile.stats);

        base.profile = {
            ...base.profile,
            ...profile,
            aboutParagraphs: useCustomAbout
                ? ensureOriginInAboutParagraphs(profile.aboutParagraphs)
                : ensureOriginInAboutParagraphs(base.profile.aboutParagraphs),
            stats: useCustomStats
                ? ensureArray(profile.stats).slice(0, 3).map((item) => ({
                    value: (item && item.value) || '',
                    label: (item && item.label) || ''
                }))
                : deepClone(base.profile.stats)
        };

        const contact = data.contact && typeof data.contact === 'object' ? data.contact : {};
        if (contact.resumeUrl === 'assets/Ibrahim_Bamidele_Resume.pdf') {
            contact.resumeUrl = 'assets/Ibrahim_Sobur_Bamidele_Resume.pdf';
        }
        base.contact = {
            ...base.contact,
            ...contact,
            whatsapp: {
                ...base.contact.whatsapp,
                ...(contact.whatsapp && typeof contact.whatsapp === 'object' ? contact.whatsapp : {})
            },
            twitter: {
                ...base.contact.twitter,
                ...(contact.twitter && typeof contact.twitter === 'object' ? contact.twitter : {})
            },
            facebook: {
                ...base.contact.facebook,
                ...(contact.facebook && typeof contact.facebook === 'object' ? contact.facebook : {})
            },
            github: {
                ...base.contact.github,
                ...(contact.github && typeof contact.github === 'object' ? contact.github : {})
            }
        };

        base.availability = Array.isArray(data.availability)
            ? ensureArray(data.availability).filter(Boolean)
            : deepClone(DEFAULT_CONTENT.availability);

        base.projects = Array.isArray(data.projects)
            ? sanitizeProjects(data.projects).map((project) => {
                const canonicalKey = getCanonicalProjectKey(project);
                const id = canonicalKey || project.id || buildId('project');
                const imageUrl = project.imageUrl || '';
                const normalizedImageUrl = id === 'silentcall' && (!imageUrl || imageUrl === 'img/projects/silentcall.jpg')
                    ? 'img/projects/silentcall.svg'
                    : imageUrl;

                return {
                    id,
                    name: project.name || 'Untitled Project',
                    description: project.description || '',
                    status: normalizeProjectStatus(project.status),
                    track: project.track || '',
                    imageUrl: normalizedImageUrl,
                    liveUrl: project.liveUrl || '',
                    repoUrl: project.repoUrl || '',
                    tags: ensureArray(project.tags).filter(Boolean)
                };
            })
            : sanitizeProjects(deepClone(DEFAULT_CONTENT.projects));

        base.achievements = Array.isArray(data.achievements)
            ? ensureArray(data.achievements).map((item) => ({
                id: item.id || buildId('achievement'),
                title: item.title || 'Untitled Achievement',
                description: item.description || ''
            }))
            : deepClone(DEFAULT_CONTENT.achievements);

        base.education = Array.isArray(data.education)
            ? ensureArray(data.education).map((item) => ({
                id: item.id || buildId('education'),
                icon: item.icon || 'fas fa-graduation-cap',
                title: item.title || 'Untitled Training',
                institution: item.institution || '',
                duration: item.duration || ''
            }))
            : deepClone(DEFAULT_CONTENT.education);

        base.experience = Array.isArray(data.experience)
            ? ensureArray(data.experience).map((item) => ({
                id: item.id || buildId('experience'),
                role: item.role || '',
                company: item.company || '',
                duration: item.duration || '',
                bullets: ensureArray(item.bullets).filter(Boolean)
            }))
            : deepClone(DEFAULT_CONTENT.experience);

        return base;
    };

    const getContent = () => {
        try {
            const raw = getStoredRawContent();
            if (!raw) {
                return deepClone(DEFAULT_CONTENT);
            }

            const normalized = normalizeContent(JSON.parse(raw));
            const serialized = JSON.stringify(normalized);
            if (serialized !== raw) {
                localStorage.setItem(STORAGE_KEY, serialized);
                clearLegacyStorage();
            }

            return normalized;
        } catch (error) {
            console.error('Failed to parse portfolio content from storage:', error);
            return deepClone(DEFAULT_CONTENT);
        }
    };

    const saveContent = (content) => {
        const normalized = normalizeContent(content);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        clearLegacyStorage();
        return normalized;
    };

    const resetContent = () => {
        localStorage.removeItem(STORAGE_KEY);
        clearLegacyStorage();
        return deepClone(DEFAULT_CONTENT);
    };

    window.PortfolioContentStore = {
        STORAGE_KEY,
        LEGACY_STORAGE_KEYS: deepClone(LEGACY_STORAGE_KEYS),
        DEFAULT_CONTENT: deepClone(DEFAULT_CONTENT),
        getContent,
        saveContent,
        resetContent,
        deepClone,
        buildId,
        normalizeProjectStatus
    };
})();
