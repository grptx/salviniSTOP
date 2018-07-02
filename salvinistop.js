MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var valuestopped = 0;

//definisco il blocco da schiantare in overlay
blocker = '<div class="salviniblocker">' +
    '<div class="salviniblocker-profile-fader"></div>' +
    '<div class="salviniblocker-inner">' +
    '<div class="salviniblocker-txt">' +
    '<div class="salviniblocker-disclaimer fwb">ATTENZIONE, può contenere materiale fascioleghista</div>' +
    '<div class="salviniblocker-ctas">' +
    '<span class="salviniblocker-cta quote _42ft _4jy0 _4jy3 _517h">Sostituisci con perla random</span>' +
    '<span class="salviniblocker-close _42ft _4jy0 _4jy3 _517h">Mi arrischio.</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

//definisco le chiavi di ricerca
keywords = [
    /(salvin)+/gi,
    /(lega)+/gi,
    /(primagliitaliani)+/gi
];


var newPost =
    '<div class="topBorder"></div>' +
    '<div class="salvinistopped">' +
    '<div role="article">' +
    '<div class="userContentWrapper salviniBlockDone"></div>' +
    '</div>' +
    '</div>' +
    '<div class="bottomBorder"></div>';


$.fn.randomQuote = function () {
    var element = this;


    userInfo = $('.clearfix._5x46');

    var userInfo = this.find($(userInfo));

    element.wrapInner('<div class="temp_controller"></div>');

    var blocker = element.find('.salviniblocker');
    var old = element.find('.temp_controller');

    blocker.appendTo(element);

    old.height(old.height()).contents().remove();

    blocker.animate({
        'opacity': 0
    }, 150, function () {
        blocker.remove()
    });

    function successo(results) {

        var curHeight = old.height();
        old.css('height', 'auto');

        old.append(newPost).css({'opacity': '0'}).find('.salvinistopped').prepend(userInfo);

        //var authLink = results.titles.replace(' ', '+')

        var str = '<span class="salviniblock-quote">' + results.quote + '</span><br><br>(' + results.titles + ')';

        var html = $.parseHTML(str);
        element.find('.userContentWrapper').append(html);

        var autoHeight = old.height();
        old.height(curHeight).animate({
            'opacity': '1',
            'height': autoHeight

        }, 150);


        //se è vuota recuperane un altra
        if (old.find('.salviniblock-quote').text() == 'undefined') {
            console.log('quote undefined, restart...')
            element.randomQuote()

        } else {
            chrome.storage.sync.get(/* String or Array */["salvini-stopped"], function(items){
                var value = parseInt(items["salvini-stopped"]);
                if(!value) {
                    value=0;
                }
                value++;
                valuestopped = value;
                chrome.storage.sync.set({ "salvini-stopped": value }, function(){
                    chrome.extension.sendMessage('salvini-stopped-msg');
                });
                //console.log(items);

            });
        }

    }

    function test(results) {
        console.log(results.titles)
        console.log('cit: ' + results.quote)
        console.log('------------')
    }

    function testError(errore) {
        console.error('Errore: ' + errore);
    }

    function errore(errore) {
        console.error('Errore: ' + errore);
        console.log('restart della funzione...')
        go()
    }

    var authors = [
        "Karl Popper",
        "Karl Marx",
        "Antonio Gramsci",
        "Thomas Hobbes",
        "John Locke",
        "Immanuel Kant",
        "Friedrich Nietzsche",
        "Marcel Proust",
        "Bertolt Brecht",
        "Platone",
        "Albert Einstein",
        "Schopenhauer",
        "Aristotele",
        "Sigmund Freud",
        "Blaise Pascal",
        "Sartre",
        "Hegel",
        "Montaigne",
        "John Maynard Keynes",
        "Wittgenstein",
        "Kierkegaard",
        "Isaac Newton",
        "Martin Heidegger",
        "Carl Gustav Jung",
        "Michel Foucault",
        "Simone Weil",
        "Cesare Beccaria",
        "Palmiro Togliatti",
        "Enrico Berlinguer",
        "Giacomo Matteotti",
        "Filippo Turati",
        "Giorgio Amendola",
        "Sandro Pertini",
        "Tommaso Moro",
        "Robert Owen",
        "Henri de Saint-Simon",
        "Charles Fourier",
        "Pierre-Joseph Proudhon",
        "Alexander Herzen",
        "John Stuart Mill",
        "Friedrich Engels",
        "Michail Bakunin",
        "Léon Blum",
        "Benedetto Croce",
        //risorgimento
        "Adelaide Cairoli",
        "Amatore Sciesa",
        "Beppe Fenoglio",
        "Carlo Cattaneo",
        "Carlo Pisacane",
        "Enrico Toti",
        "Felice Orsini",
        "Francesco Crispi",
        "Gabriele Rossetti",
        "Giovanni Berchet",
        "Giuseppe Mazzini",
        "Goffredo Mameli",
        "Guglielmo Pepe",
        "Luigi Settembrini",
        "Madame de Staël",
        "Massimo d'Azeglio",
        "Pietro Colletta",
        "Silvio Pellico",
        "Stendhal",
        "Tommaso Campanella",
        "Ugo Foscolo",
        "Vincenzo Cuoco",
        "Vincenzo Gioberti",
        "Vittorio Alfieri"
        //		"Luigi Einaudi",
        //		"Alcide De Gasperi"
    ];


    function go() {
        var author = authors[Math.floor(Math.random() * authors.length)];
        //console.log(author);
        WikiquoteApi.getRandomQuote(author, successo, errore);
    }

    go()

};


$.fn.block = function (container) {
    var container = container;
    var current = this;
    if (
        !this.hasClass('salviniblocked')
        &&
        !this.parents('.salviniblocked').length > 0
    ) {

        this.addClass('salviniblocked').prepend(blocker);

        this.find('.salviniblocker-close').click(function () {
            $(this).closest('div.salviniblocker').animate({
                'opacity': 0
            }, 150, function () {
                $(this).closest('div.salviniblocker').remove()
            })

        });

        this.find('.salviniblocker-cta.quote').click(function () {
            //qui chiamo la citazione
            current.randomQuote()
        })


    }
};


var observer = new MutationObserver(function (mutations) {
    var wallItem;
    var container;

    if ($(".groupJumpLayout")[0]){
        // in un gruppo
        //console.log("GRUPPO");
        wallItem = $('[id^=mall_post]');
        container = wallItem;
    } else if ($(".homeWiderContent")[0]){
        // nella home
        //console.log("IN HOME");
        //wallItem = $('[id^=hyperfeed_story_id]');
        wallItem = $('._4-u2.mbm');
        container = wallItem.parent();
    } else {
        //profilo personale
        //console.log("PERSONA");
        wallItem = $('._4-u2.mbm');
        container = wallItem;
    }
    if(wallItem) {
        container = wallItem;//.parent();

        wallItem.each(function () {
            var element = $(this);
            $.each(keywords, function (key, value) {
                //console.log($this);
                var rSearchTerm = new RegExp(value);
                //console.log($this)
                element.contents().filter(function (value) {

                    //element.css({'background':'red'})
                    return (rSearchTerm).test($(this).text()); // return every match as jQuery obj
                }).closest(container).block($(container)); // <--example, do your stuff here.
            });
        })
    }

});


// select the target node
var target = document.querySelector('#globalContainer');

// configuration of the observer:
var config = {
    childList: true,
    attributes: false,
    characterData: true,
    subtree: true
};

// pass in the target node, as well as the observer options
observer.observe(target, config);