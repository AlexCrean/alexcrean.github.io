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
        title: "About",
        group: "Documentation Viewer",
        summary: "Practical Unity production tools built from real project work.",
        packagePath: "Assets / AC_Tools",
        actions: [
            {
                href: "https://assetstore.unity.com/publishers/140384",
                label: "See My Unity Publisher Profile"
            }
        ],
        mediaHeading: "Peek at Upcoming Production Tools",
        media: [
            {
                title: "Peek at Upcoming Production Tools",
                defaultOpen: true,
                src: "assets/images/UNITY TOOLS.png",
                alt: "Overview board showing upcoming Unity production tools across Quality Of Life and Level Design toolboxes.",
                caption: "A little look at what is already in progress."
            }
        ],
        sections: [
            {
                heading: "Brief Description",
                defaultOpen: false,
                body: [
                    "Made from the tools I kept wishing existed while shipping everything from game jams to long, collaborative Unity projects.",
                    "The focus stays the same across all of them: clearer context, safer edits, and making the editor more personable."
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
                                    ],
                                    list: [
                                        "Shared window palette for headers, rows, separators, accents, toggle states, and warning colours.",
                                        "Shared text palette for primary text, muted labels, link colours, and information surfaces.",
                                        "Shared code palette for documentation previews and editor-side code samples.",
                                        "One central theme asset used across AC_Tools windows and drawers."
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
                    purchaseLink: "https://assetstore.unity.com/packages/slug/368278",
                    summary: "In-Unity documentation for assets, objects, folders, and scenes that stays flexible as the project changes, with Hand-Off available as a separate review add-on.",
                    packagePath: "Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Document Inside",
                    assetLocation: "Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Document Inside",
                    mediaHeading: "Unity References",
                    postMediaGroups: ["Hand-Off Add-on"],
                    notesPath: "assets/tools/document-inside/Information.txt",
                    aliases: ["/documentinside", "/qol/document-inside", "/qualityoflife/documentinside", "/qol/betterinside", "/qualityoflife/betterinside"],
                    keywords: ["docs", "notes", "inside", "better inside", "handoff", "review", "xml"],
                    sections: [
                        {
                            heading: "Brief Overview",
                            body: [
                                "Document Inside puts the useful context back on the thing you are actually working on, so setup notes, ownership, caveats, and review state stop drifting off into separate docs and forgotten chat threads.",
                                "Good documentation changes as the project changes. In a Unity project that keeps expanding, the stronger approach is to keep that context inside the engine, where it can stay close to the asset, object, folder, or scene it actually belongs to.",
                                "It is built for teams who want cleaner hand-off, faster understanding, and less risk when someone opens a scene, prefab, folder, or object and needs to know what matters before touching it."
                            ]
                        }
                    ],
                    media: [
                        {
                            title: "Document Inside Overview",
                            defaultOpen: true,
                            pitchMedia: true,
                            src: "assets/images/LUWA - Document Inside.svg",
                            alt: "Promotional overview window for Document Inside showing the richer pitch presentation for the tool.",
                            caption: "The fast read on why Document Inside is useful before you drop into the implementation details."
                        },
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
                                    heading: "Brief Overview",
                                    body: [
                                        "Document Inside keeps the useful project context on the exact asset, object, folder, or scene people are already touching, instead of scattering it across separate docs, chats, and review notes.",
                                        "The result is less second-guessing, less editor tab-hopping, and a cleaner hand-off path when the next person needs to understand what something is, why it exists, and what is safe to change."
                                    ]
                                },
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
                                    ],
                                    list: [
                                        "Inspector notes for supported assets, objects, folders, and scenes.",
                                        "XML-backed descriptions for code-driven targets.",
                                        "Supported target handling for GameObjects, MonoBehaviours, ScriptableObjects, folders, and scenes.",
                                        "Project-side persistence for notes and XML preferences.",
                                        "Inspector configuration for target visibility and scope."
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
                                    ],
                                    list: [
                                        "Reviewer-facing Hand-Off notes inside the same Information surface.",
                                        "Review status tracking on the selected target.",
                                        "Project-wide Review window entry from Developer / AC_Tools / Review.",
                                        "Blocked and reviewed markers for quick status reading.",
                                        "Project-side persistence for Hand-Off records and review state."
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
                    purchaseLink: "https://assetstore.unity.com/packages/slug/370620",
                    summary: "Locking and protection for high-risk assets and objects, with visible or hidden modes and blocked editor actions.",
                    packagePath: "Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Don't Edit",
                    assetLocation: "Assets / AC_Tools / Quality Of Life Tools by AC / Better Documentation / Don't Edit",
                    leadSectionHeadings: ["How To Use"],
                    mediaHeading: "Unity References",
                    notesPath: "assets/tools/dont-edit/Information.txt",
                    aliases: ["/qol/dont-edit"],
                    keywords: ["lock", "warning", "protection", "review only"],
                    media: [
                        {
                            group: "Ways to Lock",
                            title: "Menu Drop Down",
                            src: "assets/images/Don't Edit.png",
                            alt: "Unity Developer menu showing the AC_Tools path to Don't Edit.",
                            caption: "Developer -> AC_Tools -> Don't Edit or Ctrl + Alt + 4.",
                            body: [
                                "This is the clean entry point when you want to open the tool deliberately rather than locking from a one-off context action.",
                                "It is the better starting path when you expect to choose a mode, inspect current locks, or adjust the shared behavior afterwards."
                            ]
                        },
                        {
                            group: "Ways to Lock",
                            title: "Don't Edit Window",
                            src: "assets/images/Window Tool-premium.png",
                            alt: "Don't Edit tool window showing quick lock controls, configuration, and locked items.",
                            caption: "The main window used to apply locks, configure behavior, and inspect protected targets.",
                            body: [
                                "The top of the window is the operational part of the tool: choose the target, choose the lock mode, and apply it without bouncing through multiple editor menus.",
                                "Below that, the same window carries the config foldout and the locked-items list, so the workflow stays in one place when you need to move from applying a lock to checking what the tool is currently enforcing."
                            ]
                        },
                        {
                            group: "Ways to Lock",
                            title: "Drop Mode Options",
                            src: "assets/images/Options for Edit-premium.png",
                            alt: "Drop Mode selector showing Don't Edit But See and Don't Edit Or See options.",
                            caption: "The lock mode decides whether the target stays visible or is hidden from normal editing flow.",
                            body: [
                                "DontEditButSee is the visible lock. It is useful when the object still needs to remain in view as context, but should stop inviting casual edits.",
                                "DontEditOrSee is the stronger mode. It shifts the tool from read-only protection into active interruption of normal selection and opening flow."
                            ]
                        },
                        {
                            group: "Ways to Lock",
                            title: "Right-Click Lock Flow",
                            src: "assets/images/Right Click on Hierarchy.png",
                            alt: "Unity Hierarchy context menu showing the Don't Edit options on right click.",
                            caption: "You can also reach the lock workflow directly from the Hierarchy context menu when working in-scene.",
                            body: [
                                "This is the faster in-scene route when the object is already in front of you and the decision is local: protect this now.",
                                "It matters less as a discovery surface and more as a speed path once the tool becomes part of normal scene maintenance."
                            ]
                        },
                        {
                            group: "Configuration",
                            title: "Config Asset",
                            src: "assets/images/Don'tEditLockConfigLocation-premium.png",
                            alt: "Project window showing the Don't Edit package folder with the config asset visible.",
                            caption: "The shared settings asset for lock enforcement, hidden selection rules, blocked open behavior, logging, and scene tool visibility.",
                            body: [
                                "This is the project-level rules object behind the tool, not just a local window preference.",
                                "If the lock behavior feels too strict or too soft, this is the asset that explains why and the place where that behavior is adjusted."
                            ]
                        },
                        {
                            group: "Lock Indicators",
                            title: "Hierarchy Lock Indicator",
                            src: "assets/images/Don'tEditIconInHierarchy.png",
                            alt: "Unity Hierarchy showing the full Don't Edit indicator on a protected item.",
                            caption: "Protected items can show a clear hierarchy indicator so locked content stands out before you interact with it.",
                            body: [
                                "The full indicator is the strongest hierarchy signal in the set. It is the version you want when the item should read immediately as protected before anyone even clicks it.",
                                "The partial state shown next belongs to the same visual language, but it communicates a lighter or mixed restriction state rather than the full locked treatment."
                            ]
                        },
                        {
                            group: "Lock Indicators",
                            title: "Partial Hierarchy Indicator",
                            src: "assets/images/PartialDon'tEditIconInHierarchy.png",
                            alt: "Unity Hierarchy showing a partial Don't Edit indicator state on an item.",
                            caption: "The partial indicator helps distinguish restricted states without making every protected item look identical.",
                            body: [
                                "This is useful when the hierarchy needs to communicate nuance rather than a single blunt yes-or-no lock state.",
                                "Together, the full and partial indicators give the tool a hierarchy language that can be read quickly without opening the object first."
                            ]
                        }
                    ],
                    sections: [
                        {
                            heading: "About",
                            defaultOpen: false,
                            body: [
                                "Don't Edit gives high-risk project content a deliberate layer of friction before someone casually renames, moves, opens, or edits the wrong thing.",
                                "It supports two lock modes. One keeps the target visible but read-only. The other pushes it further out of the normal selection and opening flow.",
                                "It works best for the kind of content that quietly breaks a scene, a prefab setup, or a shared workflow when someone nudges it at the wrong moment."
                            ]
                        },
                        {
                            heading: "How To Use",
                            defaultOpen: true,
                            body: [
                                "Use this flow to lock something on purpose, verify the result, and then tune the strictness if needed. The window, drop mode selector, and config asset images above map to these steps."
                            ],
                            numberedList: [
                                "Select the asset or GameObject you want to protect.",
                                "Open Don't Edit from Developer -> AC_Tools -> Don't Edit, or use the Assets or GameObject menu if you already know what you want to lock.",
                                "In the window, drop in the current target if needed and choose the lock mode. Use DontEditButSee when the target should stay visible but read-only. Use DontEditOrSee when it should also be hidden from normal selection and opening flow.",
                                "Apply the lock and immediately test the result in the editor. Try selecting it, opening it, renaming it, or making a small edit so you can confirm the protection matches the intention.",
                                "If the lock feels too loose or too strict, open the config area and adjust the shared rules for blocked selection, opening, scene tools, and feedback logging.",
                                "When you need to review or remove protection later, use the main window to inspect the locked items list and unlock from there."
                            ]
                        },
                        {
                            heading: "Config",
                            body: [
                                "The config asset is the shared rule set for the tool. It decides whether locked content can still be edited, whether hidden locks block selection and opening, whether scene tools should disappear for locked selections, and whether lock actions should log feedback while you work.",
                                "If you are setting the tool up for a team, this is the part that defines how strict the protection should feel in day-to-day editor use."
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
                                    ],
                                    list: [
                                        "Visible read-only and hidden protected lock modes.",
                                        "Lock and unlock actions from the Assets and GameObject menus.",
                                        "Main Don't Edit window for quick locking, configuration, and locked item review.",
                                        "Selection filtering and blocked opening for hidden locked targets.",
                                        "Protected delete, duplicate, rename, cut, paste, move, and asset modification handling.",
                                        "Hierarchy, Project window, and Inspector lock indicators.",
                                        "Optional hiding of scene tools while locked content is selected."
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
