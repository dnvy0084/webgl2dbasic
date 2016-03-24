//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오후 2:33
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";

class BitmapDataHistoryTest extends TestCase{

    constructor() {
        super();

        this.index = 0;
        this.size = 50;
    }

    start(){

        let img = $("#img_b")[0];
        let bmpd = new BitmapData( img.width, img.height );

        bmpd.numMaxHistory = 5;
        bmpd.draw( img );
        bmpd.update();

        $( "#content" ).append( bmpd.canvas );

        this.onKeyDown = this.keydown.bind(this);

        window.addEventListener( "keydown", this.onKeyDown );

        this.bmpd = bmpd;
    }

    dispose(){

        let content = $( "#content" )[0];

        for (var i = 0; i < content.childElementCount; i++) {
            content.removeChild( content.firstElementChild );
        }
    }

    keydown( e ){

        switch( e.keyCode ){
            case 70: //f
                this.fillRect( 0xffffff * Math.random() );
                break;

            case 90: //z
                this.undo( e.ctrlKey, e.shiftKey );
                break;
        }
    }

    fillRect( color ){

        let w = parseInt( this.bmpd.width / this.size );

        let x = this.index % w,
            y = this.index++ / w | 0;

        this.bmpd.fillRect( this.size * x, this.size * y, this.size, this.size, color );
        this.bmpd.save();
        this.bmpd.update();
    }

    undo( ctrl, shift ){

        if( !ctrl ) return;

        if( shift ) // redo
        {
            this.bmpd.undo( +1 );
        }
        else // undo
        {
            this.bmpd.undo( -1 );
        }

        this.bmpd.update();
    }

}// class BitmapDataHistoryTest


window.$case[ "BitmapData History Undo, Redo Test" ] = BitmapDataHistoryTest;