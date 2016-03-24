/**
 * Created by NAVER on 16. 3. 9..
 */

"use strict";

window.$case = {};

class TestCase{

    constructor(){

        this.main = null;
    }

    start(){
        console.log( "case start", this );
    }

    dispose(){

        let content = $("#content")[0];

        for (var i = 0; i < content.childElementCount; i++) {
            content.removeChild( content.firstElementChild );
        }
    }
}