//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오후 7:47
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";


BitmapDataHistory = {
    SHOW_ORIGINAL: -1024
};

class BitmapData {

    constructor(width, height) {

        if (!this._initCanvas(width, height)) return;

        this._filters = [];
        this._colorMatrixFilter = new ColorMatrixFilter();
    }

    /**
     * 오프 스크린 캔버스 생성 및 context 객체 설정, 가로 세로 설정
     * @param width
     * @param height
     * @returns {boolean}
     */
    _initCanvas(width, height) {

        var offScreen = document.createElement("canvas");

        offScreen.id = "pe.bitmap.offScreen_" + (++BitmapData.offScreenIndex);
        offScreen.width = width;
        offScreen.height = height;

        this._offContext = offScreen.getContext("2d");

        if (this._offContext == null) {
            throw new Error("CanvasRenderingContext2D 객체를 찾을 수 없습니다. 브라우져의 Canvas 지원 여부를 확인 하세요");
            return false;
        }

        return true;
    }

    _initHistory(){

        this._history = [];
        this._pool = [];
        this._index = 0;
        this._numMaxHistory = this._numMaxHistory || 2;

        let width = this.width,
            height = this.height;

        this._originalData = this._offContext.getImageData(0, 0, width, height);
    }

    _drawToCanvas( bitmapDrawable, matrix = null ){

        let m = matrix;

        this._offContext.clearRect(0, 0, this.width, this.height);

        if (m != null)
            this._offContext.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);

        if (bitmapDrawable instanceof BitmapData)
            bitmapDrawable = bitmapDrawable.canvas;

        this._offContext.drawImage(bitmapDrawable, 0, 0);
    }


    /**
     * bitmapDrawable instance( BitmapData, Image || Canvas Element )를 BitmapData 객체에 그립니다
     * @param bitmapDrawable : Image or Canvas, BitmapData
     * @param matrix : Float32Array(6)
     */
    draw(bitmapDrawable, matrix = null) {

        this._drawToCanvas( bitmapDrawable, matrix );
        this._initHistory();

        this.save();
        this.update();

        return this;
    }


    /**
     * 현재 imageData의 편집 내용을 canvas element에 update합니다
     */
    update( original = false ) {

        this._applyFilters();

        let imageData = original ? this.originalImageData : this.imageData;

        this._offContext.clearRect(0, 0, this.width, this.height);
        this._offContext.putImageData(imageData, 0, 0);
    }


    /**
     * save한 편집 내용을 되돌리거나 복원합니다
     * 최대 history 개수는 this.numMaxHistory로 설정 가능
     * @param index
     */
    undo(index = -1) {

        if( index == BitmapDataHistory.SHOW_ORIGINAL )
        {
            this._freeImageData( this._history );
            this._history = [ this._originalData ];
            this._index = 0;
        }
        else
        {
            this._index = Math.max( 0, Math.min( this._history.length - 1, this._index + index ) );
        }

        console.log( "undo", this._index );
    }


    /**
     * 현재 편집 내용을 저장하고 새로운 편집 가능 이미지로 복사합니다
     */
    save() {

        let source = this.imageData || this._originalData;

        if (source == null)
            throw new Error("원본 이미지 데이터를 찾을 수 없습니다");

        this._freeImageData( this._history.splice( this._index + 1, this._history.length - this._index + 1 ) );

        for ( ; this._history.length >= this.numMaxHistory; ) {
            this._freeImageData( this._history.shift() )
        }

        this._history.push( this._allocImageData() );
        this._index = Math.min( this._history.length - 1, this._index + 1 );

        this.imageData.data.set(source.data);

        this._filters = [];
    }


    _allocImageData(){

        if( this._pool.length == 0 )
            this._pool.push( this._offContext.createImageData( this.width, this.height ) );

        return this._pool.pop();
    }

    _freeImageData( imageData ){

        if( imageData instanceof Array ){
            this._pool.push.apply( this, imageData )
        }
        else{
            this._pool.push( imageData );
        }

    }


    /**
     * unsigned int pixel 색상 반환
     * @param x
     * @param y
     * @returns {number}
     */
    getPixel(x, y) {

        let data = this.imageData.data,
            i = 4 * ( y * this.imageData.width + x );

        return data[i] << 16 | data[i + 1] << 8 | data[i + 2];
    }


    /**
     * uint 0xrrggbb 형태로 픽셀 색상 설정
     * @param x
     * @param y
     * @param color
     */
    setPixel(x, y, color) {

        let data = this.imageData.data,
            i = 4 * ( y * this.imageData.width + x );

        let r = color >> 16 & 0xff,
            g = color >> 8 & 0xff,
            b = color & 0xff;

        data[i    ] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }


    /**
     * x, y 위치의 pixel값을 Uint8Array 타입으로 가져옴
     * @param x
     * @param y
     * @returns {Uint8Array}
     */
    getPixelv(x, y) {

        let data = this.imageData.data,
            i = 4 * ( y * this.imageData.width + x );

        return new Uint8Array([
            data[i], data[i + 1], data[i + 2]
        ]);
    }

    /**
     * Uint8Array [ red, green, blue ] 로 픽셀 색상 설정
     * @param x
     * @param y
     * @param colors
     */
    setPixelv(x, y, colors) {

        let data = this.imageData.data,
            i = 4 * ( y * this.imageData.width + x );

        data[i    ] = colors[0];
        data[i + 1] = colors[1];
        data[i + 2] = colors[2];
    }


    /**
     * 설정한 영역의 color를 교체
     * @param x
     * @param y
     * @param width
     * @param height
     * @param color
     */
    fillRect(x, y, width, height, color) {

        let right = Math.max(0, Math.min(x + width, this.width)),
            bottom = Math.max(0, Math.min(y + height, this.height)),

            r = color >> 16 & 0xff,
            g = color >> 8 & 0xff,
            b = color & 0xff,

            vertical = 0,
            index = 0,
            _w = this.imageData.width,
            buf = this.imageData.data;

        for (var j = y; j < bottom; j++) {

            vertical = 4 * j * _w;

            for (var i = x; i < right; i++) {

                index = vertical + 4 * i;

                buf[index    ] = r;
                buf[index + 1] = g;
                buf[index + 2] = b;
            }
        }
    }


    /**
     * apply bitmap filter on this instance
     * 비트맵 필터를 적용합니다
     * @param filter 비트팹 필터
     * @param sx 소스 x
     * @param sy 소스 y
     * @param sw 소스 width
     * @param sh 소스 height
     */
    applyBitmapFilter( filter, sx = 0, sy = 0, sw = 0, sh = 0 ) {

        sw = sw || this.width;
        sh = sh || this.height;

        filter.applyFilter( this.sourceData, this.imageData, sx, sy, sw, sh );
    }

    _applyFilters(){

        if( this._filters.length == 0 ) return;

        let filter;

        this._colorMatrixFilter.colorMatrix.identity();

        for (var i = 0, l = this._filters.length; i < l; i++) {
            filter = this._filters[i];

            if( filter instanceof ColorMatrixFilter ){
                this._colorMatrixFilter.colorMatrix.append( filter.colorMatrix );
            }
        }

        this.applyBitmapFilter( this._colorMatrixFilter );
    }


    /**
     * 새로운 BitmapData 객체로 복사
     */
    clone() {

        var clone = new BitmapData(this.width, this.height);

        clone.draw(this);

        return clone;
    }


    get filters() {
        return this._filters;
    }

    set filters(value) {
        this._filters = value;
        this.update();
    }


    /**
     * return imageData.width;
     * @returns {number}
     */
    get width() {
        return this._offContext.canvas.width;
    }

    /**
     * return imageData.height;
     * @returns {number}
     */
    get height() {
        return this._offContext.canvas.height;
    }


    /**
     * history 개수 반환
     * @returns {Array}
     */
    get numHistory() {
        return this._history.length;
    }


    get numMaxHistory() {
        return this._numMaxHistory;
    }

    set numMaxHistory(value) {
        this._numMaxHistory = value;
    }


    /**
     * return canvas element : 필터가 적용된 imagedata가 그려진 canvas element를 반환
     * @returns {HTMLCanvasElement}
     */
    get canvas() {
        return this._offContext.canvas;
    }

    /**
     * return image element : 필터가 적용된 imageData의 img element를 반환
     * @returns {Element}
     */
    get image() {
        var img = document.createElement("img");
        img.src = this.canvas.toDataURL("image/png");

        return img;
    }


    /**
     * 편집 중인 현재 imageData
     * @returns {ImageData|*}
     */
    get imageData() {
        return this._history[this._index];
    }

    /**
     * 편집에 필요한 소스 이미지 데이터
     * 현재 편집중인 데이터의 이전 데이터
     * @returns {*}
     */
    get sourceData(){

        let sourceIndex = this._index - 1;

        if( sourceIndex < 0 )
            return this.originalImageData;

        return this._history[ sourceIndex ];
    }

    /**
     * 최초 draw된 오리지널 imageData;
     * @returns {ImageData|*}
     */
    get originalImageData() {
        return this._originalData;
    }

}// class BitmapData

BitmapData.offScreenIndex = -1;