// ==UserScript==
// @name         Emojify
// @namespace    None
// @version      1.0.2
// @description  Dreams do come true, a script that transforms text based code into Emojis, uses discord like syntax.
// @author       Marshal
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const emojiMap = {
        ":Shiggy_sad:": "https://cdn.discordapp.com/emojis/1214056479871471656.webp?size=48",
        ":AquaSalute:": "https://cdn.discordapp.com/emojis/1123713278728732753.webp?size=48",
        ":Woeful:": "https://cdn.discordapp.com/emojis/1233132750366576723.webp?size=48&animated=true",
        ":Yesyesyes:": "https://cdn.discordapp.com/emojis/1167599942982975498.webp?size=48&animated=true",
        ":Cirnoyes:":  "https://cdn.discordapp.com/emojis/619631386852065282.webp?size=48",
        ":Sillydance:": "https://cdn.discordapp.com/emojis/1195422281443324026.webp?size=48&animated=true",
        ":<3:":  "https://cdn.discordapp.com/emojis/1195419982817935496.webp?size=48&animated=true",
        ":Pat:":  "https://cdn.discordapp.com/emojis/1057461468909535272.webp?size=48&animated=true",
        ":Catroll:":  "https://cdn.discordapp.com/emojis/1245432352310689934.webp?size=48&animated=true",

        // You can add as much as you can from any vaild URL, the default are my most used/Favorites

    };

    // Function to replace emojis in a text node
    function replaceEmojisInTextNode(node) {
        let text = node.nodeValue;
        let changed = false;

        for (const [shortcode, url] of Object.entries(emojiMap)) {
            if (text.includes(shortcode)) {
                text = text.replace(new RegExp(shortcode, 'g'), ` <img src="${url}" alt="${shortcode}" style="width: 24px; height: 24px;"> `);
                changed = true;
            }
        }

        if (changed) {
            const tempDiv = document.createElement("span");
            tempDiv.innerHTML = text;
            node.replaceWith(...tempDiv.childNodes);
        }
    }

    // Function to process all text nodes inside an element
    function replaceEmojisInElement(element) {
        if (!element) return;

        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            replaceEmojisInTextNode(node);
        }
    }

    function replaceEmojisInInput(input) {
        let newText = input.value;
        for (const shortcode of Object.keys(emojiMap)) {
            newText = newText.replace(new RegExp(shortcode, 'g'), ""); // Remove text-based emojis
        }

        if (newText !== input.value) {
            input.value = newText;
        }
    }

    // Observe DOM changes and replace emojis dynamically
    function observeElementChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        replaceEmojisInElement(node);
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        replaceEmojisInTextNode(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Listen for input events on text areas and inputs
    document.addEventListener("input", function(event) {
        if (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT") {
            replaceEmojisInInput(event.target);
        }
    });

    replaceEmojisInElement(document.body);
    observeElementChanges();
})();
