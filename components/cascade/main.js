lofty.config({
    resolve: function( id ) {
        if ( /^cascade\-select/.test(id) ) {
            return 'demo.1688.com/work/other/components/cascade/' + id + '.js'
        }
        return id;
    }
});

define(['cascade-select', 'jquery'], function(CascadeSelect, $) {
    $(function() {

        /**
         * cascade select
         */

        var cascadeSelect = new CascadeSelect( {
            tpl : $( '.cascade-select' ),
            item : 'li',
            selectedArea : '.selected-items',
            cascadeLevelNum : 3,
            itemMaxNum : 3,
            zIndex : 10,
            limitLevel : 0
        } );


    });
});
