//
(function (_document, _window) {
    'use strict';

    var CONFIG = {
        'app.name': 'ankostyuk-page',
        'content.url': 'src/views/content/',
        'default.lang': 'ru'
    };

    function App() {
        //
        var url             = purl(),
            locationSearch  = url.param(),
            $html           = $('html'),
            $app            = $('#' + CONFIG['app.name']),
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
            console.info('*** loadContent...');

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
                console.warn('*** always, templates:', templates);
                $.each(templates, function(k, t){
                    console.info('*', k, t);
                    $('[' + k + ']').each(function(){
                        $(this).html(t.html);
                    });
                });
                $app.addClass('ready');
            });
        }

        //
        return {
            init: function() {
                checkLocalConfig();
                checkLang();
                loadContent();
            }
        };
    }

    // startup
    $(function() {
        var app = new App();
        app.init();
    });
})(document, window);
