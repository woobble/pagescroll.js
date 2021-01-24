// HTML Classes

const HTML = "pscroll-html"
const SECTION = "pscroll_section"
const SECTION_CLASS = `.${SECTION}`
const SECTION_ACTIVE = "pscroll_active"
const SECTION_ACTIVE_CLASS = `.${SECTION_ACTIVE}`

'use strict'

const PScroll = class {

    constructor(options = {}) {
        this.anchors = options.anchors ||  []
        this.fallBackSection = options.fallBack || 0
        this.initialized = false
        this.sectionTags = new Map()
        this.sections = []
        this.callbacks = new Set()
        this.initialize()
    }

    initialize() {
        if(this.initialized) {
            throw new Error("PScroll instance is already initialized");
        }
        this.initialized = true;
        (function(pScroll, root, initializeStructure, sections) {
            initializeStructure(root);
            sections(pScroll, root);
            if(pScroll.sections.length > 0) pScroll.activeSection = pScroll.fallBackSection
        }(this, function () {
            return select('#page_container')
        }, function (root) {
            initializeAndCheckStructure(root)
        }, function (pScroll, root) {
            let i = 0;
            select(SECTION_CLASS, root).forEach(value => {
                pScroll.sections.push(value)
                const sectionAnchor = pScroll.anchors[i] || anchorName()
                pScroll.sectionTags.set(sectionAnchor, value)
                i++;
            })
            return pScroll.sections
        }));

        (function (pScroll) {

            document.addEventListener('wheel', function(event) {
                if (event.deltaY < 0) {
                    pScroll.goUp()
                } else if (event.deltaY > 0) {
                    pScroll.goDown()
                }
            });
        }(this));

    }

    goUp() {
        if(this.sections[this.currentSectionId - 1] !== null) {
            this.activeSection = this.currentSectionId - 1
        }
    }

    goDown() {
        if(this.sections[this.currentSectionId + 1] !== null) {
            this.activeSection = this.currentSectionId + 1
        }
    }

    set activeSection(id) {
        if(id === this.currentSectionId) return;

        (function (pScroll) {
            const section = pScroll.sections[pScroll.currentSectionId]

            if(section && hasClass(section, SECTION_ACTIVE)) {
                removeClass(section, SECTION_ACTIVE)
            }

        }(this));

        this.currentSectionId = id;

        (function (pScroll, setActiveClass) {
            const section = pScroll.sections[id]

            if(!section) {
                window.console.warn("Cannot find section. Getting back to fallback")
                setActiveClass(pScroll.sections[pScroll.fallBackSection])
                return;
            }
            setActiveClass(section)
        }(this, function (elem) {
            if(!elem) return;
            if(!hasClass(elem, SECTION_ACTIVE)) {
                addClass(elem, SECTION_ACTIVE)
            }
        }));


        this.callbacks.forEach(value => value(id))

    }

    get activeSection() {
        return this.sections[this.currentSectionId]
    }

    async scrollTo(id) {
        this.activeSection = id
    }

    afterScroll(callback) {
        if (typeof callback !== "function") return;
        this.callbacks.add(callback)
    }

}

let id = 1;
function anchorName() {
    return `undef${id++}`
}

function initializeAndCheckStructure() {
    const htmlEl = select("html")[0]

    if(!hasClass(htmlEl, HTML)) {
        addClass(htmlEl, HTML)
    }
}

function style(elements, styles) {
    elements = !isListOrArray(elements) ? [elements] : elements
    for(let key in styles) {
        if(styles.hasOwnProperty(key)) {
            for (let element in elements) {
                element.style[key] = styles[style]
            }
        }
    }
    return elements
}

function select(selector, context) {
    context = arguments > 1 ? context : document
    return context ? context.querySelectorAll(selector) : null
}

function hasClass($el, clazz) {
    if(!$el) return false;
    if($el.classList) return $el.classList.contains(clazz)
    return RegExp(`(^| )${clazz}( |$)`, 'gi').test($el.className)
}

function addClass($el, clazz) {
    if(!$el) return;
    if($el.classList) $el.classList.add(clazz)
}

function isListOrArray(o) {
    return Object.prototype.toString.call(o) === '[object NodeList]' ||
        Object.prototype.toString.call(o) === '[object Array]'
}

function removeClass($el, clazz) {
    if(!$el) return;
    if($el.classList) $el.classList.remove(clazz)
}

PScroll.fn = PScroll.prototype = function (options = {}) {
    if(typeof document == "undefined" || typeof window == "undefined") {
        console.exception("document and window has to be defined")
        return null;
    }
    return new PScroll(options)
}

export default PScroll.fn

