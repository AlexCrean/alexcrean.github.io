window.DOCS_VIEWER = {
    links: {
        documentation: "https://alexcrean.github.io/",
        website: "https://www.alexcrean.com/",
        personal: "https://www.alexcrean.com/",
        linkedin: "https://www.linkedin.com/in/alex-crean/",
        publisher: "https://assetstore.unity.com/publishers/140384",
        eula: "https://unity.com/legal/as-terms"
    },
    home: {
        route: "/",
        title: "",
        group: "Documentation Viewer",
        summary: "Practical Unity tools by Alex Crean, built to remove friction, speed up editor work, and keep production workflows easier to trust.",
        packagePath: "Assets / AC_Tools",
        sections: [
            {
                heading: "Brief Description",
                defaultOpen: false,
                body: [
                    "Current published scope covers the shared tooling layer plus the Quality Of Life documentation and safety tools.",
                    "These packages are built around day-to-day Unity work: clearer context, safer editing, better review flow, and less wasted time moving through repetitive editor tasks."
                ]
            },
            {
                heading: "How To Use",
                defaultOpen: true,
                body: [
                    "Start from the package or add-on you need, then check the parts that affect real project use: where it lives, what state it stores, what it changes in the editor, and how it fits into an existing workflow.",
                    "These pages focus on the non-obvious parts, including config assets, persistence under ProjectSettings, extension points, and behavior that matters during setup, handoff, or review."
                ]
            },
            {
                heading: "Feature List",
                list: [
                    "Shared covers theme assets, editor chrome, compatibility wrappers, and common lookup utilities.",
                    "Quality Of Life currently covers Document Inside, Document Outside, and Don't Edit.",
                    "The published focus is production utility: documentation where work happens, safer editing surfaces, and editor tooling that removes avoidable friction."
                ]
            }
        ]
    },
    groups: [
        {
            slug: "shared",
            title: "Shared",
            landing: {
                title: "Shared",
                summary: "Common foundations used across AC_Tools, including themes, editor chrome, compatibility helpers, and reusable visual language.",
                packagePath: "Assets / AC_Tools / AC_Tool_Shared",
                sections: [
                    {
                        heading: "Brief Description",
                        defaultOpen: false,
                        body: [
                            "AC_Tool_Shared contains the common editor-side infrastructure used across the suite.",
                            "That includes theme assets, editor chrome, compatibility wrappers, asset lookup, busy-state helpers, and shared readme handling."
                        ]
                    },
                    {
                        heading: "How To Use",
                        defaultOpen: true,
                        body: [
                            "If a tool needs shared colours, shared footer chrome, move-safe asset lookup, documentation routing, or Unity-version compatibility helpers, it should be pulling that from here instead of reinventing it."
                        ]
                    },
                    {
                        heading: "Feature List",
                        list: [
                            "SharedCommonUtils provides common constants, tool-root discovery, local asset lookup, readme handling, and shared documentation behaviour.",
                            "ACToolWindowTheme keeps the visual language consistent across the suite.",
                            "ACToolWindowChrome keeps footer bars and status pills aligned.",
                            "ACEditorCompat keeps version-sensitive editor API handling in one place.",
                            "ACToolsEditorBusyScope helps tools avoid running bulk work while Unity is busy.",
                            "ACToolReadme keeps in-editor documentation presentation consistent across the suite."
                        ]
                    }
                ]
            },
            pages: [
                {
                    slug: "colourconfiguration",
                    title: "Colour Configuration",
                    version: "1.0",
                    summary: "Shared theme assets that keep AC_Tools visually consistent across editor windows, overlays, and documentation surfaces.",
                    packagePath: "Assets / AC_Tools / AC_Tool_Shared / Window Colour Themes",
                    assetLocation: "Assets / AC_Tools / AC_Tool_Shared / Window Colour Themes / Colour Theme for AC Tool Windows.asset",
                    mediaHeading: "Unity References",
                    notesPath: "assets/tools/colour-configuration/Information.txt",
                    aliases: ["/shared/colours", "/shared/colorconfiguration", "/shared/colour-configuration"],
                    keywords: ["colours", "colors", "theme", "window theme", "overlay"],
                    media: [
                        {
                            title: "Project Window Reference",
                            src: "assets/images/WindowColourThemeLocation-premium.png",
                            alt: "Unity Project window showing the Window Colour Themes folder and the Colour Theme for AC Tool Windows asset tile.",
                            caption: "Where to find the shared window theme asset in the package."
                        },
                        {
                            title: "Colour Theme Asset",
                            src: "assets/images/AC Tool Window Theme-premium.png",
                            alt: "Unity Inspector showing the Colour Theme for AC Tool Windows asset with window, text, and code colour fields.",
                            caption: "The shared theme asset that defines the palette used across AC_Tools windows and code previews.",
                            body: [
                                "The Window Colours block covers the main shell of the editor window, including headers, body rows, separators, accents, toggle states, and warning colours.",
                                "The Text Colours block controls readable UI text, muted labels, link colours, and information surfaces.",
                                "The Code Colours block is used by read-only code previews, which keeps syntax colouring consistent anywhere AC_Tools renders sample code or reference snippets."
                            ]
                        }
                    ],
                    sections: [
                        {
                            heading: "Brief Overview",
                            defaultOpen: false,
                            body: [
                                "Colour Configuration is the shared theme asset that keeps AC_Tools visually consistent.",
                                "It controls the palette used by tool windows, information panels, status accents, and code previews so the suite reads like one system instead of a set of disconnected editor scripts."
                            ]
                        },
                        {
                            heading: "How To Use",
                            defaultOpen: true,
                            body: [
                                "Open the Colour Theme for AC Tool Windows asset when you need to adjust the visual language used across AC_Tools windows.",
                                "The Window Colours block controls the core shell, the Text Colours block controls readability and info surfaces, and the Code Colours block controls read-only code previews shown by documentation and inspector tools.",
                                "If you are building or extending a tool in this suite, reference this shared theme instead of defining local colors in the window or drawer itself."
                            ]
                        },
                        {
                            heading: "How It's Used In The System",
                            body: [
                                "The ACToolWindowTheme asset is loaded through ACToolWindowTheme.GetInstance(), which lets AC_Tools windows and drawers share one central source for headers, rows, accents, info panels, and code styling.",
                                "If the asset cannot be found, the shared class falls back to in-memory defaults. The tool still draws, but the intended setup is to keep the shared theme asset in the project so the palette stays deliberate and editable.",
                                "The same theme object also exposes the Code Colours block, which is where code previews pull their background, keyword, type, method, variable, string, comment, and preprocessor colours."
                            ],
                            codeHtml:
                                '<span class="code-line-number">1</span>  <span class="code-keyword">using</span> <span class="code-type">UnityEngine</span>;\n' +
                                '<span class="code-line-number">2</span>  \n' +
                                '<span class="code-line-number">3</span>  <span class="code-keyword">using</span> <span class="code-type">ACTools</span>.<span class="code-type">Editor</span>;\n' +
                                '<span class="code-line-number">4</span>  \n' +
                                '<span class="code-line-number">5</span>  <span class="code-keyword">public</span> <span class="code-keyword">class</span> <span class="code-type">ExampleWindow</span> : <span class="code-type">EditorWindow</span>\n' +
                                '<span class="code-line-number">6</span>  {\n' +
                                '<span class="code-line-number">7</span>      <span class="code-keyword">private</span> <span class="code-keyword">void</span> <span class="code-method">OnGUI</span>()\n' +
                                '<span class="code-line-number">8</span>      {\n' +
                                '<span class="code-line-number">9</span>          <span class="code-keyword">var</span> <span class="code-variable">theme</span> = <span class="code-type">ACToolWindowTheme</span>.<span class="code-method">GetInstance</span>();\n' +
                                '<span class="code-line-number">10</span> \n' +
                                '<span class="code-line-number">11</span>          <span class="code-variable">GUI</span>.<span class="code-variable">color</span> = <span class="code-variable">theme</span>.<span class="code-variable">header</span>;\n' +
                                '<span class="code-line-number">12</span>          <span class="code-type">EditorGUILayout</span>.<span class="code-method">LabelField</span>(<span class="code-string">"Shared Header"</span>);\n' +
                                '<span class="code-line-number">13</span> \n' +
                                '<span class="code-line-number">14</span>          <span class="code-comment">// Shared code preview colours</span>\n' +
                                '<span class="code-line-number">15</span>          <span class="code-keyword">var</span> <span class="code-variable">codeBackground</span> = <span class="code-variable">theme</span>.<span class="code-variable">codeBackground</span>;\n' +
                                '<span class="code-line-number">16</span>          <span class="code-keyword">var</span> <span class="code-variable">keywordColour</span> = <span class="code-variable">theme</span>.<span class="code-variable">codeKeyword</span>;\n' +
                                '<span class="code-line-number">17</span>          <span class="code-keyword">var</span> <span class="code-variable">stringColour</span> = <span class="code-variable">theme</span>.<span class="code-variable">codeString</span>;\n' +
                                '<span class="code-line-number">18</span>      }\n' +
                                '<span class="code-line-number">19</span>  }'
                        }
                    ],
                    changelogGroups: [
                        {
                            title: "Colour Configuration",
                            version: "1.0",
                            summary: [
                                "Public release history for the shared colour theme asset used across AC_Tools windows and code previews."
                            ],
                            entries: [
                                {
                                    version: "1.0",
                                    label: "Public Release",
                                    body: [
                                        "Initial public release of the shared window theme asset.",
                                        "Includes the Window Colours, Text Colours, and Code Colours blocks used across the current documentation and editor surfaces."
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            slug: "qol",
            title: "Quality Of Life",
            aliases: ["/qualityoflife"],
            landing: {
                title: "Quality Of Life",
                aliases: ["/qualityoflife"],
                summary: "Documentation, review, navigation, and safety tooling for production Unity work.",
                packagePath: "Assets / AC_Tools / Quality Of Life Tools by AC",
                sections: [
                    {
                        heading: "Brief Description",
                        defaultOpen: false,
                        body: [
                            "Quality Of Life groups the editor tools that deal with documentation, review flow, safe editing, and repeated project traversal.",
                            "The currently shipped set is centered on Document Inside, Document Outside, and Don't Edit."
                        ]
                    },
                    {
                        heading: "How To Use",
                        body: [
                            "The relevant questions here are usually scope, persistence, config location, and how much of the workflow is local editor state versus shared project data.",
                            "If you are evaluating current publish scope, Shared, Document Inside, Document Outside, and Don't Edit are the primary references."
                        ]
                    },
                    {
                        heading: "Feature List",
                        list: [
                            "Document Inside for in-Inspector documentation and review extensions.",
                            "Document Outside for external references stored as Unity assets.",
                            "Don't Edit for locking and protected editing workflows."
                        ]
                    }
                ]
            },
            pages: [
                {
                    slug: "documentinside",
                    title: "Document Inside",
                    versionLabel: "Core 1.0 / Hand-Off Add-on 1.0",
                    summary: "In-Unity documentation for assets, objects, folders, and scenes, built around a base notes workflow with Hand-Off available as a separate review add-on.",
                    packagePath: "Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Document Inside",
                    assetLocation: "Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Document Inside",
                    mediaHeading: "Unity References",
                    postMediaGroups: ["Hand-Off Add-on"],
                    notesPath: "assets/tools/document-inside/Information.txt",
                    aliases: ["/qol/document-inside", "/qualityoflife/documentinside", "/qol/betterinside", "/qualityoflife/betterinside"],
                    keywords: ["docs", "notes", "inside", "better inside", "handoff", "review", "xml"],
                    media: [
                        {
                            group: "Core Document Inside",
                            title: "Inspector Preview",
                            src: "assets/images/Folder Information Preview-premium.png",
                            alt: "Unity Inspector showing Document Inside on a folder with the Information section visible.",
                            caption: "The base notes workflow on a supported target, without the Hand-Off add-on."
                        },
                        {
                            group: "Hand-Off Add-on",
                            title: "Hand-Off in the Inspector",
                            src: "assets/images/Information Full-premium.png",
                            alt: "Unity Inspector showing the Information panel with Hand-Off Notes and Review Status sections enabled.",
                            caption: "The expanded Inspector surface when the Hand-Off add-on is installed.",
                            body: [
                                "The base Information area still carries the original notes workflow. Hand-Off adds reviewer-facing notes and status controls beneath that rather than replacing the core panel.",
                                "Project context, Hand-Off notes, and review state stay on the same target, so routine approval work does not get pushed into a separate tool."
                            ]
                        },
                        {
                            group: "Hand-Off Add-on",
                            title: "Review Status",
                            src: "assets/images/Select.png",
                            alt: "Unity interface crop showing a selected review status control in use with the Hand-Off workflow.",
                            caption: "Review state is edited directly against the tracked target when Hand-Off is installed.",
                            body: [
                                "This is where a target moves between states such as marked for review, blocked, or resolved.",
                                "The selected status feeds both the local Inspector view and the broader review queue so teams can see progress without interpreting freeform notes alone."
                            ]
                        },
                        {
                            group: "Hand-Off Add-on",
                            title: "Review Window Entry",
                            src: "assets/images/Review.png",
                            alt: "Unity Developer menu showing the Review window entry under AC_Tools.",
                            caption: "The Review window is the project-wide entry point for the Hand-Off workflow.",
                            body: [
                                "Use the Review window once the work goes beyond the current selection and you need queue visibility, recent activity, or a wider view of tracked items.",
                                "It keeps Hand-Off positioned as an extension of Document Inside rather than a disconnected second system."
                            ]
                        },
                        {
                            group: "Hand-Off Add-on",
                            title: "Blocked Marker",
                            src: "assets/images/Mark - Blocked-premium.png",
                            alt: "Small red review marker used to indicate a blocked Hand-Off state.",
                            caption: "Blocked targets can be surfaced with a lightweight marker when Hand-Off is installed.",
                            compact: true
                        },
                        {
                            group: "Hand-Off Add-on",
                            title: "Reviewed Marker",
                            src: "assets/images/Mark - Reviewed-premium.png",
                            alt: "Small review marker used to indicate a reviewed Hand-Off state.",
                            caption: "Reviewed targets can use a separate marker so teams can read status at a glance.",
                            compact: true
                        }
                    ],
                    sectionGroups: [
                        {
                            title: "Document Inside (Core)",
                            version: "1.0",
                            refId: "core-document-inside",
                            refAliases: ["core", "document-inside-core"],
                            defaultOpen: true,
                            mediaGroups: ["Core Document Inside"],
                            summary: [
                                "The base package keeps project context on the asset, object, folder, or scene you are already editing, without requiring a separate review system."
                            ],
                            keywords: ["core", "notes", "xml", "document inside", "base"],
                            sections: [
                                {
                                    heading: "Notes in the Inspector",
                                    defaultOpen: true,
                                    body: [
                                        "For MonoBehaviours and ScriptableObjects, add a description or summary XML comment above the class and let Document Inside surface it in the Inspector.",
                                        "For project-facing context, select a supported target, expand Information, and write a manual note that explains setup, ownership, dependencies, caveats, or what is safe to change.",
                                        "This base workflow is enough when the goal is simple context on the asset, object, folder, or scene itself without review-state tracking."
                                    ]
                                },
                                {
                                    heading: "Supported Targets",
                                    body: [
                                        "GameObjects and prefab assets can surface documentation from the first attached MonoBehaviour with valid XML docs, or from a manual note when XML is not available.",
                                        "MonoBehaviours and ScriptableObjects can use XML from the backing script, with the option to switch to a manual project note by turning off Use XML.",
                                        "Folders and scenes are manual-note only. They work well for conventions, checklists, dependencies, scene purpose, and handoff instructions."
                                    ]
                                },
                                {
                                    heading: "How It Works",
                                    body: [
                                        "When a supported target is selected, a global inspector hook listens for Unity finishing the default header, then injects the Information panel into that surface.",
                                        "A stable key is generated for the target, XML docs are loaded if the type supports them, saved comments and XML preferences are read from the project database, and the shared panel UI is drawn.",
                                        "After that, registered extensions can add their own sections below the base panel without replacing the host experience."
                                    ]
                                },
                                {
                                    heading: "Storage",
                                    body: [
                                        "Manual notes and XML preferences are stored in ProjectSettings/DocumentInsideOfUnityComments.asset, so the data stays with the Unity project and does not become runtime content."
                                    ]
                                },
                                {
                                    heading: "XML Support",
                                    body: [
                                        "For code-driven targets, Document Inside reads the XML comment block above the backing class and surfaces it in the Information panel.",
                                        "Use XML for type intent. Use manual notes for project-specific context such as setup, ownership, dependencies, caveats, and expected next steps."
                                    ]
                                },
                                {
                                    heading: "Writing XML Comments",
                                    body: [
                                        "Use standard C# XML documentation comments directly above the class, with summary or description covering type intent and the manual note covering project-specific context.",
                                        "These guides are a good baseline for writing clear XML comments that stay useful once they are surfaced in the Inspector."
                                    ],
                                    links: [
                                        {
                                            label: "Find more about XML comments here (Datadog)",
                                            href: "https://docs.datadoghq.com/security/code_security/static_analysis/static_analysis_rules/csharp-best-practices/summary-documentation-comment/"
                                        },
                                        {
                                            label: "Find more about XML comments here (Medium)",
                                            href: "https://medium.com/@sametkarademir244/effective-code-documentation-with-c-xml-comments-372f8434fdbf"
                                        }
                                    ]
                                },
                                {
                                    heading: "Supported XML Tags",
                                    body: [
                                        "The parser reads source comments directly from the script file rather than compiler-generated XML output.",
                                        "It supports description and summary as the main content source, plus practical inline tags such as para, br, c, code, see, seealso, paramref, typeparamref, and list."
                                    ]
                                },
                                {
                                    heading: "Configuration",
                                    body: [
                                        "The main Inspector config controls where Document Inside can appear and which target types are eligible for the Information panel."
                                    ]
                                },
                                {
                                    heading: "Inspector Config",
                                    body: [
                                        "The main Inspector config lives inside the Document Inside package and acts as the shared configuration source for Inspector visibility and target support."
                                    ]
                                },
                                {
                                    heading: "Visibility Scope",
                                    body: [
                                        "The current config exposes a visibilityMode field, but the shipped implementation still resolves scope through AC tool asset paths. In practice, the current behavior is AC-tools-only even though the enum suggests broader future visibility."
                                    ],
                                    quotes: [
                                        {
                                            text: "Inspector config: Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Document Inside / Scripture / Config / Document Inside Inspector Config.asset"
                                        }
                                    ]
                                },
                                {
                                    heading: "Notes and Limits",
                                    body: [
                                        "Document Inside is editor-only. It does not create runtime UI.",
                                        "Comments are not stored on the target object itself. They are stored in project-level singleton assets.",
                                        "XML docs are read from source comments in the script file, not from compiler-generated XML output.",
                                        "Foldout state and some window preferences are stored as editor state, so they affect the local editing experience rather than shared documentation content."
                                    ]
                                }
                            ]
                        },
                        {
                            title: "Hand-Off (Add-on)",
                            version: "1.0",
                            refId: "hand-off-add-on",
                            refAliases: ["hand-off", "handoff", "review-addon"],
                            defaultOpen: false,
                            mediaGroups: ["Hand-Off Add-on"],
                            summary: [
                                "Hand-Off is the optional review layer for Document Inside. Its main aim is to keep approval state, blockers, next steps, and reviewer-facing context on the exact asset, object, folder, or scene under discussion.",
                                "It extends the same Information surface rather than replacing it, so teams can move from simple notes into a lightweight review workflow without splitting the context across separate tools.",
                                "Hand-Off is planned as a separate Unity Asset Store add-on."
                            ],
                            keywords: ["hand-off", "handoff", "review", "add-on", "approval"],
                            sections: [
                                {
                                    heading: "Review Workflow",
                                    body: [
                                        "Keep the base note focused on context, then add Hand-Off when the target also needs reviewer-facing notes, blockers, or status.",
                                        "That status can show whether something is marked for review, currently in review, blocked, resolved, or already reviewed.",
                                        "That state is also reduced into a simple result such as awaiting review, requirements met, or issues found, so teams can scan it quickly."
                                    ]
                                },
                                {
                                    heading: "Review Markers",
                                    body: [
                                        "Hand-Off can surface lightweight blocked and reviewed markers so teams can read review state at a glance in supported editor surfaces.",
                                        "Indicator appearance is controlled through HandOff Review Indicator Settings.asset, which defines shapes, colors, and layout values for hierarchy, project, and inspector markers."
                                    ]
                                },
                                {
                                    heading: "Review Window",
                                    body: [
                                        "The project-wide Review window is opened from Developer / AC_Tools / Review.",
                                        "It exposes the selected target, queue counts, and recent activity in one place, which is useful once review is spanning more than the current Inspector selection."
                                    ]
                                },
                                {
                                    heading: "Hand-Off Storage",
                                    body: [
                                        "Hand-Off records are stored in ProjectSettings/DocumentInsideHandOff.asset.",
                                        "Each record tracks the stable key, display name, asset path, target type, Hand-Off note, review status, review summary, and update timestamp."
                                    ]
                                }
                            ]
                        }
                    ],
                    sections: [
                        {
                            heading: "Brief Description",
                            defaultOpen: false,
                            body: [
                                "Document Inside is the main in-Unity documentation layer for this toolkit.",
                                "The base package covers manual notes, XML-backed descriptions, and project-side persistence for supported targets.",
                                "Hand-Off is an optional add-on that extends the same surface with review state, Hand-Off notes, and approval workflow."
                            ]
                        }
                    ],
                    changelogGroups: [
                        {
                            title: "Document Inside (Core)",
                            version: "1.0",
                            summary: [
                                "Public release history for the base in-Inspector notes and XML workflow."
                            ],
                            entries: [
                                {
                                    version: "1.0",
                                    label: "Public Release",
                                    body: [
                                        "Initial public release of the base Document Inside workflow.",
                                        "Includes manual notes, XML-backed type descriptions, supported target handling, Inspector configuration, and project-side persistence."
                                    ]
                                }
                            ]
                        },
                        {
                            title: "Hand-Off (Add-on)",
                            version: "1.0",
                            summary: [
                                "Public release history for the optional review layer that extends Document Inside."
                            ],
                            entries: [
                                {
                                    version: "1.0",
                                    label: "Public Release",
                                    body: [
                                        "Initial public release of the Hand-Off add-on.",
                                        "Includes reviewer-facing notes, review status, project-wide review entry, and blocked or reviewed markers."
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    slug: "documentoutside",
                    title: "Document Outside",
                    version: "1.0",
                    hiddenInNav: true,
                    summary: "External documentation links stored as Unity assets so web docs, wikis, and reference pages stay close to the workflow.",
                    packagePath: "Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Document Outside",
                    notesPath: "assets/tools/document-outside/Information.txt",
                    aliases: ["/qol/document-outside"],
                    keywords: ["docs", "external", "reference", "outside"],
                    sections: [
                        {
                            heading: "Brief Description",
                            defaultOpen: false,
                            body: [
                                "Document Outside is the external-link companion to Document Inside.",
                                "It stores a URL in a Unity asset so docs that live on the web can stay close to the project without being copied into the Inspector as written notes.",
                                "The intended use case is a source of truth that stays outside Unity, but still needs a stable in-project entry point."
                            ]
                        },
                        {
                            heading: "How To Use",
                            defaultOpen: true,
                            body: [
                                "Create a Documentation Asset, paste in the external URL, and place that asset where the reference should live in the project.",
                                "Open the link from the custom inspector, double click the asset, or use Alt-click in the Project window for a quick open path.",
                                "If the URL is incomplete or invalid, the editor normalises it where possible and prompts before opening so the workflow stays safe and predictable."
                            ]
                        },
                        {
                            heading: "Feature List",
                            list: [
                                "ScriptableObject-based DocumentationAsset files that store external references inside the Unity project.",
                                "Custom inspector with inline URL editing and an Open Documentation action.",
                                "URL normalisation for bare domains and broken-link validation before opening.",
                                "Trusted host confirmation flow, with remembered hosts stored per project in ProjectSettings/AC_DocumentOutsideTrustedHosts.asset.",
                                "Project window icon overlay and preview support so documentation assets are easy to identify.",
                                "Double click and Alt-click open behavior from the Project window."
                            ]
                        }
                    ],
                    changelogGroups: [
                        {
                            title: "Document Outside",
                            version: "1.0",
                            summary: [
                                "Public release history for the external documentation asset workflow."
                            ],
                            entries: [
                                {
                                    version: "1.0",
                                    label: "Public Release",
                                    body: [
                                        "Initial public release of the external documentation asset workflow.",
                                        "Includes URL validation, trusted host handling, and Project window support for documentation assets."
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    slug: "dontedit",
                    title: "Don't Edit",
                    version: "1.0",
                    summary: "Locking and protection for high-risk assets and objects, with visible or hidden modes and blocked editor actions.",
                    packagePath: "Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Don't Edit",
                    mediaHeading: "Unity References",
                    notesPath: "assets/tools/dont-edit/Information.txt",
                    aliases: ["/qol/dont-edit"],
                    keywords: ["lock", "warning", "protection", "review only"],
                    media: [
                        {
                            title: "Don't Edit Window",
                            src: "assets/images/Window Tool-premium.png",
                            alt: "Don't Edit tool window showing quick lock controls, configuration, and locked items.",
                            caption: "The main window used to apply locks, configure behavior, and inspect protected targets.",
                            body: [
                                "The top area is built for fast locking. You can drop the current selection or another target into the window, choose a mode, and apply the lock without hunting through multiple menus.",
                                "The Configuration foldout controls the shared enforcement rules for the tool, and the Locked Items area gives you a direct way to inspect what is currently protected."
                            ]
                        },
                        {
                            title: "Drop Mode Options",
                            src: "assets/images/Options for Edit-premium.png",
                            alt: "Drop Mode selector showing Don't Edit But See and Don't Edit Or See options.",
                            caption: "The lock mode decides whether the target stays visible or is hidden from normal editing flow.",
                            body: [
                                "DontEditButSee keeps the target available in the editor but blocks editing, which is useful for reference objects, review-only assets, or setup that should remain visible.",
                                "DontEditOrSee is the stronger lock. It is intended for content that should be protected from normal selection and opening flow as well."
                            ]
                        },
                        {
                            title: "Menu Path",
                            src: "assets/images/Don't Edit.png",
                            alt: "Unity Developer menu showing the AC_Tools path to Don't Edit.",
                            caption: "Developer -> AC_Tools -> Don't Edit or Ctrl + Alt + 4."
                        },
                        {
                            title: "Config Asset",
                            src: "assets/images/Don'tEditLockConfigLocation-premium.png",
                            alt: "Project window showing the Don't Edit package folder with the config asset visible.",
                            caption: "The shared settings asset for lock enforcement, hidden selection rules, blocked open behavior, logging, and scene tool visibility."
                        }
                    ],
                    sections: [
                        {
                            heading: "Brief Description",
                            defaultOpen: false,
                            body: [
                                "Don't Edit is the safety layer for project content that should stay visible, trusted, and hard to disturb by accident.",
                                "It supports two lock modes. One keeps the target visible but read-only. The other hides it from normal selection and opening workflows.",
                                "Typical use cases are shared scenes, protected setup objects, review-only assets, and any content where accidental edits are expensive to unwind."
                            ]
                        },
                        {
                            heading: "How To Use",
                            defaultOpen: true,
                            body: [
                                "Lock the current selection from the GameObject or Assets menu, or use the Don't Edit window to choose a target and apply the lock mode there.",
                                "Use DontEditButSee when the object should remain visible but read-only. Use DontEditOrSee when normal selection and opening should be blocked as well.",
                                "The config asset is the shared rule set for the tool. It decides whether locked content can still be edited, whether hidden locks block selection and opening, whether scene tools should disappear for locked selections, and whether lock actions should log feedback while you work."
                            ]
                        },
                        {
                            heading: "Feature List",
                            list: [
                                "Two lock modes: visible read-only and hidden protected.",
                                "Lock and unlock actions from both the Assets and GameObject menus.",
                                "Dedicated Don't Edit window for quick lock actions, configuration, and locked item management.",
                                "Selection filtering for hidden locks and blocked opening of hidden locked assets.",
                                "Blocked delete, duplicate, rename, cut, paste, move, and asset modification operations for locked content.",
                                "Undo-based protection for property edits on locked targets.",
                                "Hierarchy and Project window badges, plus an inspector lock strip with inline unlock action.",
                                "Optional hiding of scene tools while locked content is selected."
                            ]
                        }
                    ],
                    changelogGroups: [
                        {
                            title: "Don't Edit",
                            version: "1.0",
                            summary: [
                                "Public release history for the locking and protected editing workflow."
                            ],
                            entries: [
                                {
                                    version: "1.0",
                                    label: "Public Release",
                                    body: [
                                        "Initial public release of the Don't Edit safety workflow.",
                                        "Includes visible and hidden lock modes, the main window, config asset support, menu entry points, and protected editing behavior."
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
