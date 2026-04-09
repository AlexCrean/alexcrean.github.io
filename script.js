const sidebar = document.getElementById("sidebar");
const menuToggle = document.querySelector(".menu-toggle");
const brandHome = document.getElementById("brandHome");
const homeNavLink = document.getElementById("homeNavLink");
const searchInput = document.getElementById("searchInput");
const navGroups = document.getElementById("navGroups");
const accessToggle = document.getElementById("accessToggle");
const accessPanel = document.getElementById("accessPanel");
const aiToggle = document.getElementById("aiToggle");
const aiPanel = document.getElementById("aiPanel");
const accessForm = document.getElementById("accessForm");
const accessCollapse = document.getElementById("accessCollapse");
const accessReset = document.getElementById("accessReset");
const personalLink = document.getElementById("personalLink");
const linkedinLink = document.getElementById("linkedinLink");
const pageGroup = document.getElementById("pageGroup");
const pageTitle = document.getElementById("pageTitle");
const pageSummary = document.getElementById("pageSummary");
const pageOverview = document.getElementById("pageOverview");
const pageMeta = document.getElementById("pageMeta");
const pageAssets = document.getElementById("pageAssets");
const assetLocationCard = document.getElementById("assetLocationCard");
const assetLocationPath = document.getElementById("assetLocationPath");
const mediaGallery = document.getElementById("mediaGallery");
const sectionList = document.getElementById("sectionList");
const pageAddonAssets = document.getElementById("pageAddonAssets");
const addonMediaGallery = document.getElementById("addonMediaGallery");
const changelogMount = document.getElementById("changelogMount");

const viewer = window.DOCS_VIEWER;
const routeMap = new Map();
const aliasMap = new Map();
const groupMap = new Map();
const pageSearchIndex = new Map();
const groupSearchIndex = new Map();
const referenceSearchIndex = [];
const openGroups = new Set(viewer.groups.map((group) => group.slug));
const isFileProtocol = window.location.protocol === "file:";
const ACCESS_STORAGE_KEY = "ac_tools_accessibility";
const defaultAccessibilityPrefs = {
    textSize: "default",
    contrast: "default",
    reduceMotion: false,
    underlineLinks: false,
    focusBoost: false
};
const knownRoots = new Set(
    viewer.groups.flatMap((group) => [
        group.slug,
        ...(group.aliases || [])
            .map((alias) => String(alias).replace(/^\/+|\/+$/g, "").split("/")[0].toLowerCase())
            .filter(Boolean)
    ])
);

let currentRoute = "/";
let currentFragment = "";
let searchQuery = "";
const REF_SEARCH_TOKEN = "#ref";
const CONFIG_DEFINITION_URL = "https://opensource.com/article/21/6/what-config-files";

let accessibilityPrefs = { ...defaultAccessibilityPrefs };

const escapeHtml = (value = "") =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const withDefinitionLinks = (value = "") => {
    const escaped = escapeHtml(value);
    return escaped.replace(/\b(config asset|config file|config)\b/gi, (match) =>
        `<a class="definition-link" href="${CONFIG_DEFINITION_URL}" target="_blank" rel="noreferrer">${match}</a>`
    );
};

const normalizeRoute = (value) => {
    if (!value) {
        return "/";
    }

    const cleanValue = String(value)
        .split("?")[0]
        .split("#")[0]
        .trim()
        .replace(/^https?:\/\/[^/]+/i, "");

    if (!cleanValue || cleanValue === "/") {
        return "/";
    }

    const normalized = `/${cleanValue.replace(/^\/+|\/+$/g, "")}`.toLowerCase();
    return normalized === "/index.html" ? "/" : normalized;
};

const normalizeFragment = (value) =>
    String(value || "")
        .replace(/^#+/, "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const getReferenceId = (item) =>
    normalizeFragment(item?.refId || item?.title || item?.caption || "reference");

const getSectionGroupId = (group) =>
    normalizeFragment(group?.refId || group?.title || "section-group");

const getSectionGroupFragments = (group) =>
    [
        getSectionGroupId(group),
        ...((group?.refAliases || []).map((value) => normalizeFragment(value)))
    ].filter(Boolean);

const splitLeadSentence = (value = "") => {
    const text = String(value || "").trim();
    if (!text) {
        return { lead: "", remainder: "" };
    }

    const match = text.match(/^(.+?[.!?])(?:\s+|$)([\s\S]*)$/);
    if (!match) {
        return { lead: text, remainder: "" };
    }

    return {
        lead: match[1].trim(),
        remainder: (match[2] || "").trim()
    };
};

const buildSearchText = (...parts) =>
    parts
        .flat(Infinity)
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

const tokenizeSearchQuery = (value = "") =>
    String(value || "")
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean);

const matchesSearchTokens = (searchText, tokens) => {
    if (!tokens.length) {
        return true;
    }

    return tokens.every((token) => searchText.includes(token));
};

const getSectionId = (section, scopeId = "") =>
    normalizeFragment(section?.refId || [scopeId, section?.heading].filter(Boolean).join("-"));

const getChangelogRootId = (entry) =>
    normalizeFragment(`${entry?.slug || entry?.title || "page"}-changelog`);

const getChangelogGroupId = (group, scopeId = "changelog") =>
    normalizeFragment(group?.refId || [scopeId, group?.title || "group"].filter(Boolean).join("-"));

const getVersionNodeId = (version, scopeId = "version") =>
    normalizeFragment([scopeId, version].filter(Boolean).join("-"));

const compareVersions = (left, right) => {
    const leftParts = String(left || "")
        .split(".")
        .map((value) => Number.parseInt(value, 10) || 0);
    const rightParts = String(right || "")
        .split(".")
        .map((value) => Number.parseInt(value, 10) || 0);
    const maxLength = Math.max(leftParts.length, rightParts.length);

    for (let index = 0; index < maxLength; index += 1) {
        const difference = (leftParts[index] || 0) - (rightParts[index] || 0);
        if (difference !== 0) {
            return difference;
        }
    }

    return 0;
};

const buildVersionTree = (entries = []) => {
    const root = {
        version: "",
        depth: 0,
        entry: null,
        children: new Map()
    };

    entries.forEach((entry) => {
        const parts = String(entry.version || "")
            .split(".")
            .map((value) => value.trim())
            .filter(Boolean);

        if (!parts.length) {
            return;
        }

        let cursor = root;
        const prefix = [];

        parts.forEach((part, index) => {
            prefix.push(part);
            const version = prefix.join(".");

            if (!cursor.children.has(version)) {
                cursor.children.set(version, {
                    version,
                    depth: index + 1,
                    entry: null,
                    children: new Map()
                });
            }

            cursor = cursor.children.get(version);
        });

        cursor.entry = entry;
    });

    return root;
};

const sortVersionNodes = (nodes = []) =>
    [...nodes].sort((left, right) => compareVersions(right.version, left.version));

const collectVersionNodeIds = (node, scopeId, collector = new Set()) => {
    if (!node) {
        return collector;
    }

    if (node.version) {
        collector.add(getVersionNodeId(node.version, scopeId));
    }

    node.children?.forEach((child) => {
        collectVersionNodeIds(child, scopeId, collector);
    });

    return collector;
};

const loadAccessibilityPrefs = () => {
    try {
        const raw = window.localStorage.getItem(ACCESS_STORAGE_KEY);
        if (!raw) {
            return { ...defaultAccessibilityPrefs };
        }

        const parsed = JSON.parse(raw);
        return {
            ...defaultAccessibilityPrefs,
            ...parsed
        };
    } catch {
        return { ...defaultAccessibilityPrefs };
    }
};

const saveAccessibilityPrefs = () => {
    try {
        window.localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(accessibilityPrefs));
    } catch {}
};

const toggleBodyDataset = (name, value, defaultValue = "", target = document.body) => {
    if (!target) {
        return;
    }

    if (!value || value === defaultValue) {
        delete target.dataset[name];
        return;
    }

    target.dataset[name] = value;
};

const applyAccessibilityPrefs = () => {
    toggleBodyDataset("textSize", accessibilityPrefs.textSize, "default");
    toggleBodyDataset("contrast", accessibilityPrefs.contrast, "default");
    toggleBodyDataset("motion", accessibilityPrefs.reduceMotion ? "reduced" : "", "");
    toggleBodyDataset("links", accessibilityPrefs.underlineLinks ? "underlined" : "", "");
    toggleBodyDataset("focus", accessibilityPrefs.focusBoost ? "boosted" : "", "");

    toggleBodyDataset("motion", accessibilityPrefs.reduceMotion ? "reduced" : "", "", document.documentElement);
};

const syncAccessibilityForm = () => {
    if (!accessForm) {
        return;
    }

    const textSize = accessForm.elements.namedItem("textSize");
    const contrast = accessForm.elements.namedItem("contrast");
    const reduceMotion = accessForm.elements.namedItem("reduceMotion");
    const underlineLinks = accessForm.elements.namedItem("underlineLinks");
    const focusBoost = accessForm.elements.namedItem("focusBoost");

    Array.from(textSize).forEach((input) => {
        input.checked = input.value === accessibilityPrefs.textSize;
    });

    Array.from(contrast).forEach((input) => {
        input.checked = input.value === accessibilityPrefs.contrast;
    });

    reduceMotion.checked = accessibilityPrefs.reduceMotion;
    underlineLinks.checked = accessibilityPrefs.underlineLinks;
    focusBoost.checked = accessibilityPrefs.focusBoost;
};

const openAccessPanel = () => {
    if (!accessPanel || !accessToggle) {
        return;
    }

    accessPanel.hidden = false;
    accessToggle.setAttribute("aria-expanded", "true");
};

const closeAccessPanel = () => {
    if (!accessPanel || !accessToggle) {
        return;
    }

    accessPanel.hidden = true;
    accessToggle.setAttribute("aria-expanded", "false");
};

const toggleAccessPanel = () => {
    if (!accessPanel) {
        return;
    }

    if (accessPanel.hidden) {
        openAccessPanel();
        return;
    }

    closeAccessPanel();
};

const openAiPanel = () => {
    if (!aiPanel || !aiToggle) {
        return;
    }

    aiPanel.hidden = false;
    aiToggle.setAttribute("aria-expanded", "true");
};

const closeAiPanel = () => {
    if (!aiPanel || !aiToggle) {
        return;
    }

    aiPanel.hidden = true;
    aiToggle.setAttribute("aria-expanded", "false");
};

const attachHoldReset = (button, onComplete, durationMs = 10000) => {
    if (!button) {
        return;
    }

    let holdStart = 0;
    let frameId = 0;
    let holding = false;

    const setProgress = (value) => {
        button.style.setProperty("--hold-progress", String(value));
    };

    const stop = () => {
        holding = false;
        holdStart = 0;
        if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
        }
        setProgress(0);
    };

    const tick = (now) => {
        if (!holding) {
            return;
        }

        const progress = Math.min((now - holdStart) / durationMs, 1);
        setProgress(progress);

        if (progress >= 1) {
            stop();
            onComplete();
            return;
        }

        frameId = window.requestAnimationFrame(tick);
    };

    const start = () => {
        stop();
        holding = true;
        holdStart = performance.now();
        frameId = window.requestAnimationFrame(tick);
    };

    button.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
            return;
        }
        start();
    });

    ["pointerup", "pointerleave", "pointercancel", "blur"].forEach((eventName) => {
        button.addEventListener(eventName, stop);
    });

    button.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            if (!holding) {
                start();
            }
        }
    });

    button.addEventListener("keyup", (event) => {
        if (event.key === " " || event.key === "Enter") {
            stop();
        }
    });
};

const toggleAiPanel = () => {
    if (!aiPanel) {
        return;
    }

    if (aiPanel.hidden) {
        openAiPanel();
        return;
    }

    closeAiPanel();
};

const getPathSegments = (pathname = window.location.pathname) =>
    pathname
        .split("/")
        .filter(Boolean)
        .filter((segment) => !["index.html", "404.html"].includes(segment.toLowerCase()));

const getBaseSegments = () => {
    const segments = getPathSegments();
    const routeIndex = segments.findIndex((segment) => knownRoots.has(segment.toLowerCase()));
    return routeIndex === -1 ? segments : segments.slice(0, routeIndex);
};

const baseSegments = getBaseSegments();
const basePath = baseSegments.length ? `/${baseSegments.join("/")}` : "";

const buildUrl = (route, fragment = "") => {
    const normalized = normalizeRoute(route);
    const hashSuffix = fragment ? `#${fragment}` : "";

    if (isFileProtocol) {
        const baseFile = window.location.pathname;
        return normalized === "/"
            ? `${baseFile}${hashSuffix}`
            : `${baseFile}?route=${encodeURIComponent(normalized)}${hashSuffix}`;
    }

    if (normalized === "/") {
        return `${basePath || ""}/${hashSuffix}`;
    }

    return `${basePath}${normalized}${hashSuffix}`;
};

const buildAssetUrl = (assetPath) => {
    const cleanPath = assetPath.replace(/^\/+/, "");
    return `${basePath ? `${basePath}/` : "/"}${cleanPath}`;
};

const buildExternalUrl = (url) => {
    if (!url) {
        return "#";
    }

    return url;
};

const registerRoute = (entry) => {
    routeMap.set(entry.route, entry);

    (entry.aliases || []).forEach((alias) => {
        aliasMap.set(normalizeRoute(alias), entry.route);
    });
};

registerRoute({
    ...viewer.home,
    type: "home"
});

viewer.groups.forEach((group) => {
    groupMap.set(group.slug, group);

    registerRoute({
        ...group.landing,
        type: "group",
        groupSlug: group.slug,
        groupTitle: group.title,
        route: `/${group.slug}`
    });

    group.pages.forEach((page) => {
        registerRoute({
            ...page,
            type: "page",
            groupSlug: group.slug,
            groupTitle: group.title,
            route: `/${group.slug}/${page.slug}`
        });
    });
});

const buildReferenceResult = ({ groupTitle, pageTitle, pageRoute, title, caption = "", fragment, searchText, hiddenInNav = false }) => ({
    groupTitle,
    pageTitle,
    pageRoute,
    title,
    caption,
    fragment,
    hiddenInNav,
    searchText: buildSearchText(searchText, title, caption)
});

const buildIndexes = () => {
    pageSearchIndex.clear();
    groupSearchIndex.clear();
    referenceSearchIndex.length = 0;

    pageSearchIndex.set(
        viewer.home.route,
        buildSearchText(
            viewer.home.title,
            viewer.home.summary,
            viewer.home.packagePath,
            ...(viewer.home.keywords || []),
            ...(viewer.home.sections || []).flatMap((section) => [
                section.heading,
                ...(section.body || []),
                ...(section.list || [])
            ])
        )
    );

    viewer.groups.forEach((group) => {
        groupSearchIndex.set(
            group.slug,
            buildSearchText(group.title, group.landing?.summary, ...(group.landing?.keywords || []))
        );

        group.pages.forEach((page) => {
            const pageRoute = `/${group.slug}/${page.slug}`;
            const groupTitle = group.title;
            const pageTitle = page.title;
            const pageSearchParts = [
                page.title,
                page.summary,
                page.packagePath,
                ...(page.keywords || []),
                ...(page.aliases || [])
            ];

            (page.sections || []).forEach((section) => {
                const sectionId = getSectionId(section);
                pageSearchParts.push(section.heading, ...(section.body || []), ...(section.list || []));

                referenceSearchIndex.push(
                    buildReferenceResult({
                        groupTitle,
                        pageTitle,
                        pageRoute,
                        title: section.heading,
                        caption: (section.body || [])[0] || "",
                        fragment: sectionId,
                        searchText: buildSearchText(
                            section.heading,
                            ...(section.body || []),
                            ...(section.list || []),
                            ...((section.links || []).map((item) => item.label))
                        )
                    })
                );
            });

            (page.media || []).forEach((item) => {
                pageSearchParts.push(item.title, item.caption, item.alt, ...(item.body || []), ...(item.keywords || []));

                referenceSearchIndex.push(
                    buildReferenceResult({
                        groupTitle,
                        pageTitle,
                        pageRoute,
                        title: item.title || "Reference",
                        caption: item.caption || "",
                        fragment: getReferenceId(item),
                        searchText: buildSearchText(
                            item.group,
                            item.title,
                            item.caption,
                            item.alt,
                            ...(item.body || []),
                            ...(item.keywords || [])
                        )
                    })
                );
            });

            (page.sectionGroups || []).forEach((sectionGroup) => {
                const sectionGroupId = getSectionGroupId(sectionGroup);
                pageSearchParts.push(sectionGroup.title, ...(sectionGroup.summary || []), ...(sectionGroup.keywords || []));

                referenceSearchIndex.push(
                    buildReferenceResult({
                        groupTitle,
                        pageTitle,
                        pageRoute,
                        title: sectionGroup.title,
                        caption: (sectionGroup.summary || [])[0] || "",
                        fragment: sectionGroupId,
                        searchText: buildSearchText(
                            sectionGroup.title,
                            ...(sectionGroup.summary || []),
                            ...(sectionGroup.keywords || [])
                        )
                    })
                );

                (sectionGroup.sections || []).forEach((section) => {
                    const sectionId = getSectionId(section, sectionGroupId);
                    pageSearchParts.push(section.heading, ...(section.body || []), ...(section.list || []));

                    referenceSearchIndex.push(
                        buildReferenceResult({
                            groupTitle,
                            pageTitle,
                            pageRoute,
                            title: section.heading,
                            caption: (section.body || [])[0] || "",
                            fragment: sectionId,
                            searchText: buildSearchText(
                                sectionGroup.title,
                                section.heading,
                                ...(section.body || []),
                                ...(section.list || []),
                                ...((section.links || []).map((item) => item.label))
                            )
                        })
                    );
                });
            });

            (page.changelogGroups || []).forEach((changelogGroup) => {
                const changelogRootId = getChangelogRootId(page);
                const changelogGroupId = getChangelogGroupId(changelogGroup, changelogRootId);

                pageSearchParts.push(
                    changelogGroup.title,
                    changelogGroup.version,
                    ...(changelogGroup.summary || []),
                    ...((changelogGroup.entries || []).flatMap((entryItem) => [
                        entryItem.version,
                        entryItem.label,
                        ...(entryItem.body || []),
                        ...(entryItem.list || [])
                    ]))
                );

                referenceSearchIndex.push(
                    buildReferenceResult({
                        groupTitle,
                        pageTitle,
                        pageRoute,
                        title: `${changelogGroup.title} Changelog`,
                        caption: (changelogGroup.summary || [])[0] || "",
                        fragment: changelogGroupId,
                        searchText: buildSearchText(
                            "changelog",
                            changelogGroup.title,
                            changelogGroup.version,
                            ...(changelogGroup.summary || [])
                        )
                    })
                );

                (changelogGroup.entries || []).forEach((entryItem) => {
                    referenceSearchIndex.push(
                        buildReferenceResult({
                            groupTitle,
                            pageTitle,
                            pageRoute,
                            title: `${changelogGroup.title} ${entryItem.version}`,
                            caption: entryItem.label || "",
                            fragment: getVersionNodeId(entryItem.version, changelogGroupId),
                            searchText: buildSearchText(
                                "changelog",
                                changelogGroup.title,
                                entryItem.version,
                                entryItem.label,
                                ...(entryItem.body || []),
                                ...(entryItem.list || [])
                            )
                        })
                    );
                });
            });

            pageSearchIndex.set(pageRoute, buildSearchText(...pageSearchParts));
        });
    });
};

buildIndexes();

const resolveEntry = (route) => {
    const normalized = normalizeRoute(route);
    const canonicalRoute = aliasMap.get(normalized) || normalized;
    return routeMap.get(canonicalRoute) || routeMap.get("/") || viewer.home;
};

const getRequestedRoute = () => {
    const params = new URLSearchParams(window.location.search);
    const queryRoute = params.get("route");
    if (queryRoute) {
        return normalizeRoute(queryRoute);
    }

    const segments = getPathSegments();
    const routeIndex = segments.findIndex((segment) => knownRoots.has(segment.toLowerCase()));

    if (routeIndex === -1) {
        return "/";
    }

    return normalizeRoute(`/${segments.slice(routeIndex).join("/")}`);
};

const getRequestedFragment = () => normalizeFragment(window.location.hash);

const openSidebar = () => {
    if (!sidebar || !menuToggle) {
        return;
    }

    sidebar.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-sidebar-open");
};

const closeSidebar = () => {
    if (!sidebar || !menuToggle) {
        return;
    }

    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-sidebar-open");
};

const toggleSidebar = () => {
    if (sidebar?.classList.contains("is-open")) {
        closeSidebar();
        return;
    }

    openSidebar();
};

const navigateTo = (route, replace = false, fragment = "") => {
    const entry = resolveEntry(route);
    currentFragment = normalizeFragment(fragment);
    const nextUrl = buildUrl(entry.route, currentFragment);
    currentRoute = entry.route;

    if (entry.groupSlug) {
        openGroups.add(entry.groupSlug);
    }

    if (replace) {
        window.history.replaceState({ route: entry.route }, "", nextUrl);
    } else {
        window.history.pushState({ route: entry.route }, "", nextUrl);
    }

    render();
    closeSidebar();
};

const isReferenceSearch = (value = "") => value.trim().toLowerCase().startsWith(REF_SEARCH_TOKEN);
const getReferenceQuery = (value = "") => {
    if (!isReferenceSearch(value)) {
        return "";
    }

    return value.trim().slice(REF_SEARCH_TOKEN.length).trim().toLowerCase();
};

const getVisibleGroups = () => {
    const tokens = tokenizeSearchQuery(searchQuery);

    return viewer.groups
        .map((group) => {
            const groupEntry = resolveEntry(`/${group.slug}`);
            const groupMatch = matchesSearchTokens(groupSearchIndex.get(group.slug) || "", tokens);
            const visiblePages = group.pages.filter((page) => {
                const isCurrentPage = currentRoute === `/${group.slug}/${page.slug}`;
                const isVisibleInNav = !page.hiddenInNav || isCurrentPage;
                return isVisibleInNav && (groupMatch || matchesSearchTokens(pageSearchIndex.get(`/${group.slug}/${page.slug}`) || "", tokens));
            });

            return {
                group,
                groupEntry,
                visiblePages,
                isVisible: groupMatch || visiblePages.length > 0
            };
        })
        .filter((item) => item.isVisible);
};

const getReferenceResults = () => {
    const tokens = tokenizeSearchQuery(getReferenceQuery(searchQuery));

    return referenceSearchIndex.filter((item) => matchesSearchTokens(item.searchText, tokens));
};

const appendSectionContent = (body, section) => {
    (section.body || []).forEach((paragraph) => {
        const p = document.createElement("p");
        p.innerHTML = withDefinitionLinks(paragraph);
        body.appendChild(p);
    });

    if (section.list?.length) {
        const list = document.createElement("ul");
        section.list.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
        body.appendChild(list);
    }

    if (section.links?.length) {
        const list = document.createElement("ul");
        list.className = "section-link-list";

        section.links.forEach((item) => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.href = buildExternalUrl(item.href);
            link.target = "_blank";
            link.rel = "noreferrer";
            link.className = "section-link";
            link.textContent = item.label;
            li.appendChild(link);
            list.appendChild(li);
        });

        body.appendChild(list);
    }

    if (section.quotes?.length) {
        section.quotes.forEach((item) => {
            const quote = document.createElement("blockquote");
            quote.className = "section-quote";

            const quoteText = document.createElement("p");
            quoteText.className = "section-quote-text";
            quoteText.innerHTML = withDefinitionLinks(item.text || "");
            quote.appendChild(quoteText);

            body.appendChild(quote);
        });
    }

    if (section.codeHtml) {
        const codeBlock = document.createElement("pre");
        codeBlock.className = "code-block";

        const code = document.createElement("code");
        code.className = "code-content";
        code.innerHTML = section.codeHtml;

        codeBlock.appendChild(code);
        body.appendChild(codeBlock);
    }
};

const createSection = (section, scopeId = "") => {
    const article = document.createElement("section");
    const isOpen = section.defaultOpen !== false;
    article.className = `doc-section content-section doc-accordion${isOpen ? " is-open" : ""}`;
    article.id = getSectionId(section, scopeId);

    const summary = document.createElement("button");
    summary.type = "button";
    summary.className = "doc-accordion-summary";
    summary.setAttribute("aria-expanded", String(isOpen));
    summary.textContent = section.heading;
    article.appendChild(summary);

    const body = document.createElement("div");
    body.className = "section-body doc-accordion-body";
    body.hidden = !isOpen;

    appendSectionContent(body, section);

    article.appendChild(body);

    summary.addEventListener("click", () => {
        setAccordionState(article, body.hidden);
    });

    return article;
};

const isOverviewSection = (section) => {
    const heading = String(section?.heading || "").trim().toLowerCase();
    return heading === "brief overview" || heading === "brief description";
};

const renderMediaItems = (target, items, entry, options = {}) => {
    if (!target) {
        return;
    }

    target.innerHTML = "";

    if (!items.length) {
        target.hidden = true;
        return;
    }

    target.hidden = false;

    let currentGroup = "";
    const showGroupHeadings = options.showGroupHeadings !== false;

    items.forEach((item) => {
        const nextGroup = item.group || "";

        if (showGroupHeadings && nextGroup && nextGroup !== currentGroup) {
            currentGroup = nextGroup;

            const groupHeading = document.createElement("h3");
            groupHeading.className = "media-group-heading";
            groupHeading.textContent = nextGroup;
            target.appendChild(groupHeading);
        }

        const refId = getReferenceId(item);
        const isOpen = currentFragment === refId || item.defaultOpen === true;

        const accordion = document.createElement("section");
        accordion.className = `doc-section content-section doc-accordion${isOpen ? " is-open" : ""}`;
        accordion.id = refId;

        const summary = document.createElement("button");
        summary.type = "button";
        summary.className = "doc-accordion-summary";
        summary.setAttribute("aria-expanded", String(isOpen));
        summary.textContent = item.title || entry.mediaHeading || "Reference";
        accordion.appendChild(summary);

        const accordionBody = document.createElement("div");
        accordionBody.className = "section-body doc-accordion-body";
        accordionBody.hidden = !isOpen;

        const card = document.createElement("article");
        card.className = "media-card";
        if (item.compact) {
            card.classList.add("is-compact");
        }

        const imageFrame = document.createElement("div");
        imageFrame.className = "media-image-frame";
        if (item.compact) {
            imageFrame.classList.add("is-compact");
        }

        const image = document.createElement("img");
        image.className = "media-image";
        image.src = buildAssetUrl(item.src);
        image.alt = item.alt || item.title || "Documentation reference image";
        if (item.compact) {
            image.classList.add("is-compact");
        }

        imageFrame.appendChild(image);
        card.appendChild(imageFrame);

        const body = document.createElement("div");
        body.className = "media-card-body";

        if (item.caption) {
            const caption = document.createElement("p");
            caption.className = "media-card-text";
            caption.innerHTML = withDefinitionLinks(item.caption);
            body.appendChild(caption);
        }

        (item.body || []).forEach((paragraph) => {
            const detail = document.createElement("p");
            detail.className = "media-card-detail";
            detail.innerHTML = withDefinitionLinks(paragraph);
            body.appendChild(detail);
        });

        card.appendChild(body);
        accordionBody.appendChild(card);

        summary.addEventListener("click", () => {
            setAccordionState(accordion, accordionBody.hidden);
        });

        accordion.appendChild(accordionBody);
        target.appendChild(accordion);
    });
};

const createSectionGroup = (group, entry) => {
    const article = document.createElement("section");
    const groupId = getSectionGroupId(group);
    const mediaItems = (entry.media || []).filter((item) => (group.mediaGroups || []).includes(item.group || ""));
    const nestedSectionIds = (group.sections || []).map((section) => getSectionId(section, groupId));
    const fragmentIds = new Set([
        ...getSectionGroupFragments(group),
        ...nestedSectionIds,
        ...mediaItems.map((item) => getReferenceId(item))
    ]);
    const isOpen = fragmentIds.has(currentFragment) || group.defaultOpen === true;

    article.className = `doc-section content-section section-group doc-accordion${isOpen ? " is-open" : ""}`;
    article.id = groupId;

    const header = document.createElement("div");
    header.className = "section-group-header";

    const summaryLabel = document.createElement("div");
    summaryLabel.className = "section-group-summary";
    summaryLabel.textContent = group.title;

    const controls = document.createElement("div");
    controls.className = "section-group-controls";

    const openAllControl = document.createElement("button");
    openAllControl.type = "button";
    openAllControl.className = "section-group-control-button";
    openAllControl.textContent = "Open All";

    const collapseAllControl = document.createElement("button");
    collapseAllControl.type = "button";
    collapseAllControl.className = "section-group-control-button";
    collapseAllControl.textContent = "Collapse All";

    controls.appendChild(openAllControl);
    controls.appendChild(collapseAllControl);

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "section-group-toggle";
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute("aria-label", `Toggle ${group.title}`);
    toggleButton.innerHTML = '<span class="section-group-toggle-chevron" aria-hidden="true"></span>';

    header.appendChild(summaryLabel);
    header.appendChild(controls);
    header.appendChild(toggleButton);
    article.appendChild(header);

    const summaryParagraphs = Array.isArray(group.summary) ? [...group.summary] : [];
    const previewSplit = splitLeadSentence(summaryParagraphs[0] || "");
    const previewText = previewSplit.lead;
    const introParagraphs = [];

    if (summaryParagraphs.length) {
        if (previewSplit.remainder) {
            introParagraphs.push(previewSplit.remainder);
        }

        introParagraphs.push(...summaryParagraphs.slice(1));
    }

    if (previewText) {
        const preview = document.createElement("p");
        preview.className = "section-group-preview";
        preview.innerHTML = withDefinitionLinks(previewText);
        article.appendChild(preview);
    }

    const body = document.createElement("div");
    body.className = "section-body doc-accordion-body section-group-body";
    body.hidden = !isOpen;

    if (introParagraphs.length) {
        const intro = document.createElement("div");
        intro.className = "section-group-intro";

        introParagraphs.forEach((paragraph) => {
            const p = document.createElement("p");
            p.innerHTML = withDefinitionLinks(paragraph);
            intro.appendChild(p);
        });

        body.appendChild(intro);
    }

    if (mediaItems.length) {
        const mediaTarget = document.createElement("div");
        mediaTarget.className = "section-group-media";
        renderMediaItems(mediaTarget, mediaItems, entry, { showGroupHeadings: false });
        body.appendChild(mediaTarget);
    }

    if (group.sections?.length) {
        const sectionsTarget = document.createElement("div");
        sectionsTarget.className = "section-group-sections";
        group.sections.forEach((section) => {
            sectionsTarget.appendChild(createSection(section, groupId));
        });
        body.appendChild(sectionsTarget);
    }

    article.appendChild(body);

    openAllControl.addEventListener("click", (event) => {
        event.stopPropagation();
        setChildAccordionsState(body, true);
    });

    collapseAllControl.addEventListener("click", (event) => {
        event.stopPropagation();
        setChildAccordionsState(body, false);
    });

    const toggleGroup = () => {
        setAccordionState(article, body.hidden);
    };

    toggleButton.addEventListener("click", toggleGroup);
    header.addEventListener("click", (event) => {
        if (controls.contains(event.target) || toggleButton.contains(event.target)) {
            return;
        }

        toggleGroup();
    });

    return article;
};

const createChangelogVersionNode = (node, scopeId) => {
    const article = document.createElement("section");
    const hasEntry = Boolean(node.entry);
    const isMajorGroup = node.depth === 1 && !hasEntry;
    const descendantIds = collectVersionNodeIds(node, scopeId);
    const isOpen =
        descendantIds.has(currentFragment) ||
        (hasEntry && node.depth > 1 && compareVersions(node.version, "1.0") === 0);

    article.className = `doc-section content-section doc-accordion changelog-version changelog-depth-${node.depth}${isOpen ? " is-open" : ""}`;
    article.id = getVersionNodeId(node.version, scopeId);

    const summary = document.createElement("button");
    summary.type = "button";
    summary.className = "doc-accordion-summary";
    summary.setAttribute("aria-expanded", String(isOpen));
    summary.textContent = isMajorGroup ? node.version : node.version;
    article.appendChild(summary);

    const body = document.createElement("div");
    body.className = "section-body doc-accordion-body changelog-version-body";
    body.hidden = !isOpen;

    if (hasEntry) {
        if (node.entry.label && node.entry.label !== node.version) {
            const label = document.createElement("p");
            label.className = "changelog-version-label";
            label.textContent = node.entry.label;
            body.appendChild(label);
        }

        appendSectionContent(body, node.entry);
    }

    const childNodes = sortVersionNodes(Array.from(node.children.values()));
    if (childNodes.length) {
        const childContainer = document.createElement("div");
        childContainer.className = "changelog-version-children";
        childNodes.forEach((child) => {
            childContainer.appendChild(createChangelogVersionNode(child, scopeId));
        });
        body.appendChild(childContainer);
    }

    article.appendChild(body);

    summary.addEventListener("click", () => {
        setAccordionState(article, body.hidden);
    });

    return article;
};

const createChangelogGroup = (group, pageScopeId) => {
    const article = document.createElement("section");
    const groupId = getChangelogGroupId(group, pageScopeId);
    const versionTree = buildVersionTree(group.entries || []);
    const descendantIds = collectVersionNodeIds(versionTree, groupId);
    const isOpen = currentFragment === groupId || descendantIds.has(currentFragment) || group.defaultOpen === true;
    article.className = `doc-section content-section section-group changelog-group doc-accordion${isOpen ? " is-open" : ""}`;
    article.id = groupId;

    const header = document.createElement("div");
    header.className = "section-group-header";

    const summaryLabel = document.createElement("div");
    summaryLabel.className = "section-group-summary";
    summaryLabel.textContent = group.title;

    const versionLabel = document.createElement("span");
    versionLabel.className = "section-group-version";
    if (group.version) {
        versionLabel.textContent = group.version;
    } else {
        versionLabel.hidden = true;
    }

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "section-group-toggle";
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute("aria-label", `Toggle ${group.title}`);
    toggleButton.innerHTML = '<span class="section-group-toggle-chevron" aria-hidden="true"></span>';

    header.appendChild(summaryLabel);
    header.appendChild(versionLabel);
    header.appendChild(toggleButton);
    article.appendChild(header);

    const previewText = (group.summary || [])[0] || "";
    if (previewText) {
        const preview = document.createElement("p");
        preview.className = "section-group-preview";
        preview.innerHTML = withDefinitionLinks(previewText);
        article.appendChild(preview);
    }

    const body = document.createElement("div");
    body.className = "section-body doc-accordion-body section-group-body";
    body.hidden = !isOpen;

    if ((group.summary || []).length > 1) {
        const intro = document.createElement("div");
        intro.className = "section-group-intro";
        group.summary.slice(1).forEach((paragraph) => {
            const p = document.createElement("p");
            p.innerHTML = withDefinitionLinks(paragraph);
            intro.appendChild(p);
        });
        body.appendChild(intro);
    }

    const versionNodes = sortVersionNodes(Array.from(versionTree.children.values()));
    if (versionNodes.length) {
        const versions = document.createElement("div");
        versions.className = "changelog-version-list";
        versionNodes.forEach((node) => {
            versions.appendChild(createChangelogVersionNode(node, groupId));
        });
        body.appendChild(versions);
    }

    article.appendChild(body);

    const toggleGroup = () => {
        setAccordionState(article, body.hidden);
    };

    toggleButton.addEventListener("click", toggleGroup);
    header.addEventListener("click", (event) => {
        if (toggleButton.contains(event.target)) {
            return;
        }

        toggleGroup();
    });

    return article;
};

const renderChangelog = (entry) => {
    if (!changelogMount) {
        return;
    }

    changelogMount.innerHTML = "";
    const groups = Array.isArray(entry.changelogGroups) ? entry.changelogGroups : [];

    if (!groups.length) {
        changelogMount.hidden = true;
        return;
    }

    changelogMount.hidden = false;

    const rootId = getChangelogRootId(entry);
    const groupIds = groups.map((group) => getChangelogGroupId(group, rootId));
    const versionIds = groups.flatMap((group) => {
        const tree = buildVersionTree(group.entries || []);
        return Array.from(collectVersionNodeIds(tree, getChangelogGroupId(group, rootId)));
    });
    const isOpen = currentFragment === rootId || groupIds.includes(currentFragment) || versionIds.includes(currentFragment);
    const wrapper = document.createElement("section");
    wrapper.className = `doc-section content-section doc-accordion changelog-root${isOpen ? " is-open" : ""}`;
    wrapper.id = rootId;

    const summary = document.createElement("button");
    summary.type = "button";
    summary.className = "doc-accordion-summary";
    summary.setAttribute("aria-expanded", String(isOpen));
    summary.textContent = "Changelog";
    wrapper.appendChild(summary);

    const body = document.createElement("div");
    body.className = "section-body doc-accordion-body changelog-root-body";
    body.hidden = !isOpen;

    groups.forEach((group) => {
        body.appendChild(createChangelogGroup(group, rootId));
    });

    wrapper.appendChild(body);

    summary.addEventListener("click", () => {
        setAccordionState(wrapper, body.hidden);
    });

    changelogMount.appendChild(wrapper);
};

const renderPageAssets = (entry) => {
    const hasAssetLocation = Boolean(entry.assetLocation);
    const mediaItems = entry.sectionGroups ? [] : (Array.isArray(entry.media) ? entry.media : []);
    const postMediaGroups = new Set(entry.postMediaGroups || []);
    const preMediaItems = mediaItems.filter((item) => !postMediaGroups.has(item.group || ""));
    const postMediaItems = mediaItems.filter((item) => postMediaGroups.has(item.group || ""));

    if (!pageAssets || !assetLocationCard || !assetLocationPath || !mediaGallery || !pageAddonAssets || !addonMediaGallery) {
        return;
    }

    if (!hasAssetLocation && preMediaItems.length === 0 && postMediaItems.length === 0) {
        pageAssets.hidden = true;
        assetLocationCard.hidden = true;
        assetLocationPath.textContent = "";
        mediaGallery.innerHTML = "";
        pageAddonAssets.hidden = true;
        addonMediaGallery.innerHTML = "";
        return;
    }

    pageAssets.hidden = !hasAssetLocation && preMediaItems.length === 0;
    assetLocationCard.hidden = !hasAssetLocation;
    assetLocationPath.textContent = hasAssetLocation ? entry.assetLocation : "";
    renderMediaItems(mediaGallery, preMediaItems, entry);
    pageAddonAssets.hidden = postMediaItems.length === 0;
    renderMediaItems(addonMediaGallery, postMediaItems, entry);
};

const renderPage = () => {
    const entry = resolveEntry(currentRoute);
    const sections = Array.isArray(entry.sections) ? [...entry.sections] : [];
    const overviewSectionIndex = sections.findIndex((section) => isOverviewSection(section));
    const overviewSection = overviewSectionIndex >= 0 ? sections.splice(overviewSectionIndex, 1)[0] : null;

    pageGroup.textContent = "";
    pageTitle.textContent = entry.title || "";
    pageTitle.hidden = !entry.title;
    pageSummary.textContent = entry.summary || "";
    pageMeta.textContent = "";
    pageMeta.hidden = true;

    if (pageOverview) {
        pageOverview.innerHTML = "";
        pageOverview.hidden = !overviewSection;

        if (overviewSection?.body?.length) {
            overviewSection.body.forEach((paragraph) => {
                const p = document.createElement("p");
                p.innerHTML = withDefinitionLinks(paragraph);
                pageOverview.appendChild(p);
            });
        }
    }

    const versionParts = [];
    if (entry.versionLabel) {
        versionParts.push(entry.versionLabel);
    } else if (entry.version) {
        versionParts.push(`Version ${entry.version}`);
    }

    if (entry.sectionGroups?.length) {
        entry.sectionGroups.forEach((group) => {
            if (group.version) {
                versionParts.push(`${group.title} ${group.version}`);
            }
        });
    }

    if (versionParts.length) {
        pageMeta.textContent = versionParts.join(" / ");
        pageMeta.hidden = false;
    }

    if (personalLink) {
        personalLink.href = buildExternalUrl(viewer.links?.personal || viewer.links?.website);
    }

    if (linkedinLink) {
        linkedinLink.href = buildExternalUrl(viewer.links?.linkedin);
    }

    sectionList.innerHTML = "";
    if (entry.sectionGroups?.length) {
        entry.sectionGroups.forEach((group) => {
            sectionList.appendChild(createSectionGroup(group, entry));
        });
    } else {
        sections.forEach((section) => {
            sectionList.appendChild(createSection(section));
        });
    }

    renderPageAssets(entry);
    renderChangelog(entry);
};

const setAccordionState = (accordion, open) => {
    if (!accordion) {
        return;
    }

    const body = accordion.querySelector(":scope > .doc-accordion-body");
    const summary = accordion.querySelector(":scope > .doc-accordion-summary");
    const groupToggle = accordion.querySelector(":scope > .section-group-header .section-group-toggle");

    if (!body) {
        return;
    }

    body.hidden = !open;
    accordion.classList.toggle("is-open", open);
    if (summary) {
        summary.setAttribute("aria-expanded", String(open));
    }
    if (groupToggle) {
        groupToggle.setAttribute("aria-expanded", String(open));
    }
};

const setAllAccordionsState = (open) => {
    document.querySelectorAll("#mainContent .doc-accordion").forEach((accordion) => {
        setAccordionState(accordion, open);
    });
};

const setChildAccordionsState = (container, open) => {
    if (!container) {
        return;
    }

    container.querySelectorAll(".doc-accordion").forEach((accordion) => {
        setAccordionState(accordion, open);
    });
};

const renderNav = () => {
    if (isReferenceSearch(searchQuery)) {
        const results = getReferenceResults();
        navGroups.innerHTML = "";

        if (!results.length) {
            const emptyState = document.createElement("div");
            emptyState.className = "nav-empty";
            emptyState.textContent = "No reference matches yet. Try #ref followed by part of a reference title.";
            navGroups.appendChild(emptyState);
            return;
        }

        const label = document.createElement("p");
        label.className = "nav-search-heading";
        label.textContent = "Reference Matches";
        navGroups.appendChild(label);

        const resultList = document.createElement("div");
        resultList.className = "ref-results";

        results.forEach((result) => {
            const resultButton = document.createElement("button");
            resultButton.type = "button";
            resultButton.className = `ref-link${currentRoute === result.pageRoute && currentFragment === result.fragment ? " is-active" : ""}`;

            const title = document.createElement("span");
            title.className = "ref-link-title";
            title.textContent = result.title;

            const meta = document.createElement("span");
            meta.className = "ref-link-meta";
            meta.textContent = `${result.pageTitle} / ${result.groupTitle}`;

            resultButton.appendChild(title);
            resultButton.appendChild(meta);
            resultButton.addEventListener("click", () => {
                navigateTo(result.pageRoute, false, result.fragment);
            });

            resultList.appendChild(resultButton);
        });

        navGroups.appendChild(resultList);
        return;
    }

    const visibleGroups = getVisibleGroups();
    navGroups.innerHTML = "";

    if (!visibleGroups.length) {
        const emptyState = document.createElement("div");
        emptyState.className = "nav-empty";
        emptyState.textContent = "No documentation pages match that search yet.";
        navGroups.appendChild(emptyState);
        return;
    }

    visibleGroups.forEach(({ group, groupEntry, visiblePages }) => {
        const wrapper = document.createElement("section");
        const isGroupRoute = currentRoute === groupEntry.route;
        const containsCurrentRoute = currentRoute.startsWith(`${groupEntry.route}/`) || isGroupRoute;
        const shouldExpand = searchQuery ? visiblePages.length > 0 : openGroups.has(group.slug) || containsCurrentRoute;
        const hasChildren = visiblePages.length > 0;

        wrapper.className = `nav-group${shouldExpand ? "" : " is-collapsed"}`;

        const bar = document.createElement("div");
        bar.className = "group-bar";

        const toggleGroup = () => {
            if (!hasChildren) {
                navigateTo(groupEntry.route);
                return;
            }

            if (openGroups.has(group.slug)) {
                openGroups.delete(group.slug);
            } else {
                openGroups.add(group.slug);
            }

            renderNav();
        };

        const navigateGroup = () => {
            if (!hasChildren) {
                navigateTo(groupEntry.route);
                return;
            }

            const defaultPage = visiblePages[0];
            const defaultRoute = defaultPage ? `/${group.slug}/${defaultPage.slug}` : groupEntry.route;
            navigateTo(defaultRoute);
        };

        const groupLink = document.createElement("button");
        groupLink.type = "button";
        groupLink.className = `group-link${containsCurrentRoute ? " is-active" : ""}`;
        groupLink.textContent = group.title;
        groupLink.addEventListener("click", navigateGroup);

        const groupToggle = document.createElement("button");
        groupToggle.type = "button";
        groupToggle.className = "group-toggle";
        groupToggle.setAttribute("aria-label", `Toggle ${group.title}`);
        groupToggle.hidden = !hasChildren;
        groupToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleGroup();
        });

        bar.appendChild(groupLink);
        bar.appendChild(groupToggle);
        wrapper.appendChild(bar);

        const pageList = document.createElement("div");
        pageList.className = "page-list";

        visiblePages.forEach((page) => {
            const pageEntry = resolveEntry(`/${group.slug}/${page.slug}`);
            const pageLink = document.createElement("button");
            pageLink.type = "button";
            pageLink.className = `page-link${currentRoute === pageEntry.route ? " is-active" : ""}`;
            pageLink.textContent = page.title;
            pageLink.addEventListener("click", () => {
                navigateTo(pageEntry.route);
            });
            pageList.appendChild(pageLink);
        });

        wrapper.appendChild(pageList);
        navGroups.appendChild(wrapper);
    });
};

const render = () => {
    if (homeNavLink) {
        homeNavLink.classList.toggle("is-active", currentRoute === "/" && !currentFragment);
    }

    renderNav();
    renderPage();

    if (currentFragment) {
        window.requestAnimationFrame(() => {
            const target = document.getElementById(currentFragment);
            if (target) {
                target.scrollIntoView({
                    block: "start",
                    behavior: accessibilityPrefs.reduceMotion ? "auto" : "smooth"
                });
            }
        });
    }
};

if (menuToggle) {
    menuToggle.addEventListener("click", toggleSidebar);
}

if (brandHome) {
    brandHome.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo("/");
    });
}

if (homeNavLink) {
    homeNavLink.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo("/");
    });
}

if (accessToggle) {
    accessToggle.addEventListener("click", () => {
        toggleAccessPanel();
    });
}

if (aiToggle) {
    aiToggle.addEventListener("click", () => {
        toggleAiPanel();
    });
}

if (accessForm) {
    accessForm.addEventListener("change", (event) => {
        const target = event.target;

        if (!(target instanceof HTMLInputElement)) {
            return;
        }

        switch (target.name) {
            case "textSize":
                accessibilityPrefs.textSize = target.value;
                break;
            case "contrast":
                accessibilityPrefs.contrast = target.value;
                break;
            case "reduceMotion":
                accessibilityPrefs.reduceMotion = target.checked;
                break;
            case "underlineLinks":
                accessibilityPrefs.underlineLinks = target.checked;
                break;
            case "focusBoost":
                accessibilityPrefs.focusBoost = target.checked;
                break;
            default:
                return;
        }

        applyAccessibilityPrefs();
        saveAccessibilityPrefs();
        syncAccessibilityForm();
    });
}

if (accessCollapse) {
    accessCollapse.addEventListener("click", () => {
        closeAccessPanel();
    });
}

if (accessReset) {
    attachHoldReset(accessReset, () => {
        accessibilityPrefs = { ...defaultAccessibilityPrefs };
        applyAccessibilityPrefs();
        saveAccessibilityPrefs();
        syncAccessibilityForm();
    });
}

if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        searchQuery = event.target.value.trim();
        renderNav();
    });
}

window.addEventListener("popstate", () => {
    currentRoute = resolveEntry(getRequestedRoute()).route;
    currentFragment = getRequestedFragment();
    render();
    closeSidebar();
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAccessPanel();
        closeAiPanel();
        closeSidebar();
    }
});

document.addEventListener("click", (event) => {
    if (!accessPanel || !accessToggle || accessPanel.hidden) {
        return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
        return;
    }

    if (accessPanel.contains(target) || accessToggle.contains(target)) {
        return;
    }

    closeAccessPanel();
});

document.addEventListener("click", (event) => {
    if (!aiPanel || !aiToggle || aiPanel.hidden) {
        return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
        return;
    }

    if (aiPanel.contains(target) || aiToggle.contains(target)) {
        return;
    }

    closeAiPanel();
});

currentRoute = resolveEntry(getRequestedRoute()).route;
currentFragment = getRequestedFragment();
accessibilityPrefs = loadAccessibilityPrefs();
applyAccessibilityPrefs();
syncAccessibilityForm();

if (new URLSearchParams(window.location.search).has("route")) {
    navigateTo(currentRoute, true, currentFragment);
} else {
    render();
}

