

(function( $ ){

    var gitems	=	[];
    var onceIsBind  =   false;
    var imgloaded   =   [];
    var lastUstawElementyTime   =   0;
    var lastUstawElementyAr   =   [];

    var methods = {
        ustawElementyAll : function() {
            cTime = new Date();
            cmTime = cTime.getTime();
            maxDiff =   150;
            if(lastUstawElementyTime>(cmTime - maxDiff)) {
                for(k in lastUstawElementyAr) {
                    clearTimeout(lastUstawElementyAr[k]);
                }
                index   =   setTimeout(function() { $('').mosaic('ustawElementyAll'); }, 50);
                lastUstawElementyAr.push(index);
                return;
            }
            lastUstawElementyTime   =   cmTime;
            for(key in gitems) {
                ustawElementy(gitems[key]);
            }
        } ,
        wczytajWidoczneAll: function() {
            for(key in gitems) {
                wczytajWidoczne(gitems[key]);
            }
        }
    };

    function initElements(th) {

        $(th).find(".mosaicpic-source li").each(function() {
            urlThumb    =   $(this).attr("data-thumb");
            urlFull     =   $(this).attr("data-full");
            $(th).find(".mosaicpic-wrapper").append("<div class=\"mosaicpic-wrapper-items\" data-full='" + urlFull + "' data-url='" + urlThumb + "'><div></div></div>");
        });

        $(th).find(".mosaicpic-wrapper-items").click(function() {
            dataIndex   =   $(this).closest(".mosaicpic-wrapper").attr("data-index");

            if(gitems[dataIndex].mosaicpic_options.onClick) {
                gitems[dataIndex].mosaicpic_options.onClick.apply(this);
            }





        });

    }

    function ustawElementy(th, isSecond) {

        if(isSecond==undefined) {
            isSecond    =   false;
        }

        szerokosc    =   0;
        if(isSecond) {
            szerokosc    =   th.find(".mosaicpic-wrapper").width();
        }

        ob  =   $(th).find(".mosaicpic-wrapper");
        maxHeight   =   ob.attr("data-maxheight");
        ob.height(maxHeight);

        $(th).find(".mosaicpic-wrapper div.mosaicpic-wrapper-items").css({
            width:  'auto' ,
            left:   0 ,
            top:    0 ,
            height: 'auto'
        });

        if(!isSecond) {
            szerokosc   =   th.find(".mosaicpic-wrapper").width();
        }

        maxWidthItem        =   th.mosaicpic_options.maxWidth;
        IloscWWierszu       =   Math.ceil(szerokosc / maxWidthItem);
        SzerokoscPerItem    =   Math.floor(szerokosc / IloscWWierszu);
        LastItemWidth       =   ( ( szerokosc - ( SzerokoscPerItem * IloscWWierszu ) ) +  SzerokoscPerItem );

        xKey    =   1;
        left    =   0;
        sumTop  =   0;
        // suggestHeight   =   SzerokoscPerItem;

        var arrayColsHeight =   [];
        var autoMosonry =   true;
        if(autoMosonry) {
            for(x=1;x<=IloscWWierszu;x++) {
                arrayColsHeight[x]  =   0;
            }
        }



        $(th).find(".mosaicpic-wrapper div.mosaicpic-wrapper-items").each(function() {

            if(autoMosonry) {
                xKey    =   1;
                minK    =   1;
                minKH   =   0;
                for(k in arrayColsHeight) {
                    if(minKH>arrayColsHeight[k] || k==1) {
                        minKH = arrayColsHeight[k];
                        minK    =   k; // first min
                    }
                }
                xKey    =   minK;
                left    =   SzerokoscPerItem * ( xKey - 1 );
            }

            SetWidth    =   SzerokoscPerItem;
            if(xKey==IloscWWierszu) { SetWidth = LastItemWidth; }

            if(arrayColsHeight[xKey]==undefined) {
                arrayColsHeight[xKey]   =   0;
            }

            sumTop  =   arrayColsHeight[xKey];

            suggestHeight   =   SzerokoscPerItem;
            ratio           =   $(this).attr("mosaicpic-ratio");
            if(ratio!=undefined) {
                ratio   =   parseFloat(ratio);
                suggestHeight = Math.floor(SzerokoscPerItem / ratio);
            }


            $(this).css({
                width:  SetWidth + "px" ,
                left:   left + "px" ,
                top:    sumTop + "px" ,
                height: suggestHeight + "px"
            });

            arrayColsHeight[xKey]   =   sumTop + suggestHeight;

            if(!autoMosonry) {

                left    =   left + SetWidth;

                if(xKey==IloscWWierszu) {
                    xKey    =   1;
                    left    =   0;
                } else {
                    xKey++;
                }

            }

        });

        maxHeight   =   0;
        for(x in arrayColsHeight) {
            maxHeight   =   Math.max(arrayColsHeight[x], maxHeight);
        }

        ob.css('height', 'auto');

        $(th).find(".mosaicpic-wrapper").attr("data-maxheight", maxHeight);

        if(!isSecond) {
            ustawElementy(th, true);
        }

    }

    function wczytajWidoczne(th) {
        $(th).find(".mosaicpic-wrapper-items").each(function() {
            if($(this).mosaicpic_is_on_screen()) {
                if($(this).attr("mosaicpic-isloaded")!="1") {
                    wczytajUrl($(this).attr("data-url"));
                }
            }
        });
    }

    function wczytajUrl(ImgUrl) {
        imgloaded.push([ ImgUrl , 0 ]);

        var tmpImg = new Image() ;
        tmpImg.src = ImgUrl ;

        tmpImg.onload = function() {

            for(k in imgloaded) {
                if(imgloaded[k][0]==this.src) {
                    imgloaded[k][1] =   1;
                }
            }

            imageUrl    =   this.src;
            imageWidth    =   this.width;
            imageHeight    =   this.height;
            imageRatio    =   this.width / this.height;
            $(".mosaicpic-wrapper-items").each(function() {
                if($(this).attr("data-url")==imageUrl) {

                    setTimeout(function(th, imageUrl) {
                        $(th).css("background-image", "url('" + imageUrl + "')");
                        $(th).css("background-size", "cover");
                    }, 150, this, imageUrl);


                    $(this).attr("mosaicpic-isloaded", "1");

                    $(this).attr("mosaicpic-width", imageWidth);
                    $(this).attr("mosaicpic-height", imageHeight);
                    $(this).attr("mosaicpic-ratio", imageRatio);

                }
            });

            $('').mosaic('ustawElementyAll');


        };
    }

    function initOnceBind() {
        $(window).resize(function() {
            $('').mosaic('ustawElementyAll');
            $('').mosaic('wczytajWidoczneAll');
        });
        $(window).scroll(function() {
            $('').mosaic('wczytajWidoczneAll');
        });
    }

    $.fn.mosaic	=	function(options) {

        if ( methods[options] ) {
            return methods[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }

        this.mosaicpic_options    =   options;
        gitems.push(this);
        index   =   gitems.length - 1;

        this.append("<div class='mosaicpic-wrapper' data-maxheight='0' data-index='" + index + "' style='position: relative'></div>");
        this.append("<div class='mosaicpic-hidden'></div>");
        this.find("ul").addClass("mosaicpic-source");

        initElements(this);
        ustawElementy(this);
        wczytajWidoczne(this);

        xc = 0;
        $(this).find(".mosaicpic-source li").each(function() {
            if(xc<10) {
                wczytajUrl( $(this).attr("data-thumb") );
            }
            xc++;
            //  $(this).parent().find(".mosaicpic-hidden").append("<img src='" + $(this).attr("data-url") + "'");
        });

        if(!onceIsBind) {
            initOnceBind();
        }

        onceIsBind  =   true;
        return this.each(function() { });
    }

})(jQuery);


jQuery.fn.mosaicpic_is_on_screen = function(){
    var win = jQuery(window);
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    boundsLeft      =   bounds.left;
    boundsRight     =   bounds.right;
    boundsTop       =   bounds.top - 300; // po to aby wcześniej wczytywać
    boundsBottom    =   bounds.bottom + 300;

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < boundsTop || viewport.top > boundsBottom));
};