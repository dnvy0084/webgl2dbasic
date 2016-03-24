//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오후 12:15
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";

class YUIPanelTest extends TestCase{

    constructor() {
        super();
    }

    start(){

        this.content = document.getElementById( "content" );

        YUI( {skin: "sam"} ).use( "panel", "slider", this.onPanelReady.bind(this) );
    }

    dispose(){

    }


    onPanelReady( Y ){

        console.log( Y );

        var form = document.getElementById( "matrix-container" );
        var clone = form.cloneNode( true );

        clone.style.width = "300px";
        this.makeSliders( Y, clone );

        this.content.appendChild( clone );

        this.panel = new Y.Panel({
            srcNode: clone,
            width: 330,
            xy: [5, -300],
            zIndex: 5,
            modal: false,
            visible: true,
            render: true
        });

        this.panel.render( "#ui-layer" );
        this.panel.show();
        this.panel.set( "xy", [5, 45] );
        this.panel.set( "buttons", {
            header: [ "close" ]
        });

        console.log( this.panel.get( "buttons" ) );
    }

    makeSliders( Y, form ){

        var slider;

        var spans = form.getElementsByClassName( "slider-parent" );
        console.log( spans, spans.length );

        for (var i = 0; i < spans.length; i++) {
            slider = new Y.Slider({
                min: -3,
                max: +3,
                value: 0,
                width: 50
            });

            slider.render( spans[i] );
        }
    }

}// class YUIPanelTest

window.$case[ "YUI Panel Sample" ] = YUIPanelTest;