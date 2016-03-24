//--------------------------------------
//
// _workspace(photoeditor)
//  - created by NAVER: 오후 2:25
//  - kim.jinhoon@nhn.com
//
//--------------------------------------

"use stirct";


class DIVQuadContainer extends DIVQuad{

    constructor(){
        super();

        this.children = [];
        this._textureHidden = true;
    }

    add( quad ){

        if( this.children.indexOf( quad ) != -1 ) return;

        this.children.push( quad );
        quad.parent = this;
    }

    remove( quad ){

        let index = this.children.indexOf( quad );

        if( index == -1 ) return;

        return this.children.splice( index, 1 )[0];
    }

    update( mat ){

        this.evalMatrix();

        for (var i = 0; i < this.children.length; i++) {

            let child = this.children[i];
            child.update( this.mat );
        }
    }


    get textureHidden() {
        return this._textureHidden;
    }

    set textureHidden(value) {

        this._textureHidden = value;

        let css = value ? "url(img/e.jpg)" : "";

        for (var i = 0; i < this.children.length; i++) {
            this.children[i].div.css( "background-image", css );
        }
    }
}


class DIVCubeWithDiffuseLight extends TestCase{

    constructor() {
        super();
    }

    start(){

        this.container = new DIVQuadContainer();

        this.initViewport();
        this.initCube();
        this.initGUI();

        this.onDraw = this.draw.bind(this);
        this.id = requestAnimationFrame( this.onDraw );
    }

    dispose(){
        super.dispose();

        webkitCancelRequestAnimationFrame( this.id );
        $( this.gui.domElement ).remove();
    }


    initViewport(){

        let content = $( "#content" );

        this.viewport = $( '<div id="viewport"></div>' );
        this.viewport.css({
            border: "1px solid #888",
            position: "relative",
            "width": "800px",
            "height": "800px",
            "margin": "auto",
            "perspective": "800px",
            "background-color": "black",
            overflow: "hidden",
        });

        content.append( this.viewport );
    }

    initCube(){

        let size = 150;

        let front = new DIVQuad( size, size );
            front.div.attr( "id", "front" );
            front.z = size / 2;
            front.setNormal( 0, 0, 1 );
        this.container.add( front );

        let back = new DIVQuad( size, size );
            back.div.attr( "id", "back" );
            back.z = -size / 2;
            back.setNormal( 0, 0, -1 );
        this.container.add( back );

        let top = new DIVQuad( size, size );
            top.div.attr( "id", "top" );
            top.y = -size / 2;
            top.rotationX = Math.PI / 2;
            top.setNormal( 0, 0, 1 );
        this.container.add( top );

        let bottom = new DIVQuad( size, size );
            bottom.div.attr( "id", "bottom" );
            bottom.y = size / 2;
            bottom.rotationX = -Math.PI / 2;
            bottom.setNormal( 0, 0, 1 );
        this.container.add( bottom );

        let left = new DIVQuad( size, size );
            left.div.attr( "id", "left" );
            left.x = -size / 2;
            left.rotationY = Math.PI / 2;
            left.setNormal( 0, 0, 1 );
        this.container.add( left );

        let right = new DIVQuad( size, size );
            right.div.attr( "id", "right" );
            right.x = size / 2;
            right.rotationY = -Math.PI / 2;
            right.setNormal( 0, 0, 1 );
        this.container.add( right );

        for (var i = 0; i < this.container.children.length; i++) {

            let child = this.container.children[i];

            child.div.css( "position", "absolute" );

            child.light[0] = 250;
            child.light[1] = 250;
            child.light[2] = 500;

            this.viewport.append( child.div );
        }

        this.container.x = ( 800 - size ) / 2;
        this.container.y = ( 800 - size ) / 2;
        this.container.z = 0;

        this.container.rotationX = -0.4;
        this.container.rotationY = 0.4;
    }


    initGUI(){

        this.gui = new dat.GUI({ autoPlace: false } );
        this.gui.domElement.classList.add( "gui" );

        $("#nav").after( this.gui.domElement );

        let info = [
            {
                folder: "position",
                target: this.container,
                x: [ -100, 600 ],
                y: [ -100, 600 ],
                z: [ -500, 500 ],
            },
            {
                folder: "rotation",
                target: this.container,
                rotationX: [ -3.14, 3.14 ],
                rotationY: [ -3.14, 3.14 ],
                rotationZ: [ -3.14, 3.14 ],
                textureHidden: []
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

        this.container.update();
    }

}// class DIVCubeWithDiffuseLight

window.$case[ "DIVCube with DiffuseLight test" ] = DIVCubeWithDiffuseLight;