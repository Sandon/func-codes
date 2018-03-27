define( 'CascadeDropbox', ['jquery'], function ( $ ) {

    /**
     * @param options
     * options.tpl String
     * options.dataAttr String 承载数据的属性名
     * options.targets String
     * @constructor
     */
    function CascadeDropbox ( options ) {
        this.options = options;

        // tpl
        if ( !options.tpl ) {
            return;
        }
        this.tpl = $( options.tpl );

        // targets
        !options.targets && ( options.targets = "select" );
        this.targets = this.tpl.find( options.targets );

        // dataAttr
        if ( options.dataAttr ) {
            this.data = this.tpl.attr( options.dataAttr );
            this._init();
        }
    }

    CascadeDropbox.prototype._init = function () {
        /*
         * 初始渲染
         */
        var len = this.targets.length;
        for ( var i = 0; i != len; i++ ) {

        }

        /*
         * 绑定事件
         */
    };

    /**
     * 除了通过属性的承载来植入数据，还可以通过此函数来动态设置数据
     * @param data
     */
    CascadeDropbox.prototype.setData = function (data) {
        this.data = data;
        this._init();
    };

    return CascadeDropbox;
} );