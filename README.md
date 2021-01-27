![Node.js CI](https://github.com/Woobble/pagescroll.js/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/%40woobble%2Fpagescroll.js.svg)](https://badge.fury.io/js/%40woobble%2Fpagescroll.js)

# pagescroll.js

[demo](https://woobble.github.io/pagescroll.js/)

Install:
```
npm i @woobble/pagescroll.js
```

Usage:
```javascript
import pagescroll from '@woobble/pagescroll.js'

// Create instance
const pScroll = pagescroll({
    tags: [
        "tag1",
        "tag2",
    ],
    initialize: true
})

// If initialize: false
pScroll.initialize()

// Destroy instance
pScroll.destroy()
```

Build
```
git clone https://github.com/Woobble/pagescroll.js.git

cd pagescroll.js

npm i

// compiles to ./dist
npm run build
```