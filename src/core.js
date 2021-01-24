// HTML Classes

const HTML = "pscroll-html"
const SECTION = "pscroll_section"
const SECTION_CLASS = `.${SECTION}`
const SECTION_ACTIVE = "pscroll_active"
const SECTION_ACTIVE_CLASS = `.${SECTION_ACTIVE}`

'use strict'

const PScroll = class {

    constructor(options = {}) {
        this.anchors = options.anchors ??  []
        this.fallBackSection = options.fallBack ?? 0
        this.initialized = false
        this.sectionTags = new Map()
        this.sections = new NodeList()
        this.callbacks = new NodeList()
        this.initialize()
    }

    initialize() {
        if(this.initialized) {
            throw new Error("PScroll instance is already initialized");
        }
        this.initialized = true;
        (function(pScroll, root, initializeStructure, _sections) {
            initializeStructure(root);
            const sections = _sections(pScroll, root);
            if(sections.length > 0) pScroll.activeSection = pScroll.fallBackSection
        }(this, function () {
            return $('#page_container') ?? throw new Error("Cannot initialize PScroll, cause there is not element with id: 'pscroll'");
        }, function (root) {
            initializeAndCheckStructure(root)
        }, function (pScroll, root) {
            let i = 0;
            $(SECTION_CLASS, root).forEach(value => {
                this.sections.add(value)
                const sectionAnchor = pScroll.anchors[i] ?? anchorName()
                pScroll.sectionTags.set(sectionAnchor, value)
                i++;
            })
            return this.sections
        }));
    }

    set activeSection(id) {
        if(id === this.currentSectionId) return;

        (function (pScroll) {
            const section = pScroll.sections[pScroll.currentSectionId]

            if(section !== null && hasClass(section, SECTION_ACTIVE_CLASS)) {
                removeClass(section, SECTION_ACTIVE_CLASS)
            }

        }(this))

        this.currentSectionId = id

        (function (pScroll, setActiveClass) {
            const section = pScroll.sections[pScroll.currentSectionId]

            if(!section) {
                window.console.warn("Cannot find section. Getting back to fallback")
                setActiveClass(pScroll.sections[pScroll.fallBackSection])
                return;
            }
            setActiveClass(section)
        }(this, function (elem) {
            if(!elem) return;
            if(!hasClass(elem, SECTION_ACTIVE_CLASS)) {
                addClass(elem, SECTION_ACTIVE_CLASS)
            }
        }))


        this.callbacks.forEach(value => value(id))

    }

    get activeSection() {
        return this.sections[this.currentSectionId]
    }

    async scrollTo(id) {
        this.activeSection = id
    }

    afterScroll(callback) {
        if (typeof callback !== "function") throw new Error("")
        this.callbacks.add(callback)
    }

}



function anchorName() {
    return makeId(5)
}

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function initializeAndCheckStructure(root) {
    const htmlEl = $("html")[0]

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

function $(selector, context) {
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

export default PScroll.prototype = PScroll

