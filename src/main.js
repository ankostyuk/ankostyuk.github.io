//
(function (_document, _window) {
    'use strict';

    var CONFIG = {
        'app.name': 'ankostyuk.github.io',
        'default.lang': 'ru'
    };

    function App() {
        //
        var url             = purl(),
            locationSearch  = url.param(),
            $html           = $('html'),
            localConfig     = {};

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
            // console.info('*** loadContent', this);
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
