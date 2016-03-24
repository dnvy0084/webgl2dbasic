//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오후 6:35
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";

class BitmapDataMultiFiltersTest extends TestCase {

    constructor() {
        super();
    }

    start(){

        let img = $("#img_b")[0];

        var bmpd = new BitmapData( img.width, img.height );
        bmpd.draw( img );

        $( "#content" ).append( bmpd.canvas );

        let a = new ColorMatrixFilter();
        a.colorMatrix.setTo(
            1, 0, 0, 0.5,
            0, 1, 0, 0,
            0, 0, 1, 0
        );

        let b = new ColorMatrixFilter();
        b.colorMatrix.setTo(
            1, 0, 0, 0,
            0, 1, 0, 0.5,
            0, 0, 1, 0
        );

        let c = new ColorMatrixFilter();
        c.colorMatrix.setTo(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0.5
        );

        let d = new ColorTransformFilter();
        d.contrast = 0.5;
        d.saturation = 3;

        let t = new ColorMatrixFilter();
        let f = 0.5;
        t.colorMatrix.setTo(
            100, 0, 0, -99 * f,
            0, 100, 0, -99 * t,
            0, 0, 100, -99 * t
        );

        bmpd.filters.push(d);
        bmpd.update();
        bmpd.save();
        bmpd.applyBitmapFilter( c, 100, 100, 100, 100 );
        bmpd.save();
        bmpd.applyBitmapFilter( b, 150, 150, 100, 100 );
        bmpd.save();
        bmpd.applyBitmapFilter( a, 200, 200, 100, 100 );
        bmpd.update();
    }

    dispose(){
        super.dispose();


    }


}// class BitmapDataMultiFiltersTest

window.$case[ "BitmapData Multi Filters apply test" ] = BitmapDataMultiFiltersTest;