//
(function (_document, _window) {
    'use strict';

    var CONFIG = {
        'app.name': 'ankostyuk-page',
        'content.url': 'src/views/content/',
        'default.lang': 'ru'
    };

    function App(options) {
        options = options || {};

        //
        var url             = purl(),
            locationSearch  = url.param(),
            $html           = $('html'),
            $app            = options.container,
            localConfig     = {},
            templates       = {};

        //
        function checkLocalConfig() {
            var localStorageItem = _window.localStorage && _window.localStorage.getItem(CONFIG['app.name']);

            localConfig = null;

            try {
                localConfig = JSON.parse(localStorageItem);
            } catch(e) {}

            localConfig = localConfig || {};
        }

        function storeLocalConfig() {
            if (_window.localStorage) {
                _window.localStorage.setItem(CONFIG['app.name'], JSON.stringify(localConfig));
            }
        }

        function checkLang() {
            localConfig['lang'] = locationSearch['lang'] || localConfig['lang'] || CONFIG['default.lang'];
            $html.attr('lang', localConfig['lang']);
            storeLocalConfig();
        }

        function loadContent() {
            var lang            = localConfig['lang'],
                requests        = [];

            var contentViews    = [
                'base.html',
                lang + '/main.html'
            ];

            $.each(contentViews, function(i, v){
                var r = $.get(CONFIG['content.url'] + v, function(data){
                    $(data).each(function(){
                        var $t = $(this),
                            id = $t.attr('id');

                        if (id) {
                            templates[id] = {
                                html: $t.html()
                            };
                        }
                    });
                });
                requests.push(r);
            });

            $.when.apply($, requests).always(function(){
                $.each(templates, function(k, t){
                    $('[' + k + ']').each(function(){
                        $(this).html(t.html);
                    });
                });
                $app.addClass(CONFIG['app.name'] + '_ready');
            });
        }

        function initTags() {
            $app.find('.ap-tags-bar [ap-tag-toggle]').click(function(){
                var $tagToggle  = $(this),
                    tag         = $tagToggle.attr('ap-tag-toggle'),
                    on          = $tagToggle.hasClass('btn-primary'),
                    $tagContent = $app.find('[ap-tag="' + tag + '"]');

                if (on) {
                    $tagToggle.removeClass('btn-primary').addClass('btn-default');
                    $tagContent.hide();
                } else {
                    $tagToggle.removeClass('btn-default').addClass('btn-primary');
                    $tagContent.show();
                }
            });
        }

        //
        return {
            init: function() {
                checkLocalConfig();
                checkLang();
                loadContent();
                initTags();
            }
        };
    }

    // startup
    $(function() {
        var app = new App({
            container: $('body')
        });
        app.init();
    });
})(document, window);
