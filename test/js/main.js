/**
 * Created by NAVER on 16. 3. 9..
 */


"use strict";



class TestMain{

    constructor(){
        //
    }

    initCanvas( canvas ){

        this.canvas = canvas;

        if( typeof canvas == "string" )
            this.canvas = document.getElementById( canvas );

        this.initEvents();
        this.onResize();

        return this;
    }

    initEvents(){

        window.onresize = this.onResize;

        function preventDefault(e) {
            e = e || event;
            e.preventDefault();
        }

        window.addEventListener( "dragover", preventDefault );
    }

    onResize(){

        if( this.canvas == null ) return;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }



    setTestCase( label ){

        if( this.currentLabel == label ) return;

        this.currentLabel = label;
        this.disposeCurrentCase();

        if( !window.$case.hasOwnProperty( label ) )
            console.log( "[ERROR] Can not find " + label );

        this.currentCase = new window.$case[label]();
        this.currentCase.main = this;
        this.currentCase.start( this.canvas );
    }

    disposeCurrentCase(){

        if( !this.currentCase ) return;

        this.currentCase.main = null;
        this.currentCase.dispose();
    }



    initUILayer( skin, importWidgetList ){

        YUI({ skin: skin }).use(
            importWidgetList,
            this.onYUIAllSet.bind(this)
        );

        return this;
    }

    onYUIAllSet(Y){

        var sources = [];
        var firstCase = null;

        for( var s in window.$case )
        {
            sources.push( s );

            if( firstCase == null )
                firstCase = s;
        }

        this.dropDown = new DropDown(Y, sources);
        this.dropDown.onChange = this.onDropDownChanged.bind(this);

        this.setTestCase( firstCase );
    }

    onDropDownChanged( label ){

        this.setTestCase( label );

    }


} //class TestMain




class DropDown{

    constructor(Y, sources){

        this.sources = sources;

        this.widget = new Y.Button({
            srcNode: "#widget-dropdownInput",
            label: sources[0]

        }).render("#ui-layer");

        this.node._node.classList.add( "case-dropdown" );

        this.list = new Y.AutoCompleteList({
            inputNode: this.node,
            source: this.sources,
            render: true,
            minQueryLenght: 0,
            tabSelect: true,
            activateFirstItem: false
        });

        this.widget.on( "click", this.onWidgetClick.bind(this) );
        this.widget.on( "labelChange", this.onLabelChanged.bind(this));
        this.list.on( "select", this.onListSelect.bind(this) );
    }

    onLabelChanged(e){

        if( this.onChange )
            this.onChange( e.newVal );
    }

    onListSelect( e ){

        this.widget.set( "label", e.itemNode.get( "text" ) );
    }


    onWidgetClick( e ){

        e.stopPropagation();

        if( this.list.get( "visible" ) )
        {
            this.list.hide();
        }
        else
        {
            this.list.sendRequest();
            this.list.show();
        }
    }


    get node(){

        if( this.widget == null ) return null;

        if( this._node == null )
            this._node = this.widget.get( "srcNode" );

        return this._node;
    }

    get label(){
        return this.widget.get( "label" );
    }

}// class DropDown