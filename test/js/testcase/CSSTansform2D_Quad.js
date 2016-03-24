/**
 * Created by NAVER on 16. 3. 10..
 */

"use strict";

class CSSTansform2D_Quad extends TestCase{

    constructor(){
        super();
    }

    start(){

        this.content = document.getElementById( "content" );
        this.layout();
    }

    dispose(){

        for (var i = 0, l = this.content.childElementCount; i < l; i++) {
            this.content.removeChild( this.content.firstElementChild );
        }

        webkitCancelRequestAnimationFrame( this._id );
    }


    layout(){

        this.children = [];

        this.quad = new Quad( 100, 100, "lightGreen" );
        this.quad.y = window.innerHeight / 2;
        this.content.appendChild( this.quad.div );

        this.onDraw = this.draw.bind( this );

        this._id = requestAnimationFrame( this.onDraw );
    }

    draw(ms){
        this._id = requestAnimationFrame( this.onDraw );

        this.quad.rotation += 0.03;
        this.quad.x = window.innerWidth * ( Math.cos( ms / 500 ) / 2 + 0.5 );
        this.quad.update();
    }

}// class CSSTransform2D;


class Quad{

    constructor( w, h, color ){

        this.div = this.makeDiv( w, h, color );

        this._x = 0;
        this._y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._rotation = 0;

        this.transformChanged = true;
    }


    makeDiv( w, h, color ){

        var div = document.createElement( "div" );

        div.style.width = w + "px";
        div.style.height = h + "px";
        div.style.backgroundColor = color;

        return div;
    }

    update(){

        if( !this.transformChanged ) return;

        var a, b, c, d, e, f;
        var cos = Math.cos( this._rotation );
        var sin = Math.sin( this._rotation );

        a = cos * this._scaleX;
        b = -sin * this._scaleX;

        c = sin * this._scaleY;
        d = cos * this._scaleY;

        e = this._x;
        f = this._y;

        this.div.style.transform =
            this.printf( "matrix(%s,%s,%s,%s,%s,%s)", a, b, c, d, e, f );

        this.transformChanged = false;
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


    get rotation(){
        return this._rotation;
    }

    set rotation(value){
        if( this._rotation == value) return;

        this._rotation = value;
        this.transformChanged = true;
    }

}// class Quad;

window.$case[ "CSS Transform 2D Quad Instantiation" ] = CSSTansform2D_Quad;