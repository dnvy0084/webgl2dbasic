/**
 * Created by NAVER on 16. 3. 10..
 */


"use strict";

class CSSTransform3D_Quad extends TestCase {

    constructor() {
        super();
    }

    start(){

        this.content = document.getElementById("content");
        this.content.style.perspective = "500px";
        this.content.style.perspectiveOrigin = "50% 50%";
        this.layout();
    }

    dispose(){

        for (var i = 0, l = this.content.childElementCount; i < l; i++) {
            this.content.removeChild( this.content.firstElementChild );
        }

        webkitCancelRequestAnimationFrame( this._id );
    }

    layout(){

        this.quad = new Quad3D( 100, 100, "red" );

        this.quad.x = 100//( window.innerWidth - this.quad.width ) / 2;
        this.quad.y = 100//( window.innerHeight - this.quad.height ) / 2;
        //this.quad.z = -300;

        //this.quad.rotationY = 45;

        this.quad.scaleX =
        this.quad.scaleY =
        this.quad.scaleZ = 1;

        this.quad.update();
        this.content.appendChild( this.quad.div );

        this.onDraw = this.draw.bind(this);
        this._id = requestAnimationFrame( this.onDraw );

        console.log( this.quad.div );
    }

    draw( ms ){

        this._id = requestAnimationFrame( this.onDraw );

        //this.quad.rotationY++;
        //this.quad.x = -300 * ( Math.cos(ms/500) - 1 ) / 2;
        //this.quad.y = -300 * ( Math.sin(ms/500) - 1 ) / 2;
        //this.quad.z = 300 * ( Math.cos(ms/500) - 1 ) / 2;

        this.quad.scaleX = this.quad.scaleY = Math.cos( ms / 500 );
        this.quad.update();
    }


} // class CSS transform 3d


window.$case[ "CSS Trasnform 3D Quad" ] = CSSTransform3D_Quad;


class Quad3D{

    constructor( w, h, color ){

        this.div = this.makeDiv( w, h, color );

        this._x = 0;
        this._y = 0;
        this._z = 0;

        this._scaleX = 1;
        this._scaleY = 1;
        this._scaleZ = 1;

        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;

        this.raw = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])

        this.transformChanged = true;
    }


    makeDiv( w, h, color ){

        var div = document.createElement( "div" );

        div.style.width = w + "px";
        div.style.height = h + "px";
        div.style.backgroundColor = color;
        div.style.perspective = "500px";
        div.style.transformOrigin = "50% 50%";
        //div.style.transform = "translateX(100px) translateZ(-300px) translateY(100px)";

        return div;
    }

    update(){

        if( !this.transformChanged ) return;

        var m = this.raw;

        m[0] = this._scaleX;
        m[5] = this._scaleY;
        m[10] = this._scaleZ;

        m[12] = this._x;
        m[13] = this._y;
        m[14] = this._z;

        //this.printMat( m );
        //this.applyMatrix3D( m );

        var rotate = this.printf( "rotateX(%sdeg) rotateY(%sdeg) rotateZ(%sdeg)", this._rotationX, this._rotationY, this._rotationZ  );
        var scale = this.printf( "scale3d(%s,%s,%s)", this._scaleX, this._scaleY, this._scaleZ );
        var translate = this.printf( "translate3d(%spx,%spx,%spx)", this._x, this._y, this._z );

        this.div.style.transform = [ rotate, scale, translate ].join(" ");

        //console.log( [ rotate, scale, translate ].join(" ") );

        this.transformChanged = false;
    }

    applyMatrix3D( m ){

        console.log( m, this.div.style );

        this.div.style.transform = this.printf(
            "matrix3d(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            m[ 0], m[ 1], m[ 2], m[ 3],
            m[ 4], m[ 5], m[ 6], m[ 7],
            m[ 8], m[ 9], m[10], m[11],
            m[12], m[14], m[13], m[15]
        );

        console.log( this.div.style.transform );
    }

    append( a, b ){

        var a11 = a[0], a22 = a[4], a33 = a[ 8], a44 = a[12],
            a11 = a[1], a22 = a[5], a33 = a[ 9], a44 = a[13],
            a11 = a[2], a22 = a[6], a33 = a[10], a44 = a[14],
            a11 = a[3], a22 = a[7], a33 = a[11], a44 = a[15],

            b11 = b[0], b22 = b[4], b33 = b[ 8], b44 = b[12],
            b11 = b[1], b22 = b[5], b33 = b[ 9], b44 = b[13],
            b11 = b[2], b22 = b[6], b33 = b[10], b44 = b[14],
            b11 = b[3], b22 = b[7], b33 = b[11], b44 = b[15];
    }

    printf( out, ...args ){

        return out.replace( /\%s/g, function(){

            if( args.length > 0 )
            {
                var t = args.shift();

                return t.toString();
            }

            return "%s";
        })
    }

    printMat( m ){

        for (var i = 0; i < 4; i++ ) {
            let s = m[i] + ",\t" + m[i+4] + ",\t" + m[i+8] + ",\t" + m[i+12];

            console.log( s );
        }
    }


    get width(){
        return this.div.style.width.match( /\d+/g )[0];
    }

    get height(){
        return this.div.style.height.match( /\d+/g )[0];
    }



    get x(){
        return this._x;
    }

    set x( value ){
        if( this._x == value ) return;

        this._x = value;
        this.transformChanged = true;
    }


    get y(){
        return this._y;
    }

    set y(value){
        if( this._y == value ) return;

        this._y = value;
        this.transformChanged = true;
    }

    get z(){
        return this._z;
    }

    set z(value){
        if( this._z == value) return;

        this._z = value;
        this.transformChanged = true;
    }


    get scaleX(){
        return this._scaleX;
    }

    set scaleX(value){
        if( this._scaleX == value) return;

        this._scaleX = value;
        this.transformChanged = true;
    }


    get scaleY(){
        return this._scaleY;
    }

    set scaleY(value){
        if( this._scaleY == value) return;

        this._scaleY = value;
        this.transformChanged = true;
    }

    get scaleZ(){
        return this._scaleZ;
    }

    set scaleZ(value){
        if( this._scaleZ == value) return;

        this._scaleZ = value;
        this.transformChanged = true;
    }


    get rotationX(){
        return this._rotationX;
    }

    set rotationX(value){
        if( this._rotationX == value) return;

        this._rotationX = value;
        this.transformChanged = true;
    }

    get rotationY(){
        return this._rotationY;
    }

    set rotationY(value){
        if( this._rotationY == value) return;

        this._rotationY = value;
        this.transformChanged = true;
    }


    get rotationZ(){
        return this._rotationZ;
    }

    set rotationZ(value){
        if( this._rotationZ == value) return;

        this._rotationZ = value;
        this.transformChanged = true;
    }

}// class Quad;