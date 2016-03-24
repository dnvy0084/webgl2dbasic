//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오후 3:32
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";

class ColorMatrix {

    constructor(
        m11 = 1,     m12 = 0,     m13 = 0,      m14 = 0,
        m21 = 0,     m22 = 1,     m23 = 0,      m24 = 0,
        m31 = 0,     m32 = 0,     m33 = 1,      m34 = 0
    ) {

        this._raw = new Float32Array(12);

        this.setTo(
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34
        );
    }


    setTo(
        m11,     m12,     m13,      m14,
        m21,     m22,     m23,      m24,
        m31,     m32,     m33,      m34
    ){
        var m = this._raw;

        m[0] = m11, m[3] = m12, m[6] = m13, m[ 9] = m14,
        m[1] = m21, m[4] = m22, m[7] = m23, m[10] = m24,
        m[2] = m31, m[5] = m32, m[8] = m33, m[11] = m34;

        return this;
    }


    /**
     * 단위 행렬로 설정
     */
    identity(){

        var m = this._raw;

        m[0] = 1, m[3] = 0, m[6] = 0, m[ 9] = 0,
        m[1] = 0, m[4] = 1, m[7] = 0, m[10] = 0,
        m[2] = 0, m[5] = 0, m[8] = 1, m[11] = 0;

        return this;
    }


    /**
     * 변형된 color vector V` = transform matrix M x rgbVector V
     * dest가 null일 경우 새로운 객체 생성
     * source의 값을 참조 하지 않기 때문에 source == dest여도 계산에 문제는 없음
     * @param source
     * @param sourceOffset
     * @param dest
     * @param destOffset
     */
    transformColor( source, sourceOffset = 0, dest = null, destOffset = 0 ){

        dest = dest || new Uint8ClampedArray(3);

        let r = source[ sourceOffset     ] / 255,
            g = source[ sourceOffset + 1 ] / 255,
            b = source[ sourceOffset + 2 ] / 255,
            m = this._raw;

        dest[ destOffset     ] = 255 * ( r * m[0] + g * m[3] + b * m[6] + m[ 9] );
        dest[ destOffset + 1 ] = 255 * ( r * m[1] + g * m[4] + b * m[7] + m[10] );
        dest[ destOffset + 2 ] = 255 * ( r * m[2] + g * m[5] + b * m[8] + m[11] );

        return this;
    }


    /**
     * return mat Matrix x this Matrix
     * @param a
     */
    prepend( mat ){

        let a = mat._raw, b = this._raw,

            a11 = a[0], a12 = a[3], a13 = a[6], a14 = a[ 9],
            a21 = a[1], a22 = a[4], a23 = a[7], a24 = a[10],
            a31 = a[2], a32 = a[5], a33 = a[8], a34 = a[11],

            b11 = b[0], b12 = b[3], b13 = b[6], b14 = b[ 9],
            b21 = b[1], b22 = b[4], b23 = b[7], b24 = b[10],
            b31 = b[2], b32 = b[5], b33 = b[8], b34 = b[11];

        b[0] = a11 * b11 + a12 * b21 + a13 * b31;
        b[3] = a11 * b12 + a12 * b22 + a13 * b32;
        b[6] = a11 * b13 + a12 * b23 + a13 * b33;
        b[9] = a11 * b14 + a12 * b24 + a13 * b34 + a14;

        b[ 1] = a21 * b11 + a22 * b21 + a23 * b31;
        b[ 4] = a21 * b12 + a22 * b22 + a23 * b32;
        b[ 7] = a21 * b13 + a22 * b23 + a23 * b33;
        b[10] = a21 * b14 + a22 * b24 + a23 * b34 + a24;

        b[ 2] = a31 * b11 + a32 * b21 + a33 * b31;
        b[ 5] = a31 * b12 + a32 * b22 + a33 * b32;
        b[ 8] = a31 * b13 + a32 * b23 + a33 * b33;
        b[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34;

        return this;
    }


    /**
     * return this Matrix x mat Matrix;
     * @param a
     */
    append( mat ){

        let b = mat._raw, a = this._raw,

            a11 = a[0], a12 = a[3], a13 = a[6], a14 = a[ 9],
            a21 = a[1], a22 = a[4], a23 = a[7], a24 = a[10],
            a31 = a[2], a32 = a[5], a33 = a[8], a34 = a[11],

            b11 = b[0], b12 = b[3], b13 = b[6], b14 = b[ 9],
            b21 = b[1], b22 = b[4], b23 = b[7], b24 = b[10],
            b31 = b[2], b32 = b[5], b33 = b[8], b34 = b[11];

        a[0] = a11 * b11 + a12 * b21 + a13 * b31;
        a[3] = a11 * b12 + a12 * b22 + a13 * b32;
        a[6] = a11 * b13 + a12 * b23 + a13 * b33;
        a[9] = a11 * b14 + a12 * b24 + a13 * b34 + a14;

        a[ 1] = a21 * b11 + a22 * b21 + a23 * b31;
        a[ 4] = a21 * b12 + a22 * b22 + a23 * b32;
        a[ 7] = a21 * b13 + a22 * b23 + a23 * b33;
        a[10] = a21 * b14 + a22 * b24 + a23 * b34 + a24;

        a[ 2] = a31 * b11 + a32 * b21 + a33 * b31;
        a[ 5] = a31 * b12 + a32 * b22 + a33 * b32;
        a[ 8] = a31 * b13 + a32 * b23 + a33 * b33;
        a[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34;

        return this;
    }


    /**
     * return deep copied instance
     */
    clone(){

        var m = this._raw;

        return new ColorMatrix(
            m[0], m[3], m[6], m[ 9],
            m[1], m[4], m[7], m[10],
            m[2], m[5], m[8], m[11]
        );
    }


    get raw() {
        return this._raw;
    }


}// class ColorMatrix