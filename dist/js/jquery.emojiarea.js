/**
 * emojiarea - A rich textarea control that supports emojis, WYSIWYG-style.
 * Copyright (c) 2012 DIY Co
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@diy.org>
 */

(function($, window, document) {
    var ELEMENT_NODE = 1;
    var TEXT_NODE = 3;
    var TAGS_BLOCK = ['p', 'div', 'pre', 'form'];
    var KEY_ESC = 27;
    var KEY_TAB = 9;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    $.emojiarea = {
        path: '',
        icons: {},
        defaults: {
            button: null,
            buttonLabel: 'Emojis',
            buttonPosition: 'after'
        }
    };

    $.fn.emojiarea = function(options) {
        options = $.extend({}, $.emojiarea.defaults, options);
        return this.each(function() {
            var $textarea = $(this);
            if ('contentEditable' in document.body && options.wysiwyg !== false) {
                new EmojiArea_WYSIWYG($textarea, options);
            } else {
                new EmojiArea_Plain($textarea, options);
            }
        });
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var util = {};

    util.restoreSelection = (function() {
        if (window.getSelection) {
            return function(savedSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                for (var i = 0, len = savedSelection.length; i < len; ++i) {
                    sel.addRange(savedSelection[i]);
                }
            };
        } else if (document.selection && document.selection.createRange) {
            return function(savedSelection) {
                if (savedSelection) {
                    savedSelection.select();
                }
            };
        }
    })();

    util.saveSelection = (function() {
        if (window.getSelection) {
            return function() {
                var sel = window.getSelection(), ranges = [];
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        ranges.push(sel.getRangeAt(i));
                    }
                }
                return ranges;
            };
        } else if (document.selection && document.selection.createRange) {
            return function() {
                var sel = document.selection;
                return (sel.type.toLowerCase() !== 'none') ? sel.createRange() : null;
            };
        }
    })();

    util.replaceSelection = (function() {
        if (window.getSelection) {
            return function(content) {
                var range, sel = window.getSelection();
                var node = typeof content === 'string' ? document.createTextNode(content) : content;
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(' '));
                    range.insertNode(node);
                    range.setStart(node, 0);

                    window.setTimeout(function() {
                        range = document.createRange();
                        range.setStartAfter(node);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }, 0);
                }
            }
        } else if (document.selection && document.selection.createRange) {
            return function(content) {
                var range = document.selection.createRange();
                if (typeof content === 'string') {
                    range.text = content;
                } else {
                    range.pasteHTML(content.outerHTML);
                }
            }
        }
    })();

    util.insertAtCursor = function(text, el) {
        text = ' ' + text;
        var val = el.value, endIndex, startIndex, range;
        if (typeof el.selectionStart != 'undefined' && typeof el.selectionEnd != 'undefined') {
            startIndex = el.selectionStart;
            endIndex = el.selectionEnd;
            el.value = val.substring(0, startIndex) + text + val.substring(el.selectionEnd);
            el.selectionStart = el.selectionEnd = startIndex + text.length;
        } else if (typeof document.selection != 'undefined' && typeof document.selection.createRange != 'undefined') {
            el.focus();
            range = document.selection.createRange();
            range.text = text;
            range.select();
        }
    };

    util.extend = function(a, b) {
        if (typeof a === 'undefined' || !a) { a = {}; }
        if (typeof b === 'object') {
            for (var key in b) {
                if (b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
        }
        return a;
    };

    util.escapeRegex = function(str) {
        return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    };

    util.htmlEntities = function(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var EmojiArea = function() {};

    EmojiArea.prototype.setup = function() {
        var self = this;

        this.$editor.on('focus', function() { self.hasFocus = true; });
        this.$editor.on('blur', function() { self.hasFocus = false; });

        this.setupButton();
    };

    EmojiArea.prototype.setupButton = function() {
        var self = this;
        var $button;

        if (this.options.button) {
            $button = $(this.options.button);
        } else if (this.options.button !== false) {
            $button = $('<a href="javascript:void(0)">');
            $button.html(this.options.buttonLabel);
            $button.addClass('emoji-button');
            $button.attr({title: this.options.buttonLabel});
            this.$editor[this.options.buttonPosition]($button);
        } else {
            $button = $('');
        }

        // if ($(".usr_msg_smilebox_for_msg").attr('class') != 'usr_msg_smilebox_for_msg') {
        //     if ($button.next().is("a")) {
        //         $('#smiles-boxx').parent().append('<div class="smiles-box" data-id="' + this.$textarea.attr('id') + '"></div>');
        //     } else {
        //         $button.after('<div class="smiles-box" data-id="' + this.$textarea.attr('id') + '"></div>');
        //     }
        //
        // }

		$('#smile-boxx').append('<div class="smiles-box" data-id="' + this.$textarea.attr('id') + '"></div>');

        $button.on('click', function(e) {
            if ($(this).hasClass('visible-menu')) {
                $(this).removeClass('visible-menu');
                EmojiMenu.show(self, true);
            } else {
                $(this).addClass('visible-menu');
                EmojiMenu.show(self, false);
            }
            e.stopPropagation();
        });

        this.$button = $button;
    };

    EmojiArea.createIcon = function(emoji) {
        var filename = $.emojiarea.icons[emoji];
        var path = $.emojiarea.path || '';
        if (path.length && path.charAt(path.length - 1) !== '/') {
            path += '/';
        }
        return '<img src="' + path + filename + '" alt="' + util.htmlEntities(emoji) + '">';
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /**
     * Editor (plain-text)
     *
     * @constructor
     * @param {object} $textarea
     * @param {object} options
     */

    var EmojiArea_Plain = function($textarea, options) {
        this.options = options;
        this.$textarea = $textarea;
        this.$editor = $textarea;
        this.setup();
    };

    EmojiArea_Plain.prototype.insert = function(emoji) {
        if (!$.emojiarea.icons.hasOwnProperty(emoji)) return;
        util.insertAtCursor(emoji, this.$textarea[0]);
        this.$textarea.trigger('change');
    };

    EmojiArea_Plain.prototype.val = function() {
        return this.$textarea.val();
    };

    util.extend(EmojiArea_Plain.prototype, EmojiArea.prototype);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /**
     * Editor (rich)
     *
     * @constructor
     * @param {object} $textarea
     * @param {object} options
     */

    var EmojiArea_WYSIWYG = function($textarea, options) {
        var self = this;

        this.options = options;
        this.$textarea = $textarea;
        this.$editor = $('<div>').addClass('emoji-wysiwyg-editor');
        this.$editor.text(
            $textarea.val().toString().replace(/\n/g, "<br />")
        );
        this.$editor.attr({contenteditable: 'true'});

        this.$editor.on('cut copy', function(e) {
            if (undefined !== e.originalEvent.clipboardData) {
                var selection = window.getSelection();
                text = selection.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');
                var newdiv = document.createElement('div');
                $(newdiv).attr('style', 'left: -100%; position: absolute; display: block; top: -100%;');
                $(newdiv).html(text);
                document.body.appendChild(newdiv);

                if (document.selection) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(newdiv);
                    range.select();
                } else if (window.getSelection) {
                    var range = document.createRange();
                    range.selectNode(newdiv);
                    // window.getSelection().addRange(range);
                }

                window.setTimeout(function() {
                    $(newdiv).remove();
                },0);
            }
        });

        this.$editor.on('blur keyup paste', function(e) {
            if (undefined !== e.originalEvent.clipboardData) {
                e.preventDefault();
                var text = (e.originalEvent || e).clipboardData.getData('text/html');

                if (text == '' || text.indexOf("<html") > -1 || text.indexOf("<meta") > -1) {
                    text = (e.originalEvent || e).clipboardData.getData('text/plain');
                    text = text.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');
                    // text = text.toString().replace(/[\u0100-\uFFFF]/g,'');
                }

                var $result = $('<div></div>').html(text);

                // replace all styles except bold and italic
                $.each($result.find("*"), function(idx, val) {
                    var $item = $(val);
                    if (!$(val).is('img') && !(val instanceof HTMLBRElement) ) {
                        $item.replaceWith($(val).text());
                    }
                });

                var cleanedText = $result.html();
                document.execCommand('insertHtml', false, cleanedText);
            }

            return self.onChange.apply(self, arguments);
        });
        this.$editor.on('mousedown focus', function() { document.execCommand('enableObjectResizing', false, false); });
        this.$editor.on('blur', function() { document.execCommand('enableObjectResizing', true, true); });

        var html = this.$editor.text();
        var emojis = $.emojiarea.icons;
        for (var key in emojis) {
            if (emojis.hasOwnProperty(key)) {
                html = html.replace(new RegExp(util.escapeRegex(key), 'g'), EmojiArea.createIcon(key));
            }
        }
        this.$editor.html(html);

        $textarea.hide().after(this.$editor);

        this.setup();

        this.$button.on('mousedown', function() {
            if (self.hasFocus) {
                self.selection = util.saveSelection();
            }
        });
    };

    EmojiArea_WYSIWYG.prototype.onChange = function() {
        // console.log(this.val());
        this.$textarea.val(this.val()).trigger('change');
    };

    EmojiArea_WYSIWYG.prototype.insert = function(emoji) {
        var content;
        var $img = $(EmojiArea.createIcon(emoji));
        if ($img[0].attachEvent) {
            $img[0].attachEvent('onresizestart', function(e) { e.returnValue = false; }, false);
        }

        this.$editor.trigger('focus');
        //if (this.selection && (this.selection.endOffset !== 0 || this.selection.startOffset !== 0)) {
        //	util.restoreSelection(this.selection);
        //}
        try { util.replaceSelection($img[0]); } catch (e) {}
        this.onChange();
    };

    EmojiArea_WYSIWYG.prototype.val = function() {
        var lines = [];
        var line  = [];

        var flush = function() {
            lines.push(line.join(''));
            line = [];
        };

        var sanitizeNode = function(node) {
            if (node.nodeType === TEXT_NODE) {
                line.push(node.nodeValue);
            } else if (node.nodeType === ELEMENT_NODE) {
                var tagName = node.tagName.toLowerCase();
                var isBlock = TAGS_BLOCK.indexOf(tagName) !== -1;

                if (isBlock && line.length) flush();

                if (tagName === 'img') {
                    var alt = node.getAttribute('alt') || '';
                    if (alt) line.push(alt);
                    return;
                } else if (tagName === 'br') {
                    flush();
                }

                var children = node.childNodes;
                for (var i = 0; i < children.length; i++) {
                    sanitizeNode(children[i]);
                }

                if (isBlock && line.length) flush();
            }
        };

        var children = this.$editor[0].childNodes;
        for (var i = 0; i < children.length; i++) {
            sanitizeNode(children[i]);
        }

        if (line.length) flush();

        return lines.join('\n');
    };

    util.extend(EmojiArea_WYSIWYG.prototype, EmojiArea.prototype);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /**
     * Emoji Dropdown Menu
     *
     * @constructor
     * @param {object} emojiarea
     */
    var EmojiMenu = function(emojiarea) {
        var self = this;
        var $body = $(document.body);
        var $container;
        if ($(".usr_msg_smilebox_for_msg").attr('class') == 'usr_msg_smilebox_for_msg' || $(".usr_msg_smilebox_for_msg_foreign").attr("class") == "usr_msg_smilebox_for_msg_foreign") {
            if (emojiarea.$button.attr('data-menu').length > 0) {
                $container = $(".usr_msg_smilebox_for_msg" + emojiarea.$button.attr('data-menu'));
            } else {
                $container = $(".usr_msg_smilebox_for_msg");
            }

        } else {
            $container = $('.smiles-box[data-id=' + emojiarea.$textarea.attr('id') + ']');
        }

        if ($container.length > 1) {
            $container = $container.first();
        }

        var $window = $(window);

        this.emojiarea = null;

        if ($('div.emoji-menu', $container).hasClass('emoji-menu')) {
            this.$menu = $('div.emoji-menu', $container);
            this.$items = $('div.emoji-menu > div', $container);
        } else {
            this.$menu = $('<div>');
            this.$menu.addClass('emoji-menu');
            this.$menu.attr('data-menu', emojiarea.$button.attr('data-menu'));
            this.$menu.hide();
            this.$items = $('<div>').appendTo(this.$menu);
            $container.html(this.$menu);
        }

        this.visible = false;

        $body.on('keydown', function(e) {
            if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) {
                self.hide();
            }
        });

		/*$body.on('mouseup', function(e) {
		 if (!$(e.target).closest('.emoji-menu').length) {
		 self.hide();
		 }
		 });*/

        $window.on('resize', function() {
            if (self.visible) self.reposition();
        });

        this.$menu.on('mouseup', 'a', function(e) {
            e.stopPropagation();
            return false;
        });


        this.$menu.unbind('click');

        this.$menu.on('click', 'a', function(e) {
            var emoji = $('.label', $(this)).text();
            window.setTimeout(function() {
                self.onItemSelected.apply(self, [emoji]);
            }, 0);
            e.stopPropagation();
            return false;
        });

        this.load();
    };

    EmojiMenu.prototype.onItemSelected = function(emoji) {
        this.emojiarea.insert(emoji);
        // this.hide();
    };

    EmojiMenu.prototype.load = function() {
        var html = [];
        var options = $.emojiarea.icons;
        var path = $.emojiarea.path;
        if (path.length && path.charAt(path.length - 1) !== '/') {
            path += '/';
        }

        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var filename = options[key];
                html.push('<a href="javascript:void(0)" title="' + util.htmlEntities(key) + '">' + EmojiArea.createIcon(key) + '<span class="label">' + util.htmlEntities(key) + '</span></a>');
            }
        }

        this.$items.html(html.join(''));
    };

    EmojiMenu.prototype.reposition = function() {
        var $button = this.emojiarea.$button;
        var offset = $button.offset();
        offset.top += $button.outerHeight();
        offset.left += Math.round($button.outerWidth() / 2);
        var menuHeight = this.$menu.height();

        if ((offset.top - $(window).scrollTop()) > ($(window).height() / 2)) {
            styles = {top: offset.top - menuHeight - $button.outerHeight(), left: offset.left}
        } else {
            styles = {top: offset.top, left: offset.left}
        }

        this.$menu.css(styles);
    };

    EmojiMenu.prototype.hide = function(callback) {
        if (this.emojiarea) {
            this.emojiarea.menu = null;
            this.emojiarea.$button.removeClass('on');
            // this.emojiarea = null;
        }
        this.visible = false;
        this.$menu.hide();
    };

    EmojiMenu.prototype.show = function(emojiarea) {
        // console.lgo(this.visible);
        if (this.visible) {
            this.hide();
        } else {
            if (this.emojiarea && this.emojiarea === emojiarea) return;
            this.emojiarea = emojiarea;
            this.emojiarea.menu = this;
            this.reposition();
            this.$menu.show();
            this.visible = true;
        }

    };

    EmojiMenu.show = (function() {
        var menu = null;
        return function(emojiarea, visible) {
            menu = new EmojiMenu(emojiarea);
            if (visible) {
                menu.hide();
            } else {
                menu.show(emojiarea);
            }

        };
    })();

})(jQuery, window, document);