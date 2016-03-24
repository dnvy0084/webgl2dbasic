/**
 * Created by NAVER on 16. 3. 9..
 */

"use strict";


class BitmapDataFilterApplyTest extends TestCase{

    constructor(){
        super();
    }

    start(){

        let img = $("#img_b");
        let e = img[0];

        var bmpd = new BitmapData( e.width, e.height );
        bmpd.draw( e );

        var clone = bmpd.clone();

        //clone.fillRect( 100, 100, 100, 100, 0xcccccc );

        console.log( clone.getPixel( 101, 101 ).toString(16));
        console.log( clone.getPixelv( 101, 101 ) );

        //clone.setPixel( 101, 101, 0xff0000);
        //clone.setPixelv( 102, 101, [255, 0, 0] );

        clone.update();

        var content = $( "#content" );

        content.append( clone.canvas );
        content.append( clone.image );

        $(clone.canvas).css("display", "block");
        $(clone.image).css( "display", "block" );

        console.log( "====================================" );

        var a = new ColorMatrix();
        var b = new ColorMatrix(
            1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, 1, 300
        );

        a.prepend( b );

        this.printMatrix( a );

        this.filter = new ColorTransformFilter();
        this.filter.brightness = 0.01;
        this.filter.contrast = 1.01;
        this.filter.saturation = 1.01;

        this.bmpd = clone;
        //this.bmpd.fillRect( 0, 0, 10, 10, 0xff0000 );
        //this.bmpd.save();

        this.bmpd.applyBitmapFilter( this.filter );
        this.bmpd.update();

        this.onRender = this.render.bind( this );
        this.id = requestAnimationFrame( this.onRender );

        //this.onMove = this.move.bind(this);
        //this.bmpd.canvas.addEventListener( "mousemove", this.onMove );

        var r = this.bmpd.canvas.getBoundingClientRect();

        this.ox = r.left;
        this.oy = r.top;

        this.initGUI();
    }

    initGUI(){

        this.gui = new dat.GUI( {autoPlace: false} );

        this.gui.add( this.filter, "brightness", -0.79, 0.79 );
        this.gui.add( this.filter, "contrast", 0.25, 1.98 );
        this.gui.add( this.filter, "saturation", 0, 1.98 );

        this.gui.domElement.classList.add( "gui" );

        $( "#nav" ).after( this.gui.domElement );
    }

    move( e ){

        let stageX = e.clientX - this.ox,
            stageY = e.clientY - this.oy;

        let t = stageX / this.bmpd.canvas.width,
            r = ( stageY / this.bmpd.canvas.height * 0.5 - 0.25 );

        this.filter.contrast = t * 3;
        this.filter.brightness = r;
        //this.filter.saturation = t * 4;

        this.bmpd.applyBitmapFilter( this.filter );
        this.bmpd.update();
    }

    render( ms ){

        this.id = requestAnimationFrame( this.onRender );

        this.bmpd.applyBitmapFilter( this.filter );
        this.bmpd.update();
    }

    printMatrix( m ){

        m = m instanceof Float32Array ? m : m.raw;

        for (var i = 0; i < 3; i++ ) {

            console.log( "[%s] [%s] [%s] [%s]", m[i], m[i+3], m[i+6], m[i+9] );
        }
    }

    dispose(){

        var content = $("#content");
        var children = content.children();

        for (var i = 0; i < children.length; i++) {

            content[0].removeChild( children[i] );
        }

       $( this.gui.domElement ).remove();

        webkitCancelRequestAnimationFrame( this.id );
    }

}//c

window.$case[ "BitmapData ColorTransform Filter Apply Test" ] = BitmapDataFilterApplyTest;