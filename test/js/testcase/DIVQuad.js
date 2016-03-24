

class DIVQuad{

    constructor( w, h, color = "#c00" ){

        DIVQuad.camera = [ 200, 200, 500 ];

        this.div = this.makeQuad( w, h, color );

        this.x =
        this.y =
        this.z = 0;

        this.scaleX =
        this.scaleY =
        this.scaleZ = 1;

        this.rotationX =
        this.rotationY =
        this.rotationZ = 0.0;

        this._brightness = 100;

        this.normal = new Float32Array(3); // 법선 벡터
        this.light = new Float32Array(3);  // 광원 위치
        this.lightDir = new Float32Array(3); // 객체 위치 - 광원 위치 : 광원의 입사각 벡터

        this.mat = new Float32Array(16); // 부모 객체의 matrix 값을 복사하기 위한 행렬 - append 만 구현해 놔서 시작 행렬을 복사해서 사용
        this.translate = new Float32Array(16); // 해당 객체의 이동 및 확대 축소 행렬
    }

    setTo(
        mat,
        m11,    m12,    m13,    m14,
        m21,    m22,    m23,    m24,
        m31,    m32,    m33,    m34,
        m41,    m42,    m43,    m44
    ){
        var m = mat;

        m[0] = m11, m[4] = m12, m[ 8] = m13, m[12] = m14,
        m[1] = m21, m[5] = m22, m[ 9] = m23, m[13] = m24,
        m[2] = m31, m[6] = m32, m[10] = m33, m[14] = m34,
        m[3] = m41, m[7] = m42, m[11] = m43, m[15] = m44;

        return this;
    }

    /**
     * 법선 벡터 설정
     * @param x
     * @param y
     * @param z
     */
    setNormal( x, y, z ){

        this.normal[0] = x;
        this.normal[1] = y;
        this.normal[2] = z;
    }


    /**
     * css3 transform 속성 업데이트 : 렌더링 엔진이라면 draw에 해당
     * @param mat
     */
    update( mat ){

        this.evalMatrix( mat );
        this.evalDiffuse();

        this.div.css( "transform", this.matrixCSS );
    }


    /**
     * x축 회전 행렬 계산
     * @param t
     * @returns {Float32Array|*}
     */
    rotateX( t ){

        let cos = Math.cos(t),
            sin = Math.sin(t);

        let m = this.rotatXMatrix = this.rotatXMatrix || new Float32Array(16);

        m[0] = 1, m[4] = 0, m[ 8] = 0, m[12] = 0,
        m[1] = 0, m[5] = cos, m[ 9] = -sin, m[13] = 0,
        m[2] = 0, m[6] = sin, m[10] = cos, m[14] = 0,
        m[3] = 0, m[7] = 0, m[11] = 0, m[15] = 1;

        return m;
    }

    /**
     * y축 회전 행렬 계산
     * @param t
     * @returns {Float32Array|*}
     */
    rotateY(t){

        let cos = Math.cos(t),
            sin = Math.sin(t);

        let m = this.rotateYMatrix = this.rotateYMatrix || new Float32Array(16);

        m[0] = cos, m[4] = 0, m[ 8] = -sin, m[12] = 0,
        m[1] = 0, m[5] = 1, m[ 9] = 0, m[13] = 0,
        m[2] = sin, m[6] = 0, m[10] = cos, m[14] = 0,
        m[3] = 0, m[7] = 0, m[11] = 0, m[15] = 1;

        return m;
    }

    /**
     * z축 회전 행렬 계산
     * @param t
     * @returns {Float32Array|*}
     */
    rotateZ(t){

        let cos = Math.cos(t),
            sin = Math.sin(t);

        let m = this.rotateZMatrix = this.rotateZMatrix || new Float32Array(16);

        m[0] = cos, m[4] = -sin, m[ 8] = 0, m[12] = 0,
        m[1] = sin, m[5] = cos, m[ 9] = 0, m[13] = 0,
        m[2] = 0, m[6] = 0, m[10] = 1, m[14] = 0,
        m[3] = 0, m[7] = 0, m[11] = 0, m[15] = 1;

        return m;
    }


    /**
     * 행렬 초기화 : 단위 행렬로 설정
     * @param m
     */
    identity( m ){

        m[0] = 1, m[4] = 0, m[ 8] = 0, m[12] = 0,
        m[1] = 0, m[5] = 1, m[ 9] = 0, m[13] = 0,
        m[2] = 0, m[6] = 0, m[10] = 1, m[14] = 0,
        m[3] = 0, m[7] = 0, m[11] = 0, m[15] = 1;
    }

    /**
     * 행렬 곱
     * @param a
     * @param b
     */
    append( a, b ){

        let a11 = a[0], a12 = a[4], a13 = a[ 8], a14 = a[12],
            a21 = a[1], a22 = a[5], a23 = a[ 9], a24 = a[13],
            a31 = a[2], a32 = a[6], a33 = a[10], a34 = a[14],
            a41 = a[3], a42 = a[7], a43 = a[11], a44 = a[15],

            b11 = b[0], b12 = b[4], b13 = b[ 8], b14 = b[12],
            b21 = b[1], b22 = b[5], b23 = b[ 9], b24 = b[13],
            b31 = b[2], b32 = b[6], b33 = b[10], b34 = b[14],
            b41 = b[3], b42 = b[7], b43 = b[11], b44 = b[15];

        a[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        a[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        a[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        a[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;

        a[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        a[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        a[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        a[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;

        a[ 8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        a[ 9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        a[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        a[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;

        a[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        a[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        a[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        a[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    }

    /**
     * 행렬과 벡터 곱
     * @param mat
     * @param p
     * @param out
     * @returns {*|Float32Array}
     */
    transform( mat, p, out ){

        out = out || new Float32Array(3);

        let a = mat;

        let a11 = a[0], a12 = a[4], a13 = a[ 8], a14 = a[12],
            a21 = a[1], a22 = a[5], a23 = a[ 9], a24 = a[13],
            a31 = a[2], a32 = a[6], a33 = a[10], a34 = a[14];

        let x = p[0], y = p[1], z = p[2];

        out[0] = a11 * x + a12 * y + a13 * z;
        out[1] = a21 * x + a22 * y + a23 * z;
        out[2] = a31 * x + a32 * y + a33 * z;

        return out;
    }

    /**
     * 단위 벡터로 설정
     * @param p
     * @param out
     * @returns {*|Float32Array}
     */
    normalize( p, out ){

        out = out || new Float32Array(3);

        let x = p[0],
            y = p[1],
            z = p[2],

            len = Math.sqrt( x * x + y * y + z * z );

        out[0] = x / len;
        out[1] = y / len;
        out[2] = z / len;

        return out;
    }

    /**
     * 벡터 내적
     * @param a
     * @param b
     * @returns {number}
     */
    dot( a, b ){

        let n = 0;

        for (var i = 0; i < a.length; i++)
            n += a[i] * b[i];

        return n;
    }


    /**
     * div element 생성
     * @param w
     * @param h
     * @param color
     * @returns {*|jQuery|HTMLElement}
     */
    makeQuad( w, h, color ){

        var div = $( '<div></div>' );

        div.css({
            width: w + "px",
            height: h + "px",
            "background-color": color,
            "trnasform-origin": "50% 50% 0",
            "background-image": "url(img/e.jpg)",
        });

        return div;
    }

    /**
     * 설정된 위치, 확대/축소, 회전 값을 바탕으로 행렬 계산
     * @param parent
     */
    evalMatrix( parent ){

        let m = parent;

        if( m )
        {
            this.setTo(
                this.mat,
                m[0], m[4], m[ 8], m[12],
                m[1], m[5], m[ 9], m[13],
                m[2], m[6], m[10], m[14],
                m[3], m[7], m[11], m[15]
            );
        }
        else
        {
            this.setTo(
                this.mat,
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            )
        }

        this.setTo(
            this.translate,
            this.scaleX, 0, 0, this.x,
            0, this.scaleY, 0, this.y,
            0, 0, this.scaleZ, this.z,
            0, 0, 0, 1
        );

        this.append( this.mat, this.translate );

        if( this.rotationX != 0.0 ){
            this.append( this.mat, this.rotateX(this.rotationX) );
        }

        if( this.rotationY != 0.0 ){
            this.append( this.mat, this.rotateY(this.rotationY) );
        }

        if( this.rotationZ != 0.0 ){
            this.append( this.mat, this.rotateZ(this.rotationZ) );
        }
    }

    /**
     * 난반사광 계산 : diffuse light
     */
    evalDiffuse(){

        let o = this.parent || this;
        let x = o.x, y = o.y, z = o.z;

        // 입사각
        this.lightDir[0] = this.light[0] - x;
        this.lightDir[1] = this.light[1] - y;
        this.lightDir[2] = this.light[2] - z;
        // 광원 방향만 사용 - normalize
        this.normalize( this.lightDir, this.lightDir );

        // 면의 법선 벡터를 변환 행렬 곱으로 현재 바라보고 있는 방향으로 설정
        let p = this.transform( this.mat, this.normal );
        // 방향만 필요
        this.normalize( p, p );

        let diffuse = this.dot( p, this.lightDir );
        let specular = 0;

        if( diffuse > 0 ){

            let viewDir = new Float32Array(3);

            viewDir[0] = DIVQuad.camera[0] - x;
            viewDir[1] = DIVQuad.camera[1] - y;
            viewDir[2] = DIVQuad.camera[2] - z;

            this.normalize( viewDir, viewDir );
            specular = Math.pow( this.dot( p, viewDir ), 20 );
        }

        this.div.css( "z-index", parseInt( diffuse * 1000 ) );
        this.brightness = Math.max( 15, 100 * specular + 100 * diffuse );
    }


    /**
     * 현재 계산된 행렬을 css transform: matrix3d(n,n,n,...) String으로 반환
     * @returns {string}
     */
    get matrixCSS(){
        return "matrix3d(" + this.mat.join(",") + ")";
    }


    /**
     * div 가로 길이 반환
     * @returns {*}
     */
    get width(){
        return this.div.css( "width" ).match( /\d+/g )[0];
    }

    /**
     * div 세로 길이 반환
     * @returns {*}
     */
    get height(){
        return this.div.css( "height" ).match( /\d+/g )[0];
    }


    /**
     * css filter( brightness n% )로 밝기 설정. diffuse light 설정
     * @returns {*}
     */
    get brightness() {
        return this._brightness;
    }

    set brightness(value) {

        this._brightness = value;

        this.div.css( "-webkit-filter", "brightness(" + this._brightness + "%)" );
    }
} // class Quad
