// HTML Classes

const HTML = "pscroll-html"
const SECTION = "pscroll_section"
const SECTION_CLASS = `.${SECTION}`
const SECTION_ACTIVE = "pscroll_active"
const SECTION_ACTIVE_CLASS = `.${SECTION_ACTIVE}`

'use strict'

const PScroll = class {

    constructor(options = {}) {
        this.tags = options.tags || []
        this.fallBackSection = options.fallBack || 0
        const initialize = options.initialize || true
        this.initialized = false
        this.sections = []
        this.callbacks = []
        this.sectionTags = new Map()
        this.waiting = false
        if(initialize) this.initialize()
    }

    destroy() {
        if(!this.initialized) return;
        this.tags = null
        this.fallBackSection = null
        this.sectionTags = null
        this.sections = null
        this.callbacks = null
        this.waiting = null
        document.removeEventListener("wheel", this.wheelEvent)
        document.removeEventListener("touchmove", this.moveTouch)
        document.removeEventListener("touchstart", this.startTouch)
        unregister()
    }

    initialize() {
        if(this.initialized) {
            return;
        }
        this.initialized = true;
        (function(pScroll, root, initializeStructure, sections) {
            initializeStructure(root);
            sections(pScroll, root);
            if(pScroll.sections.length > 0) {
                const tag = getAnchor()
                pScroll.activeSection = pScroll.sectionTags.get(tag) || pScroll.fallBackSection
            }
        }(this, function () {
            return select('#page_container')
        }, function (root) {
            initializeAndCheckStructure(root)
        }, function (pScroll, root) {
            let i = 0;
            select(SECTION_CLASS, root).forEach(value => {
                pScroll.sections.push(value)
                const sectionAnchor = pScroll.tags[i] || anchorName()
                pScroll.sectionTags.set(sectionAnchor, i)
                i++;
            })
            return pScroll.sections
        }));

        (function (pScroll) {

            document.addEventListener('wheel', pScroll.wheelEvent = function(event) {
                if (event.deltaY < 0) {
                    pScroll.goUp()
                } else if (event.deltaY > 0) {
                    pScroll.goDown()
                }
            }, false);

            (function (pScroll) {
                document.addEventListener("touchstart", pScroll.startTouch = startTouch, false);
                document.addEventListener("touchmove", pScroll.moveTouch = moveTouch, false);

                let initialX = null;
                let initialY = null;

                function startTouch(e) {
                    initialX = e.touches[0].clientX;
                    initialY = e.touches[0].clientY;
                }

                function moveTouch(e) {
                    if (initialX === null) {
                        return;
                    }

                    if (initialY === null) {
                        return;
                    }

                    let currentX = e.touches[0].clientX;
                    let currentY = e.touches[0].clientY;

                    let diffX = initialX - currentX;
                    let diffY = initialY - currentY;

                    if(Math.abs(diffX) < Math.abs(diffY)){
                        if (diffY > 0) {
                            pScroll.goDown()
                        } else {
                            pScroll.goUp()
                        }
                    }

                    initialX = null;
                    initialY = null;

                }

            }(pScroll))

        }(this));

        const tag = getAnchor()
        if(tag) {
            this.goToTag(tag)
        }

    }

    goUp() {
        if(this.waiting) return;
        if((this.currentSectionId - 1) >= 0) {
            this.waiting = true
            const newId = this.currentSectionId - 1
            this.activeSection = newId
            pushAnchor(this.getTagForIndex(newId))
            setTimeout(() => {
                this.waiting = false
            }, 1000)
        }
    }

    goDown() {
        if(this.waiting) return;
        if((this.currentSectionId + 1) < this.sections.length) {
            this.waiting = true
            const newId = this.currentSectionId + 1
            this.activeSection = newId
            pushAnchor(this.getTagForIndex(newId))
            setTimeout(() => {
                this.waiting = false
            }, 1000)
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
                pScroll.currentSectionId = pScroll.fallBackSection;
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

    goTo(id) {
        if(((this.currentSectionId + 1) < this.sections.length) &&
            ((this.currentSectionId - 1) >= 0)) {
            this.activeSection = id
        }
    }

    goToTag(tag) {
        if(!tag) return;
        const tagId = this.sectionTags.get(tag)
        if(tagId) {
            this.goTo(tagId)
            pushAnchor(tag)
        }
    }

    afterScroll(callback) {
        if (typeof callback !== "function") return;
        this.callbacks.push(callback)
    }

    getTagForIndex (index) {
        let val = null;
        if(index >= 0) {
            this.sectionTags.forEach((_index, value) => {
                if(index === _index) {
                    val = value;
                }
            })
        }
        return val;
    }

}

function pushAnchor(tag) {
    window.location.href = `#${tag}`
}

function getAnchor() {
    return window.location.hash.replace('#', '')
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

function unregister() {
    const htmlEl = select("html")[0]
    if(hasClass(htmlEl, HTML)) {
        removeClass(htmlEl, HTML)
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

PScroll.fn = function (options = {}) {
    if(typeof document == "undefined" || typeof window == "undefined") {
        console.exception("document and window has to be defined")
        return null;
    }
    return new PScroll(options)
}

window.PScroll = PScroll.fn
export default PScroll.fn