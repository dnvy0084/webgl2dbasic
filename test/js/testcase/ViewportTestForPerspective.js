//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오전 11:13
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";


class ViewportTestForPerspective extends TestCase {


    constructor() {
        super();
    }


    start(){

        this.initViewport();
        this.initQuad();
        this.initGUI();
    }

    dispose(){
        super.dispose();
        $( this.gui.domElement ).remove();
    }



    initViewport(){

        let content = $( "#content" );

        this.viewport = $( '<div id="viewport"></div>' );
        this.viewport.css({
            border: "1px solid #888",
            "width": "500px",
            "height": "500px",
            "margin": "auto",
            "perspective": "500px",
            "background-image": "url(" + this.makeGrid( 500, 500, 10 )+ ")",
            overflow: "hidden",
        });

        content.append( this.viewport );
    }

    initQuad(){

        this.quad = new DIVQuad( 150, 150, "red" );
        this.viewport.append( this.quad.div );

        this.quad.normal[0] =
        this.quad.normal[1] = 0;
        this.quad.normal[2] = 1;

        this.quad.light[0] = 100,
        this.quad.light[1] = 100,
        this.quad.light[2] = 100;

        this.quad.x = ( 500 - this.quad.width ) / 2;
        this.quad.y = ( 500 - this.quad.height ) / 2;

        this.onDraw = this.draw.bind(this);
        this.id = requestAnimationFrame( this.onDraw );
    }

    initGUI(){

        this.gui = new dat.GUI({ autoPlace: false } );
        this.gui.domElement.classList.add( "gui" );

        $("#nav").after( this.gui.domElement );

        let info = [
            {
                folder: "position",
                target: this.quad,
                x: [ -100, 600 ],
                y: [ -100, 600 ],
                z: [ -500, 500 ],
            },
            {
                folder: "scale",
                target: this.quad,
                scaleX: [ -2, 2 ],
                scaleY: [ -2, 2 ],
                scaleZ: [ -2, 2 ],
            },
            {
                folder: "rotation",
                target: this.quad,
                rotationX: [ -3.14, 3.14 ],
                rotationY: [ -3.14, 3.14 ],
                rotationZ: [ -3.14, 3.14 ],
            }
        ];

        for (var i = 0; i < info.length; i++) {

            let o = info[i],
                f = this.gui.addFolder( o.folder );

            for( var s in o ){

                if( s == "target" || s == "folder" ) continue;

                let item = f.add.apply( f, [ o.target, s ].concat(o[s] ) );
            }

            f.open();
        }
    }




    draw( ms ){

        this.id = requestAnimationFrame( this.onDraw );
        this.quad.update();
    }



    makeGrid( w, h, gap ){

        var gl = document.createElement( "canvas" ).getContext("2d");

        gl.canvas.width = w;
        gl.canvas.height = h;

        this.drawLines( gl, w, h, gap, "#eee" );
        this.drawLines( gl, w, h, 50, "#ccc" );
        this.drawLines( gl, w, h, 100, "#888" );

        return gl.canvas.toDataURL();
    }


    drawLines( gl, w, h, gap, color ){

        gl.beginPath();

        for (var y = 1; y <= h / gap; y++) {
            gl.moveTo( 0, y * gap + 0.5 );
            gl.lineTo( w, y * gap + 0.5 );
        }

        for (var x = 0; x <= w / gap; x++) {
            gl.moveTo( x * gap + 0.5, 0 );
            gl.lineTo( x * gap + 0.5, h );
        }

        gl.strokeStyle = color;
        gl.stroke();
    }



}// class ViewportTestForPerspective

window.$case[ "Single Plain Transform with CSS3 matrix3d" ] = ViewportTestForPerspective;
