function peg$subclass(child, parent) {
    function C() { this.constructor = child; }
    C.prototype = parent.prototype;
    child.prototype = new C();
}
function peg$SyntaxError(message, expected, found, location) {
    var self = Error.call(this, message);
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(self, peg$SyntaxError.prototype);
    }
    self.expected = expected;
    self.found = found;
    self.location = location;
    self.name = "SyntaxError";
    return self;
}
peg$subclass(peg$SyntaxError, Error);
function peg$padEnd(str, targetLength, padString) {
    padString = padString || " ";
    if (str.length > targetLength) {
        return str;
    }
    targetLength -= str.length;
    padString += padString.repeat(targetLength);
    return str + padString.slice(0, targetLength);
}
peg$SyntaxError.prototype.format = function (sources) {
    var str = "Error: " + this.message;
    if (this.location) {
        var src = null;
        var k;
        for (k = 0; k < sources.length; k++) {
            if (sources[k].source === this.location.source) {
                src = sources[k].text.split(/\r\n|\n|\r/g);
                break;
            }
        }
        var s = this.location.start;
        var offset_s = (this.location.source && (typeof this.location.source.offset === "function"))
            ? this.location.source.offset(s)
            : s;
        var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
        if (src) {
            var e = this.location.end;
            var filler = peg$padEnd("", offset_s.line.toString().length, ' ');
            var line = src[s.line - 1];
            var last = s.line === e.line ? e.column : line.length + 1;
            var hatLen = (last - s.column) || 1;
            str += "\n --> " + loc + "\n"
                + filler + " |\n"
                + offset_s.line + " | " + line + "\n"
                + filler + " | " + peg$padEnd("", s.column - 1, ' ')
                + peg$padEnd("", hatLen, "^");
        }
        else {
            str += "\n at " + loc;
        }
    }
    return str;
};
peg$SyntaxError.buildMessage = function (expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
        literal: function (expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
        },
        class: function (expectation) {
            var escapedParts = expectation.parts.map(function (part) {
                return Array.isArray(part)
                    ? classEscape(part[0]) + "-" + classEscape(part[1])
                    : classEscape(part);
            });
            return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
        },
        any: function () {
            return "any character";
        },
        end: function () {
            return "end of input";
        },
        other: function (expectation) {
            return expectation.description;
        }
    };
    function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
    }
    function literalEscape(s) {
        return s
            .replace(/\\/g, "\\\\")
            .replace(/"/g, "\\\"")
            .replace(/\0/g, "\\0")
            .replace(/\t/g, "\\t")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/[\x00-\x0F]/g, function (ch) { return "\\x0" + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return "\\x" + hex(ch); });
    }
    function classEscape(s) {
        return s
            .replace(/\\/g, "\\\\")
            .replace(/\]/g, "\\]")
            .replace(/\^/g, "\\^")
            .replace(/-/g, "\\-")
            .replace(/\0/g, "\\0")
            .replace(/\t/g, "\\t")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/[\x00-\x0F]/g, function (ch) { return "\\x0" + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return "\\x" + hex(ch); });
    }
    function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }
    function describeExpected(expected) {
        var descriptions = expected.map(describeExpectation);
        var i, j;
        descriptions.sort();
        if (descriptions.length > 0) {
            for (i = 1, j = 1; i < descriptions.length; i++) {
                if (descriptions[i - 1] !== descriptions[i]) {
                    descriptions[j] = descriptions[i];
                    j++;
                }
            }
            descriptions.length = j;
        }
        switch (descriptions.length) {
            case 1:
                return descriptions[0];
            case 2:
                return descriptions[0] + " or " + descriptions[1];
            default:
                return descriptions.slice(0, -1).join(", ")
                    + ", or "
                    + descriptions[descriptions.length - 1];
        }
    }
    function describeFound(found) {
        return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }
    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
    options = options !== undefined ? options : {};
    var peg$FAILED = {};
    var peg$source = options.grammarSource;
    var peg$startRuleFunctions = { properties: peg$parseproperties };
    var peg$startRuleFunction = peg$parseproperties;
    var peg$c0 = "=";
    var peg$c1 = "\"";
    var peg$c2 = "\\\"";
    var peg$c3 = " ";
    var peg$c4 = "\t";
    var peg$c5 = "\n";
    var peg$c6 = "\r";
    var peg$c7 = "true";
    var peg$c8 = "false";
    var peg$c9 = ".";
    var peg$r0 = /^[0-9]/;
    var peg$r1 = /^[ \t\n\r]/;
    var peg$e0 = peg$otherExpectation("name value pair");
    var peg$e1 = peg$literalExpectation("=", false);
    var peg$e2 = peg$otherExpectation("valid value");
    var peg$e3 = peg$otherExpectation("a quoted or unquoted string");
    var peg$e4 = peg$otherExpectation("double quoted string");
    var peg$e5 = peg$literalExpectation("\"", false);
    var peg$e6 = peg$literalExpectation("\\\"", false);
    var peg$e7 = peg$anyExpectation();
    var peg$e8 = peg$literalExpectation(" ", false);
    var peg$e9 = peg$literalExpectation("\t", false);
    var peg$e10 = peg$literalExpectation("\n", false);
    var peg$e11 = peg$literalExpectation("\r", false);
    var peg$e12 = peg$otherExpectation("boolean");
    var peg$e13 = peg$literalExpectation("true", false);
    var peg$e14 = peg$literalExpectation("false", false);
    var peg$e15 = peg$otherExpectation("integer");
    var peg$e16 = peg$classExpectation([["0", "9"]], false, false);
    var peg$e17 = peg$otherExpectation("number");
    var peg$e18 = peg$literalExpectation(".", false);
    var peg$e19 = peg$otherExpectation("whitespace");
    var peg$e20 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false);
    var peg$f0 = function (name, value) { return { name, value }; };
    var peg$f1 = function (s) { return s.join(""); };
    var peg$f2 = function (c) { return c; };
    var peg$f3 = function (s) { return text(); };
    var peg$f4 = function (c) { return c; };
    var peg$f5 = function (bool) { return (bool === "true"); };
    var peg$f6 = function () { return parseInt(text(), 10); };
    var peg$f7 = function () { return parseFloat(text()); };
    var peg$currPos = 0;
    var peg$savedPos = 0;
    var peg$posDetailsCache = [{ line: 1, column: 1 }];
    var peg$maxFailPos = 0;
    var peg$maxFailExpected = [];
    var peg$silentFails = 0;
    var peg$result;
    if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }
        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }
    function text() {
        return input.substring(peg$savedPos, peg$currPos);
    }
    function offset() {
        return peg$savedPos;
    }
    function range() {
        return {
            source: peg$source,
            start: peg$savedPos,
            end: peg$currPos
        };
    }
    function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
    }
    function expected(description, location) {
        location = location !== undefined
            ? location
            : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
    }
    function error(message, location) {
        location = location !== undefined
            ? location
            : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildSimpleError(message, location);
    }
    function peg$literalExpectation(text, ignoreCase) {
        return { type: "literal", text: text, ignoreCase: ignoreCase };
    }
    function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }
    function peg$anyExpectation() {
        return { type: "any" };
    }
    function peg$endExpectation() {
        return { type: "end" };
    }
    function peg$otherExpectation(description) {
        return { type: "other", description: description };
    }
    function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos];
        var p;
        if (details) {
            return details;
        }
        else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
                p--;
            }
            details = peg$posDetailsCache[p];
            details = {
                line: details.line,
                column: details.column
            };
            while (p < pos) {
                if (input.charCodeAt(p) === 10) {
                    details.line++;
                    details.column = 1;
                }
                else {
                    details.column++;
                }
                p++;
            }
            peg$posDetailsCache[pos] = details;
            return details;
        }
    }
    function peg$computeLocation(startPos, endPos, offset) {
        var startPosDetails = peg$computePosDetails(startPos);
        var endPosDetails = peg$computePosDetails(endPos);
        var res = {
            source: peg$source,
            start: {
                offset: startPos,
                line: startPosDetails.line,
                column: startPosDetails.column
            },
            end: {
                offset: endPos,
                line: endPosDetails.line,
                column: endPosDetails.column
            }
        };
        if (offset && peg$source && (typeof peg$source.offset === "function")) {
            res.start = peg$source.offset(res.start);
            res.end = peg$source.offset(res.end);
        }
        return res;
    }
    function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
            return;
        }
        if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected);
    }
    function peg$buildSimpleError(message, location) {
        return new peg$SyntaxError(message, null, null, location);
    }
    function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
    }
    function peg$parseproperties() {
        var s0, s1;
        s0 = [];
        s1 = peg$parsenamevaluepair();
        if (s1 !== peg$FAILED) {
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$parsenamevaluepair();
            }
        }
        else {
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parsenamevaluepair() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_();
        s2 = peg$parseunquotedstring();
        if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 61) {
                s4 = peg$c0;
                peg$currPos++;
            }
            else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e1);
                }
            }
            if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                s6 = peg$parseval();
                if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();
                    peg$savedPos = s0;
                    s0 = peg$f0(s2, s6);
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e0);
            }
        }
        return s0;
    }
    function peg$parseval() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$parsenumber();
        if (s0 === peg$FAILED) {
            s0 = peg$parseboolean();
            if (s0 === peg$FAILED) {
                s0 = peg$parsestring();
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e2);
            }
        }
        return s0;
    }
    function peg$parsestring() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$parsequotedstring();
        if (s0 === peg$FAILED) {
            s0 = peg$parseunquotedstring();
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e3);
            }
        }
        return s0;
    }
    function peg$parsequotedstring() {
        var s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c1;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e5);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parsequotedstringcontent();
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 34) {
                    s3 = peg$c1;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e5);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f1(s2);
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e4);
            }
        }
        return s0;
    }
    function peg$parsequotedstringcontent() {
        var s0, s1, s2, s3;
        s0 = [];
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c1;
            peg$currPos++;
        }
        else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e5);
            }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
            s2 = undefined;
        }
        else {
            peg$currPos = s2;
            s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c2) {
                s3 = peg$c2;
                peg$currPos += 2;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e6);
                }
            }
            if (s3 === peg$FAILED) {
                if (input.length > peg$currPos) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e7);
                    }
                }
            }
            if (s3 !== peg$FAILED) {
                peg$savedPos = s1;
                s1 = peg$f2(s3);
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$currPos;
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 34) {
                    s3 = peg$c1;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e5);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = undefined;
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c2) {
                        s3 = peg$c2;
                        peg$currPos += 2;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e6);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.length > peg$currPos) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$e7);
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s1;
                        s1 = peg$f2(s3);
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
        }
        else {
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseunquotedstring() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parseunquotedstringcontent();
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f3(s1);
        }
        s0 = s1;
        return s0;
    }
    function peg$parseunquotedstringcontent() {
        var s0, s1, s2, s3;
        s0 = [];
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 32) {
            s3 = peg$c3;
            peg$currPos++;
        }
        else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e8);
            }
        }
        if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
                s3 = peg$c0;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e1);
                }
            }
            if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 9) {
                    s3 = peg$c4;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e9);
                    }
                }
                if (s3 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 10) {
                        s3 = peg$c5;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e10);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 13) {
                            s3 = peg$c6;
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$e11);
                            }
                        }
                    }
                }
            }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
            s2 = undefined;
        }
        else {
            peg$currPos = s2;
            s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
            if (input.length > peg$currPos) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e7);
                }
            }
            if (s3 !== peg$FAILED) {
                peg$savedPos = s1;
                s1 = peg$f4(s3);
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$currPos;
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 32) {
                    s3 = peg$c3;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e8);
                    }
                }
                if (s3 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 61) {
                        s3 = peg$c0;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e1);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 9) {
                            s3 = peg$c4;
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$e9);
                            }
                        }
                        if (s3 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 10) {
                                s3 = peg$c5;
                                peg$currPos++;
                            }
                            else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$e10);
                                }
                            }
                            if (s3 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 13) {
                                    s3 = peg$c6;
                                    peg$currPos++;
                                }
                                else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$e11);
                                    }
                                }
                            }
                        }
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = undefined;
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    if (input.length > peg$currPos) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$e7);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s1;
                        s1 = peg$f4(s3);
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
        }
        else {
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseboolean() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 4) === peg$c7) {
            s1 = peg$c7;
            peg$currPos += 4;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e13);
            }
        }
        if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c8) {
                s1 = peg$c8;
                peg$currPos += 5;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e14);
                }
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f5(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e12);
            }
        }
        return s0;
    }
    function peg$parseinteger() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        if (peg$r0.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e16);
            }
        }
        if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$r0.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$e16);
                    }
                }
            }
        }
        else {
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f6();
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e15);
            }
        }
        return s0;
    }
    function peg$parsenumber() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseinteger();
        if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
                s3 = peg$c9;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e18);
                }
            }
            if (s3 !== peg$FAILED) {
                s4 = peg$parseinteger();
                if (s4 !== peg$FAILED) {
                    s3 = [s3, s4];
                    s2 = s3;
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 === peg$FAILED) {
                s2 = null;
            }
            peg$savedPos = s0;
            s0 = peg$f7();
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e17);
            }
        }
        return s0;
    }
    function peg$parse_() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];
        if (peg$r1.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$e20);
            }
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$r1.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$e20);
                }
            }
        }
        peg$silentFails--;
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
            peg$fail(peg$e19);
        }
        return s0;
    }
    peg$result = peg$startRuleFunction();
    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
    }
    else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
            ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
            : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
}
export { peg$SyntaxError as SyntaxError, peg$parse as parse };
