if (localStorage.getItem("name")==null) {
    localStorage.setItem("name", prompt("Your name..."));
}

function paste() {
    navigator.clipboard.readText().then(text => {
        text != "" ? q.value += text : alert(":| Your clipboard is empty.");
    }).catch(() => {
        alert(":( Permission denied!");
    });
}

srch.addEventListener("submit", function () {
    const prefixes = {
        "/c": "https://codepen.io/search/pens?q=",
        "/y": "https://www.youtube.com/results?search_query=",
        "/m": "https://minecraft.fandom.com/wiki/Special:Search?query=",
        "/s": "https://open.spotify.com/search/",
        "/w": "https://en.wikipedia.org/w/index.php?search="
    };

    const input = q.value.trim();
    const prefix = input.slice(0, 2);
    const query = input.slice(2);

    let searchURL;

    if (prefixes.hasOwnProperty(prefix)) {
        searchURL = prefixes[prefix];
    } else {
        searchURL = "https://www.google.com/search?q=" + prefix;
    }

    if (query.length > 0) {
        window.open(searchURL + query);
    }
});


function clock() {
    const now = new Date(),
        [h, m] = [now.getHours(), now.getMinutes()];
    ['hr', 'min'].forEach((x, i) => document.getElementById(x).style.transform = `rotate(${[h % 12 * 5, m][i] * 6}deg)`);
    digi.innerHTML = h + " : " + m;
    wish.innerHTML = `Good ${h < 12 ? "morning" : h < 18 ? "afternoon" : "evening"},<br>${localStorage.getItem("name")}`;
    setTimeout(clock, 6e4);
} clock();

function cal(x) {
    c.value += x;
}

calc.addEventListener("submit", function () {
    c.value = eval(c.value);
});

function back() {
    const s = c.selectionStart - 1
    c.value = c.value.slice(0, s) + c.value.slice(s + 1);
    c.selectionStart = c.selectionEnd = s;
}

chem.addEventListener("submit", function () {
    al.style.height = "7ch";
    al.style.padding = "2ch";
    chem.style.height = "40vh";
    doBalance();
});

function mic() {
    var rec = window.webkitSpeechRecognition ? new window.webkitSpeechRecognition() : (window.SpeechRecognition ? new window.SpeechRecognition() : null);
    if (rec) {
        rec.lang = 'en-IN';
        rec.onstart = () => {
            q.placeholder = "Listening...";
        }
        rec.onerror = e => {
            alert("Permission " + e.error);
            q.placeholder = "What you wanna surf?";
        }
        rec.onnomatch = () => {
            rec.start();
        }
        rec.onresult = e => {
            q.value += e.results[0][0].transcript;
            q.placeholder = "Search on Swoogle XD";
        }
        rec.start();
    }
}

document.addEventListener('contextmenu', e => {
     e.preventDefault();
 });

mob.href = (/Mobi|Android|iPhone|iPad|Windows Phone/.test(navigator.userAgent)) ? "Mob.css" : "NotMob.css";

const formulaElem = document.getElementById("sce");
function doBalance() {

    const msgElem = document.getElementById("msg");
    const balancedElem = document.getElementById("rslt");
    const codeOutElem = document.getElementById("code");
    msgElem.textContent = "";
    while (balancedElem.firstChild !== null)
        balancedElem.removeChild(balancedElem.firstChild);
    while (codeOutElem.firstChild !== null)
        codeOutElem.removeChild(codeOutElem.firstChild);
    codeOutElem.textContent = " ";
    const formulaStr = formulaElem.value;
    let eqn;
    try {
        eqn = new Parser(formulaStr).parseEquation();
    }
    catch (e) {
        if (e instanceof ParseError) {
            msgElem.textContent = "Syntax error: " + e.message;
            const start = e.start;
            let end = e.end !== undefined ? e.end : e.start;
            while (end > start && [" ", "\t"].includes(formulaStr.charAt(end - 1)))
                end--;
            if (start == end)
                end++;
            codeOutElem.textContent = formulaStr.substring(0, start);
            if (end <= formulaStr.length) {
                codeOutElem.append(createElem("u", formulaStr.substring(start, end)));
                codeOutElem.append(formulaStr.substring(end, formulaStr.length));
            }
            else
                codeOutElem.append(createElem("u", " "));
        }
        else if (e instanceof Error) {
            msgElem.textContent = "Syntax error: " + e.message;
        }
        else {
            msgElem.textContent = "Assertion error";
        }
        return;
    }
    try {
        let matrix = buildMatrix(eqn);
        solve(matrix);
        const coefs = extractCoefficients(matrix);
        checkAnswer(eqn, coefs);
        balancedElem.append(eqn.toHtml(coefs));
    }
    catch (e) {
        msgElem.textContent = e.message;
    }
}

function doDemo(formulaStr) {
    formulaElem.value = formulaStr;
    doBalance();
}
const RANDOM_DEMOS = [
    "H2 + O2 = H2O",
    "Fe + O2 = Fe2O3",
    "NH3 + O2 = N2 + H2O",
    "C2H2 + O2 = CO2 + H2O",
    "C3H8O + O2 = CO2 + H2O",
    "Na + O2 = Na2O",
    "P4 + O2 = P2O5",
    "Na2O + H2O = NaOH",
    "Mg + HCl = MgCl2 + H2",
    "AgNO3 + LiOH = AgOH + LiNO3",
    "Pb + PbO2 + H^+ + SO4^2- = PbSO4 + H2O",
    "HNO3 + Cu = Cu(NO3)2 + H2O + NO",
    "KNO2 + KNO3 + Cr2O3 = K2CrO4 + NO",
    "AgNO3 + BaCl2 = Ba(NO3)2 + AgCl",
    "Cu(NO3)2 = CuO + NO2 + O2",
    "Al + CuSO4 = Al2(SO4)3 + Cu",
    "Na3PO4 + Zn(NO3)2 = NaNO3 + Zn3(PO4)2",
    "Cl2 + Ca(OH)2 = Ca(ClO)2 + CaCl2 + H2O",
    "CHCl3 + O2 = CO2 + H2O + Cl2",
    "H2C2O4 + MnO4^- = H2O + CO2 + MnO + OH^-",
    "H2O2 + Cr2O7^2- = Cr^3+ + O2 + OH^-",
    "KBr + KMnO4 + H2SO4 = Br2 + MnSO4 + K2SO4 + H2O",
    "K2Cr2O7 + KI + H2SO4 = Cr2(SO4)3 + I2 + H2O + K2SO4",
    "KClO3 + KBr + HCl = KCl + Br2 + H2O",
    "Ag + HNO3 = AgNO3 + NO + H2O",
    "P4 + OH^- + H2O = H2PO2^- + P2H4",
    "Zn + NO3^- + H^+ = Zn^2+ + NH4^+ + H2O",
    "ICl + H2O = Cl^- + IO3^- + I2 + H^+"
];
let lastRandomIndex = -1;
function doRandom() {
    let index;
    do {
        index = Math.floor(Math.random() * RANDOM_DEMOS.length);
        index = Math.max(Math.min(index, RANDOM_DEMOS.length - 1), 0);
    } while (RANDOM_DEMOS.length >= 2 && index == lastRandomIndex);
    lastRandomIndex = index;
    doDemo(RANDOM_DEMOS[index]);
}

class Parser {
    constructor(formulaStr) {
        this.tok = new Tokenizer(formulaStr);
    }

    parseEquation() {
        let lhs = [this.parseTerm()];
        while (true) {
            const next = this.tok.peek();
            if (next == "+") {
                this.tok.consume(next);
                lhs.push(this.parseTerm());
            }
            else if (next == "=") {
                this.tok.consume(next);
                break;
            }
            else
                throw new ParseError("Plus or equal sign expected", this.tok.pos);
        }
        let rhs = [this.parseTerm()];
        while (true) {
            const next = this.tok.peek();
            if (next === null)
                break;
            else if (next == "+") {
                this.tok.consume(next);
                rhs.push(this.parseTerm());
            }
            else
                throw new ParseError("Plus or end expected", this.tok.pos);
        }
        return new Equation(lhs, rhs);
    }

    parseTerm() {
        const startPos = this.tok.pos;
        let items = [];
        let electron = false;
        let next;
        while (true) {
            next = this.tok.peek();
            if (next == "(")
                items.push(this.parseGroup());
            else if (next == "e") {
                this.tok.consume(next);
                electron = true;
            }
            else if (next !== null && /^[A-Z][a-z]*$/.test(next))
                items.push(this.parseElement());
            else if (next !== null && /^[0-9]+$/.test(next))
                throw new ParseError("Invalid term - number not expected", this.tok.pos);
            else
                break;
        }

        let charge = null;
        if (next == "^") {
            this.tok.consume(next);
            next = this.tok.peek();
            if (next === null)
                throw new ParseError("Number or sign expected", this.tok.pos);
            else {
                charge = this.parseOptionalNumber();
                next = this.tok.peek();
            }
            if (next == "+")
                charge = +charge;
            else if (next == "-")
                charge = -charge;
            else
                throw new ParseError("Sign expected", this.tok.pos);
            this.tok.take();
        }

        if (electron) {
            if (items.length > 0)
                throw new ParseError("Invalid term - electron needs to stand alone", startPos, this.tok.pos);
            if (charge === null)
                charge = -1;
            if (charge != -1)
                throw new ParseError("Invalid term - invalid charge for electron", startPos, this.tok.pos);
        }
        else {
            if (items.length == 0)
                throw new ParseError("Invalid term - empty", startPos, this.tok.pos);
            if (charge === null)
                charge = 0;
        }
        return new Term(items, charge);
    }

    parseGroup() {
        const startPos = this.tok.pos;
        this.tok.consume("(");
        let items = [];
        while (true) {
            const next = this.tok.peek();
            if (next == "(")
                items.push(this.parseGroup());
            else if (next !== null && /^[A-Z][a-z]*$/.test(next))
                items.push(this.parseElement());
            else if (next == ")") {
                this.tok.consume(next);
                if (items.length == 0)
                    throw new ParseError("Empty group", startPos, this.tok.pos);
                break;
            }
            else
                throw new ParseError("Element, group, or closing parenthesis expected", this.tok.pos);
        }
        return new Group(items, this.parseOptionalNumber());
    }

    parseElement() {
        const name = this.tok.take();
        if (!/^[A-Z][a-z]*$/.test(name))
            throw new Error("Assertion error");
        return new ChemElem(name, this.parseOptionalNumber());
    }

    parseOptionalNumber() {
        const next = this.tok.peek();
        if (next !== null && /^[0-9]+$/.test(next))
            return checkedParseInt(this.tok.take());
        else
            return 1;
    }
}

class Tokenizer {
    constructor(str) {
        this.str = str.replace(/\u2212/g, "-");
        this.pos = 0;
        this.skipSpaces();
    }

    peek() {
        if (this.pos == this.str.length)
            return null;
        const match = /^([A-Za-z][a-z]*|[0-9]+|[+\-^=()])/.exec(this.str.substring(this.pos));
        if (match === null)
            throw new ParseError("Invalid symbol", this.pos);
        return match[0];
    }

    take() {
        const result = this.peek();
        if (result === null)
            throw new Error("Advancing beyond last token");
        this.pos += result.length;
        this.skipSpaces();
        return result;
    }

    consume(s) {
        if (this.take() != s)
            throw new Error("Token mismatch");
    }
    skipSpaces() {
        const match = /^[ \t]*/.exec(this.str.substring(this.pos));
        if (match === null)
            throw new Error("Assertion error");
        this.pos += match[0].length;
    }
}
class ParseError extends Error {
    constructor(message, start, end) {
        super(message);
        this.start = start;
        this.end = end;
        Object.setPrototypeOf(this, ParseError.prototype);
    }
}

class Equation {
    constructor(lhs, rhs) {

        this.leftSide = lhs.slice();
        this.rightSide = rhs.slice();
    }

    getElements() {
        const result = new Set();
        for (const item of this.leftSide.concat(this.rightSide))
            item.getElements(result);
        return Array.from(result);
    }

    toHtml(coefs) {
        if (coefs !== undefined && coefs.length != this.leftSide.length + this.rightSide.length)
            throw new RangeError("Mismatched number of coefficients");
        let node = document.createDocumentFragment();
        let j = 0;
        function termsToHtml(terms) {
            let head = true;
            for (const term of terms) {
                const coef = coefs !== undefined ? coefs[j] : 1;
                if (coef != 0) {
                    if (head)
                        head = false;
                    else
                        node.append(createSpan("plus", " + "));
                    if (coef != 1) {
                        let span = createSpan("coefficient", coef.toString().replace(/-/, MINUS));
                        if (coef < 0)
                            span.classList.add("negative");
                        node.append(span);
                    }
                    node.append(term.toHtml());
                }
                j++;
            }
        }
        termsToHtml(this.leftSide);
        node.append(createSpan("rightarrow", " \u2192 "));
        termsToHtml(this.rightSide);
        return node;
    }
}


class Term {
    constructor(items, charge) {
        if (items.length == 0 && charge != -1)
            throw new RangeError("Invalid term");
        this.items = items.slice();
        this.charge = charge;
    }
    getElements(resultSet) {
        resultSet.add("e");
        for (const item of this.items)
            item.getElements(resultSet);
    }

    countElement(name) {
        if (name == "e") {
            return -this.charge;
        }
        else {
            let sum = 0;
            for (const item of this.items)
                sum = checkedAdd(sum, item.countElement(name));
            return sum;
        }
    }

    toHtml() {
        let node = createSpan("term");
        if (this.items.length == 0 && this.charge == -1) {
            node.textContent = "e";
            node.append(createElem("sup", MINUS));
        }
        else {
            for (const item of this.items)
                node.append(item.toHtml());
            if (this.charge != 0) {
                let s;
                if (Math.abs(this.charge) == 1)
                    s = "";
                else
                    s = Math.abs(this.charge).toString();
                if (this.charge > 0)
                    s += "+";
                else
                    s += MINUS;
                node.append(createElem("sup", s));
            }
        }
        return node;
    }
}


class Group {
    constructor(items, count) {
        if (count < 1)
            throw new RangeError("Assertion error: Count must be a positive integer");
        this.items = items.slice();
        this.count = count;
    }
    getElements(resultSet) {
        for (const item of this.items)
            item.getElements(resultSet);
    }
    countElement(name) {
        let sum = 0;
        for (const item of this.items)
            sum = checkedAdd(sum, checkedMultiply(item.countElement(name), this.count));
        return sum;
    }

    toHtml() {
        let node = createSpan("group", "(");
        for (const item of this.items)
            node.append(item.toHtml());
        node.append(")");
        if (this.count != 1)
            node.append(createElem("sub", this.count.toString()));
        return node;
    }
}


class ChemElem {
    constructor(name, count) {
        this.name = name;
        this.count = count;
        if (count < 1)
            throw new RangeError("Assertion error: Count must be a positive integer");
    }
    getElements(resultSet) {
        resultSet.add(this.name);
    }
    countElement(n) {
        return n == this.name ? this.count : 0;
    }

    toHtml() {
        let node = createSpan("element", this.name);
        if (this.count != 1)
            node.append(createElem("sub", this.count.toString()));
        return node;
    }
}


class Matrix {
    constructor(numRows, numCols) {
        this.numRows = numRows;
        this.numCols = numCols;
        if (numRows < 0 || numCols < 0)
            throw new RangeError("Illegal argument");

        let row = [];
        for (let j = 0; j < numCols; j++)
            row.push(0);
        this.cells = [];
        for (let i = 0; i < numRows; i++)
            this.cells.push(row.slice());
    }


    get(r, c) {
        if (r < 0 || r >= this.numRows || c < 0 || c >= this.numCols)
            throw new RangeError("Index out of bounds");
        return this.cells[r][c];
    }

    set(r, c, val) {
        if (r < 0 || r >= this.numRows || c < 0 || c >= this.numCols)
            throw new RangeError("Index out of bounds");
        this.cells[r][c] = val;
    }


    swapRows(i, j) {
        if (i < 0 || i >= this.numRows || j < 0 || j >= this.numRows)
            throw new RangeError("Index out of bounds");
        const temp = this.cells[i];
        this.cells[i] = this.cells[j];
        this.cells[j] = temp;
    }


    static addRows(x, y) {
        let z = [];
        for (let i = 0; i < x.length; i++)
            z.push(checkedAdd(x[i], y[i]));
        return z;
    }


    static multiplyRow(x, c) {
        return x.map(val => checkedMultiply(val, c));
    }


    static gcdRow(x) {
        let result = 0;
        for (const val of x)
            result = gcd(val, result);
        return result;
    }


    static simplifyRow(x) {
        let sign = 0;
        for (const val of x) {
            if (val != 0) {
                sign = Math.sign(val);
                break;
            }
        }
        if (sign == 0)
            return x.slice();
        const g = Matrix.gcdRow(x) * sign;
        return x.map(val => val / g);
    }

    gaussJordanEliminate() {

        let cells = this.cells = this.cells.map(Matrix.simplifyRow);

        let numPivots = 0;
        for (let i = 0; i < this.numCols; i++) {

            let pivotRow = numPivots;
            while (pivotRow < this.numRows && cells[pivotRow][i] == 0)
                pivotRow++;
            if (pivotRow == this.numRows)
                continue;
            const pivot = cells[pivotRow][i];
            this.swapRows(numPivots, pivotRow);
            numPivots++;

            for (let j = numPivots; j < this.numRows; j++) {
                const g = gcd(pivot, cells[j][i]);
                cells[j] = Matrix.simplifyRow(Matrix.addRows(Matrix.multiplyRow(cells[j], pivot / g), Matrix.multiplyRow(cells[i], -cells[j][i] / g)));
            }
        }

        for (let i = this.numRows - 1; i >= 0; i--) {

            let pivotCol = 0;
            while (pivotCol < this.numCols && cells[i][pivotCol] == 0)
                pivotCol++;
            if (pivotCol == this.numCols)
                continue;
            const pivot = cells[i][pivotCol];

            for (let j = i - 1; j >= 0; j--) {
                const g = gcd(pivot, cells[j][pivotCol]);
                cells[j] = Matrix.simplifyRow(Matrix.addRows(Matrix.multiplyRow(cells[j], pivot / g), Matrix.multiplyRow(cells[i], -cells[j][pivotCol] / g)));
            }
        }
    }
}

function buildMatrix(eqn) {
    let elems = eqn.getElements();
    let lhs = eqn.leftSide;
    let rhs = eqn.rightSide;
    let matrix = new Matrix(elems.length + 1, lhs.length + rhs.length + 1);
    elems.forEach((elem, i) => {
        let j = 0;
        for (const term of lhs) {
            matrix.set(i, j, term.countElement(elem));
            j++;
        }
        for (const term of rhs) {
            matrix.set(i, j, -term.countElement(elem));
            j++;
        }
    });
    return matrix;
}
function solve(matrix) {
    matrix.gaussJordanEliminate();
    function countNonzeroCoeffs(row) {
        let count = 0;
        for (let i = 0; i < matrix.numCols; i++) {
            if (matrix.get(row, i) != 0)
                count++;
        }
        return count;
    }

    let i;
    for (i = 0; i < matrix.numRows - 1; i++) {
        if (countNonzeroCoeffs(i) > 1)
            break;
    }
    if (i == matrix.numRows - 1)
        throw new RangeError("All-zero solution");

    matrix.set(matrix.numRows - 1, i, 1);
    matrix.set(matrix.numRows - 1, matrix.numCols - 1, 1);
    matrix.gaussJordanEliminate();
}
function extractCoefficients(matrix) {
    const rows = matrix.numRows;
    const cols = matrix.numCols;
    if (cols - 1 > rows || matrix.get(cols - 2, cols - 2) == 0)
        throw new RangeError("Multiple independent solutions");
    let lcm = 1;
    for (let i = 0; i < cols - 1; i++)
        lcm = checkedMultiply(lcm / gcd(lcm, matrix.get(i, i)), matrix.get(i, i));
    let coefs = [];
    for (let i = 0; i < cols - 1; i++)
        coefs.push(checkedMultiply(lcm / matrix.get(i, i), matrix.get(i, cols - 1)));
    if (coefs.every(x => x == 0))
        throw new RangeError("Assertion error: All-zero solution");
    return coefs;
}

function checkAnswer(eqn, coefs) {
    if (coefs.length != eqn.leftSide.length + eqn.rightSide.length)
        throw new Error("Assertion error: Mismatched length");
    function isZero(x) {
        if (typeof x != "number" || isNaN(x) || Math.floor(x) != x)
            throw new Error("Assertion error: Not an integer");
        return x == 0;
    }
    if (coefs.every(isZero))
        throw new Error("Assertion error: All-zero solution");
    for (const elem of eqn.getElements()) {
        let sum = 0;
        let j = 0;
        for (const term of eqn.leftSide) {
            sum = checkedAdd(sum, checkedMultiply(term.countElement(elem), coefs[j]));
            j++;
        }
        for (const term of eqn.rightSide) {
            sum = checkedAdd(sum, checkedMultiply(term.countElement(elem), -coefs[j]));
            j++;
        }
        if (sum != 0)
            throw new Error("Assertion error: Incorrect balance");
    }
}

const INT_MAX = 9007199254740992;

function checkedParseInt(str) {
    const result = parseInt(str, 10);
    if (isNaN(result))
        throw new RangeError("Not a number");
    return checkOverflow(result);
}

function checkedAdd(x, y) {
    return checkOverflow(x + y);
}

function checkedMultiply(x, y) {
    return checkOverflow(x * y);
}

function checkOverflow(x) {
    if (Math.abs(x) >= INT_MAX)
        throw new RangeError("Arithmetic overflow");
    return x;
}

function gcd(x, y) {
    if (typeof x != "number" || typeof y != "number" || isNaN(x) || isNaN(y))
        throw new Error("Invalid argument");
    x = Math.abs(x);
    y = Math.abs(y);
    while (y != 0) {
        const z = x % y;
        x = y;
        y = z;
    }
    return x;
}


const MINUS = "\u2212";

function createElem(tagName, text) {
    let result = document.createElement(tagName);
    if (text !== undefined)
        result.textContent = text;
    return result;
}

function createSpan(cls, text) {
    let result = createElem("span", text);
    result.className = cls;
    return result;
}