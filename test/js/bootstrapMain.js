/**
 * Created by NAVER on 16. 3. 9..
 */


"use strict";

const dropdownItem = '<li><a id="%s" href="#">%s</a></li>';
const divider = '<li class="divider"></li>';

let index = 0;

class TestMain{

    constructor(){
        window.printf = this.printf;
    }

    printf( out, ...args ){

        function rep() {
            return args.shift();
        }

        return out.replace( /\%s+/g, rep );
    }

    initCanvas( canvas ){

        this.canvas = canvas;

        if( typeof canvas == "string" )
            this.canvas = document.getElementById( canvas );

        this.initEvents();
        this.onResize();

        return this;
    }

    initEvents(){

        window.onresize = this.onResize;

        function preventDefault(e) {
            e = e || event;
            e.preventDefault();
        }

        window.addEventListener( "dragover", preventDefault );
    }

    onResize(){

        if( this.canvas == null ) return;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }


    setTestCase( label ){

        if( this.currentLabel == label ) return;

        this.currentLabel = label;
        this.disposeCurrentCase();

        if( !window.$case.hasOwnProperty( label ) )
            console.log( "[ERROR] Can not find " + label );

        this.currentCase = new window.$case[label]();
        this.currentCase.main = this;
        this.currentCase.start( this.canvas );

        $( "#nav_title" ).text( label );
    }

    disposeCurrentCase(){

        if( !this.currentCase ) return;

        this.currentCase.main = null;
        this.currentCase.dispose();
    }



    initUILayer( parent, o ){

        var parent = $(parent);
        let firstCase;

        for( var key in o ){

            firstCase = firstCase || key;

            parent.append( printf( dropdownItem, ++index + "item", key ) );

            $( printf( "#%sitem", index ) ).on( "click", this.onClick.bind(this) );
        }

        this.setTestCase( firstCase );

        return this;
    }

    onClick( e ){

        this.setTestCase( e.target.innerHTML );
    }

} //class TestMain

