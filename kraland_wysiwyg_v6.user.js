// ==UserScript==
// @name           Kraland Wysiwyg V6
// @namespace      ki
// @description    Ajoute une zone de prévisualisation dynamique à l'éditeur de kramail, au forum et aux déclarations in game et reformate un texte quoté.
// @version   1.0.14
// @include        http://www.kraland.org/*
// @grant       none
// ==/UserScript==

/*jslint passfail: false, plusplus: true, vars: true, browser: true, sloppy: true, regexp: true*/

/*
***********************************************************************************************
                 Les options du scripts se règlent à la suite de cette ligne : */

var OPTION_FREQUENCE_PREVISUALISATION = 1;
// L'option fréquence permet de changer la fréquence selon laquelle la zone de prévisualisation est mise-à-jour.
//  1 indique qu'elle sera mise à jour à chaque caractère modifié.
//  0 indique que la zone sera mise-à-jour lors d'un déplacement de la souris.
//  Préférez 0 si vous rencontrez des problèmes de lenteurs.

var OPTION_REFORMATER_TEXTE = 1;
// L'option reformatage permet de reformater les textes des réponses dans les kramails ou les messages du forum
// 1 reformate le message
// 0 désactive cette option

/* Fin des options
 *********************************************************************************************** */

/*
1.0.14
No more rewriting functions into html. What was that for, anyway ? It was even harder to add breakpoints.
Function add2Tag with 1 or 0 as parameter was confusing and is split in two distinct functions for normal tags and smiley tags.
Removing "smiley" option. Smileys are always shown.
Improving global js following the specifications of jslint and jshint.
Improving displaySmileysArea with loops.
Using consts instead of magic numbers.

1.0.13:
Adding fleft and fright tags.

1.0.12:
Fixed spoiler tag description.

1.0.11:
Dummy maj for update.

1.0.10:
Removing unused bbcode.
Adding kraland bbcode.
Adding BBCode Parser library.
Custom process function from library ( tagged with @since and @removed ).
*/


var b_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHT4ACgoOEhYQEAACIiomLjgACiZKTlJICi5WZkJqcl5MDoKGVkZKiAKaWmKiZpImro6qgp6+tswOuspOeuLe2lLWmtJi2ob2WnJq7yLrLlYEAOw==";
var i_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHXIACgoOEhYQEAACIiomLjgACiZKTlJICi5WZkJUYA54DGJSXlTEDMKGinDADMZmjk6WnrpQYq62umABAA0SolZGSGDsDO5qQmJ09vr+JnZ+gmq/GqdO/udWb2JOBADs=";
var u_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHVYACgoOEhYQEAACIiomLjgACiZKTlJICi5IDmpqVkZOciaCWmACilZCVmisrp5eVK5udp4mwA5SumbahupaUoqaQpKWbvL2zs7i7xMWox63Czs3Rk4EAOw==";
var s_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHXoACgoOEhYQEAACIiomLjgACiZKTlJICi5WZkJMYA54DGJmXiZ01iTqglZGkA6aaiaOsQkGhogCdn7metbCYkhg9qZSrtwNFp8KTsaXIvJacuc6Wvq/P1arU18TXkoEAOw==";
var left_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHR4ACgoOEhYQEAACIiomLjgACiZKTlJICiAOZmpubkJWfk5cAnJyUkaCgoqSrA56on6qsraGvsJiynae1obesprumi8CuwwCBADs=";
var center_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHSYACgoOEhYQEAACIiomLjgACiZKTlJICBAOZmpubiZGVoJaLnJyTn6Ggl6SrA56ooZeJrJmmr6mYs52QtpWxALm1vKaLwrvFiYEAOw==";
var right_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHSYACgoOEhYQEAACIiomLjgACiZKTlJICBAOZmpubiZGVoJaLiZycnqGol6WrA6eooJeTrJmur5Sqs52QtpWxkrm1vJ6jwp/CiYEAOw==";
var quote_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHaYACgoOEhYQEA4mKi4wWAgADhpIDFwKIhJGDigKUj5kCF6GTlZcCPIongpsDKZ6qqSCfmg2WkauJnLiUAJCShp29jMKcLa6+mMWXwoyclb3HmqS2y6vOssediNTCxQAEKeCh4g2h4C0tgQA7";
var img_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHjoACgoOEhYQEAACIiomLjgACAAOTlJWWkAQDFZucmxYAOQAWA5CSnZ0sJgM/kpiap5smLCwDo6WvsAMsRjQAvQKZsJupJj+2kbinoKKtyJ6jr5+bOaTOFRYmFxc0FQMmm82ZnwPa5AMgIAMCx63Z2u/n6QAmt+QX9vjok7fv9+Xl+lxZGkipVKKDCBMmCgQAOw==";
var url_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHYYACgoOEhYQEAACIiomLjgACiZKTlJICi5WZkJqcl5yZkQADo6OJpKWJlwMbAqwbo62xA6mrAqe3tbO2tiurG7+/A72vkLm4pKy6BLWusK62iJHLp6bUqZ+g2JWe2pbdk4EAOw==";
var mail_str = "data:image/gif;base64,R0lGODlhEgARAMZHAP/6zJmZmf//+wAAAP//0gAAe3t7AFV3vCGcWlpaWtUAAPd0AF5DLXt7ewB7e3sAAO1hYfSsAHsAewBvACsr5Pn7gf/r64R7hO7MmfX7+Sgzls7OzmOcpYm44ns/Ozyc5r29vYTW3jdU0sa9vUIAAAALTAgAAL29xtb//4R7e87//5SUlISEQnuEe///AJQAAFJKUpx7e7UYIcnS6gAIAFJCQmNKSv/exicpTe/vkHNaWm9gYMa9xjk5OaUICIyEQq2EhJB7ezExMa0xMUJCQlJCSmRlSP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAEgARAAAHoIACgoOEhYQAiIkfHYwEiYkCjwCMHR8aHZIAkQAaACIfM4sdA5kCHh4aGh+WIqgeraekAhqzIiIaBLm6NxkZsh4ZGp8aFrq5Qz6+msAlzSUDAsY+HgS/vde9xjc31Zq00cbY17+CxgQZOMIaJd2mGea6GjMdOMru8LmXHbi/A/7+z0qo2vdMFgBHiHB0mHFpFYASkCSlstVBRKlMqxxmCgQAOw==";

var SMILEYS = [':)', ';)', '8)', ':]', ':D', ':p', ':6', '3)', ':,', ':(', ':[', ')[', '!(', '^]', 'x(', '8(', 'o)', '%(', ':o', ':|', ')|', ';(', ';[', ':f', ';o', ';|', '[(', '0)', ':B', ':=', '8]', '|)', 'O)', '8î', '8Î', 'j)', 'p)', '^)', ')f', ':î', ':Î', '%)', '8O', 'OX', ')%', 'oX', ':.', 'o(', 'hp', ':n', ':P', ':x', '8p', 'j|', 'kD', 'k]', ';p', ':l', ':+', ':-', 'VV', '%%', 'Q)', 'fr', 'en', 'de', 'es', 'it', 'nl', 'ca', 'sw', 'jp', '*t', '*j', '*o', '*r', '*v', '*c', '*b', '*m', '*n', '=o', '=n', '=S', 'ty', 'mt', 'so', 'iz', 'jo', 'tk', 'pk', 'ka', 'ke', '3i', '+)', 'st', '§c', '§o', '§g', 'co', '§p', '=)', '=!', '=k', '=y', '§x', '§b', '§3', '§;', '§+', '§-', '§|', '§V', '§î', '§h', '§w', '§k', '§v', '§d', '§i', '§C', '§l', '§y', '§m', '§D', '§r'];

var SMILEYS_REGEXP = [':[)]', ';[)]', '8[)]', ':]', ':D', ':p', ':6', '3[)]', ':,', ':[(]', ':[[]', '[)][[]', '![(]', '[ù^]]', 'x[(]', '8[(]', 'o[)]', '%[(]', ':o', ':[|]', '[)][|]', ';[(]', ';[[]', ':f', ';o', ';[|]', '[[][(]', '0[)]', ':B', ':=', '8]', '[|][)]', 'O[)]', '8î', '8Î', 'j[)]', 'p[)]', '[ù^][)]', '[)]f', ':î', ':Î', '[%][)]', '8O', 'OX', '[)]%', 'oX', ':[.]', 'o[(]', 'hp', ':n', ':P', ':x', '8p', 'j[|]', 'kD', 'k]', ';p', ':l', ':[+]', ':-', 'VV', '%%', 'Q[)]', 'fr', 'en', 'de', 'es', 'it', 'nl', 'ca', 'sw', 'jp', '[*]t', '[*]j', '[*]o', '[*]r', '[*]v', '[*]c', '[*]b', '[*]m', '[*]n', '=o', '=n', '=S', 'ty', 'mt', 'so', 'iz', 'jo', 'tk', 'pk', 'ka', 'ke', '3i', '[+][)]', 'st', '[§]c', '[§]o', '[§]g', 'co', '[§]p', '=[)]', '=!', '=k', '=y', '[§]x', '[§]b', '[§]3', '[§];', '[§][+]', '[§]-', '[§][|]', '[§]V', '[§]î', '[§]h', '[§]w', '[§]k', '[§]v', '[§]d', '[§]i', '[§]C', '[§]l', '[§]y', '[§]m', '[§]D', '[§]r'];

// Colors defined by Kraland @since 1.0.10

var COLOR_TAG_MAP = {
	yellow: '#f4ac00',
	orange: '#f77400',
	fuchsia: '#ed6161',
	red: '#d50000',
	brown: '#5e432d',
	blue: '#2b2be4',
	lightgreen: '#219c5a',
	lightblue: '#5577bc',
	green: '#006f00',
	darkgray: '#5a5a5a',
	maroon: 'maroon',
	purple: 'purple',
	navy: 'navy',
	teal: 'teal',
	olive: 'olive',
	gray: 'gray',
	aqua: 'aqua'
};

var SPAN_TAG_MAP = {
	b: 'font-weight: bold;',
	center: 'margin-left:auto; margin-right:auto; display: block; text-align: center;',
	i: 'font-style: italic;',
	left: 'display: block; text-align: left;',
	right: 'display: block; text-align: right;',
	strike: 'text-decoration: line-through;',
	u: 'text-decoration: underline;'
};

var SMILEY_TAB_COUNT = 6;

function decIntegerToHexString(intValue) {
	var str = (intValue).toString(16);
	str = str.toUpperCase();
	if (intValue < 16) {
		str = '0' + str;
	}
	return str;
}

function replaceAllSmileys(text) {
	var i;
	var regexp;
	var smileyHex = "";
	var smileyHtml = "";

	for (i = 0; i < SMILEYS_REGEXP.length; i++) {
		smileyHex = decIntegerToHexString(i + 1);
		regexp = new RegExp('\\[(' + SMILEYS_REGEXP[i] + ')]', 'g');
		smileyHtml = '<img src="http://img.kraland.org/s/' + smileyHex + '.gif">';
		text = text.replace(regexp, smileyHtml);
	}

	return text;
}


/*************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 *************************************************************************/

/*
Copyright (C) 2011 Patrick Gillespie, http://patorjk.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
    Extendible BBCode Parser v1.0.0
    By Patrick Gillespie (patorjk@gmail.com)
    Website: http://patorjk.com/

    This module allows you to parse BBCode and to extend to the mark-up language
    to add in your own tags.
*/

var XBBCODE = (function () {

	// -----------------------------------------------------------------------------
	// Set up private variables
	// -----------------------------------------------------------------------------

	var me = {},
		urlPattern = /^(?:https?|file|c):(?:\/{1,3}|\\{1})[\-a-zA-Z0-9:;@#%&()~_?\+=\/\\\.]*$/,
		colorNamePattern = /^(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/,
		colorCodePattern = /^#?[a-fA-F0-9]{6}$/,
		emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/,
		fontFacePattern = /^([a-z][a-z0-9_]+|"[a-z][a-z0-9_\s]+")$/i,
		tags,
		tagList,
		tagsNoParseList = [],
		bbRegExp,
		pbbRegExp,
		pbbRegExp2,
		openTags,
		closeTags;

	/* -----------------------------------------------------------------------------
	 * tags
	 * This object contains a list of tags that your code will be able to understand.
	 * Each tag object has the following properties:
	 *
	 *   openTag - A function that takes in the tag's parameters (if any) and its
	 *             contents, and returns what its HTML open tag should be.
	 *             Example: [color=red]test[/color] would take in "=red" as a
	 *             parameter input, and "test" as a content input.
	 *             It should be noted that any BBCode inside of "content" will have
	 *             been processed by the time it enter the openTag function.
	 *
	 *   closeTag - A function that takes in the tag's parameters (if any) and its
	 *              contents, and returns what its HTML close tag should be.
	 *
	 *   displayContent - Defaults to true. If false, the content for the tag will
	 *                    not be displayed. This is useful for tags like IMG where
	 *                    its contents are actually a parameter input.
	 *
	 *   restrictChildrenTo - A list of BBCode tags which are allowed to be nested
	 *                        within this BBCode tag. If this property is omitted,
	 *                        any BBCode tag may be nested within the tag.
	 *
	 *   restrictParentsTo - A list of BBCode tags which are allowed to be parents of
	 *                       this BBCode tag. If this property is omitted, any BBCode
	 *                       tag may be a parent of the tag.
	 *
	 *   noParse - true or false. If true, none of the content WITHIN this tag will be
	 *             parsed by the XBBCode parser.
	 *
	 *
	 *
	 * LIMITIONS on adding NEW TAGS:
	 *  - Tag names should be alphanumeric (including underscores) and all tags should have an opening tag
	 *    and a closing tag.
	 *    The [*] tag is an exception because it was already a standard
	 *    bbcode tag. Technecially tags don't *have* to be alphanumeric, but since
	 *    regular expressions are used to parse the text, if you use a non-alphanumeric
	 *    tag names, just make sure the tag name gets escaped properly (if needed).
	 * --------------------------------------------------------------------------- */

	tags = {
		/*
		    This tag does nothing and is here mostly to be used as a classification for
		    the bbcode input when evaluating parent-child tag relationships
		*/
		"bbcode": {
			openTag: function (params, content) {
				return '';
			},
			closeTag: function (params, content) {
				return '';
			}
		},
		"fleft": {
			openTag: function (params, content) {
				return '<div class="limg">';
			},
			closeTag: function (params, content) {
				return '<div>';
			}
		},
		"fright": {
			openTag: function (params, content) {
				return '<div class="rimg">';
			},
			closeTag: function (params, content) {
				return '<div>';
			}
		},
		"img": {
			openTag: function (params, content) {

				var myUrl = content;

				urlPattern.lastIndex = 0;
				if (!urlPattern.test(myUrl)) {
					myUrl = "";
				}

				return '<img src="' + myUrl + '" />';
			},
			closeTag: function (params, content) {
				return '';
			},
			displayContent: false
		},
		"mail": {
			openTag: function (params, content) {

				var myEmail;

				if (!params) {
					myEmail = content.replace(/<.*?>/g, "");
				} else {
					myEmail = params.substr(1);
				}

				emailPattern.lastIndex = 0;
				if (!emailPattern.test(myEmail)) {
					return '<a>';
				}

				return '<a href="mailto:' + myEmail + '">';
			},
			closeTag: function (params, content) {
				return '</a>';
			}
		},
		"quote": {
			openTag: function (params, content) {
				return '<div class="quote">';
			},
			closeTag: function (params, content) {
				return '</div>';
			}
		},
		"spoiler": {
			openTag: function (params, content) {
				return '<div><div class="pre-spoiler"><span style="float:left; padding-top: 2px;">Spoiler</span><input type="button" value="Voir" class="see-spoiler" onclick="spoiler(this);"></div><div><div class="spoiler" style="display: none;">';
			},
			closeTag: function (params, content) {
				return '</div></div></div>';
			}
		},
		"url": {
			openTag: function (params, content) {

				var myUrl;

				if (!params) {
					myUrl = content.replace(/<.*?>/g, "");
				} else {
					myUrl = params.substr(1);
				}

				urlPattern.lastIndex = 0;
				if (!urlPattern.test(myUrl)) {
					myUrl = "#";
				}

				return '<a href="' + myUrl + '">';
			},
			closeTag: function (params, content) {
				return '</a>';
			}
		},
		/*
		    The * tag is special since the user does not define a closing * tag when writing their bbcode.
		    Instead this module parses the code and adds the closing * tag in for them. None of the tags you
		    add will act like this and this tag is an exception to the others.
		*/
		"*": {
			openTag: function (params, content) {
				return "<li>";
			},
			closeTag: function (params, content) {
				return "</li>";
			},
			restrictParentsTo: ["list", "ul", "ol"]
		}
	};

	function createSpanTag(param) {
		return {
			openTag: function (params, content) {
				return '<span style="' + param + '">';
			},
			closeTag: function (params, content) {
				return '</span>';
			}
		};
	}

	function createColorTag(param) {
		return createSpanTag('color:' + param);
	}

	var colorHTML;
	for (colorHTML in COLOR_TAG_MAP) {
		if (COLOR_TAG_MAP.hasOwnProperty(colorHTML)) {
			tags[colorHTML] = createColorTag(COLOR_TAG_MAP[colorHTML]);
		}
	}

	var spanHTML;
	for (spanHTML in SPAN_TAG_MAP) {
		if (SPAN_TAG_MAP.hasOwnProperty(spanHTML)) {
			tags[spanHTML] = createSpanTag(SPAN_TAG_MAP[spanHTML]);
		}
	}


	// create tag list and lookup fields
	function initTags() {
		tagList = [];
		var prop,
			ii,
			len;
		for (prop in tags) {
			if (tags.hasOwnProperty(prop)) {
				if (prop === "*") {
					tagList.push("\\" + prop);
				} else {
					tagList.push(prop);
					if (tags[prop].noParse) {
						tagsNoParseList.push(prop);
					}
				}

				tags[prop].validChildLookup = {};
				tags[prop].validParentLookup = {};
				tags[prop].restrictParentsTo = tags[prop].restrictParentsTo || [];
				tags[prop].restrictChildrenTo = tags[prop].restrictChildrenTo || [];

				len = tags[prop].restrictChildrenTo.length;
				for (ii = 0; ii < len; ii++) {
					tags[prop].validChildLookup[tags[prop].restrictChildrenTo[ii]] = true;
				}
				len = tags[prop].restrictParentsTo.length;
				for (ii = 0; ii < len; ii++) {
					tags[prop].validParentLookup[tags[prop].restrictParentsTo[ii]] = true;
				}
			}
		}

		bbRegExp = new RegExp("<bbcl=([0-9]+) (" + tagList.join("|") + ")([ =][^>]*?)?>((?:.|[\\r\\n])*?)<bbcl=\\1 /\\2>", "gi");
		pbbRegExp = new RegExp("\\[(" + tagList.join("|") + ")([ =][^\\]]*?)?\\]([^\\[]*?)\\[/\\1\\]", "gi");
		pbbRegExp2 = new RegExp("\\[(" + tagsNoParseList.join("|") + ")([ =][^\\]]*?)?\\]([\\s\\S]*?)\\[/\\1\\]", "gi");

		// create the regex for escaping ['s that aren't apart of tags
		(function () {
			var closeTagList = [];
			var ii = 0;
			for (ii = 0; ii < tagList.length; ii++) {
				if (tagList[ii] !== "\\*") { // the * tag doesn't have an offical closing tag
					closeTagList.push("/" + tagList[ii]);
				}
			}

			openTags = new RegExp("(\\[)((?:" + tagList.join("|") + ")(?:[ =][^\\]]*?)?)(\\])", "gi");
			closeTags = new RegExp("(\\[)(" + closeTagList.join("|") + ")(\\])", "gi");
		})();

	}
	initTags();

	// -----------------------------------------------------------------------------
	// private functions
	// -----------------------------------------------------------------------------

	function checkParentChildRestrictions(parentTag, bbcode, bbcodeLevel, tagName, tagParams, tagContents, errQueue) {

		errQueue = errQueue || [];
		bbcodeLevel++;

		// get a list of all of the child tags to this tag
		var reTagNames = new RegExp("(<bbcl=" + bbcodeLevel + " )(" + tagList.join("|") + ")([ =>])", "gi"),
			reTagNamesParts = new RegExp("(<bbcl=" + bbcodeLevel + " )(" + tagList.join("|") + ")([ =>])", "i"),
			matchingTags = tagContents.match(reTagNames) || [],
			cInfo,
			errStr,
			ii,
			childTag,
			pInfo = tags[parentTag] || {};

		reTagNames.lastIndex = 0;

		if (!matchingTags) {
			tagContents = "";
		}

		for (ii = 0; ii < matchingTags.length; ii++) {
			reTagNamesParts.lastIndex = 0;
			childTag = (matchingTags[ii].match(reTagNamesParts))[2].toLowerCase();

			if (pInfo && pInfo.restrictChildrenTo && pInfo.restrictChildrenTo.length > 0) {
				if (!pInfo.validChildLookup[childTag]) {
					errStr = "The tag \"" + childTag + "\" is not allowed as a child of the tag \"" + parentTag + "\".";
					errQueue.push(errStr);
				}
			}
			cInfo = tags[childTag] || {};
			if (cInfo.restrictParentsTo.length > 0) {
				if (!cInfo.validParentLookup[parentTag]) {
					errStr = "The tag \"" + parentTag + "\" is not allowed as a parent of the tag \"" + childTag + "\".";
					errQueue.push(errStr);
				}
			}

		}

		tagContents = tagContents.replace(bbRegExp, function (matchStr, bbcodeLevel, tagName, tagParams, tagContents) {
			errQueue = checkParentChildRestrictions(tagName.toLowerCase(), matchStr, bbcodeLevel, tagName, tagParams, tagContents, errQueue);
			return matchStr;
		});
		return errQueue;
	}

	/*
	    This function updates or adds a piece of metadata to each tag called "bbcl" which
	    indicates how deeply nested a particular tag was in the bbcode. This property is removed
	    from the HTML code tags at the end of the processing.
	*/
	function updateTagDepths(tagContents) {
		tagContents = tagContents.replace(/<([^\>][^\>]*?)\>/gi, function (matchStr, subMatchStr) {
			var bbCodeLevel = subMatchStr.match(/^bbcl=([0-9]+) /);
			if (bbCodeLevel === null) {
				return "<bbcl=0 " + subMatchStr + ">";
			} else {
				return "<" + subMatchStr.replace(/^(bbcl=)([0-9]+)/, function (matchStr, m1, m2) {
					return m1 + (parseInt(m2, 10) + 1);
				}) + ">";
			}
		});
		return tagContents;
	}

	/*
	    This function removes the metadata added by the updateTagDepths function
	*/
	function unprocess(tagContent) {
		return tagContent.replace(/<bbcl=[0-9]+ \/\*>/gi, "").replace(/<bbcl=[0-9]+ /gi, "&#91;").replace(/>/gi, "&#93;");
	}

	var replaceFunct = function (matchStr, bbcodeLevel, tagName, tagParams, tagContents) {

		tagName = tagName.toLowerCase();

		var processedContent = tags[tagName].noParse ? unprocess(tagContents) : tagContents.replace(bbRegExp, replaceFunct),
			openTag = tags[tagName].openTag(tagParams, processedContent),
			closeTag = tags[tagName].closeTag(tagParams, processedContent);

		if (tags[tagName].displayContent === false) {
			processedContent = "";
		}

		return openTag + processedContent + closeTag;
	};

	function parse(config) {
		var output = config.text;
		output = output.replace(bbRegExp, replaceFunct);
		return output;
	}

	function addBbcodeLevels(text) {
		while (text !== (text = text.replace(pbbRegExp, function (matchStr, tagName, tagParams, tagContents) {
				matchStr = matchStr.replace(/\[/g, "<");
				matchStr = matchStr.replace(/\]/g, ">");
				return updateTagDepths(matchStr);
			}))) {

		}
		return text;
	}

	// -----------------------------------------------------------------------------
	// public functions
	// -----------------------------------------------------------------------------

	// API, Expose all available tags
	me.tags = function () {
		return tags;
	};

	// API
	me.addTags = function (newtags) {
		var tag;
		for (tag in newtags) {
			tags[tag] = newtags[tag];
		}
		initTags();
	};

	me.process = function (config) {

		var ret = {
				html: "",
				error: false
			},
			errQueue = [];

		config.text = config.text.replace(/</g, "&lt;"); // escape HTML tag brackets
		config.text = config.text.replace(/>/g, "&gt;"); // escape HTML tag brackets

		config.text = config.text.replace(openTags, function (matchStr, openB, contents, closeB) {
			return "<" + contents + ">";
		});
		config.text = config.text.replace(closeTags, function (matchStr, openB, contents, closeB) {
			return "<" + contents + ">";
		});

		config.text = config.text.replace(/\[/g, "&#91;"); // escape ['s that aren't apart of tags
		config.text = config.text.replace(/\]/g, "&#93;"); // escape ['s that aren't apart of tags
		config.text = config.text.replace(/</g, "["); // escape ['s that aren't apart of tags
		config.text = config.text.replace(/>/g, "]"); // escape ['s that aren't apart of tags	

		// process tags that don't have their content parsed
		while (config.text !== (config.text = config.text.replace(pbbRegExp2, function (matchStr, tagName, tagParams, tagContents) {
				tagContents = tagContents.replace(/\[/g, "&#91;");
				tagContents = tagContents.replace(/\]/g, "&#93;");
				tagParams = tagParams || "";
				tagContents = tagContents || "";
				return "[" + tagName + tagParams + "]" + tagContents + "[/" + tagName + "]";
			}))) {

		}

		//config.text = fixStarTag(config.text); @removed 1.0.10
		config.text = addBbcodeLevels(config.text); // add in level metadata

		errQueue = checkParentChildRestrictions("bbcode", config.text, -1, "", "", config.text);

		ret.html = parse(config);

		if (ret.html.indexOf("[") !== -1 || ret.html.indexOf("]") !== -1) {
			errQueue.push("Some tags appear to be misaligned.");
		}

		if (config.removeMisalignedTags) {
			ret.html = ret.html.replace(/\[.*?\]/g, "");
		}
		if (config.addInLineBreaks) {
			ret.html = '<div style="white-space:pre-wrap;">' + ret.html + '</div>';
		}

		ret.html = ret.html.replace(new RegExp("&#91;", 'g'), "["); // put ['s back in
		ret.html = ret.html.replace(new RegExp("&#93;", 'g'), "]"); // put ['s back in

		ret.error = errQueue.length !== 0;
		ret.errorQueue = errQueue;

		ret.html = replaceAllSmileys(ret.html); // @since 1.0.10

		return ret;
	};

	return me;
})();




/*************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 *************************************************************************/



var Previews = [];
var n_prevs = 0;
var currentOpenedTag = ''; // used when clicking twice on the same tag (without selection). First click inserts opening tag, second click inserts closing tag.

/****************************************
 *		SECURED FUNCTIONS				*
 *****************************************/

// Returns 0 or 1 whether the input is checked or not
// @param area the current textArea
function isItalic(textArea) {
	var italic = 0;
	try {
		//      area p          td         div           input
		italic = textArea.parentNode.parentNode.childNodes[3].childNodes[0].checked === true ? 1 : 0;
	} catch (err) {
		// NULLPOINTER
	}
	return italic;
}

function isMinichatLog() {
	return document.title === "Kraland Interactif - Communauté - Mini-Chat";
}

// Returns true if we are in the popup window
function isPopupFrame() {
	return document.title === "Kraland - Passer un Ordre";
}

// Returns true if we are in the kramail window or in the forum post window
function isMainFrame() {
	var forms = document.getElementsByTagName('form');
	var i;
	for (i = 0; i < forms.length; i++) {
		if (forms[i].name === "post_msg") {
			return 1;
		}
	}
	return 0;
}

function convert(text) {
	return XBBCODE.process({
		text: text,
		removeMisalignedTags: false,
		addInLineBreaks: false
	}).html;
}


// Update the previsualisation area and display the character's counter when the keyup event is triggered
// @param event the keyup event
function key_up(event) {
	var area = null;

	// If the event was triggered by the user
	if (event !== null) {
		area = Previews[event.target.id];
	} else {
		// If the script made a call to this function by itself
		area = document.getElementsByClassName('forum-message')[0].getElementsByTagName('textarea')[0];
	}

	if (area === null || area === undefined) {
		return;
	}

	var doc = document;
	var str;
	// Simple check for the italic checkbox, only in the popup window
	if (isItalic(area)) {
		str = convert('[i]' + area.value + '[/i]');
	} else {
		str = convert(area.value);
	}

	var id = area.id.substr("area".length, area.id.length);
	var prev = doc.getElementById('preview' + id);
	var foot = doc.getElementById('footer' + id);

	// Replace some shit with true badass <br/> tags ! Beware of the <br/> tags, they could kill you while you're sleeping
	// Rico is tired ^
	var endl = /(\r\n|\n\r|\r|\n)/g;
	var count = 0;
	prev.innerHTML = str.replace(endl, function (match, g1, g2, position, input) {
		count++;
		return "<br/>";
	});

	// This one is not used anymore, Kraland is ok with '<' and '\' now
	//var alert_carac = "";
	//if (area.value.search(new RegExp(/(\\|<\S)/)) != -1) alert_carac = "<p align='right'><font color='red'><b>Aaaaaaaaaaaahhhh un < ou un \ ! Vade retro satanas !</b></font></p>";

	var nbCarac = area.value.match(new RegExp(/\"/g));
	if (nbCarac !== null) {
		count = count + 5 * nbCarac.length;
	}

	nbCarac = area.value.match(new RegExp(/(\>|\<)/g));
	if (nbCarac !== null) {
		count = count + 3 * nbCarac.length;
	}

	foot.innerHTML = area.value.length + count + " caractères"; // Not used anymore : + alert_carac;
}

// Callback function
// @param evt a click event
function mouseUp(evt) {
	setTimeout(key_up, 50, evt);
}

// Sets the width and height of every textarea in the popup window to 100% and 400px.
function extendTextArea() {
	var areas = document.getElementsByTagName("textarea");
	var i;
	for (i = 0; i < areas.length; i++) {
		areas[i].style.width = "450px";
		areas[i].style.height = "400px";
	}
}

// Called when the smiley is clicked and display the next set of smileys
// @param areaId the current textArea's id
function displaySmileysArea(areaId) {
	var smileyTabs = [];
	var nextShowingTabIndex = -1;
	var i = 0;

	for (i = 0; i < SMILEY_TAB_COUNT; i++) {
		smileyTabs[i] = document.getElementById(areaId + "smile" + i);
		if (smileyTabs[i].style.display === "block") {
			nextShowingTabIndex = (i + 1);
		}
	}

	// if no block was shown, tabIndex is equals to -1. Display first tab.
	if (nextShowingTabIndex === -1) {
		smileyTabs[0].style.display = "block";
		smileyTabs[0].style.height = "30px";
	}

	// if last block was shown, tabIndex is equals to SMILEY_TAB_COUNT. Hide last tab.
	if (nextShowingTabIndex === SMILEY_TAB_COUNT) {
		smileyTabs[SMILEY_TAB_COUNT - 1].style.display = "none";
	}

	// Hide previous tab and display next tab.
	if (nextShowingTabIndex > 0 && nextShowingTabIndex < SMILEY_TAB_COUNT) {
		smileyTabs[nextShowingTabIndex - 1].style.display = "none";
		smileyTabs[nextShowingTabIndex].style.display = "block";
		smileyTabs[nextShowingTabIndex].style.height = "30px";
	}
}

// Creates and display the previsualisation area
// @param textarea the textarea to be previsualised
function createPreview(textarea) {
	var id = n_prevs++;

	textarea.id = "area" + id;
	Previews[textarea.id] = textarea;

	var container = textarea.parentNode;

	// Add the keyup event listener to the textarea
	if (OPTION_FREQUENCE_PREVISUALISATION == 1) {
		textarea.addEventListener('keyup', key_up, false);
	}

	var prev = document.createElement('div');
	prev.id = "preview" + id;
	prev.className = "bigcadre";
	prev.style.marginLeft = "0";
	prev.style.width = "97%";
	prev.style.padding = "5px";
	prev.innerHTML = "";

	// Add the mouseover event listener to the textarea and the previsualisation area
	if (OPTION_FREQUENCE_PREVISUALISATION === 0) {
		prev.addEventListener('mouseover', key_up, false);
		textarea.addEventListener('mousemove', key_up, false);
	}

	var footer = document.createElement('div');
	footer.id = "footer" + id;

	// This one is used as a container
	var paragraph = document.createElement('p');
	textarea.parentNode.insertBefore(paragraph, textarea);
	paragraph.parentNode.removeChild(textarea);
	paragraph.appendChild(textarea);
	paragraph.appendChild(prev);
	paragraph.appendChild(footer);
}

// Removes every stupid '>' that cut the post's sentences is pieces.
// @param textarea the textarea to be cleaned
function removeBadQuotes(textarea) {
	textarea.value = textarea.value.replace(/ \n(?:> )+(?=[\wéàçèäâêë\[])/g, " ");
	textarea.value = textarea.value.replace(/  /g, " ");
}


/****************************************
 *		END SECURED FUNCTIONS			*
 *****************************************/

function getSelection(htmlIdentifier) {
	var textselect = document.getElementById(htmlIdentifier);

	if (textselect === null || textselect === undefined) {
		return null;
	}

	return {
		htmlText: textselect,
		beforeText: (textselect.value).substring(0, textselect.selectionStart),
		text: (textselect.value).substring(textselect.selectionStart, textselect.selectionEnd),
		afterText: (textselect.value).substring(textselect.selectionEnd, textselect.textLength),
		isTextSelected: textselect.selectionEnd && (textselect.selectionEnd - textselect.selectionStart > 0)
	};
}

function addSmileyTag(tag, id) {
	var selection = getSelection(id);

	if (selection !== null) {
		selection.htmlText.value = selection.beforeText + "[" + tag + "]" + selection.afterText;
	}
}

function addTag(tag, id) {
	var selection = getSelection(id);

	if (selection === null) {
		return;
	}

	var eq = (tag === "url" || tag === "mail") ? '=' : '';
	var openingTag = "[" + tag + eq + "]";
	var closingTag = "[/" + tag + "]";

	if (selection.isTextSelected) {
		selection.htmlText.value = selection.beforeText + openingTag + selection.text + closingTag + selection.afterText;
		selection.htmlText.selectionStart = selection.beforeText.length;
		selection.htmlText.selectionEnd = selection.htmlText.textLength - selection.afterText.length;
		selection.htmlText.focus(); // allows to use multiples tags on the same selection
	} else {
		if (currentOpenedTag === tag) {
			selection.htmlText.value = selection.beforeText + closingTag + selection.afterText;
			currentOpenedTag = '';
		} else {
			selection.htmlText.value = selection.beforeText + openingTag + selection.afterText;
			currentOpenedTag = tag;
		}
	}
}

function makeSmileyOnclickHandler(smileyTagString, htmlIdentifier) {
	return function () {
		addSmileyTag(smileyTagString, htmlIdentifier);
		return false;
	};
}

function makeTagOnclickHandler(tagString, htmlIdentifier) {
	return function () {
		addTag(tagString, htmlIdentifier);
		return false;
	};
}

function makeDisplaySmileysOnclickHandler(textareaIdentifier) {
	return function () {
		displaySmileysArea(textareaIdentifier);
		return false;
	};
}

// Creates a html table with 21 smileys in it on the top of a textarea
// @param tableNum the table's number
// @param areaId the current textArea's id
function createSmileysTable(tableNum, areaId) {
	var SMILEY_COUNT_PER_TAB = 21;
	var startingSmileyIndex = (SMILEY_COUNT_PER_TAB * tableNum) + 1;

	var tr = document.createElement('tr');
	var i = 0;
	for (i = 0; i < SMILEY_COUNT_PER_TAB; i++) {
		var td = document.createElement('td');
		var a = document.createElement('a');
		a.onclick = makeSmileyOnclickHandler(SMILEYS[(SMILEY_COUNT_PER_TAB * tableNum) + i], areaId);
		a.href = '#';
		a.areaId = areaId.substr("area".length, areaId.length);

		var image = document.createElement('img');
		image.src = 'http://img.kraland.org/s/' + decIntegerToHexString(startingSmileyIndex + i) + '.gif';
		a.appendChild(image);
		td.appendChild(a);
		tr.appendChild(td);
	}
	return tr;
}

function add_tool(node, str, tag, id, is_image) {
	var a = document.createElement('a');
	a.onclick = makeTagOnclickHandler(tag, id);
	a.href = '#';
	a.id = id.substr("area".length, id.length);

	if (is_image) {
		var image = document.createElement('img');
		image.src = str;
		a.appendChild(image);
	} else {
		var div = document.createElement('div');
		div.style.margin = "0";
		div.style.width = "8px";
		div.style.height = "8px";
		div.style.backgroundColor = str;
		a.appendChild(div);
	}

	a.addEventListener('mouseup', mouseUp, true);
	node.appendChild(a);
}

function add_toolbar(area) {
	var toolbar = document.createElement('span');
	var i = 0;

	var c = [];
	c[0] = ['b', b_str];
	c[1] = ['i', i_str];
	c[2] = ['u', u_str];
	c[3] = ['strike', s_str];
	c[4] = ['left', left_str];
	c[5] = ['center', center_str];
	c[6] = ['right', right_str];
	c[7] = ['quote', quote_str];
	c[8] = ['img', img_str];
	c[9] = ['url', url_str];
	c[10] = ['mail', mail_str];
	c[11] = ["yellow", "#f4ac00"];
	c[12] = ["orange", "#f77400"];
	c[13] = ["fuchsia", "#ed6161"];
	c[14] = ["red", "#d50000"];
	c[15] = ["maroon", "#7b0000"];
	c[16] = ["brown", "#5e432d"];
	c[17] = ["purple", "purple"];
	c[18] = ["navy", "#00007b"];
	c[19] = ["smiley", "smiley"];
	c[20] = ["blue", "#2b2be4"];
	c[21] = ["lightblue", "#5577bc"];
	c[22] = ["teal", "#007b7b"];
	c[23] = ["lightgreen", "#219c5a"];
	c[24] = ["green", "#006f00"];
	c[25] = ["olive", "#7b7b00"];
	c[26] = ["gray", "#7b7b7b"];
	c[27] = ["darkgray", "#5a5a5a"];


	var table = document.createElement('table');
	table.style.display = "inline";
	table.style.border = "0";
	table.cellSpacing = 1;
	table.cellPadding = 0;

	var tr = document.createElement('tr');

	for (i = 0; i < c.length; i++) {
		if (i == 20) {
			table.appendChild(tr);
			tr = document.createElement('tr');
		}

		var td = document.createElement('td');
		td.style.border = "1px solid #999999";
		var is_image;
		if (i < 11) {
			is_image = true;
			td.width = "18px";
			td.height = "17px";
			td.rowSpan = "2";
		} else {
			is_image = false;
			td.width = "8px";
			td.height = "8px";
		}
		if (i != 19) {
			add_tool(td, c[i][1], c[i][0], area.id, is_image);
		} else {
			var a = document.createElement('a');
			a.onclick = makeDisplaySmileysOnclickHandler(area.id);
			a.href = '#';
			a.id = area.id.substr("area".length, area.id.length);

			var image = document.createElement('img');
			image.src = 'http://img.kraland.org/s/' + "01" + '.gif';
			td.style.border = "1px solid #999999";
			td.rowSpan = 2;
			a.appendChild(image);
			td.appendChild(a);
		}
		tr.appendChild(td);
	}

	table.appendChild(tr);
	toolbar.appendChild(table);

	for (i = 0; i < SMILEY_TAB_COUNT; i++) {
		table = document.createElement('table');
		table.style.display = "none";
		table.style.border = "0";
		table.cellSpacing = 1;
		table.cellPadding = 0;
		table.id = area.id + "smile" + i;
		table.appendChild(createSmileysTable(i, area.id));
		toolbar.appendChild(table);
	}

	area.parentNode.parentNode.insertBefore(toolbar, area.parentNode);
}

// The main function
function main() {
	if (isMainFrame()) {
		if (OPTION_REFORMATER_TEXTE === 1) {
			removeBadQuotes(document.getElementsByClassName('forum-message')[0].getElementsByTagName('textarea')[0]);
		}
		// Tools, smileys etc...
		var left_toolbar = document.getElementsByClassName('forum-cartouche');
		// This add some rare characters, could be useful.
		if (left_toolbar.length !== 0) {
			var help_text = document.createElement('p');
			help_text.innerHTML = "— « » À É";
			left_toolbar[0].appendChild(help_text);
		}
		createPreview(document.getElementsByClassName('forum-message')[0].getElementsByTagName('textarea')[0]);
		key_up();
	} else if (isPopupFrame()) {
		extendTextArea();
		var areas = document.getElementsByTagName('textarea');
		for (var i = 0; i < areas.length; i++) {
			createPreview(areas[i]);
			add_toolbar(areas[i]);
		}
	} else if (isMinichatLog()) {
		// the div where the text area is located
		var divMinHeightBottom = document.getElementById('div-min-height-bottom');
		divMinHeightBottom.style.height = 'auto';

		// textArea creation
		var textAreaAsNew = document.createElement('input');
		textAreaAsNew.setAttribute('name', 'minichatInput');
		textAreaAsNew.style.width = '100%';
		/*textAreaAsNew.onkeypress=function(event)
				{
					if(event.which === 13 || event.keyCode == 13 ) {
						appendMinichat();
					}
				};*/

		var formMinichat = document.createElement('form');
		formMinichat.setAttribute('action', 'http://www.kraland.org/main.php?p=6_6');
		formMinichat.appendChild(textAreaAsNew);
		formMinichat.addEventListener('submit', function (evt) {
			evt.preventDefault();
			var textAreaByName = document.getElementsByName('minichatInput')[0];

			if (textAreaByName.value === '') {
				return;
			}

			var minichatGetRequest = 'http://www.kraland.org/minichat.php?message=' + encodeURIComponent(textAreaByName.value);
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					window.location = 'http://www.kraland.org/main.php?p=6_6';
				}
			};
			xhr.open('GET', minichatGetRequest, true);
			xhr.send();
		});

		divMinHeightBottom.appendChild(formMinichat);

		// getting the new textArea
		var textAreaByName = document.getElementsByName('minichatInput')[0];

		createPreview(textAreaByName);
		add_toolbar(textAreaByName);

		textAreaByName.focus();
	}
}

main();
