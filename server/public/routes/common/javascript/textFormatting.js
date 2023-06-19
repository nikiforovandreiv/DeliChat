// function takes a text and returns a highlighted version of it
function highlight(text, color) {
    const colors = {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m'
    };

    const resetColor = '\x1b[0m';

    if (colors[color]) {
        return `${colors[color]}${text}${resetColor}`;
    } else {
        return text;
    }
}

// highlight text
function hT(text, color = 'green') {
    return highlight(text, color);
}

// highlight passwords
function hP(text, color = 'red') {
    return highlight(text, color);
}

// highlight ID
function hID(text, color = 'magenta') {
    return highlight(text, color);
}

// highlight file
function hF(text, color = 'blue') {
    return highlight(text, color);
}

module.exports = {
    highlight,
    hT,
    hP,
    hID,
    hF
};