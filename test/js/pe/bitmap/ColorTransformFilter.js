//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오전 11:51
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";


const lumR = 0.2125;
const lumG = 0.7154;
const lumB = 0.0721;

class ColorTransformFilter extends ColorMatrixFilter {

    constructor() {

        super();

        this._brightness = 0;
        this._contrast = 1;
        this._saturation = 1;

        this._needToUpdate = true;
    }


    /**
     * 밝기, 대비, 색상 값이 적용 된 matrix 반환
     * @returns {*}
     */
    get colorMatrix(){

        if( this._needToUpdate )
        {
            let c = this._contrast,
                t = 0.5 * ( 1.0 - c ),
                b = c * this._brightness + t,
                s = this._saturation,
                sr = ( 1 - s ) * lumR,
                sg = ( 1 - s ) * lumG,
                sb = ( 1 - s ) * lumB,
                _b = b * ( sr + sg + sb + s );

            this._colorMatrix.setTo(
                c * ( sr + s ), c * sg, c * sb, _b,
                c * sr, c * ( sg + s ), c * sb, _b,
                c * sr, c * sg, c * ( sb + s ), _b
            );
        }

        this._needToUpdate = false;

        return this._colorMatrix;
    }


    /**
     * 이미지 밝기 조절
     * @returns {*}
     */
    get brightness() {
        return this._brightness;
    }

    set brightness( value ) {

        if( this._brightness == value ) return;

        this._brightness = value;
        this._needToUpdate = true;
    }


    /**
     * 이미지 대비 조절
     * @returns {*}
     */
    get contrast() {
        return this._contrast;
    }

    set contrast(value) {

        if( this._contrast == value ) return;

        this._contrast = value;
        this._needToUpdate = true;
    }


    /**
     * 이미지 색상 조절
     * @returns {*}
     */
    get saturation() {
        return this._saturation
    }

    set saturation(value) {

        if( this._saturation == value ) return;

        this._saturation = value;
        this._needToUpdate = true;
    }

}// class ColorTransformFilter