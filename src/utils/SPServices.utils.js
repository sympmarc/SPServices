// Wrap an XML node (n) around a value (v)
function wrapNode(n, v) {
    var thisValue = typeof v !== "undefined" ? v : "";
    return "<" + n + ">" + thisValue + "</" + n + ">";
}

// Generate a random number for sorting arrays randomly
function randOrd() {
    return (Math.round(Math.random()) - 0.5);
}

// If a string is a URL, format it as a link, else return the string as-is
function checkLink(s) {
    return ((s.indexOf("http") === 0) || (s.indexOf(SLASH) === 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
}

// Get the filename from the full URL
function fileName(s) {
    return s.substring(s.lastIndexOf(SLASH) + 1, s.length);
}

/* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
var xml_special_to_escaped_one_map = {
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
};

// Paul T., 2015.05.01: Commented out since its not currently used.
// var escaped_one_to_xml_special_map = {
// '&amp;': '&',
// '&quot;': '"',
// '&lt;': '<',
// '&gt;': '>'
// };

function encodeXml(string) {
    return string.replace(/([\&"<>])/g, function (str, item) {
        return xml_special_to_escaped_one_map[item];
    });
}

// Paul T., 2015-05-02: Commented out since its not currently used.
// function decodeXml(string) {
// return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
// function (str, item) {
// return escaped_one_to_xml_special_map[item];
// });
// }

/* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */

// Escape column values
function escapeColumnValue(s) {
    if (typeof s === "string") {
        return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
    } else {
        return s;
    }
}

// Escape Url
function escapeUrl(u) {
    return u.replace(/&/g, '%26');
}

// Split values like 1;#value into id and value
function SplitIndex(s) {
    var spl = s.split(spDelim);
    this.id = spl[0];
    this.value = spl[1];
}

function pad(n) {
    return n < 10 ? "0" + n : n;
}

// James Padolsey's Regex Selector for jQuery http://james.padolsey.com/javascript/regex-selector-for-jquery/
/*    $.expr[':'].regex = function (elem, index, match) {
 var matchParams = match[3].split(','),
 validLabels = /^(data|css):/,
 attr = {
 method: matchParams[0].match(validLabels) ?
 matchParams[0].split(':')[0] : 'attr',
 property: matchParams.shift().replace(validLabels, '')
 },
 regexFlags = 'ig',
 regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
 return regex.test($(elem)[attr.method](attr.property));
 };
 */
