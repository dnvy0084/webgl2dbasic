/**
 * Created by NAVER on 16. 3. 10..
 */

"use strict";

class CSSTransform3D_01 extends TestCase{

    constructor(){
        super();
    }

    start(){

        this.content = document.getElementById( "content" );

        this.layout();
    }

    dispose(){

        for (var i = 0; i < this.content.childElementCount; i++) {

            this.content.removeChild( this.content.firstElementChild );
        }
    }



    layout(){

        let quad = this.makeElement( "div", ["quad", "red"] );

        this.content.appendChild( quad );


        let x, y, scaleX, scaleY, rotation, offsetX, offsetY;

        x = 0; y = 0;
        scaleX = scaleY = 1;
        rotation = Math.PI / 4;
        offsetX = 0;//quad.clientWidth / 2;
        offsetY = 0;//quad.clientHeight / 2;

        let a, b, c, d, e, f, cos, sin;

        cos = Math.cos( rotation );
        sin = Math.sin( rotation );

        a = cos * scaleX;
        b = -sin * scaleX;
        c = x - a * offsetX - b * offsetY;

        d = sin * scaleY;
        e = cos * scaleY;
        f = y - d * offsetX - e * offsetY;

        var mat = this.printf(
            "matrix(%s,%s,%s,%s,%s,%s)",
            a, b, d, e, c, f
        );

        console.log( mat );

        quad.style.transform = mat// "matrix(2,0,0,2,200,200)";//mat;

        console.log( quad.clientTop, quad.clientLeft );
    }


    makeElement( type, _classes ) {

        var dom = document.createElement( type );

        for (var i = 0; i < _classes.length; i++) {
            dom.classList.add( _classes[i] );
        }

        return dom;
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

}// class CSSTransform

window.$case[ "CSS transform 3D test - 1" ] = CSSTransform3D_01;