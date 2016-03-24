//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오후 6:19
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";

class ColorMatrixFilter {

    constructor() {

        this._colorMatrix = new ColorMatrix();
    }

    /**
     *
     * @param source source BitmapData
     * @param dest destination BitmapData
     * @param sx source x
     * @param sy source y
     * @param sw source width
     * @param sh source height
     */
    applyFilter( source, dest, sx = 0, sy = 0, sw = 0, sh = 0 ){

        let right = Math.max( 0, Math.min( source.width, sx + sw ) ),
            bottom = Math.max( 0, Math.min( source.height, sy + sh ) ),

            m = this.colorMatrix,
            sourceData = source.data,
            destData = dest.data,
            vertical = 0,
            width = source.width,
            index = 0;

        for (var y = sx; y < bottom; y++) {

            vertical = 4 * y * width;

            for (var x = sy; x < right; x++) {

                index = vertical + 4 * x;

                m.transformColor( sourceData, index, destData, index );
            }
        }
    }


    get colorMatrix(){
        return this._colorMatrix;
    }

}// class ColorMatrixFilter