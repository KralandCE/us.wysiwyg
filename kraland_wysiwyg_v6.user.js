// ==UserScript==
// @name           Kraland Wysiwyg V6
// @namespace      ki
// @description    Ajoute une zone de prévisualisation dynamique à l'éditeur de kramail, au forum et aux déclarations in game et reformate un texte quoté.
// @version   1.0.15
// @include        http://www.kraland.org/*
// @grant       none
// ==/UserScript==

/*jslint passfail: false, plusplus: true, vars: true, browser: true, sloppy: true, regexp: true*/

/*
***********************************************************************************************
                 Les options du scripts se règlent à la suite de cette ligne : */

var OPTION_REFORMATER_TEXTE = 1;
// L'option reformatage permet de reformater les textes des réponses dans les kramails ou les messages du forum
// 1 reformate le message
// 0 désactive cette option

/* Fin des options
 *********************************************************************************************** */

/*
1.0.15
Removing "listeners" option. Previsualisation is smart enough to update itself.
Preview is udpated when mouse is over, when mouse is clicked, when key is pressed and when a tag is used.
Using base64 for smiley instead of fetching them from kraland server. Improves loading by a factor of 3.
Rewriting toolbar code.

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

/*var SMILEYS_HEX = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D', '0E', '0F', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1A', '1B', '1C', '1D', '1E', '1F', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2A', '2B', '2C', '2D', '2E', '2F', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D', '3E', '3F', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4A', '4B', '4C', '4D', '4E', '4F', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5A', '5B', '5C', '5D', '5E', '5F', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6A', '6B', '6C', '6D', '6E', '6F', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7A', '7B', '7C', '7D', '7E'];*/

/*var SMILEYS_URL = ['http://img.kraland.org/s/01.gif', 'http://img.kraland.org/s/02.gif', 'http://img.kraland.org/s/03.gif', 'http://img.kraland.org/s/04.gif', 'http://img.kraland.org/s/05.gif', 'http://img.kraland.org/s/06.gif', 'http://img.kraland.org/s/07.gif', 'http://img.kraland.org/s/08.gif', 'http://img.kraland.org/s/09.gif', 'http://img.kraland.org/s/0A.gif', 'http://img.kraland.org/s/0B.gif', 'http://img.kraland.org/s/0C.gif', 'http://img.kraland.org/s/0D.gif', 'http://img.kraland.org/s/0E.gif', 'http://img.kraland.org/s/0F.gif', 'http://img.kraland.org/s/10.gif', 'http://img.kraland.org/s/11.gif', 'http://img.kraland.org/s/12.gif', 'http://img.kraland.org/s/13.gif', 'http://img.kraland.org/s/14.gif', 'http://img.kraland.org/s/15.gif', 'http://img.kraland.org/s/16.gif', 'http://img.kraland.org/s/17.gif', 'http://img.kraland.org/s/18.gif', 'http://img.kraland.org/s/19.gif', 'http://img.kraland.org/s/1A.gif', 'http://img.kraland.org/s/1B.gif', 'http://img.kraland.org/s/1C.gif', 'http://img.kraland.org/s/1D.gif', 'http://img.kraland.org/s/1E.gif', 'http://img.kraland.org/s/1F.gif', 'http://img.kraland.org/s/20.gif', 'http://img.kraland.org/s/21.gif', 'http://img.kraland.org/s/22.gif', 'http://img.kraland.org/s/23.gif', 'http://img.kraland.org/s/24.gif', 'http://img.kraland.org/s/25.gif', 'http://img.kraland.org/s/26.gif', 'http://img.kraland.org/s/27.gif', 'http://img.kraland.org/s/28.gif', 'http://img.kraland.org/s/29.gif', 'http://img.kraland.org/s/2A.gif', 'http://img.kraland.org/s/2B.gif', 'http://img.kraland.org/s/2C.gif', 'http://img.kraland.org/s/2D.gif', 'http://img.kraland.org/s/2E.gif', 'http://img.kraland.org/s/2F.gif', 'http://img.kraland.org/s/30.gif', 'http://img.kraland.org/s/31.gif', 'http://img.kraland.org/s/32.gif', 'http://img.kraland.org/s/33.gif', 'http://img.kraland.org/s/34.gif', 'http://img.kraland.org/s/35.gif', 'http://img.kraland.org/s/36.gif', 'http://img.kraland.org/s/37.gif', 'http://img.kraland.org/s/38.gif', 'http://img.kraland.org/s/39.gif', 'http://img.kraland.org/s/3A.gif', 'http://img.kraland.org/s/3B.gif', 'http://img.kraland.org/s/3C.gif', 'http://img.kraland.org/s/3D.gif', 'http://img.kraland.org/s/3E.gif', 'http://img.kraland.org/s/3F.gif', 'http://img.kraland.org/s/40.gif', 'http://img.kraland.org/s/41.gif', 'http://img.kraland.org/s/42.gif', 'http://img.kraland.org/s/43.gif', 'http://img.kraland.org/s/44.gif', 'http://img.kraland.org/s/45.gif', 'http://img.kraland.org/s/46.gif', 'http://img.kraland.org/s/47.gif', 'http://img.kraland.org/s/48.gif', 'http://img.kraland.org/s/49.gif', 'http://img.kraland.org/s/4A.gif', 'http://img.kraland.org/s/4B.gif', 'http://img.kraland.org/s/4C.gif', 'http://img.kraland.org/s/4D.gif', 'http://img.kraland.org/s/4E.gif', 'http://img.kraland.org/s/4F.gif', 'http://img.kraland.org/s/50.gif', 'http://img.kraland.org/s/51.gif', 'http://img.kraland.org/s/52.gif', 'http://img.kraland.org/s/53.gif', 'http://img.kraland.org/s/54.gif', 'http://img.kraland.org/s/55.gif', 'http://img.kraland.org/s/56.gif', 'http://img.kraland.org/s/57.gif', 'http://img.kraland.org/s/58.gif', 'http://img.kraland.org/s/59.gif', 'http://img.kraland.org/s/5A.gif', 'http://img.kraland.org/s/5B.gif', 'http://img.kraland.org/s/5C.gif', 'http://img.kraland.org/s/5D.gif', 'http://img.kraland.org/s/5E.gif', 'http://img.kraland.org/s/5F.gif', 'http://img.kraland.org/s/60.gif', 'http://img.kraland.org/s/61.gif', 'http://img.kraland.org/s/62.gif', 'http://img.kraland.org/s/63.gif', 'http://img.kraland.org/s/64.gif', 'http://img.kraland.org/s/65.gif', 'http://img.kraland.org/s/66.gif', 'http://img.kraland.org/s/67.gif', 'http://img.kraland.org/s/68.gif', 'http://img.kraland.org/s/69.gif', 'http://img.kraland.org/s/6A.gif', 'http://img.kraland.org/s/6B.gif', 'http://img.kraland.org/s/6C.gif', 'http://img.kraland.org/s/6D.gif', 'http://img.kraland.org/s/6E.gif', 'http://img.kraland.org/s/6F.gif', 'http://img.kraland.org/s/70.gif', 'http://img.kraland.org/s/71.gif', 'http://img.kraland.org/s/72.gif', 'http://img.kraland.org/s/73.gif', 'http://img.kraland.org/s/74.gif', 'http://img.kraland.org/s/75.gif', 'http://img.kraland.org/s/76.gif', 'http://img.kraland.org/s/77.gif', 'http://img.kraland.org/s/78.gif', 'http://img.kraland.org/s/79.gif', 'http://img.kraland.org/s/7A.gif', 'http://img.kraland.org/s/7B.gif', 'http://img.kraland.org/s/7C.gif', 'http://img.kraland.org/s/7D.gif', 'http://img.kraland.org/s/7E.gif'];*/


// wget -i filelist.txt 
//for i in *.gif; do echo -n "'data:image/gif;base64,"; echo | base64 $i | tr -d '\n'; echo -n "',"; done > file64.txt

var SMILEYS_64 = ['data:image/gif;base64,R0lGODlhDwAPALMJAP//////AP/4AP/xAP/lAP/YAP/KACEQAAAAAMDAwAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAkALAAAAAAPAA8AQAQ1MEn5ap0Shc07f8nzjRtIeZ15omXGoqAYyKQ6WRd206XNsyANaZYSvj7CX6lFwzUxFU8uEQEAOw==', 'data:image/gif;base64,R0lGODlhDwAPALMAAMDAwP//8f/dWv/JMf+tAP+jAP+TAP+BAP9vAP+7EgAAANHR0QAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AQARYEEipap3UEJL6JoVyIAqgbMNADEk1lhRyzDRCYufmjbfJFcBUAmR4mWQGBbCQLMJwlifGlCMYSNJcx1M05qKsShHLSaSEoMJLgfykQ15k0jLrUdg220USAQA7', 'data:image/gif;base64,R0lGODlhDwAPALMAAP//////AP/4AP/xAP/lAP/YAP/KAEBAUiAgIA8PAAYGBwAAAMDAwAAAAAAAAAAAACH5BAEAAAwALAAAAAAPAA8AQARTkEmpap2UjMDDHgRRGAqjbMihBMqBjCVlwJVhx9SwdTaZsxZgzae4AY5HBcGHMVlwzYoORIKeOh3RzVlxWVLPFSchBmqHhHDlbJqlkUUYZti7SCIAOw==', 'data:image/gif;base64,R0lGODlhDwAPALMAAMDAwAD/ggD1VwDuNgDnHgDhEwDbCQDUBADMAgDBAAAAAMzMzAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AQARZEEipap30EMsrSgqgFFs1WF9IJUjrJiA2FiRRfLFIE4MgDDbDISViHQxI4WGoknEwTlrhAGrqaorNkDjj+YAFYWqU7f2CB0XVKA0jhzE1Yknf5ihqGOwiiQAAOw==', 'data:image/gif;base64,R0lGODlhDwAPALMLAP//////o///hv//af/89P/yU//mP//SKP++G/+nCAAAAMDAwAAAAAAAAAAAAAAAACH5BAEAAAsALAAAAAAPAA8AQARXcEmpap30KAA290qiLEqhCMJZauIUIlaVtG5hD0OBzCN5C4GAIGc47EahjafTgWEosaerZDuIehRbBWdSHH2FAVBINF67sfRV9OEwO61XxV35Tmf4iyQCADs=', 'data:image/gif;base64,R0lGODlhDwAPALMKAAAAAAC1AADGAADOAADOCADWEADeGHMIAHsIAADnQcbGxtYAAOIUAO8AAP8IAAAAACH5BAEAAAoALAAAAAAPAA8AQARfUEn5ap00iEeK949RBI/yaJWRVIlYZhohOItDYqdWGCKYCYSOKkHcFUonQuWAWDxGN4zJ8pJOdaCqSRMQ8npIzSa0eiQ+lUBXSGzxjqcxtQINC0gPBsNBUGvTajQOVREAOw==', 'data:image/gif;base64,R0lGODlhDwAPAJEAAAAAAP8AAP//AAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFKAAAACwAAAAADwAPAAAEMxBIOWqdGFTB+cVDJ3pTOI4D5ZnC1mqd27LyKdb2mqMme5M9FAm2ssRKuxTIN8uULMpJBAAh+QQFBQAAACwEAAQABwABAAAEBVAIQGUEACH5BAUFAAAALAMABAAJAAIAAAQKEIwB6pRC0JFHBAAh+QQFBQAAACwDAAQACQACAAAEChAIAeqUY1CRRQQAIfkEBSgAAAAsBAAEAAcAAQAABAVwDEBlBAAh+QQFCgAAACwIAAoAAgABAAAEAzCECAAh+QQFCgAAACwIAAkAAgABAAAEAzCECAAh+QQFCgAAACwHAAkAAwACAAAEBTAAIUUEACH5BAUKAAAALAYACQADAAIAAAQFMAAhRQQAIfkEBQoAAAAsBQAJAAMAAgAABAUwACFFBAAh+QQFCgAAACwEAAkAAwACAAAEBTAAIUUEACH5BAUKAAAALAQACQACAAMAAAQFUAgAQogAIfkEBQoAAAAsBAAKAAIAAwAABAVwCABCiAAh+QQFCgAAACwEAAsAAwACAAAEBVCAIEMEACH5BAUKAAAALAUACwADAAIAAAQFcIAgZgQAIfkEBQoAAAAsBgALAAMAAgAABAVwgCBmBAAh+QQFCgAAACwHAAsAAwACAAAEBXCAIGYEACH5BAUKAAAALAgADAACAAEAAAQDUIgIACH5BAVkAAAALAgACwACAAEAAAQDcIwIADs=', 'data:image/gif;base64,R0lGODlhDwAPALMBAAAAAMbGxvfetffnvffv1vf33v/evf/nxv/nzv/v1v/v3v/v5//35////////wAAACH5BAEAAAEALAAAAAAPAA8AQARdMEj5ap30qFSLItVxCE/wKI/jPEu6GiVlGId1GCR2JkqvzDkTapUqFmGmGQKRYIpEMZ0lijHtFLfLZFfxVQa5k3FFXJFOw1VL9RhVlLxEsykK02oIqAi5feCAWgERADs=', 'data:image/gif;base64,R0lGODlhDwAPALMBAAAAAMbGxv8AAP8xMf9jY/9zc/+MjP/Gvf/Oxv/Wzv/e1v/n3v/v7//39////wAAACH5BAEAAAEALAAAAAAPAA8AQARkMEj5ap00CUEYU8tCbMcTPAtTeeqDlNNzIHRCH3C8gJ7y5igFi6VQ2GCyROJRNCoRJszJEpVOd4tEqXrasRLZm4mZWjEWlWNlURgMeiB3YXsYFAzNoqENPc2UFjYvXBU4hhcSEQA7', 'data:image/gif;base64,R0lGODlhDwAPALMGAAAAAAAAzgA57wBj/wCc/2PO/8zMzMzMzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAYALAAAAAAPAA8AQARF0EgJap1UjG3rHgJgAAT3ARshUkEgvG+7UuX3qZStf+EY7gNAYDbpEDGV2kBFJAFTIqdpCvI8eRVNUIcSDH3AWFPYks0iADs=', 'data:image/gif;base64,R0lGODlhDwAPALMAAMDAwP+OlP/ruf9vcP9dUf9NPf9CLf8zHf8mFf8aDgAAANTU1AAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AQARXEEipap30lEL6LsaBJAqgcNUwENVYUgkizwmJnZs32iZHDIqAghVymWIHS+Uget2UmOfnQHL2fB6REfcTAkGiqg+oIoYryA/IULQpYgqmXGGcoGu1iyQCADs=', 'data:image/gif;base64,R0lGODlhDwAPAKIAAP///729vf9jY/8AAAAAAAAAAAAAAAAAACH5BAkAAAEALAAAAAAPAA8AAAhfAAMIFEigYMGBCAMUHMCQ4UGEBBw2jDiAwECKEjFWJOgwokeKFjEu7DgxooCTDRmeFFDRJMqUK1sOOGmwJsqRBADk3KnTocKKOoPu3PizZU2QF1MqtQhRY8uEF2smDAgAOw==', 'data:image/gif;base64,R0lGODlhDwAPALMAAP////yBhvrVqPplZvpVSvpGOPo8KfovG/ojFPoYDQAAAMDAwAAAAAAAAAAAAAAAACH5BAEAAAsALAAAAAAPAA8AQARbcEmpap30lEL6LsaBJMqicEM6EIVITkqCVEidvPDnjfjZDYGAgqAIjUoxxMHADB1EJYzJEpVOPwdS1bTpeERHLiq4ArkqHMLAQqRpZZqNxfhKPqkVHCV2u10kEQA7', 'data:image/gif;base64,R0lGODlhDwAPANX/AMDAwKamCcDAH83NNubmfv8ZGfUZGfMZGfEZGfAZGe0ZGegZGeYZGeUZGeQZGeMZGeEZGdoZGdkZGdUZGdIZGcoZGcYZGcUZGcEZGb8ZGboZGbkZGbgZGbcZGbYZGbUZGa8ZGa4ZGaEZGZ8ZGZ4ZGeMuLuIuLuAuLt8uLsQuLsAuLqMuLqIyMv////Hx8dHR0bKyshkZGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AAAaXQAJgCJAZjUQAQUAIGEcdTmdkDCwBAxlJM5FEJBMNdTDUbjAQxqIBwWxIsrIoFuscDAcOXRSXjSYgdBYFF3QhE3AyHRgVdDEUjhUYHUYsMR8RDAkFCQwRHjEsRo4ZDgoICg8ZjkYrMTCOsbArfSkxLy8uurgxKXFFKCUxLi3FLjElKL/AtrEpyklFMionJicqSNFlR8tDQQA7', 'data:image/gif;base64,R0lGODlhDwAPALMLAAAAAIwIAIylAIytAJS1AK3OCK3eAPcAAP8AAP8IAP8cAMbGxrXWALXeAL3eAAAAACH5BAEAAAsALAAAAAAPAA8AQARfcEn5ap1UlG32FkJDPMtTPI2BmsIzTq7TNMeREC/seeJAlpyKIVUROF6xyiFwKDJ+GMsFAzN9fFCgp1MIOXza02MoNmI3qMaqixq5GhoPaCBgIEcgRUJRd2UrODVNUBEAOw==', 'data:image/gif;base64,R0lGODlhDwAPAHAAACH/C05FVFNDQVBFMi4wAwEAAAAh/nZERU1PIFZFUlNJT04gOiBCdWlsdCB3aXRoIGFuIFVOUkVHSVNURVJFRCBjb3B5IG9mIEdJRiBNb3ZpZSBHZWFyIDIuNg0KZnJvbSBnYW1hbmkgcHJvZHVjdGlvbnMgKGh0dHA6Ly93d3cuZ2FtYW5pLmNvbSkuACH5BAkQAAcALAAAAAAPAA8AhwAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKbK8P/w1P/isf/Ujv/Ga/+4SP+qJf+qANySALl6AJZiAHNKAFAyAP/j1P/Hsf+rjv+Pa/9zSP9XJf9VANxJALk9AJYxAHMlAFAZAP/U1P+xsf+Ojv9ra/9ISP8lJf4AANwAALkAAJYAAHMAAFAAAP/U4/+xx/+Oq/9rj/9Ic/8lV/8AVdwASbkAPZYAMXMAJVAAGf/U8P+x4v+O1P9rxv9IuP8lqv8AqtwAkrkAepYAYnMASlAAMv/U//+x//+O//9r//9I//8l//4A/twA3LkAuZYAlnMAc1AAUPDU/+Kx/9SO/8Zr/7hI/6ol/6oA/5IA3HoAuWIAlkoAczIAUOPU/8ex/6uO/49r/3NI/1cl/1UA/0kA3D0AuTEAliUAcxkAUNTU/7Gx/46O/2tr/0hI/yUl/wAA/gAA3AAAuQAAlgAAcwAAUNTj/7HH/46r/2uP/0hz/yVX/wBV/wBJ3AA9uQAxlgAlcwAZUNTw/7Hi/47U/2vG/0i4/yWq/wCq/wCS3AB6uQBilgBKcwAyUNT//7H//47//2v//0j//yX//wD+/gDc3AC5uQCWlgBzcwBQUNT/8LH/4o7/1Gv/xkj/uCX/qgD/qgDckgC5egCWYgBzSgBQMtT/47H/x47/q2v/j0j/cyX/VwD/VQDcSQC5PQCWMQBzJQBQGdT/1LH/sY7/jmv/a0j/SCX/JQD+AADcAAC5AACWAABzAABQAOP/1Mf/sav/jo//a3P/SFf/JVX/AEncAD25ADGWACVzABlQAPD/1OL/sdT/jsb/a7j/SKr/Jar/AJLcAHq5AGKWAEpzADJQAP//1P//sf//jv//a///SP//Jf7+ANzcALm5AJaWAHNzAFBQAPLy8ubm5tra2s7OzsLCwra2tqqqqp6enpKSkoaGhnp6em5ubmJiYlZWVkpKSj4+PjIyMiYmJhoaGg4ODv/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////whOAA8IFAigYMGBCA8UtMKQ4UGEABw2jGgFwECKETNWdEhQokaMChuKHFkRo8GSC0uKTKmyJcmRLF9ODDkxpkWaMitezHnzIsWaCX0aTBgQADs=', 'data:image/gif;base64,R0lGODlhDwAPANQAAAAAAAC9AADGAADGCADOEAjWGBDeIRjeISHnKSnvMTHvOTn3QkL3Qkr/SlL/Uv8AAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAlkAA8ALAAAAAAPAA8AAAVn4CM+QGmOKMkwi5IgZQo0NKMoyGEAI8A0jgYLpyvwVDRhKWcg8ACKxYoBgEAARWcpqqhasQWC9tr9lnaEQenqZQOM6bV1fg0DBuqqvO6Mi95GJWJ3AwFHJGKJhIYyhIUCMSl/JociIQA7', 'data:image/gif;base64,R0lGODlhDwAPALMOAAAAAPf/AP/3AP///////////////////////////////////////////////wAAACH5BAEAAA4ALAAAAAAPAA8AQAQp0En5ap3U6n1r4M/3TKCGlVb2CKzFCilqYs5Gk+Upd1Wr+btgTqgDTSIAOw==', 'data:image/gif;base64,R0lGODlhDwAPALMLAP/////v+//O0/+7zv6xwP+ot/+fwf6Wm/6Hjf54ggAAAMDAwAAAAAAAAAAAAAAAACH5BAEAAAsALAAAAAAPAA8AQARccEmpap30lEKILcaBJMqicNUweMpYUgmCWCOJnVtX1O/ZDQLBCiSyKWIHBWCpOIheNwsUY8IVDqQprqMTuUy5ipBVrHAIKhWB6DoiNEpm6OtOLgGt76SS6PcvEhEAOw==', 'data:image/gif;base64,R0lGODlhDwAPALMAAMDAwO+Mxudztc5KlN5jpc5CjMY5hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AQARVEEh5ap20kEH63oVhHMDhCSgokpTovizFcZvLmt3zBAKhh6OSqDAoDgrIIKZkiS0rn9BlcqB5CMBg1ScIPASPzWO17aB6R9th+DGmtcPmeoWpvEaxCAA7', 'data:image/gif;base64,R0lGODlhFAAYANIAAAAAAP///wgEBOjgGAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/sFodHRwOi8vd3d3LnJ0bHNvZnQuY29tL2FuaW1hZ2ljCgpDcmVhdGVkIHdpdGggQW5pbWFnaWMgR0lGIFYgMS4wNmIKYnkgUmlnaHQgdG8gTGVmdCBTb2Z0d2FyZSBJbmMuCgpUbyBzdXBwcmVzcyB0aGlzIG1lc3NhZ2UgaW4gdGhlIHJlZ2lzdGVyZWQgdmVyc2lvbgp1bmNoZWNrICJPcHRpb25zIHwgQW5pbWFnaWMgY29tbWVudCBmcmFtZSIKACH5BAlaAAEALAAAAAAUABgAAANJKKrR/vCJSOGs+GKqt12d9zGiVZqnAwZgWClDHJOvbM+vcNu0NOs/nGVGBBqHu10ImOQhm7Il1PkcLKhPAWDLdDW6MGFOWWp1EgAh+QQJWgABACwAAAAAFAAYAAADSSgq0f7QsUjfrHVdnDXH2yeJUUiaosaopzC8r8K5cD2ggWLXchnTN5pJGLsVbxDgjpdc7kJKJ9IiZTZ5NlQUkM1gYbiGrptiORIAOw==', 'data:image/gif;base64,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', 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAACTzPf///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFHgAAACwAAAAAEAAQAAACOIQ9qceQAWNqI1p5qrhxDwQp4SN8WsUF6JNyrLpW7KzU9GiLMJ6vzohTqUAtDLH1YbwkyYbD1igAACH5BAUeAAAALAAAAAAQAA0AAAIzhICji3imgpzKtDEzdVj7cXSLNAoDIHpkYGJCEMEdBZLLLeb4KNt7DPwBUTIhLGGjwY4FADs=', 'data:image/gif;base64,R0lGODlhEwAPALIBAL29vQAAAP8AAP9jY////wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQNFAAAACwAAAAAEwAPAAADUAi6G+4stiBqhVJRsfmNAdB5Y6gNzkWtmymiVqrGJzXcVnUP3IM6uNyuhyoGfg8gD3hsBgjPKFS1uzmg2CjnVWUlW9zdKLc9WUVjzMSFfkQSACH5BA0AAAAALAAAAAATAA8AAANOCLob7iy2IGqFMSgqeL9MMDjW53XNyJEUiW6j5XbeIz7DUAq57oxAka7UowWDtp9P2HMQAs/oiplzQq9PFDWWdGkAzNnutcGIaRJJMpIAACH5BA0AAAAALAAAAAATAA8AAANOCLob7oyFFoS1UI5ZRfeY5lzg5zVbN1bj+aTs13rBZtcDKQw8fds5Ei/nGPJqj2SvaHQQAs+oCjd0Qq/PE4A6TaooHB1pEqHoMmVJMpIAACH5BA08AAAALAAAAAATAA8AAANPCBra8a/JMBh4Iuc4691asHVYKIjh9VRYe6IMJVdviL5VTg1aNvy432/XEwiDQhkEAlwJWYRAdAq7JE9U6skB2SxLFsmnmBJzixzzZClOAAAh+QQNAAAAACwAAAAAEwAPAAADTgi6G+6MhRaEtVCOWUX3mOZc4Oc1WzdW4/mk7Nd6wWbXAykMPH3bORIv5xjyao9kr2h0EALPqAo3dEKvzxOAOk2qKBwdaRKh6DJlSTKSAAAh+QQNAAAAACwAAAAAEwAPAAADTgi6G+4stiBqhTEoKni/TDA41ud1zciRFIluo+V23iM+w1AKue6MQJGu1KMFg7afT9hzEALP6IqZc0KvTxQ1lnRpAMzZ7rXBiGkSSTKSAAAh/olQb2lscyBhdSBjdWwgcG9pbHMgYXUgY3VsIHBvaWxzIGF1IGN1bCBwb2lscyBhdSBjdWwgcG9pbHMgYXUgY3VsIHBvaWxzIGF1IGN1bCBwb2lscyBhdSBjdWwgcG9pbHMgYXUgY3VsIHBvaWxzIGF1IGN1bCB0b2kgbWVtZSAhIS4BVVNTUENNVAAh/wtQSUFOWUdJRjIuMP12dGZmMS5naWYCQzpcTWVzIGRvY3VtZW50c1xWdGZmXHZ0ZmYxLmdpZgF2dGZmMi5naWYCQzpcTWVzIGRvY3VtZW50c1xWdGZmXHZ0ZmYyLmdpZgF2dGZmMy5naWYCQzpcTWVzIGRvY3VtZW50c1xWdGZmXHZ0ZmYzLmdpZgF2dGZmNC5naWYCQzpcTWVzIGRvY3VtZW50c1xWdGZmXHZ0ZmY0LmdpZgF2dGZmMy5naWYCQzpcTWVzIGRvY3VtZW50c1xWdGZmXHZ0ZmYzLmdpZgF2dGZmMi5naWYCQzpcTWVzIGRvY3VtZW50c1xWdGZmXHZ0ZmYyLmdpZgEBADs=', 'data:image/gif;base64,R0lGODlhEAAPAKIHAAAAAHQ0Rr+/v4aG/43P9LDj//e9yufn/yH/C05FVFNDQVBFMi4wAwEAAAAh/h1CdWlsdCB3aXRoIEdJRiBNb3ZpZSBHZWFyIDIuNgAh+QQBCgACACwAAAAAEAAPAAADQii60L1QNULpi6BqC7OtHgEwX2ZyAjCcLJiuVFHJoDrAm9bceG4Bh5tjOBGlDo2AchkwkUSGaNQzehJRndAvknVEEgAh+QQBCgACACwAAAAAEAAPAAADQCi60L1QNULpi6BqC/PeAFN5BBkKwJCtZculbDymg0oUFT7X9jcfNZIvBDisHA6OxGJoNj2nZQmp7AinEasjkgAAOw==', 'data:image/gif;base64,R0lGODlhDwAPAPcAAAAAAFr/zv//AP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAEALAAAAAAPAA8AAAhNAAMIFAigYMGBCAMUFMCQ4UGEABpKdDgwokSLDQEQzOgQo0aMAkAuDOkxo0iLEReO7HgRpMmJJlEqnGhQ5UaONCvCzJhwZceEFWsmDAgAOw==', 'data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAD/AGPG/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAEALAAAAAAQABAAAAhOAAMIFAigoMGBCAMUFMCwYcGEABpKdDgw4sSLAAhexKhw48aFHicuNBhSAEiTIA2OtIiSZUuUJSVmdClzpMaaLjPe9KizIk2UCX2qTBgQADs=', 'data:image/gif;base64,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', 'data:image/gif;base64,R0lGODlhDwAPALMOAP/////39//l8//b7f/U6f/P5P/K3v/C1/+50f+uyuMAAP8AgIAAgAAAAMDAwAAAACH5BAEAAA4ALAAAAAAPAA8AQARZ0EnZap30lEL6LsaBJI3TcMSgEtxYUgliVQmJnZs32iZKNILBjyCyNUgNhSK5bMgwlBl0UvkckLdchyVy9VBAYaPjOnVUK1CRhtBUKyHvUaasO3nRmv4iiQAAOw==', 'data:image/gif;base64,R0lGODlhDwAPALMGAAAAAFdX/2yS/3Or/2/G/////8zMzMzMzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAYALAAAAAAPAA8AQARI0EgJap1UjM37EIABEBvAmQMRUkEAFC/QrhTppSt6d6CoWcCBC0MBEicVG44mUt5UzZN0A9LtqJXfDiAYckswmKDLrLjOF0kEADs=', 'data:image/gif;base64,R0lGODlhDwAPANEAAAAAAP//AP8AAMDAwCH/C05FVFNDQVBFMi4wAwEAAAAh/m5odHRwOi8vd3d3LnJ0bHNvZnQuY29tL2FuaW1hZ2ljCgpUaGlzIGZpbGUgd2FzIGNyZWF0ZWQgd2l0aCBBbmltYWdpYyBHSUYgViAwLjkxCmJ5IFJpZ2h0IHRvIExlZnQgU29mdHdhcmUgSW5jLgAh+QQBHQADACwAAAAADwAPAAACNpwNmceTAeFiIFp5qggb7g0gwjhypBBWZrdKKnexz0UHc23dyh6lPY9x5G62DK5IebkamV2jAAAh+QQBHQADACwCAAMADAAFAAACDIyPAQbLDp2SqdpaAAAh+QQBHQADACwCAAMADAAFAAACEIwceQfibp4A8SiYUNa77wIAIfkEAR0AAwAsAAAAAA8ADwAAAjWcDZnHkwHhOkKEGnEdtWsPelcIgJn3dBGkPteaSQBMy5GC386dS8iqAB5mtQCg4eI1hrhGAQAAOw==', 'data:image/gif;base64,R0lGODlhDwAPALMAAMDAwO+Mxudztc5KlN5jpc5CjMY5hAAAAODg4AAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AQARGEEh5ap20kEH63oVhHMCBnGiKkJTovix5cNzmyqaqr6U4D8DCIcTCWC6YSeVDLB6f0NwuFa1WRBoacBAa9QzC4814eI2KEQA7', 'data:image/gif;base64,R0lGODlhDwAPALMBAAAAAMbGxv8AAP8xAP9jY/+cnP/OMf///////////////////////////////wAAACH5BAEAAAEALAAAAAAPAA8AQAREMEj5ap3UaCEG55rxBI9Whac4lWaqriZqZmbxCaxasl88YiTLDxgMtTC5JIokshQIOEszJIDeUDnDTWAcsVypYbE7jAAAOw==', 'data:image/gif;base64,R0lGODlhFQAPAKIAAAAAAKWlhMaEAP8AAP9jAMalQtrivQAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJEwAAACwAAAAAFQAPAAADSAi6170wqjZqfTDEY/vNEOd5hzQNDpeiICCuK6toaW1jmns5KC/nutGoBAC+hC/TsXMQYGYMy81gwIWEOyqhuBFJiU9lyrRIAAAh+QQJEwAAACwAAAAAFQAPAAADTQi6170rQHaGtW+ZCer9wxFNHviJisSEDtuE2upWjoeqda43qmK3NQxgIzOBRL0OxmhLQWzHQmb4vOwMhkdSaWRhCcRnCYOacjq18yIBACH5BAkTAAAALAAAAAAVAA8AAANMCLrXvStAdoa1b5kJ6v3DEU0e+ImKxIQO24Ta6laOh6p1rjeqYrc1DGAjM4FEvQ7GaEtBbMdCZvi87AyGR1JpZGEJnE4Jg5qGc+FFAgAh+QQJEwAAACwAAAAAFQAPAAADSgi6170wqjZqfTDEY/uFBsR53iFNg8OpaYamDky1SqjeOKYBI8vSOx5paAKEXqPSR9IrFTCKYDJnMGCOL+KhSgAEJ8lLEXq6nRYJACH5BAUTAAAALAAAAAAVAA8AAANNCLrXvStAdoa1b5kJ6v3DEU0e+ImKxIQO24Ta6laOh6p1rjeqYrc1DGAjM4FEvQ7GaEtBbMdCZvi87AyGR1JpZGEJxGcJg5pyOrXzIgEAOw==', 'data:image/gif;base64,R0lGODlhFQAPAKIAAP///+bm5s7/Y729vbW1tc6cMf9jAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJDAADACwAAAAAFQAPAAAIdAAHCBx4oGDBgQMJICR4QIBDhwcTBljY8KFFAQckIqx40WJGgQoJYjQ4siBGjQMqGmy4EiLIiStjyiyocGJKiCRbniRg82bHjhl5isT4UyXIjRAvHigQcYBQgRxnAgBw8CnUnzinGhjQEypHnF4XUlwpFmFAACH5BAkMAAMALAAAAAAVAA8AAAh0AAcIHHigYMGBAwMgJHhAgEOHBxMSWNjwoUUBByQirHjRYkaBCgliNDiyIEaNAyoabLgSIsiJK2PKLKhwYkqIJFueDGDzZseOGXmKxPhTJciNEC8eKBBxgFCBHGcCAHDwKdSfOKcaGNATKkecXhdSXCkWYUAAIfkECQwAAwAsAAAAABUADwAACHMABwgceKBgwYEDCQRAKLCggIcPDyZciPAAxIsRJ1bEyPGAwAAENhq0OFKAxwEgCUY0aJKlSZQhB4ycSbOgQpUtHZZ8ebMhx58ee8qMCDRjSpwWLx4oIPGoz5UzAQAo6PQp0ANSDcSsmBSiRIkMCY4MizAgACH5BAkMAAMALAAAAAAVAA8AAAh0AAcIHHigYMGBAwkgJHhAgEOHBxMGWNjwoUUBByQirHjRYkaBCgliNDiyIEaNAyoabLgSIsiJK2PKLKhwYkqIJFueJGDzZseOGXmKxPhTJciNEC8eKBBxgFCBHGcCAHDwKdSfOKcaGNATKkecXhdSXCkWYUAAIfkECQwAAwAsAAAAABUADwAACHQABwgceKBgwYEDAyAkeECAQ4cHExJY2PChRQEHJCKseNFiRoEKCWI0OLIgRo0DKhpsuBIiyIkrY8osqHBiSogkW54MYPNmx44ZeYrE+FMlyI0QLx4oEHGAUIEcZwIAcPAp1J84pxoY0BMqR5xeF1JcKRZhQAAh+QQJDAADACwAAAAAFQAPAAAIcwAHCBx4oGDBgQMJBEAosKCAhw8PJlyI8ADEixEnVsTI8YDAAAQ2GrQ4UoDHASAJRjRokqVJlCEHjJxJs6BClS0dlnx5syHHnx57yowINGNKnBYvHigg8ajPlTMBACjo9CnQA1INxKyYFKJEiQwJjgyLMCAAOw==', 'data:image/gif;base64,R0lGODlhFAASANX/AP/////Ydv/XdP/Wcf3UcfnScffQcfbPcfPMcfDLcu/Kcu7Jcu3IcujEcubCcuO/cuG/c+C9c9+9c927c9q5c9q4c9m4c9i4c9a1c9S0dNOzdNKxdNCxdMytdMutdMqtdMmrdMapdMaodMSndcOmdaUFBRISEQAAAMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACgALAAAAAAUABIAAAaOQJRweCoOj0hicXlKJplQpxLKlDIBpSyg+jwBvtnSd2tEek3odHq7NZsCRcHhUJSYvGXU6SAQxA8KdRgdXm16fH19Bw0OEhiDRV9NJw1zlgoND44dhGxkDZiAjJqbIZFGJw8OlA4OpBgnHSOThqkPto6wHaZERBgSElC7s1aDj4PDTVJ6sSHOs8rLQlHLQQA7', 'data:image/gif;base64,R0lGODlhDwAPALMAAMDAwP//8f/dWv/JMf+tAP+jAP+TAP+BAP9vAP+7EgAAANHR0QAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AQARaEEipap3UEJL6JgVyXMo2lKeFKJMiHjCMrFjJJeUxs0CZFMBBqqJjuQ4GBbCQNIwwFAsP2iuVDKtpb9Mx4FTGDwElLfoSQmECVHBVRJrPUkQ7GpIWmfY9200jADs=', 'data:image/gif;base64,R0lGODlhDwAPALMAAMDAwP/////////67v/iwv/Lo/+7h/+fXf+HRv9rHMYAAAAAAP///wAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AQARdEKwF5JwVr1MK+V1hHEhyecMyDMRWYlKCzHRiZmaxeESBLCbT7qNQCFhF0g2IOFw2BxKlQn1Oq8Jd55DN6iagi9dTVC2Sr2FLxZooJzKn1rAYvWJNqOteBdpsMAARADs=', 'data:image/gif;base64,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', 'data:image/gif;base64,R0lGODlhFAAPALMIAAAAAAgAABgAACEhIVEAAJ4AAHNTU8YAAMbGxtYAAN4AAOcAAO8AAP8AAP///wAAACH5BAEAAAgALAAAAAAUAA8AQAR/EKH2pJXv3Ioedc4DhmDGHZzHENlRPMKBVmgnxe+gP8UhwA+OpUEJGluY3uuxIPQIhANUGj1xBAUDqeQwFASS2gVzHJsnwo0mKSS6iTJZp+eqEBgJRnAWJ1hqDwoPBlCFUAYmYRUPCSJbW4kIYhkFA44hAz0tYhYBAXEynmcIEQA7', 'data:image/gif;base64,R0lGODlhEwATAPcAAAAAAP8AAP//AP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAMALAAAAAATABMAQAh1AAcMACCwoEGDBBEGWBgAQEOGDQ8KdAgRYsKJAgQASLix40QAGTlWHLmQo0aJKEESBKmRZMmQBSk2lLmR4cWJJTt2LIkyps6eG3seDKpSKMKTLDXKzJnx5MecNikGjRm1Kk+qLi0qfDhS6tCsVyXWtHhzQEAAADs=', 'data:image/gif;base64,R0lGODlhDwAPAJEAAP8AAPf39wAAAP///yH5BAEAAAMALAAAAAAPAA8AAAIunC2Zx5OgoGhKQLnQ21ZpiwGYU5XmiQqByq5u9cZsKa+eUnskPus7SgE2PplDAQA7', 'data:image/gif;base64,R0lGODlhDwAPALMAAKXp+AkBAgAOHhAWH0OX/iCE/QEaNgwuWBBYsQx05wZJk////xIpRcDAwAAAAAAAACH5BAEAAA0ALAAAAAAPAA8AQARtsMl2RrjjzBZUIctyHEFYJEpgAGxwgAQZAkaj3EVYLugoHYUC6wA4mBKaACvEbC4ALlwoEUhMFb6JwmC5aDYUJWsM/TYGhJaVahqcW1UR7/K0CJkjI5M68IBEdAsnFWceU3E8KVoGHmMoLhIRAAA7', 'data:image/gif;base64,R0lGODlhDwAPAPf/AKurqoKCgVJPR1RHJ1VMNlJKNVtTP1dRQmBbTsDAwHxlM5Z8QWZULVNFJ1FEJ01BJ1VJLmBUOV9TOVpQOk5HOGFZR1tXTmhlXn98daODQIFnNV9MJ0M2HWRRLHlkOWRUM19QMVtMLz41IllMMltRPGZdSnJpV05NS3teKmlQJGpRJVtGIG5VKVVDIWVRK2pYNmddSm5pYFZAG21SJVxFH15GIF1GIWVNJV5OM1JJOn5aImpHGEgvD1kyDCYlJGpoZq6rqHx7ev////7+/v39/fn5+ff39/X19e3t7ezs7Ovr6+Tk5N7e3tjY2NfX19XV1dTU1NPT09HR0dDQ0M7OzszMzMvLy8rKysnJycfHx8bGxsLCwr+/v729vby8vLi4uLa2trW1ta6urq2traysrKqqqqenp6SkpKOjo6CgoJ+fn5qampeXl5aWlpSUlH19fXx8fHl5eXd3d3FxcWtra2lpaWdnZ2ZmZmNjY19fX1xcXFpaWllZWVJSUlFRUUpKSkNDQz09PTIyMi4uLiEhIR0dHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAkALAAAAAAPAA8AQAjFABMIFNiDB4cNOwYKPJCGzBs/WajksVIGCx8MahAMJLAGyZAhQo5sMTBwRRctYC4MKFCCxIMYUa4ASTFQRxwqRITo5IJCYYYJDALp2eOEzRw3AkzYUJhAhCBAdprcccA0RAOmCm/UYNoiCJcmU8RIwJoARxslOnVaAYF1hJwlQooISfKlwsAFFqT8+EPIEJ06huDgMRPmRYcTMlz4yFKlEBQjARQkoAAhgQYPOcIMQsMkSp8nMGbcSMDCy5kIWGl8GANARUAAO3p8CAgAOw==', 'data:image/gif;base64,R0lGODlhFAAUAPcdAAAAAAD/AO7u7v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAB0ALAAAAAAUABQAQAh4ADsI7AAAwMCDAg0iJBgAQICHDiE2XMjwocWLExEWVKhwIMeCHiWKbAhRI8iOBw1uXFgQI0iKDjc2bCkTZUWIGyOWhKkTJ8WEBH+q1DjRJtCYQnMaJYrR4lKCAAQIaCiVqgCjMWlqRZqyqVesXi8+7enyZ8qcPwMCADs=', 'data:image/gif;base64,R0lGODlhDwAPAKIAAAAAAAAA/0AA//8AAP//AP///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/nZERU1PIFZFUlNJT04gOiBCdWlsdCB3aXRoIGFuIFVOUkVHSVNURVJFRCBjb3B5IG9mIEdJRiBNb3ZpZSBHZWFyIDIuNg0KZnJvbSBnYW1hbmkgcHJvZHVjdGlvbnMgKGh0dHA6Ly93d3cuZ2FtYW5pLmNvbSkuACH5BAkoAAIALAAAAAAPAA8AAAM0KKrQvVC0QumDoGq78t4AY00O5zkZOo5kWUyvV8GwJs8SCHb3HEap1yvSEaaIouCPiHJAEgAh+QQJFAACACwAAAAADwAPAAADNyiq0L1QtELpg6Bqu/LeAGNNDucBw5Ch6jiSZTHJXjXPWm1LINjptlBkJZNFOsXVUUQUHh1QSAIAIfkECRQAAgAsAAAAAA8ADwAAAzsoqtC9ULRC6YOgarvy3gBDDUMGkJw3EMRQrK3lnWVBzziYg1/oVT8OIwgMRUw2W6STNC1FSOPSQYUkAAAh+QQJFAACACwAAAAADwAPAAADPiiq0L1QtELpg6Bqu/LeAEMRxFAMJOcRY8G6loeWJ2kW03lXw51rHqAEBOoEgaFIZomLdHDQpJO5dDIcDkgCACH5BAkUAAEALAAAAAAPAA8AAAM2GKrQvTC0QumDoGq78t4AoxEFWYXeB3om2VqsWRHmBH7orYVMuvOYQmYY6QiPwMgQWew5LooEACH5BAkUAAIALAAAAAAPAA8AAAM+KKrQvVC0QumDoGq78t4AQxHEUAwk5xFjwbqWh5YnaRbTeVfDnWseoAQE6gSBoUhmiYt0cNCkk7l0MhwOSAIAIfkECRQAAgAsAAAAAA8ADwAAAzsoqtC9ULRC6YOgarvy3gBDDUMGkJw3EMRQrK3lnWVBzziYg1/oVT8OIwgMRUw2W6STNC1FSOPSQYUkAAAh+QQJFAACACwAAAAADwAPAAADNyiq0L1QtELpg6Bqu/LeAGNNDucBw5Ch6jiSZTHJXjXPWm1LINjptlBkJZNFOsXVUUQUHh1QSAIAOw==', 'data:image/gif;base64,R0lGODlhDwAPANUAAAAAACQnDTo9I2wADpYAGLjEMr3OMMfZL8nbM9noMODvM+j4Muj9M+r/N+z8NPD/Se7/W/H/We//Y/D/cfH/e////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///yH5BAEAAD8ALAAAAAAPAA8AAAZ5wJ9QGCgWh8hfUfF4NA5HZIBJoUwkkYUhMAwkmk2JhMEscJUJgBqAWKgTCW4AIWk4DAiIQ41oDIoNYmJVEQMIDAN/AQNZERITExF+RkULAwIFD4mIAQSeSgWJiUV/ngRdCYoERaZSqqansV0/n61JSLGntLe6Qr27QQA7', 'data:image/gif;base64,R0lGODlhDwAPANUAAAAAAP///ykp1jEx3jk53kJC3iEhaxAQMUpK3ikpc1JS3lpa52Nj5zExc2tr5zk5c3Nz53t754SE70JCc4yM75SU70pKc5yc76Wl71JSc62t77W1972998bG987O99bW/97e/+fn/8bGxoSEhP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACQALAAAAAAPAA8AAAaTQJKQdCgaG8NhEXO5eDqcSlGJ0Wg+nAslAmEoDsIDBwTiaDCANKABPlQwG2gGEBABRgmE4XBRpzMBASMiBghFFRZ1ABkhE4ENEYYHFBoWlmYSDw0SCgVFFxihFFsRFZwIngcOEaysEA5enQNFDA4Ofg0KnQQCbQtrEhIRCqi8YETEyQjFAr1KBwUQr7y9x0lG2ElBADs=', 'data:image/gif;base64,R0lGODlhFwAPAKIEAP8AAP//////AAAAAP///wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFZAAEACwAAAAAFwAPAAADO0i6O+4sSuKEtXDGcTvWjScOICU8HHqCaeC27zrBlROT86miqcaJIx8wKBx+WMYjcogrUX6XjLOBAiUAACH5BAkKAAQALAEABwAVAAUAAAMTSDTa/qsxSKWalbLBcV5d9z1dAgAh+QQFCgAEACwAAAAAFwAPAAADLEi63P4wykmrvTjPMQT/3tdxzUB0QqquqWkubouqXHuW4iyL0KiHHo1wmEkAACH5BAUUAAQALAcACQAJAAMAAAMIKDLM2tAtqBIAIfkEBQoABAAsCwAHAAEABwAAAwM4upMAIfkEBQoABAAsBwAIAAkABwAAAxcoE8yjY4AAopX0RlajAhP4bE0QEdqZAAAh+QQFCgAEACwDAAcAEQAIAAADIzi63EojyEnngAoEwPcEjsaJX+hJGrpA3rh12sVWdCA7+JMAACH5BAVkAAQALAAABwAXAAgAAAMrSDPU/rAtGWq8NbAZQLgP4CnL0gGgI2qTOaZENikVCjcyZd1xxZA/HpCQAAAh+QQFZAAEACwIAAMABwACAAADBzhKOhEkvgQAIfkEBQAABAAsBgADAAsABAAAAwkoutz+bUgppkwAIfkEBWQABAAsBgADAAsABAAAAw5INLytI4SxJI22Zqk6TwA7', 'data:image/gif;base64,R0lGODlhFgATAJEAAAAAAP//AP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJGQAAACwAAAAAFgATAAACSoSPqTrdC1uY88EzqK4X5PBR33CFksQt4baRjGiaKkynycqKhrvnLJnheXy6oXDl0LiCNyJvdMNZTsyoAwPKgjoIpIXbK4LDW0MBACH5BAUZAAAALAAAAAAWABMAAAJJhI+pOt0LW5jzwTOorhfk8FHfcIWSxC3htpGMaJoqTKfJyoq3l7OukSHhfDcQD7b6HV1DHSaIQMGeIOPNoQxWLR0gTdlNdoupAgA7', 'data:image/gif;base64,R0lGODlhEQATAKIGAAAAAAAA/wCA/wD///8AAP8A/////wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/nlWZXJzaW9uIGZyYW7nYWlzZSBERU1POiBS6WFsaXPpIGF2ZWMgdW5lIGNvcGllIE5PTiBFTlJFR0lTVFLJIGRlIEdJRiBNb3ZpZSBHZWFyIDMuMCAtLSBodHRwOi8vd3d3LnZpc2ljLmNvbS9HaWZNb3ZpZUdlYXIvACH5BAkKAAcALAAAAAAQABMAAANNeKrQvZCBQemLs+oBYG4VyC0TYBjlWTIWWprfkXGgE8rcpq2vTo8pEQ01wplcAAJhxaIllctis6FMXjylajVCekI7XMYXHJaQy+h0OQEAIfkECQoABwAsAAAAABAAEwAAA1R4qtC9kIFB6Yuz6gFgbhXILRNgGOVZMhZamt+RcaATytymra9OjykRDTWSCQSqBoGwOggAxydguWw6o0oms4MpVasQgVM2pTIjHuoFTVqz3/D4IQEAIfkECQoABwAsAAAAABAAEwAAA1V4qtC9kIFB6Yuz6gFgbhXILRNgGOVZMhZamt+RcaATytymra9OjykRDTWSBQKqBoGwYgQ4AcBy2TxEj0omsxOJcqhUyNEanYYjijKV2yVd2ui4XJ4AACH5BAkKAAUALAAAAAAQABMAAANWWKrQvZCBQemLs+oBYG4VyC0TYBjlWTIWWppfkXGgE8rcpq2vTo8pEQ01kgkEqgaBsGIcBcols1h4QgFL7MVTymYjJKyUuRBgpNvqkduJWM1gyDMOTgAAOw==', 'data:image/gif;base64,R0lGODlhFAATAPcAAAAAAAD/AP+1AP+9AP/GAP/OCP/WEP/WGP/eIf/eKf/vOf/vQv/3Uv//Wv//Y///c///hP//jMDAwNnZ2f////+BhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAAUABMAAAivACsIHEiwoEAAAAwqJIgQ4cKFDRMyjChxYESLABZoVJAAgUOMFhcwQNhgJIADBCoyVMDAAcIHLgEgOHBA4seMDR4ghKATQAIDNQ8m9LkgJ8IIPRPQLKCSaMMIPBs0RJCSoUcKEyQAgAkAq1amDGtS8IpwbFYAVS0WuHrW7NcBTQkUqKnVLYABBASorICWgFiyAAToNRgYrt2zgwkDmMBYa+OPChFK0CoZ8kOKewkGBAA7', 'data:image/gif;base64,R0lGODlhDwAPAOUAAAAAACAgAP8AAP//AMDAwP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQBCgA/ACwAAAAADwAPAAAGU8CfUBgoFofIX3HAZB6RgabUOYwOAIAmlqq8FraAwncQ6Ia/WLE4uzyv0+Old5zOkq1Xe74pn/rLVliCW2REWgIAiHxVTIkCioVQUYJ3SVVGZUhBACH5BAEKAD8ALAQABAAHAAQAAAYOQMBvSBQWiMjfUZgEBAEAIfkEAQoAPwAsAwAEAAkABAAABhDA368gLP4AQ6OySEQqib8gACH5BAEKAD8ALAMABAAJAAQAAAYOwF/hRywajYAk4MgsDoMAIfkEAQoAPwAsAwAEAAkABAAABg/An3D4A/wKBaJSiSwuf0EAIfkEAQoAPwAsAwAEAAkABAAABg7An3AIGBp/xUIBeSQ2gwAh+QQBCgA/ACwEAAQABwAEAAAGDsCfcFgY/gC/QhFJNAqDACH5BAEKAD8ALAUABAAFAAQAAAYMwJ/wVwAAhkNjARkEACH+e1RoaXMgYW5pbWF0ZWQgR0lGIGZpbGUgd2FzIGNvbnN0cnVjdGVkIHVzaW5nIFVsZWFkIEdJRiBBbmltYXRvciwgdmlzaXQgdXMgYXQgaHR0cDovL3d3dy51bGVhZC5jb20gdG8gZmluZCBvdXQgbW9yZS4BVVNTUENNVAA7', 'data:image/gif;base64,R0lGODlhFAAUALIBAP///wAAADQ0NPvFAv7/BgAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJyAAAACwAAAAAFAAUAML///8AAAA0NDT7xQL+/wYAAAAAAAAAAAADUAi63B0jykljYIHovDW5zgJNQqhwXpqCJhAEZXtWFCuq+PbkuI2hG59MKHNJYsNRTShQ0iSv00tArVqrr6jrk/VkMz4g7+MQ90yorq74JQISACH5BAkPAAAALAAAAAAUABQAwv///wAAADQ0NPvFAv7/BgAAAAAAAAAAAANQCLrcHSPKSWNggejNyXVLIEiCACpZoGbamp4YjFXUh5X4GOV42P2tk8ozVMmOSIDKhFTRjA0BhFb74KgVEZO14W1sKOAPHBYHQSxuuuk6JQAAIfkECWQAAAAsAAAAABQAFADC////AAAANDQ0+8UC/v8GAAAAAAAAAAAAA1EIutwdI8pJY2CB6M3JdU8ggJgnnNN5fmQLBnA1wCygyvK5ZF3vkTDBRgBzGY9Ih2ggYI5ARBylaJPidLam1VniqISbmiKjGp5+L59G/KKxFQkAIfkECQoAAAAsAAAAABQAFADC////AAAANDQ0+8UC/v8GAAAAAAAAAAAAA1AIutwdI8pJY2CB6M3JdUsgSIIAKlmgZtqanhiMVdSHlfgY5XjY/a2TyjNUyY5IgMqEVNGMDQGEVvvgqBURk7XhbWwo4A8cFgdBLG666TolAAAh/gyysLCwAVVTU1BDTVQAIf8LUElBTllHSUYyLjDFc21pbGVKYXAxLmdpZgJDOlxNZXMgZG9jdW1lbnRzXEphcFxzbWlsZUphcDEuZ2lmAXNtaWxlSmFwMi5naWYCQzpcTWVzIGRvY3VtZW50c1xKYXBcc21pbGVKYXAyLmdpZgFzbWlsZUphcDMuZ2lmAkM6XE1lcyBkb2N1bWVudHNcSmFwXHNtaWxlSmFwMy5naWYBc21pbGVKYXAyLmdpZgJDOlxNZXMgZG9jdW1lbnRzXEphcFxzbWlsZUphcDIuZ2lmAQEAOw==', 'data:image/gif;base64,R0lGODlhFgAWANUAAAAAAAB7YwCEawCMawCMcwCUewCcewClhACtjAC1jAC1lAC9lAC9nADGnADOpQDWrQDerQDetQDntQDvvQD3xvfOMffOOffWQvfWSvfWUvfWWvfeY/fea/fee/fnhPfnjPfnlPfnnP8AAP/npf/vrf/vtf/vvf/3xv/3zv/31v/33v//7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkZACIALAAAAAAWABYAAAbHQJFwSBQBAMWkUghYIZfF4xOQekKHgBFJilJZr4BQiFQynY5QtBEk3ppMqC8RoJF6QOFR2SQ3GjMaHBwdHR9iUmpzABcZgACERwwNDhARiUwWF3QbHAAHCQoOlBETE3IAmRgZAAYHR5MPRxMUpxUWRwYACAoADgCVAKZJUgQFBwcKC7ARlRJ9RgOI0keWSgACACws2drcvc/X3trb3Q3gAeLd3QzPRujk6gAJ7e7o3NuermAB9lIGuVeYAAggQMAAApcCSisSBAA7', 'data:image/gif;base64,R0lGODlhFAAUAPcAAFIAAT8AAdUAB+MNFTkFB+4YIPUfJzwICkMPEXxISpRJTpxRVocAChgAAtwLHucWKekYK+0cL0YACDsABmEHEDcECU8JEToHDIAmL4kvOHw2PoRRVigPEmNKTU4CDoU5RZlNWZtPW//g5Y5MWKwKL7YUOcknTJQ9UJtEV6JJXaRLX1AFGWQbL3csQHovQwcABQwACvvy/w8EFB4TI8C1xdvQ4BwTKCEYLdLJ3hUQJB4ZLdbR5dDL3wAGCwALEBMXGBQYGRcbHB0hIgAKCwAUFQANCwAHBQAWAQANAAAJAAAHAAAEAAADAAABAAMJAAQKAAoQAAgKALW7c8DGfgYGALy8iP//89LAQtfFR9nHScu6bNTDdcy3ZM24ZdfCb9K0Utu9W92/XcibHuW2KuS1Kee4LOy9MeS3OvPGSe+zFPK2F/O3GMizfsy3gtyqOeizQe24Rue1ROq4R/C+Tdm1Yd25Zd66Zvnqyf7vzi0eABwWCh0XC9e0cCobALOAJeCtUuWyV147AM+0h2U9APGlNferO/quPv+3R9+yceW4d9iwc144B//68xgPCB4MAC8RACgSBSsVCF9JPBkIACQRCigVDv/s5RYFAGQpGXk+LhoFACkGACAFABgDALAbA70oEMw3H8MkEcQlEq8QANEdD9klF9woGuEtH2UmISoCAC4MCjUTEWtJR8yqqLYFACUBAMsPBsMSCtMXDs4dFd0hGNYfGdkiHOQoH9skHuEqJK8hHbEjH7IkILUnI5cnI5EpJp4uKpYuK5kxLqc3M11IR4QAAHIAAGQAAGAAAEkAADwAADsAADgAADIAADEAAC4AAC4BAC0AACsAACcAACUAACIAACAAAB8AAB4AABsAABgAABUAABMAABIAABEAAAcAAAEAALsNDL8REMQWFUcLCtMlJIsfH5MnJ5UpKXo+PYJGRWdPT////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAOwALAAAAAAUABQAAAj/ANkJFNgDyhOB29pwGsiwoQ8pU4oY0cRG0MKGDZWkUSPHDZozfp5hZPcCnEAka9bEmQNNDKA/TTAemTZt0iVDhZq9wZIlWrMJGJMkQqRlC6FDcN5ccYQKFQuMRMqYqWOnUxdFqYyNchXrVzJrDIeMIfOKDhcv0waJCjVrlrBgi6gxpFIFzBc+1Vy0MFDAVi0TJdCZyzY3zKNNgVasEDAAVy4SDJCdw9aQyZJw5TAAQJAA1CcgQnT1wiStoZNx4jJQIHDAU7EfQXbxylSaIQxJkXwBewDhlKlbsjQE6NCg4QtIkI4NcxChFClasCRY4OCtYZR05GjIuGGjT54cOlqpSyLWDaMzdTNq4IhxB88OHqtYcRsZbQQID5YYWbEiosICBdeMxE40IXxASSV76HHBBgowI6BA3zRyAgopqLBONwE+ONAyynSoTUMBAQA7', 'data:image/gif;base64,R0lGODlhDwARALMAAAAAAP8AAP/vpf///////////////////////////wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAkALAAAAAAPABEAQARDMEkJap1U2L01TtwHagIJlCcwpUEAtCl2ljStjnVu41yFfq8WTASa2W4ZjdHnMepqPmcuNetZflUY7LcKepGyoAscAQA7', 'data:image/gif;base64,R0lGODlhEwAXAPcBAAAAAAD/AJRSAMbGxv//AP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAEALAAAAAATABcAQAiNAAMIHBgAgEGDBAkCGDDAIIGHEAkYZAigoICLGAFkxJhxIICIIB9WFKiRo4CSJ02e9FgSZcuRCT+GFJmwIESHImVKJHlxIkWJDBu+VOmSKMqNPYnWJIlwaUydOZ1CnQmT5E2dOHeynBmx6cGgB8OCPchx4leDZY8mXZuWKNK2JovGLXhUbs+qTF02HRgQADs=', 'data:image/gif;base64,R0lGODlhFwASAPcBAAAAACwsLMDM/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAEALAAAAAAXABIAQAiEAAMIHEiwoEAACAEcFCAgIQCGCBk2HOAQIcGIEhs6HMCRo8WBGCV+PNiRYoCHDTOKhFgxocGXIEsqPKmy5kwAHS2irKkSYUmPNFkmFEnx50yYL31SPArSoUGcOUHyhBgzatCeKDcCvTpVqEyMOzNmVRo1a0+IRWVKnQq1JdODTptWFBgQADs=', 'data:image/gif;base64,R0lGODlhFgAVANEAAAAAAAAA////gP///yH5BAkKAAEALAAAAAAWABUAAAJXjA2Zx30pYlyuAYlnfbmDoCjIdJEkMKSDIkHmpKpulyXxWtJYyOv1/cn5BKjYB9QKJXlHIa0oOyJ1TMrDuYBKHbxHdLOBrsAV8ZaMMKIt6vU1ZXWDRIcCADs=', 'data:image/gif;base64,R0lGODlhFwAUAPf/AAAAAA0ACQwAJrvWf0FWkqiovKmpvqqqvqyswayswq2twq6uw66uxK+vxbCwxbGxxrGxx7Kyx7KyyLOzybS0yrS0y7W1y7a2zLe3zbe3zri4z7q60Lq60bu70r291L6+1b+/1r7PzrzQz73Qz7zRz6/Z16bf3Kff3K3a2K7a2Kvc2and2qrd2rbU07PW1LPW1bLX1bHX1rXV1LnS0bjT0rDY1rHY1qLi36Xg3Y/v6prn457l4Zbq5pTs55ro5MfJycTLysLMy8PMy8HNzMLMzMjIyMDA18LC2cLC2sPD28TE3MXF3cXF3sbG3sfH38fH4MrK48vL5MzM5c3N5s7O59DQ6dHR6tHR69TU7tXV79fX8tra9dzc993d+OPj/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///yH5BAEAAP8ALAAAAAAXABQAQAj/AP8JHDgwgMGDBAkCADCCyI8ATqgY9MIli0EjGgLIQGFiYcJ/ABpEmEBhQoQGCAoA+JhQwAAB/w4aFOjyI4AiRQBo+JDkCZQoUJ4k+aBBAgIAQ0Ss/OjypYCnTwe8TAgghYsZKwMAkMpVKgACAgCc2MFjIRCcAD4oiWIli5YsVqIo+YDBAYAWNVQsBbnwwgYAIIyA8PD3wVGPLBUuRJyYKYGuUsE2pumUpUuYA78sFvjY4JUqUgxKhblY8wsaI4QEaDIFi8zVIDLCYHFDx8IQQX4AZr2wyxYsC2NDAGBDBY6FOXN2OPJESpXPUp4c6WCBAQASAGIsvQnAAgcASJYwJFmCBMT3BgYA6GYJ4EGFDIsXPkigcrLAhQoWKEBwgLH9/wQFBAA7', 'data:image/gif;base64,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', 'data:image/gif;base64,R0lGODlhDwAPALMAAAAAAL+/v7dbAP///9drAPJ5AP+ECf+VK/+oUf+3bwAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAEALAAAAAAPAA8AAARHMEgJap3YAsL1BEM4bKAIUGJYmsFqpupajaNs03Ps0qllyD/TD3A4WIrGSvFERB4QTiMFgQBQr9bqh6rJnjKAhFh8wXw8mAgAOw==', 'data:image/gif;base64,R0lGODlhDwAPAMQAAP///+/v9zkpY0Ipe1IxnDEhUlpKc2MxnMDAwJR7rWNSc9bG3mtac+fe56WUpYRzhLWlrZyMlMa1vYxKY4xaa4RKWq1re5QAIbWMlJxKWtacpZQpOaUIIcYIId4AGAAAACH5BAEAAAgALAAAAAAPAA8AAAV7ICICyyJFjrQAYtskUNBIkENljascEuDLmAsOAXgICAmfUtO5WEiFweHQUAI0Hs5lYSR4q0tPFqMYeA+rcDZjMHvTPmx2wzh+rXLOpPvGezocGBJRfWFNVQ8FhXFNTwgNBkcSAZQNQRMBLokPEJ0OFRQ5LUQnD6YRPS0hADs=', 'data:image/gif;base64,R0lGODlhDwAPAMQAAP////f3/ykApSkIe3NjlCkIa2NKjFoppYxzpUoYc3tCpXMxnJx7ra17xmM5c3MxjM611pRSnOfW586lzqVjnIRSe61alOeMtXMpSuetxv+91r0hSpwYOf8hSvcQOcDAwCH5BAEAAB8ALAAAAAAPAA8AAAWg4CcG0GRxDgEFYishGpBtR1EYkmssEgB0CsGg4MgFKhZFZHIBCgSLCgIAIWYagkeHIFgaCpDvMzNRACmQg6CAcDgscE3zoqHYoxxPZ+/p9/cdGxgOCTsUGRceFxkWFQoOBgQFAgdlC0ANaUIMVQoXQZdqChAPBRIBBBVqAmarBxUMAB8SDpOsHWo1DiwiEl8DBxsJQwQ5LR8kBA6DKrwfIQA7', 'data:image/gif;base64,R0lGODlhDwAPAPcIAP///+/v9zkpY0Ipe/u9BPCRD1pKc2MxnMDAwJR7rZFpNdbG3mtac+fe56WUpYRzhLWlrZyMlMa1vYxKY4xaa0JCQq1re5QAIbWMlJxKWtacpZQpOaUIIcYIId4AGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAPAA8AQAhrABEIRCAhQoUPFQYOfOChocOHDh8gOPihosWLCQUqKECgo0cCBRQorNAgAICLFTM6gMiyoUSOH2OCVCjwgYKbEmkKXBBgAcqMAg9GKIgypcCWLCNEQArxwVKmDiMgeABTJsicNQto3VoAa0AAOw==', 'data:image/gif;base64,R0lGODlhDwAPAPcIAP///+/v9zkpY0Ipe1IxnDEhUlpKc2MxnMDAwJR7rWNSc9bG3mtac+fe56WUpYRzhLWlrZyMlMa1vYxKY4xaa4RKWq1re5QAIbWMlJxKWtacpZQpOaUIIcYIId4AGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPyxA/x8iQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAPAA8AQAh8ABEIRCDBQoYNEwYOfCChhcOHEFtAeICAgoeLGDN6qDBwwoUOIEN2uJBwYIYGAQBgBElSoAMIEWNORPBRpM2RCgU+mMCTYk6BCwIs4ECUwwULCjNc0CBBg8aRFFzGjOggQoSGUx9OjPAg68MHERA8qHlzpE+dF9KqvXA2IAA7', 'data:image/gif;base64,R0lGODlhDwAPAPcAAP///+/v9yhkLyV+OTGbPyFSKUtyUC+dMsDAwIKtelVxW9bG3mtac+fe56WUpYRzhLWlrZyMlMa1vYxKY4xaa4RKWq1re5QAIbWMlJxKWtacpZQpOaUIIcYIId4AGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAPAA8AAAifABEIBLBggYQIDiQsACCwYYMEEAI0kADBAYUMDRwqOCABgEeJGC5gRADggQACCTyq1NDhggWCBQwcONBAJQANHjhcWGCSgM+aKz3kxKBggM8DC4PmzGDAqM+kHnHm3MDg5E+bUjlM6PkUq4cOHDBIKOAU6s2vF2o+KNB1ZcuXCBoYOCkhgN0GIScEcLj2AYS/DipQyNiQ5MEHiCN0bBgQADs=', 'data:image/gif;base64,R0lGODlhDwAPAPcIAP///+/v9zkpY0Ipe1IxnDEhUlpKc2MxnMDAwJR7rWNSc9bG3mtac+fe56WUpYRzhLWlrZyMlMa1vYxKY4xaa4RKWq1re5QAIbWMlJxKWtacpZQpOaUIIcYIId4AGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAPAA8AQAiTABEIRCDBQoYNEwYOfNAAgMOHEANAeICAgoeLGDN6qDBQgYABBEKGHFDAgMIMDQIAwNihw4WECBxAUAkx4kQEBQ7oJHBApMgCCgU+UGCAAcWgAhcEWMChKYcLFk5e0CBBg0aXFAQ6aFjzYQMHESJI6GrzQYQHDhs0WLBgLVsJZhE8KMDTp0gBR4UW+DhAgIACeQMCADs=', 'data:image/gif;base64,R0lGODlhDwAPAPcIAP///+/v9zkpY0Ipe1IxnDEhUlpKc2MxnMDAwJR7rWNSc9bG3mtac+fe56WUpYRzhLWlrZyMlMa1vYxKY4xaa4RKWq1re5QAIbWMlJxKWtacpZQpOaUIIcYIId4AGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAPAA8AQAiZABEIBLBggYQIDiQsACAQAQMOHiJKnOiBw4QFHCB6aAAgIgANFS8sQNAgA0QJAVI2wHBhQgCBJTtIAEAzwMoLGRogMDmxowefFTNI0OhhoUeQHS7oHHjwgdMIMxvCzADBpgQIDijkHPiAQ4cMNMNqSGoBQFeJHI9G5ICBJ0WKHDacjbhgIlK2ZjUuFEuWIcmuDyAIdlCBwtKAADs=', 'data:image/gif;base64,R0lGODlhDwAPAPcIAP///+/v9zkpY0Ipe1IxnDEhUlpKc2MxnMDAwJR7rWNSc9bG3mtac+fe56WUpYRzhLWlrZyMlMa1vYxKY4xaa4RKWq1re5QAIbWMlJxKWtacpZQpOaUIIcYIId4AGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAPAA8AQAiMABEIBLBggYQIDiQsACAQAQMOHgBInDjRA4cJCzhA9BBRIkeLFxYgaJBh40eOFyYEEEiygwSJGT5eyNAAQcmOFCtyyCDBJM6PHS7UHHjwgdEILxuyzAAhQAMJEBxQoDnwAYcOGTJU9BDUAgCrJ7dy5IDhZk6KFjeA/Si2A9mvJrd2ZTjS6gWZFSgMDQgAOw==', 'data:image/gif;base64,R0lGODlhDwAPAPcAAP///+/v9zkpY0Ipe1IxnDEhUlpKc2MxnMDAwJR7rWNSc9bG3mtac+fe56WUpYRzhLWlrZyMlMa1vYxKY4xaa4RKWq1re5QAIbWMlJxKWtacpZQpOaUIIcYIId4AGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAPAA8AAAh7ABEIBLBggYQIDiQsACCwYYMHEAI0kADBwYMHDRw+AMCRo0SOGBEA2NixZMeNC0tyWGlyAUmOHDzI5FDygYKOMWXOPPkyp06aIBng1LkT5EsAOVl2lCDB5EqgHRuMNEl1I4KHHQNolToygMaLEMJaDNlQ5MGLDyI0bRgQADs=', 'data:image/gif;base64,R0lGODlhDQAMALMOAK0QEL0QEMYQEM4YGNYYGN4YGOsuLu9SUu9jY/eEhPeUlPelpfe1tf/Gxv///wAAACH5BAEAAA4ALAAAAAANAAwAQAQg0Mn5ppXVZvf6xt5VfdSFldyYkVxrnjD6fmQtb6HWOREAOw==', 'data:image/gif;base64,R0lGODlhDQAMALMOAKeZGL2tGMatGMa1GNK9IdbGIeLOKefWSu/ea+/nhPfnlPfvpffvtff3xv///wAAACH5BAEAAA4ALAAAAAANAAwAQARD0MmJppWHBBBKmIsRbEQWDAOxXAdwXNJyHkhBANXUuFMCKDDHDhiUdAIMVoBgQNQKHoNFBrW9LppCowVoTIkTRkISAQA7', 'data:image/gif;base64,R0lGODlhDQAMALMOAKpfFLhnFr9rF81yGdR2Gtt6G+aMNOugV+yoZvG9i/PGmfTOqPbWtvnjzf///wAAACH5BAEAAA4ALAAAAAANAAwAQARE0MmJppVnDDDKmIsRbMNBjAOxXAdgXJKiGUhRBNXUAMeUAAqYYxcUSlIDBmuGqNk6FpmtQHhdCKmGAQBoWBbFCSMhiQAAOw==', 'data:image/gif;base64,R0lGODlhDQAMALMOAK0QEL0QEMYQEM4YGNYYGN4YGOsuLu9SUu9jY/eEhPeUlPelpfe1tf/Gxv///wAAACH5BAEAAA4ALAAAAAANAAwAQARE0MmJppVnDDDKmIsRbMNBjAOxXAdgXJKiGUhRBNXUAMeUAAqYYxcUSlIDBmuGqNk6FpmtQHhdCKmGAQBoWBbFCSMhiQAAOw==', 'data:image/gif;base64,R0lGODlhDQAMALMOADeHPUKUQkKcQkKlRkqxSla5VmXAa3PGe4TOjJzWnK3erbXnvcbnxtbv1v///wAAACH5BAEAAA4ALAAAAAANAAwAQARF0MmJppVnDBBImEsRCOPhCQOxXAdQXJISDAZCeNXUAMeUAAqYYxcUSgQeBqtTQNhugddEgSSIDDAPoWHgNCyL4oSRkEQAADs=', 'data:image/gif;base64,R0lGODlhDQAMALMOABSqjBa4lxe/nRnNqBrUrhvbtDTmwlfrzWbs0Ivx3Jnz4Kj05Lb26c358P///wAAACH5BAEAAA4ALAAAAAANAAwAQARE0MmJppVnDDDKmIsRbMNBjAOxXAdgXJKiGUhRBNXUAMeUAAqYYxcUSlIDBmuGqNk6FpmtQHhdCKmGAQBoWBbFCSMhiQAAOw==', 'data:image/gif;base64,R0lGODlhDQAMALMOACFSnyFatSljtSljvSlnxilrzjl411qU3nOc54y155y9763G773O987e9////wAAACH5BAEAAA4ALAAAAAANAAwAQARH0MmJppVnDCCMmIsnAMNBCMJQLNcBGJekpAZSEEA1NcAxJQBFzMETDiWCgoDREhBqtoISNpkVDDeqRUloGACAhmVhnDASkggAOw==', 'data:image/gif;base64,R0lGODlhDQAMALMOAKoUm7gWqL8Xrs0Zu9QawtsbyOY01OtX3Oxm3/GL5/OZ6vSo7Pa28PnN9f///wAAACH5BAEAAA4ALAAAAAANAAwAQARE0MmJppVnDDDKmIsRbMNBjAOxXAdgXJKiGUhRBNXUAMeUAAqYYxcUSlIDBmuGqNk6FpmtQHhdCKmGAQBoWBbFCSMhiQAAOw==', 'data:image/gif;base64,R0lGODlhDQAMALMOAAAAAAgICBAQEBgYGCEhISkpKTExMUtLS3t7e5SUlJycnK2trb29vc7Ozv///wAAACH5BAEAAA4ALAAAAAANAAwAQARG0MmJppVolDfMmMsxDMKAECNhLBfyHJekjAdieNXUPLmTPIqYYxcUSgQeRktQqCEKtwFsolAZDoSppdBpHAQCJag4YSQkEQA7', 'data:image/gif;base64,R0lGODlhDwAPALMOAG4JGJQAGH0hLo1JUr8OKrJ2ftqFksqgqdaYoN6UpeKgqdatteettda1vcbGxgAAACH5BAEAAA4ALAAAAAAPAA8AQARM0MlJ6zQgkE0CKNUhjOQIWkqiqtZUDEV8VkNg3/ZgIYUAAIKBoUUsGieDwaHRWCQthQzOo6MMMpwNoGr92X4DBMpALiuKCgVCwaBEAAA7', 'data:image/gif;base64,R0lGODlhFAAPALMBAAAAALW1tcbGxv8AAP//AP///////////////////////////////////////wAAACH5BAEAAAEALAAAAAAUAA8AQAQ/MMhJax1k6Jz1/l6HYUQ5htqUUsPVSl4bz3EwcmTH4XTvW8CgjWVZwXzIkO4Eaup4m5JUJtqZTiJbTYYUeiURADs=', 'data:image/gif;base64,R0lGODlhDwAPALMPAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAA8ALAAAAAAPAA8AQARJ8Mk5EEBTgrreAsBxYNkwdJ84PmT2bOEqtc+JIGKLnAcahrTJJpVjuY7IEjF5eqlImMHj4HnFaLzqBci6WZsx2XFzKxrHg4srAgA7', 'data:image/gif;base64,R0lGODlhFAAUALMOAD0hCEohADMlFi8lMlQ8G1ZOQYViM0Ixd4qGhL6WXMaplu/GhN3Z0N7m+////wAAACH5BAEAAA4ALAAAAAAUABQAQAS80BWGBLvMOda010IQCArCFAMwHFwZkho1LHRi27SAKKAQisBgEMDbCAAJA4KQICwMSsMC4Mv8AgBqVlvofK6irTiL9SEcgtWgwA5R2QXB4UDdQBMLhgG/SCpoBQlFHyd3ClAFgx4+jIw7AhMfGolgZFgjcGwMbgBCnlgmaEBmCAcrBwgIA1c+VHNzV6evjA6qa302AQYECngGaZAbbDYMTH9NCn8FSjF3NM/QfQU7hId9UNhPyZKSCo1n3BEAOw==', 'data:image/gif;base64,R0lGODlhFAAUALMOADcrFDEuKV9SDVtIKY9sIKmMAL14GIN0V314lMGcZcStlu/GhN/b1vf39////wAAACH5BAEAAA4ALAAAAAAUABQAQATC0MnJ2AlhsDY7KEKQJIdQfAJRgKAiWcEiz0siB4f7Yivm/yuBC4HALQCKAeHAHCAGGQyjgzAJTCvQFTFRAFRacDC0IgieoIPBQCAFCoOCIa4FOCwHGwOhkCkQDDIDOR0vgzUjCQM6hV0CABlXADmMEk4OdFmaJxkaDgFYb5tZAJMHi191KVgqZqSiAjYLFysoWT4OAAIHNSUEoL4Jb1cHFYMJAHt9C38MA8IHCBx4sjQ0ioQUCryzBN42lI0dCj9cjREAOw==', 'data:image/gif;base64,R0lGODlhFAAUALMOAC0xOVc/I1lcZVhsi7aHRdq1dZGUlaWlpTWMyhK38VSGxZCs297e3vPz8////wAAACH5BAEAAA4ALAAAAAAUABQAQASq0EnJDrjYsDmZWOASjMEXLsMhGYMgEEVMwPIADEYjHYPiJIqgUDgYdACBmJJGK5RUE54COCQaOJ4gNbioKlIUV7IwI9FGYAejqGy7AQYob7BhGEgBjU6A00VdXi1QHA5FU15CAhwNLAoNW4gDflkgCiUBAyddaWsLGEgznwALcRSgMzFJMKgBAFAeAk4jTSQFcK9FAG5vtxJwkgcvZDQCVyx0ahcbhIQXKhEAOw==', 'data:image/gif;base64,R0lGODlhFAAUALMOAAgEBCUhHC0kJEYMDFIICEo5Lk5KQWMAAIZKM4BiQYR1XrKaeNyzd9zc3P///wAAACH5BAEAAA4ALAAAAAAUABQAQASx0MkmTVPLtSVoo05wjGRpksGkFEzrMksbYFI4nPgxBFswKC0D0LUwMGaDQUahMCQJpJsuKWBSBNJcidAxiAYsQSJxNIwLUJ0hNI49jC7FI1ZQ8GqT+mtRyOAnBgscSUqEggJ+DgsDBFkmUAGNGQYCaVolA0KWlyQECiEoUyKNjFE9BCwICAkxZKoIPpJsZAEGAEN8AgFFCh0aCqxHZHG7vIkaC8NjbQwYx3+KAdIz0A4RADs=', 'data:image/gif;base64,R0lGODlhFAAUALMOACMjKyEhQiEhSiEhUkg/NXpdNKZyLXh4eGWHsraZZbexpOK9e+Tayff39////wAAACH5BAEAAA4ALAAAAAAUABQAQASz0EnJ2AEYHzKpCkMAiEGQLGgCDCwwKce5GEZipIfSYSDr/78Aw8EAEBAFVW6BICSRhUODQigBg7nJoccSCFoBAXfgIgAKBGehQKOx2wEOY51A2BUohR2xICR0HRIKfih9ClOBHiNjYgGAEwwEV5NeOmljP15AjhdcJSAmCWZcLosqfgAyhQsrQkROUAAxBk2wBmZDcwV2CQIIeE27TX8vG6vHrMSJCgULCc8nyomBF0bTDhEAOw==', 'data:image/gif;base64,R0lGODlhFAAUALMOAAxOBBBWAB5aB11dBxwpHFtNFWZQMHxiZ0+hAIeMVs2yfNzYy+bm5vf39////wAAACH5BAEAAA4ALAAAAAAUABQAQASx0MnZlr1tagI6CEMxEAgSeACxSEtCKHAiJ7BC0BMpdAinHLydACFYcQY0g0FBSyiZIxXLUNoBDkDAsKTIoaqd7akj5aQI6IEazSYbsYrCYlBT0JcG10qzyNedexosMWxsBzCBDgxUJT0APzyNCHskHiUoQ1YCRQ5mYT0cOihlKAAiawilpAIESkoDBwOuBAUpRk8FdnV3CnlSDFgJcnQ1dEkJiQs/MK7ENImCDjaG0Q4RADs=', 'data:image/gif;base64,R0lGODlhFAAUALMOAHogCah8A7pxQeOVEurZA9qLeubTuu/vAPfzAP//CP/8RP//jP//wf/39////wAAACH5BAEAAA4ALAAAAAAUABQAQATC0MlJq1xSkNDkIMKQEMdBJIJgVAahvB+BJHRAEAVQLEshAYTBCwZIABwKAIKwAgw+AZo0ERisHIWCoQEACizY7rcRJQDIiYchml4fJ8VvcRAYDp9vASBQjL6mUkwTGGFvGSkWKg5dAFtgCw0GBlkLigI0AllZkzdfDpMmYx9FNGZHDB5mK5d0DyYbD09Xl29JfwAPD3OCDpc4TjYJClNOVr18WQEIM8OAI1cKDTnCLgrBxAE+DgyoRaZdN99XFYZgExEAOw==', 'data:image/gif;base64,R0lGODlhFAAUAPf/AAAAAAgAAAgICBAQEBgYGBgYIRghISEYGCEhGCEhISkhGCkhISkpKSkxMTEpITEpKTExMTExOTkxKTk5OUIxIUI5MUI5OUJCQkJKSko5MUpKSlJCOVJKOVJSUmNSQmtSQmtaQmtaSnNaQntjSntjUnt7e4RjSoRrUoRzUoSEhIx7Y4yMjJSUlKWEY62trbWUc72cc729vcacc8bGxs7OztathN61jO/GlPfOnP/OnP/epf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAP8ALAAAAAAUABQAQAjzAP8JHEiwoMEOCRJcuAABAoMLBy4wgHBhAkMCGgbGOEEhh8ccMD7mAJDC4L8SADRQXMgwAYMEAggKcPEQRgIRIThQTNCCBIGFJUyWuLAiRQmjMUz+o7hSIcuFEDQwSCpQwwSKDKRKhTDhZYKoDAYMFLBBhQIAIETeAABAQoYRSlPQKEG3xIqTSguyBRA078ASGgQI0PCUQN+CAzQQfvqUwT8CAgMEXSlxodXFEzQAIMhQQGOIhA+sHJgAQNgBA0JoSPBTwwsICVYHEFgy6wkAMlp88DBigAMAJzgQ4DsQRQ0PNkR6vKEj7WGCKJV7HPDcr9+AADs=', 'data:image/gif;base64,R0lGODlhFAAUAPcbAAAAABgYACEhCDEAADExGDExMTkxCEpKSmNKGGNjY2tjOWtra3NaGHNzc3tjGHt7c3t7e4xzGJx7GJyce5ycnKV7IaWMGLV7GLWcGLW1pb2cIb29vb29zsbGxs6cMc7OnM7Otee1Mfe9Mf/OMf/Ozv//zv//3v//5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAABsALAAAAAAUABQAQAjSADcIHEiwoEEDDhqEGMGwocMQIEpA0CAQAgQKEBBUcOiBAYQFEA4MHAHBRAmJFAcmGDHhxIkHIxQIBOBghACHNRkCiDCiwb8EAhNoGKHBgcENCRw4ALph58kSGRCIeOjRZIl/FgYycMi1oYcITC9yWNjQAQmHIixCOMq2rVu2NQMsKDDCKMGcDZtK+Pf0XwAAgAEMcPC0BIURGzDw/UC2qwcCJ/9dmAmga1cAh4EC2FATgWWHBAH8w8sQQ2WO/zYjFf2vcYjTDCGkflsQAFPabgMCADs=', 'data:image/gif;base64,R0lGODlhDwAPANIAAP/Oc729vQAAADgA+Ly8vP/McP///zAIcCH/C05FVFNDQVBFMi4wAwEAAAAh/mFodHRwOi8vd3d3LnJ0bHNvZnQuY29tL2FuaW1hZ2ljCgpDcmVhdGVkIHdpdGggQW5pbWFnaWMgR0lGIFYgMS4wMGEKYnkgUmlnaHQgdG8gTGVmdCBTb2Z0d2FyZSBJbmMuACH5BAkZAAQALAAAAAAPAA8AAAMxSKrSvZC0QumDomq75q5XVnijKEiOU6Yem1piCcbkp9U2Z24mM6scX+6EicEinVQkAQAh+QQJGQAEACwAAAAADwAPAAADOkiq0r2QtELpg6Jqu3KZlicwzlQ+5ul8oNEYhSvAbDXQxV2BW8/3mpFoZpBxJLvSrgM8djzJyNMRSQAAIfkECRkABAAsAAAAAA8ADwAAAzxIqtK9kLRC6YOiTJvFco4GepI4Tt62idVmDIZRvDFXHTKFt1nl/ytNzNCzlEwg4xFZJC1/mkhQFPmAIgkAIfkECRkABAAsAAAAAA8ADwAAAztIqtK9kLhCXXStYLGE3htTeWMlkYZBFemascagxu23Gsd6qOXq/69KykAykUBH0WhiUv6aneIoErVAEgAh+QQJGQAEACwAAAAADwAPAAADPEiq0r2QuEJddK1gsYTeG1N5YyWRhkEV6ZqxxqCmckkZx4q75Or7r0rK0NNIRhvTERnkiH6uS/ET6WAiCQAh+QQJGQAEACwAAAAADwAPAAADPEiq0r2QuEJddK1gsYTeG1N5YyWRhkEV6ZqxQ2vE6rcedYG75Or7r0rK0NNIRhvTERnkiH6uS/ET6WAiCQAh+QQJGQAEACwAAAAADwAPAAADPEiq0r2QuEJddK1gsYTeG1N5YyWRhkEV6ZqxxqCmckkZx4q75Or7r0rK0NNIRhvTERnkiH6uS/ET6WAiCQAh+QQJGQAEACwAAAAADwAPAAADPEiq0r2QuEJddK1gsYTeG1N5YyWRhkEV6ZqxQ2vE6rcedYG75Or7r0rK0NNIRhvTERnkiH6uS/ET6WAiCQAh+QQJGQAEACwAAAAADwAPAAADPEiq0r2QuEJddK1gsYTeG1N5YyWRhkEV6ZqxxqCmckkZx4q75Or7r0rK0NNIRhvTERnkiH6uS/ET6WAiCQAh+QQJGQAEACwAAAAADwAPAAADO0iq0r2QuEJddK1gsYTeG1N5YyWRhkEV6ZqxxqDG7bcax3qo5er/r0rKQDKRQEfRaGJS/pqd4igStUASACH5BAkZAAQALAAAAAAPAA8AAAM8SKrSvZC0QumDokybxXKOBnqSOE7etonVZgyGUbwxVx0yhbdZ5f8rTczQs5RMIOMRWSQtf5pIUBT5gCIJAAA7', 'data:image/gif;base64,R0lGODlhFAAUAPf/AAAAAAgIABgYGCEICDkQCDkpKTkxKTk5OUIYEEIxMUohGEopIVIhGFJKQlJSUlohEFpKQlpSUmMhEGMhIWNaWmNjY2spGHMpGHNzc3sxIXs5KXtjWntrWnt7e4Q5KYRrY4SEhIxza5RaSpR7a5SUlJxaSpyEc5ycnKVrY6Vza6WMe6Wlpa2UhK2cnK2trbWEe7WUhLWcjMallMbGxs6UhM6tnM6tpc7Ozta1pda9tdbW1t69pd7Ozt7e3ue1nOfGrefn5+/Gte/e3u/n5+/v7/fOtffOvffv7/f39/8YGP9KSv9SUv/Gxv/Wvf/n5//39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAP8ALAAAAAAUABQAQAjgAP8JHEiwoEGBNi4EKFHkR5MmQX7UCPAgA5KD/3Q4MMGiowMMGAkeEOhkicAbIA0OuTCgSMOHMHE0MXABBcYeHSpQmFChgouQ/1AEwLmAgFEMJEA8MHhERMsmNVQ8lGHiYYKaBFdaCNBkR4MECQzEaPLhAVagaA8S6cGWbdp/FXr8U5KEyb8TK0IKCXByht+LIFoczKEhQIEHNHwotsBAwAMRBm08aNBkA9cmELiyWHBW4MqnMEM3KdD53+cPOzY4fBhihAzONgcOeYECiYEioYvIQMDDA1oXJ0icuPj2bUAAOw==', 'data:image/gif;base64,R0lGODlhDwASALP/AAAA/wEBAMDAvwoFAAQCAAIBAP8AAP+3t////8DAwAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAkALAAAAAAPABIAQARUMMmp6qTGnKp2PZlCdUd5DIRwJRXgupZEeh1nipeSGXj+/j8RSYEgGoulAstEY/YwodWKE5sCgxTAbpsBCEtERFGMPASG5HA5sGS6NxSnUzWl0iURADs=', 'data:image/gif;base64,R0lGODlhEwASAJH/AP///wAAAP///wAAACH/C0FET0JFOklSMS4wAt7tACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJLAECACwAAAAAEwASAAACQpQTpot77QRKLgCo0I32zglsVUiWIcWYKpqdnXdyLqmJ7YzbkspTXw3yfA6mIO3x6f1uvNjoRDvKXC9W5eWKcIaRAgAh+QQJMgACACwAAAAAEwASAAACQZQTpot77QRKLgCo0I32zglsVUiWIcWYKpqpJnucnXeO7pveJfVpXtfjvXwkXs8VbOlEuUuxGJEUiTDGTBatfKIFADs=', 'data:image/gif;base64,R0lGODlhFAAXAPcdAAAAAD8fHgIUI242NZ0WDaoOCbUIBaQSC+nMN+C8a+G+eO3PQe3QQ/DUTPPWVPneZuLAfuPBhOTDjeXFleXGnObHoubIpefJrOjLtOnMu+rPxevR0f///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAB0ALAAAAAAUABcAQAjMADsIHDgQgAEAADokJFhQAIAJFBBmmIjhAoUJCxkqTJBAgUcFCDUyRHgBw8QMCDMWfOCgAQAJEiACuPgyAkiRAwMIHIATp0EDBgocUEnw5YQKFzJo2KAhw4WQI1NCtPD0goWLEiJkRLgAAQAFECKIFZuyJ0GePM3i1Km26MGDQ9umRHiAANGiR5Nq2Ov0rsCUFVLyvRBY49cIU0tiAGCV5kiWRikEroA1AoSFABxoZgBALMy5Nu8i7PgRwke/Reei1higNdq2OTu4FhkQADs=', 'data:image/gif;base64,R0lGODlhEQARAPcAAAAAAACtEAD/AP8AAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/nZERU1PIFZFUlNJT04gOiBCdWlsdCB3aXRoIGFuIFVOUkVHSVNURVJFRCBjb3B5IG9mIEdJRiBNb3ZpZSBHZWFyIDIuNg0KZnJvbSBnYW1hbmkgcHJvZHVjdGlvbnMgKGh0dHA6Ly93d3cuZ2FtYW5pLmNvbSkuACH5BAFaAAIALAAAAAARABEAAAhgAAUIAEAQgMCDBQ0KBECgIQGFAx0+jPiQYUWLBBtmrKgxAMaPGjF6DKmRYscAIx0qTAgApUuWCz26nImy5cqaLAvWjEmzp0eEPmdC5OlzKNCeRg8OzKm0qdOnUKNKfRoQACH5BAFaAAIALAAAAAARABEAAAhwAAUIAEAQgMCDBQ0KBECgIQGFAx0+jPiQYUWLBBtmrKgxAMaPGjF6DKmRYscAIx0qTAgApUuWC13KnOkxJsubNQeiJDhgAICeBHci3AkUqNCDOn/6NAoRKc+lPpsiHVjU59SpSrNexbpU6taBBLcGBAA7', 'data:image/gif;base64,R0lGODlhFAATAIcAAAAAAAAQlAgICAgQEAgYlBAAEBAIABgAABgIABgYCBghIRghKRg5nCEYACEhGCE5OSE5YykYACkpKSlanDEhCDExOTkhMTlSUjlSWjlavUJSUkJjlEJjrUJrpUJzlEpSWlIpAFI5AFI5EFJaKVJae1o5AFpKMVqMvWNKCGNjQmNzUmNzc2tKAGtaEGtra2uUrXMxKXNKAHNjIXNrOXNrc3Nze3O13nu1vXu1xoSEjIS11oS9zoyMMYyUjIyUlIzOzpSECJSUrZS1tZS1vZS91pTOzpxKe5ylpZzGxpzn76UQCKVzCKWcnKWlpaWtraXv760pY62Uc62lOa3GzrWUUrWljLWtnLW1tbX//721rb29pb29tb3Gxr3OvcacnMatjMa1AMa1jMa1pca9pca9tcbGxsbOzsbW1s69nM69pc7Gpc7Gtc7Gvc7Opc7Otc7Oxs7Ozs7W1ta9lNbGCNbGxtbOrdbOxtbWvdbW1t6cAN69lN7Gc97Ge97Oxt7Ozt7Wrd7Wvd7W1t7e3ufW5+fezufe1ufe3ufn3ufn5+fv3u/n1u/n3u/n5+/v1u/v3u/v5+/v7/fehPfv5/f37/f39/f/9///9////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7f/xSH5BAMAAP8ALAAAAAAUABMAAAj2AP8J/EdIjpwwiwg5GsiwIZ80lCJSArRmT8OLWyRqrEPl4sAvGkPSyeLx35qQId8E8UgHT0SXKANFuYjnjUSYId2oaegnJJ5LEhFFTBOJIZ04Gl1eQoToCEwvDNk00ciFixMhSH4I8YHnEJqBbMxQwoPHTJEdK250sJEEQ44yfxji+XflQ5ITDEh4CMDhCYYaYiQx7NKDhgYsGQhAeDBBx4sBKTxWELDgBpENKoBImSEjAhOPDgAAUIBhxJw8KGKEiGBFMoADJVqAWaJENAAKYjzSEAAgAQUYUIyIRlCl5D8TtgtYkADAQGvj/xy1SABCBAseHgMCADs=', 'data:image/gif;base64,R0lGODlhFAAOAPf/AAgICBAIEEoxGEpCKUpCMUpKMUpSOVJKKVJKQlJSSlpCKVpKOWNjUmtSKWtSMWtaOWtjQmtjUnNaOXt7Unt7Wnt7Y3uEc4RrOYRzSoRzUoR7Y4SESoSEc4SEe4SEhIxSUoxrMYxzSoyEa4yEhIyMSpRrMZSMhJx7QpyMWpyUe5yUhJychKVzOaV7MaV7QqWESqWUhKWlSq17Oa17Qq2EOa2EQq2Ue62ljK2lnLWMUrWUWrWllLWtnLWtpbW1pb2MOb2cWr29pb29tb29vcaMOcaUQsa9tcbGUsbGWsbGvcbGxs5ShM6UOc7Ovc7Oxs7OztacOdacQt6cQt7W1t7eWt7e3uelQufe3ufn3u+tQu/vWu/v5+/v7/eEhPeEjPeMc/eMhPeUa/elUvela/elc/etOfetQvfv7/f3Wvf37/f39/9K9///9////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAP8ALAAAAAAUAA4AQAjKAP8JHFjFiZItAxMmDGGFyA4eQLJ0WVOGiQgVOmbMGDEwjZAMCnIUySLGRQwkQxSqrHLjAoslH2BUORMhy4sqKgeamKCFCgUcOf/1YJGlQAAP/0B4WVO0SdB/QRAUWBBF4pcsVn6UKBChx1MOBkhY8PpUIBYVDxw4gHAETYUpQXG4EHB0BxMwYRxsMJFG5QooWWz0rSJjYpYaRv4VbIJloJATWaRYkZBlaRkrRaBYydICaMKPRTaTGfMDRYcaUlKcKasyTQINXAYGBAA7', 'data:image/gif;base64,R0lGODlhDQAMANUAAP////eUjPeMhPeEe/d7c/dza/drY/djWvdaUvdSSsDAwPdCMfc5KfcxGPcpCPcpAO8hAOchAN4hANYhAM4hAMYYAL0YALUYAK0YAIyMjISEhHt7e3Nzc2tra1paWjExMSEhIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAoALAAAAAANAAwAAAZeQIUio9EIFZuO55gJCAYcJMGQACk4gwGhYOgUDosGJOQ5mBHoxMIBkYQ+jDij0XA8JBNKKATp+yN5FhchCiESERESeBUXg0chE5EUjBiER4WBF5WXj4yOnI+foI+gQQA7', 'data:image/gif;base64,R0lGODlhDwAPAKL/AP78ALu3BoB6DFJMEiwmFiciIsDAwAAAACH5BAEAAAYALAAAAAAPAA8AQANEaLp2/CcAIM6YwcEQBNdKNGGDNAYFJADZs4jV1b4mW55goe986jaVH+MwArmIMYDxNUkqISdPMbQaDQ6EEcUR4Xi/rQQAO7OuBrOvBrCtBry3B7y5B7m0B7WxCKiiCaaiCZmUCaCcCn15D56YCImECYR+CX54CXNtDnRvD3NuD3BrD0dFFWJcEFJNEk9KElJMElFLEk5HEywmFigjICkjIsDAwCciIiYiIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEQALAAAAAAPAA8AQAePgESCg0RHhIdHHAUDOUdAFgUahogiDzEqH5OCRx0FngUsOjCfBQ5CiC8FMpqIGwU4Rz8FDaxHGQUTBCk7LgkRBRiaAUVGRkVDxMYAh4NHNazMhQae0IRHCjZHPQzVhQivRz4UBNBHBQICKzctFQIFk0c0BxICCzxHQRcFEQQzhkcQSJgwEcIDiBMlRqAwFAgAOxAnSoxAYSgQADs=', 'data:image/gif;base64,R0lGODlhDwAPALP/AMDAwP/MAN+zAL+ZAJ+AAGBNAIBmAEAzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AAARbEEiJap0Y1CH6uBhCDEFZDgQyiUdBnsWRUkXlBkON1BpxWAWCDiHbWBCGguH4QaAI0FoQOqp0rkLCtbMx5XYvnAohwA1vApWGszwaBJ8VKkYMxkMiakqd0RwzEQA7', 'data:image/gif;base64,R0lGODlhDwAPAOYAAP////z8++vr6unp6Ofn5uXl5JqYlt3c29va2cTDwre2tQ4JBREMCD87OFZSTw8JBRsYFnFubAgDAAwHBA8KBxMOCxUQDRcSDxgTEBkUERoVEhsWExwXFB0YFR4ZFh8aFyAbGCQfHCUgHSgjIDEsKTcyLw4IBRAKBxELCBIMCRUPDBcRDhgSDxsVEh0XFFlVU2llY25qaLe1tK+trKupqCEcGjUwLouIh5iVlJSRkCsnJldTUndzckpFRNnX17Oxsf79/fTz8/Lx8d3c3P////7+/v39/fr6+vn5+fLy8ujo6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAPAA8AQAeZgACCghSFhYOEGB8tIzJEj5BERhQAGy4fHxUxRxEPJEFElIQSBo9CkEqihBQcIBseGik3CKIULJgfHSoTJg0HjwGUFy0hPkQyOj+RqoOGh4jNGykYGBk9z4QnHh8rDgk7KCVFQ5QUDLgfIDYgCzBARASFGpjzLzw4A8sUKR8WOY9IIhERUM6ECAREZkCgAakAMwo1FEBKgi0QADs=', 'data:image/gif;base64,R0lGODlhFAAXALMAAAAAAP///wIUI4ylAK3OCO3QQ/PWVPneZv8cAD8fHvcAAG42NX19ff///wAAAAAAACH5BAEAAA0ALAAAAAAUABcAAASCsMk5AQOgZcqp/VcnWkwZih6GlRuKEcQwECqqyfg8txxA/77YADMK/mAxWgcgAB6FSg9yepTxNKrkM8kDHAy+2XZX+R7CO1g4CjCAC0ZaNioBKBQvMbJGQQD8MDhTVxp3GkgyciJ4CnUqRDYiCw2TkRMJmJOVlpcSm5wJDZmcIqEdEQA7', 'data:image/gif;base64,R0lGODlhFAAXALMAAAAAAP///8bMzPrlAOurRJ0WDaoOCaQSCz8fHrUIBW42Nf///wAAAAAAAAAAAAAAACH5BAEAAAsALAAAAAAUABcAAARlcMk5QQJgZcqp/cfWcVaSGOFIYthRiCMrs6o2zyo2sDveAYNe8PYL7ow3mC0p8FWYSQ+BMGsSJYApVWa1YrDaLUtA9nqy4io5lpTVltd3/E1RLOx0CWJvx+f1En55CAt8fx2EHREAOw==', 'data:image/gif;base64,R0lGODlhFAAXAMQAAAAAAP///2tna+nMN+3PQe3QQ/PWVPneZuC8a+G+eOLAfuPBhMmqd+TDjeXFleXGnObHoubIpefJrOjLtOnMu50WDaoOCaQSCz8fHrUIBW42Nf///wAAAAAAAAAAAAAAACH5BAEAABsALAAAAAAUABcAAAWh4CaOI5ABKECuq+leKsuaWWbBcpsCVxXnKIawQUnJUsIggyj5lQKBFBSwpDRbUUA0G2VCnFrUVgxoTCQPx08rEGzbWUkkDQ6L43NHY1E3lFFfEGl7CmsHfmUNDg8AdHsJMQAGfgUACwsNDTsLkGsABAMACQqXpTszAAgJq6OsTjMIqq6vRzsoOTkaG7q4JBi/ury9viLCwxsYyBjGxyPJLCEAOw==', 'data:image/gif;base64,R0lGODlhFAAXANUAAAAAAP///4aG/+fn/wIUI+nMN+3PQe3QQ/DUTPPWVPneZuC8a+G+eOK/euLAfuPBhOTDjePBjOXFleXGnObHoubIpd/BoN/DpufJrOjLtOnMu+rPxZ0WDaoOCaQSCz8fHrUIBW42NevR0f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACMALAAAAAAUABcAAAa2wJFwOASAAIBRksgkGp+eZZNpBIE60SkVifRwpFMkJqMpc7VKCQWj2bg1GLATomZvRBtAXC7kUrhuen9NAAQAEhNIZgIAExJyAAwPiBVjGQCMjpBclHECnwAQD2AACgmhiH+fjA8OUqUJCKF0iQOgDwxLAAm8BwAPDxAQEQADSLlOAAYFkQ7AwAAWF3xKAAsM2AwN2dRFC9fc3clc4lohI+doRB/s5+nq60Lv8CMf9R/z9EP2TUEAOw==', 'data:image/gif;base64,R0lGODlhFwAXANUAAAAAAP///wYGCAYHCAIUI+fMPeXIPu3QQ/DUTPPWVPneZvfdad+7auC8a+G+eOC9d+LAfuPBhNu6f+TDjeXFld2+kOPEmOXFm+XGnObGn+bHouTHpObHpebIpebHp+fJrObHq+bIrOXHq97BpubIrefIrefIrujJsujLtOnMu+rPxeLIvp0WDaoOCaQSCz8fHrUIBW42NevR0QEBAf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADQALAAAAAAXABcAAAbYQJpwKATAAABakshsKo9HVxKJdBKNMFhLigwEqlYq0sXqer9O5AeVaovPaCbAsvmkVCtV6mP2LocAExYadioyenwAcH9FAAIaVCoqJx+QZ2BFBAIWGEhtJiVUl3IPEhUYHWslIHxfYowzVBSoHyIkHaKXfwALCYGzHiIhnYpwcQAKCQiBExQcwhS5owAJ1QcAERETGSIjr6+NBgUADhDZHBeKxaNEAwAMDvHlDurGjEMCDQ3yxd/3gP7s/WMSg0ZBf1ZovFhYsGDChC+EOHzYJCJDihQjPgwCADs=', 'data:image/gif;base64,R0lGODlhFwAXANUAAAAAAP///wIUI+nMN+3PQe3QQ/DUTPPWVPneZuC8a+G+eOLAfuPBhOTDjefIlOfJmubGlePDk+XFlefLo+DBl+PEmuXGnOXGoebHoujMqebIpeTHqufJrObIrOXHq9m9oujLtOnMu+rPxZ0WDaoOCaQSCz8fHrUIBW42NevR0f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACoALAAAAAAXABcAAAbKQJVwKAScAABVkshsKo/H0tLpNJ5OJCm1ikSWRtOtEsABhc5dcVGC4YRE8NCmS2cCGmy3KCUKfZABgQFIRF0YXXEZAIKCUwACABIWSGchIIqLjI4KDJIaZSAeHBN0dUVdnhwdHBoPmY2FCAd3khgXGBYOr4GOsgZ3eBYVFhClaUoHyQUADAwNDRQVEbuDjgAEAwAKC83dxmGnCQrj2+Ov4HYJ4uSAvOiFpUqaakIoKva770Mm/Pb482pM1JMHS4zAfmPc0dt3ihCRIAA7', 'data:image/gif;base64,R0lGODlhFQAbAKIAAAAAAP////7/BuPBhJRSALUIBcbGxv///yH5BAEAAAcALAAAAAAVABsAAAOAeLoL/JCBAly8Z2qLJf1cV41jl1VDmpYXqr5D1cJ02AA0LD/42sc/W0blAhJ5xRwwBDAYKoKoVFBxckbO55SaZQEIhKqVa/2GFWZwFVsBq9Fudzoth8fD8vs5o5/37XF+dxZ0anmDgId4iHyDinUndIJqO2hti4ssECRymiIkFwkAOw==', 'data:image/gif;base64,R0lGODlhGQAZANUAAAAAAP///+rR0g0ACQwAJgkAHwICAwYGBwIUI8fJya3a2LHX1rXV1LbU05bq5prn457l4aLi36Xg3abf3Kff3Krd2qvc2bDY1rHY1rLX1bzQz8HNzLzRz/rlAOnMN+3PQe3QQ/DUTPPWVPneZuC8a+G+eOLAfuPBhOTDjeXFleTEluPEl+XGnObHouPHpubIpeTGqefJrN/CpujLtObJuOnMu+rPxenPxqoOCaQSCz8fHrUIBW42Nf///wAAAAAAACH5BAEAAD0ALAAAAAAZABkAAAb/wJ5wOBwYj8SkUggAdJ5QAGG5JDwBu16h5+xMqUMrgYAt53pisDCN3e1wOWkHoGZ2Bs38IFrndqFXTX0AKy16RgAHfVwoKi4wNDYCNzQyAAZTeQFKeYZNNjY1MYZkFBAOdEQACAApLE01sTMxLCkDGRURDxKpTCUnri8xMzMAMS+1AwwKE7y9fk3BMcbIKSgnABgWEryqIyIAKK6GLbXXJgANF9u9AN8h4eKvteEnJdnb3Vwi/CAAJydQoMjz7166dYKYAPjgAUAJEwAj5uHCAcCCZwpJlNj4kGMqABs0YFRFQqPHdglGJiGYcEjLPjx6xFyURIfNmDNp1hSSU6cQCR09bvqkArROEAA7', 'data:image/gif;base64,R0lGODlhGAAYAMQAAAAAAP///wIUI///AOnMN+3PQe3QQ/DUTPPWVPneZuC8a+G+eOLAfuPBhOTDjeXFleXGnObHoubIpefJrOjLtOnMu+rPxaoOCT8fHsYAAJ4AABgAALUIBW42NevR0f///yH5BAEAAB8ALAAAAAAYABgAAAXH4CeOwGiWZnqiAAeUr6oCA+u6NCqLOc/9l96ON6i9jrQaaXecUCpJJU+jOz0ik4rFkmRpMtQUwHHNWjxc5Bdc/Rwjx21lAi9lYCcB4AF5Vf4UExAPKHdiCw18Ek4UABMSg4VtSIoTjpAPDg12kwkIY3xwEYOaDJwnngdjZH2RmgunPAizBgANDQ4OSA2wH4YrBQQACwy3xkcZyW08AAoLz8TQLxsxQ83O0stDbkja2yYdH+HfKhjm4ePk5SLp6iMYH+fuQ/DbIQA7', 'data:image/gif;base64,R0lGODlhGQAXAMQAAAAAAP///wIUI+3QQ/DUTPPWVPneZuG+eOLAfuPBhOTDjeXFleXGnObHoubIpefJrOjLtOnMu+rPxZ0WDaoOCaQSC9QsJrUIBevR0f///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAZABcAAAW3YCaOpAhcAJCpZeuecMW69HrdlFzTaV9Ns50J8IBEjj3hCLBoPCKSaOQRrAEUzacEI5mmlL1GT/oQCwECJiN1jEAejEW1BDgkFgxHEUJ0xOckPWp6fXEKCYAmBgVXeGINhgkIiQCLBFdYa3+HB4AABaADAAkJCgqCCZ2Bgqytrj0BsbKztLWxKQEWubm6urEWwL+7uri9u8fDwsbFwc2ywL7GxADJ0c+2ssXDvc7Xy9TY4bSv5OQhADs=', 'data:image/gif;base64,R0lGODlhGAAZANUAAAAAAP///6yqrJ6dngIUI+nMN+3PQe3QQ/DUTPPWVPneZhIPCeG+eOLAfuPBhOTDjeXFleXGnObHoubIpWM3DHJFGHpLHIJTJGIyBV8xBm47DGw8DufJrAsFAGEqAOjLtPfy7qNlOenMu+rPxT8fHm42NevR0fPu7v39/erq6oODg319fXp6ev///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAC0ALAAAAAAYABkAAAb8wJZwSAQYjwCictkCXCybzHOTZCqNG2gWmrEYrULnJbPZVCqZTMVCri4Bnic7TTbX3e+u5VwpbzAUGh1gYXSGGUiEYUhHIhx4VgAPEBIcIiMmIwCPkG+MjRwSnUUERhGNIh8cERCjYQwOEBETHB8fmxOsrk1HsrSbAQEQDw6uAAoJkrKiwc3Nb8gIkpMRASvX2CsBQ8EACd8HAA4OD8LW2dpC5ytGBgVGDcUAKdcA2ttCEOvsACEhRv5AZAuwgAiKevcA/gsh8N6Sg9gI8gLYEJ8SiMHehGBxzaLBjkRIiOw3AOQSFSZDNjnRjYmAlEJItBBZghCKllZkMgkCADs=', 'data:image/gif;base64,R0lGODlhFQAaAOYAAAAAAP///zczOAICAwoKDQAEAAADAAACAAgMACAgABERAP//7/fnhPfnjP/3xunMN/fXQu3PQe3QQ/DUTPffa/jic/fnlPfnnOTVkP/3zgoIAPfPMffXSvfXUvPWVPjZXvneZvffe/PceffffPjhhf/vrf/31hcSAPfPOffXWv/vtf/vvf/33ufJc//npejMgujMiOjNiOnOjuC8a+G+eOC9eOK/e+LAfunMkOPBhOLAg+rNluvPneTDjeXFlevNn+fHmuXGnOPEm+3RrOzMpObHoubIpejJp9m9oQgHBu7Qt+nMuz8fHm42NQwMDAkJCQcHBwYGBgMDAwEBAf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFQALAAAAAAVABoAAAf/gFSCg4MAAISIiYULh4qOggAmjYaNj1QALBmUJS6Vj4YOKyolFxeeigAZKysApBcWk6eQqyouphYMlCmylIYXGA0kIRQUKR2nCQkvMjtLACciIwDGHRCVClIEBS8FAk9DSgAUFbsQKJUAUlEF7E4D7AUAHxzmngfw3PBERAZQKBuyEBRo8SIGOx4/NCBJ0gtRsgQAXsDAsQPAESNBfPTI4ckQCA8AevgIUgQAkIwbb6AD8HFCSJFBAAjxETIHDXQeckoAkCNHjx69bBoqZCjCAwA0bvTsqaMhIkozaEhNSqOGjSmWDM2IOlWKFFlPew21pKgJFbNkBzFZaxZtWrWCDNy+ZUKF7VtFdBUFAgA7', 'data:image/gif;base64,R0lGODlhGAAXAMQAAAAAAP///+XlsuPjsf/41uC6n/+1iN63npk7COqSX/+1imEyHXIhAGExHV0rG0MPAGkcCD8fHm42Nf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABMALAAAAAAYABcAAAWm4CSOIwABwJSSbCua8OnOL2RDyFrSKooiORIgoRMCFsjkwodiEFtHhxLZZFgTT+Hj4dg+qFYnNissFBbms1Q8ZhRVh+MinmRjrW+5dBoOo6A+SkdMfy4ABgZyVFNLhogKAAFJAAMBRwGWUAYKnAAEBJJMAgJvJQAKiZ+gk4U0KAsNqpJUPEKwsq21L4S6NBITv70kEcS/wcLDIsfIExHNEcvMI848IQA7', 'data:image/gif;base64,R0lGODlhFAAXAMQAAAAAAP///wIUI+nMN+3PQe3QQ/DUTPPWVPneZuC8a+G+eOLAfuPBhOTDjeXFleXGnObHoubIpd/DpufJrOjLtOnMu+rPxZ0WDaoOCaQSCz8fHv8AALUIBW42NevR0f///yH5BAEAAB8ALAAAAAAUABcAAAWp4CeOI8ABwJeSLGm+2dqyJsdh8UyjaHbJM9SEUinydCoHZFKxOCsToKuhZFo8FigqiILwnICJtwUQABwPlHEDeDikAAUDHRlSAGw3nEefSPBnDQxAAAgHAFRpKGwoCzKFBwaIVIBsbAorAAebBQAMDA2VgIQABANxC4Mbq6tSIigJCrJ4rGxIAAmxtKyuLjy7vTMdKltIIhrIw8PGLBoiy8zHH8nRM84tIQA7', 'data:image/gif;base64,R0lGODlhGQAXANUAAAAAAP///wIUI+nMN+3PQe3QQ/DUTPPWVPneZs6cMeC8a+G+eOLAfuPBhOTDjeXFleXGnObHoubIpefJrOjLtP9jAOnMu+rPxZ0WDaoOCaQSCz8fHrUIBW42NevR0dnZ2bW1tf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACEALAAAAAAZABcAAAbSwJBwSCQCOABASFlsOo9QDdNJXXKuGWmVmuxqMFMi6AmYUCzobvMzLgIekYnlQrdMwkK22wGXXzwXdklFbUZJEV11E4hEekYCbxBJaBYUExAPU45DAAsNDxASZhRlEpiaIYVLXaCipZgODZqqAAgHAHwQiBGwDQyznLYGuLkAp7ELU4UAB80FAA0NDg5d0MlDm0kJBAOdDNHgathjSQEBXQoL6gsM63gfIRXmg0IACunueIZN1fRbWx1CBPznZIPBgAMJFhSSUCGRDSEOOtwCsUkQADs=', 'data:image/gif;base64,R0lGODlhFAAYANUAAAAAAP///yIjBDU1NOnMN+3PQe3QQ/DUTPPWVPneZvvFAvnDAvjDAvnDA/bBA/bCA/fCBPfDBPbBBPG9BPTABfK/BfG9BfC9Be67Bum4BtuqBzc2M+C8a+G+eOLAfuPBhNm5gOTDjeXFldu9kOXGnObHoubIpefJrOjLtOnMuz8fHm42NTQ0NDMzM////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAC4ALAAAAAAUABgAAAbQQJdwKGyxWMSk0mjRQDZI5fDIkig01wfm2EoeMxCHBqu4ahqUSqvrYl0YY3J5Ho84utS5fl+mCo8TC3x6R0kCA3lzVFFEAB0gIyQmiyknJQAASZiYl5gpKSgnJCKZjR0fIpInKCgAJyajmI2bqSYnrrAiIR+lLpgJCAAhqZclo7sepb8IB8LDJACxux3KCNYGAB8fISGb2dTKmAUEjh7a596amBwd7R0e7r1K6+zxslJD3pv4+Csu/vyIqBjoD2BAgUIMHnShgqEKhQuHNJQSBAA7', 'data:image/gif;base64,R0lGODlhFwAYAMQAAAAAAP///wIUI+nMN+3PQe3QQ/DUTPPWVPneZuG+eOPBhOTDjeXFleXGnObHoubIpefJrOjLtOnMu+rPxT8fHqgAAMcCAm42NevR0dTU1Lq6ulJSUv///wAAAAAAAAAAACH5BAEAABwALAAAAAAXABgAAAW4ICeOHGCeQEauKxAE1fumbO1WuEzX7S0HO57IBEGdVMISwwGRTJ6SYhDQWiybE8wkeiyZkF6A4wSFjI1ggADAaJgk8AikwQBoNMFSQtF+QCIRABuDG2gjKH2FPzMZXSUIB4KDQItAKl+PBwYuOjM6KhmXB6MFLhszJ4xgQwAEA5xAdnhfqyQmOrIuKbUsurm0SYcAFha0vDbDxRkXxzzJAMzMwbYmFKHS0yWh1hQU2MF5ItbT4dkcIQA7', 'data:image/gif;base64,R0lGODlhGAAXAMQAAAAAAP///wIUI///CP//jOrZA+nMN+3PQe3QQ/DUTPPWVPneZqh8A+OTEuOVEubTurpxQXogCdqLep0WDaoOCaQSCz8fHrUIBW42Nf/39////wAAAAAAAAAAAAAAAAAAACH5BAEAABoALAAAAAAYABcAAAWxoCaOI3ABgJaSbCuacJVGUTNALmleFyVrtcFAknuhUJXJ6gEZElsoofQokhCGEah0K0xBCsOHlrtFRYSMTOsRZQO4qcfZwQII3oMoOZVh3HRkXWVAfzpHQg0NADZSigNZdQsKeIl4jQBgOCWSCW+Mi4o2ig9gkAAKqAiWeUeVEo8MmioABwarU1ERDBGyJbeDRYBwK8GGR8TFLhgay8ksFtDLzc7PItPUIhYa0dg52sEhADs=', 'data:image/gif;base64,R0lGODlhFgAaAMQAAAAAAP///0Rj68bOzsbMzCMkJOnMN+3PQe3QQ/DUTPPWVPneZuC8a+G+eOLAfuPBhOTDjeHGmuXFleXGnObHoubIpefJrOjLtOnMu+rPxT8fHm42Nff39////wAAAAAAACH5BAEAAB0ALAAAAAAWABoAAAW8YCeOpEicKFGuJsG9MKeyoxvHMz3c/KDzPdauN3z5SsXYIMk51oDNYG0ZYDKbpUJkQFkuo8oVQCCgkAUZb5g0FkgmZIz8Yik6RYDG412xXC4AFhUTXmIAh3wWgYMSEA8AYgsKABBvFAAUE40PDpBskgmUlRMAmpQPDZ54CpMIAA8PEBCHh6iqI4cHBnkOsL60NB2HDA3FDQ7GtzQADMTJysG0wMHBGx3W1CUa29bY2doi3t8iGh3c4zTlNCEAOw==', 'data:image/gif;base64,R0lGODlhHgAYALMAAAAAAP///zFFV0NYawIUI0hpgl18lJawIWJuL50WDaoOCaQSC7UIBf///wAAAAAAACH5BAEAAA0ALAAAAAAeABgAAASvsMk5AQOgZcq719e1bF9JWQyjjGarYdiSZJjLYUiew8DC2hqdcOcjuQDDZK12xBhghmHsVwIQAFGnsng0RBHendRYhQkBA+mrBTgckDr0mPtpu+G7wUCO6FE7bRhvZzB6PGs3fW59SX04fRp/FTyNjT0wbJVjl008GGlnP0wlBQUNpS+gOxKcHgUCsKaorKo0khylAhKztHGHHrrBAry9CGmgox+vpjeeyR+6zEANEQA7', 'data:image/gif;base64,R0lGODlhGQAXALMAAAAAAP///xECAygFB+AbK4JjaW5UXQIUI/G/hfBtJj8fHm42Nejo6HBwcP///wAAACH5BAEAAA4ALAAAAAAZABcAAASS0Mk5QQLAZcp7veDmjVpimiLJYSyqrgAhy+xbzThta3k/2CxCEBdgGBkewCEmZBILUGTHmQMcGdDClcKixrBZqCHKRSC8BOw4TJYAzOdZ4MsOS99wZmPOMma3bngxAQE9YFojGAQBDT4OfyoAhTgAAg5qiJFdIodSNgsOoBKdLwqmoKKXkDYKEqlXniStpzulNhEAOw=='];


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
	var i,
		regexp,
		smileyHex = "",
		smileyHtml = "";

	for (i = 0; i < SMILEYS_REGEXP.length; i++) {
		regexp = new RegExp('\\[(' + SMILEYS_REGEXP[i] + ')]', 'g');
		smileyHtml = '<img src="' + SMILEYS_64[i] + '">';
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
			var closeTagList = [],
				ii = 0;
			for (ii = 0; ii < tagList.length; ii++) {
				if (tagList[ii] !== "\\*") { // the * tag doesn't have an offical closing tag
					closeTagList.push("/" + tagList[ii]);
				}
			}

			openTags = new RegExp("(\\[)((?:" + tagList.join("|") + ")(?:[ =][^\\]]*?)?)(\\])", "gi");
			closeTags = new RegExp("(\\[)(" + closeTagList.join("|") + ")(\\])", "gi");
		}());

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
		function reworkTags(matchStr, tagName, tagParams, tagContents) {
			matchStr = matchStr.replace(/\[/g, "<");
			matchStr = matchStr.replace(/\]/g, ">");
			return updateTagDepths(matchStr);
		}

		var tmpText;
		var everythingIsReplaced = false;
		while (!everythingIsReplaced) {
			tmpText = text;
			text = text.replace(pbbRegExp, reworkTags);
			everythingIsReplaced = text === tmpText;
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
			if (newtags.hasOwnProperty(tag)) {
				tags[tag] = newtags[tag];
			}
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

		function reworkTags(matchStr, tagName, tagParams, tagContents) {
			tagContents = tagContents.replace(/\[/g, "&#91;");
			tagContents = tagContents.replace(/\]/g, "&#93;");
			tagParams = tagParams || "";
			tagContents = tagContents || "";
			return "[" + tagName + tagParams + "]" + tagContents + "[/" + tagName + "]";
		}

		// process tags that don't have their content parsed
		var tmpConfigText;
		var everythingIsReplaced = false;
		while (!everythingIsReplaced) {
			tmpConfigText = config.text;
			config.text = config.text.replace(pbbRegExp2, reworkTags);
			everythingIsReplaced = config.text === tmpConfigText;
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
}());




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

function updatePreview(area) {
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

	var nbCarac = area.value.match(new RegExp(/\"/g));
	if (nbCarac !== null) {
		count = count + 5 * nbCarac.length;
	}

	nbCarac = area.value.match(new RegExp(/(>|<)/g));
	if (nbCarac !== null) {
		count = count + 3 * nbCarac.length;
	}

	foot.innerHTML = area.value.length + count + " caractères";
}

// Update the previsualisation area and display the character's counter when the keyup event is triggered
// @param event the keyup event
function updateAllPreviews() {
	var i;
	for (i = 0; i < Previews.length; i++) {
		updatePreview(Previews[i]);
	}
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


function mouseUp(evt) {
	setTimeout(updateAllPreviews, 50, evt);
}

// Creates and display the previsualisation area
// @param textarea the textarea to be previsualised
function createPreview(textarea) {
	var id = n_prevs++;

	textarea.id = "area" + id;
	Previews.push(textarea);

	var container = textarea.parentNode;
	
	var prev = document.createElement('div');
	prev.id = "preview" + id;
	prev.className = "bigcadre";
	prev.style.marginLeft = "0";
	prev.style.width = "97%";
	prev.style.padding = "5px";
	prev.innerHTML = "";

	var footer = document.createElement('div');
	footer.id = "footer" + id;

	// This one is used as a container
	var paragraph = document.createElement('p');
	textarea.parentNode.insertBefore(paragraph, textarea);
	paragraph.parentNode.removeChild(textarea);
	paragraph.appendChild(textarea);
	paragraph.appendChild(prev);
	paragraph.appendChild(footer);
	
	textarea.addEventListener('keyup', updateAllPreviews, false);
	textarea.addEventListener('mouseup', mouseUp, false);
}

// Removes every stupid '>' that cut the post's sentences is pieces.
// @param textarea the textarea to be cleaned
function removeBadQuotes(textarea) {
	textarea.value = textarea.value.replace(/ \n(?:> )+(?=[\wéàçèäâêë\[])/g, " ");
	textarea.value = textarea.value.replace(/ {2}/g, " ");
}

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
		updateAllPreviews();
		return false;
	};
}

function makeTagOnclickHandler(tagString, htmlIdentifier) {
	return function () {
		addTag(tagString, htmlIdentifier);
		updateAllPreviews();
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
	var startingSmileyIndex = (SMILEY_COUNT_PER_TAB * tableNum);

	var tr = document.createElement('tr');
	var i = 0;

	for (i = 0; i < SMILEY_COUNT_PER_TAB; i++) {
		var td = document.createElement('td');
		var a = document.createElement('a');
		a.onclick = makeSmileyOnclickHandler(SMILEYS[(SMILEY_COUNT_PER_TAB * tableNum) + i], areaId);
		a.href = '#';
		a.areaId = areaId.substr("area".length, areaId.length);

		var image = document.createElement('img');
		image.src = SMILEYS_64[startingSmileyIndex + i];
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

	node.appendChild(a);
}

function add_toolbar(area) {
	var i = 0,
		toolbar = document.createElement('span'),
		normalTags = {
			'b': b_str,
			'i': i_str,
			'u': u_str,
			'strike': s_str,
			'left': left_str,
			'center': center_str,
			'right': right_str,
			'quote': quote_str,
			'img': img_str,
			'url': url_str,
			'mail': mail_str
		},
		colorTagsFirstRow = {
			"yellow": "#f4ac00",
			"orange": "#f77400",
			"fuchsia": "#ed6161",
			"red": "#d50000",
			"maroon": "#7b0000",
			"brown": "#5e432d",
			"purple": "purple",
			"navy": "#00007b"
		},
		colorTagsSecondRow = {
			"blue": "#2b2be4",
			"lightblue": "#5577bc",
			"teal": "#007b7b",
			"lightgreen": "#219c5a",
			"green": "#006f00",
			"olive": "#7b7b00",
			"gray": "#7b7b7b",
			"darkgray": "#5a5a5a"
		},
		dataProperty,
		table = document.createElement('table'),
		tr,
		td,
		a;

	table.style.display = "inline";
	table.style.border = "0";
	table.cellSpacing = 1;
	table.cellPadding = 0;

	tr = document.createElement('tr');

	for (dataProperty in normalTags) {
		if (normalTags.hasOwnProperty(dataProperty)) {
			td = document.createElement('td');
			td.style.border = "1px solid #999999";
			td.width = "18px";
			td.height = "17px";
			td.rowSpan = "2";
			add_tool(td, normalTags[dataProperty], dataProperty, area.id, true);
			tr.appendChild(td);
		}
	}

	for (dataProperty in colorTagsFirstRow) {
		if (colorTagsFirstRow.hasOwnProperty(dataProperty)) {
			td = document.createElement('td');
			td.style.border = "1px solid #999999";
			td.width = "8px";
			td.height = "8px";
			add_tool(td, colorTagsFirstRow[dataProperty], dataProperty, area.id, false);
			tr.appendChild(td);
		}
	}

	table.appendChild(tr);
	td = document.createElement('td');

	// -------------------- smiley -------------------------
	td.style.border = "1px solid #999999";
	td.rowSpan = 2;

	a = document.createElement('a');
	a.onclick = makeDisplaySmileysOnclickHandler(area.id);
	a.href = '#';
	a.id = area.id.substr("area".length, area.id.length);

	var image = document.createElement('img');
	image.src = 'http://img.kraland.org/s/' + "01" + '.gif';

	a.appendChild(image);
	td.appendChild(a);
	tr.appendChild(td);
	// -------------------- smiley -------------------------

	tr = document.createElement('tr');

	for (dataProperty in colorTagsSecondRow) {
		if (colorTagsSecondRow.hasOwnProperty(dataProperty)) {
			td = document.createElement('td');
			td.style.border = "1px solid #999999";
			td.width = "8px";
			td.height = "8px";
			add_tool(td, colorTagsSecondRow[dataProperty], dataProperty, area.id, false);
			tr.appendChild(td);
		}
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
	} else if (isPopupFrame()) {
		extendTextArea();
		var areas = document.getElementsByTagName('textarea');
		var i = 0;
		for (i = 0; i < areas.length; i++) {
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
				if (xhr.readyState === 4 && xhr.status === 200) {
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
	
	updateAllPreviews();
}

main();
