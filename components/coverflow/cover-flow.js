define( 'cover-flow', [ 'jquery' ], function ( $ ) {
    function CoverFlow ( options ) {
        this.options = options;
        this.startIndex = 0;
        this.endIndex = 0;
        this.length = null;
        this.items = null;
        this.nowSelected = null;
        this.posInfo = null;
        this.nowStyleArr = this.options.infoArray;
        this.nowClasses = this.options.classes;
        this._classes = this.options.classes.join(" ");
        this._isSwitchable = false;
        this._itemSwitchCbs = [];

        this._init();
    }
    CoverFlow.prototype._init = function () {
        var self = this;

        self.tpl = $( self.options.tpl );
        self.items = self.tpl.find( self.options.item );

        if ( self.items.length < self.nowStyleArr.length ) {
            return;
        }
        self._initGroup( true, function () {
            self._isSwitchable = true;
        } );

        //bind item switch handlers
        self.tpl.on( "click", self.options.item, function () {
            self.switchTo( self.items.index( this ) );
        } );

        //bind group switch handlers
        self.nextGroupBtn = self.tpl.find( self.options.nextGroup );
        self.prevGroupBtn=self.tpl.find( self.options.prevGroup );
        self.nextGroupBtn.on( "click", function (e) {
            e.preventDefault();
            self.nextGroup();
        } );
        self.prevGroupBtn.on( "click", function (e) {
            e.preventDefault();
            self.prevGroup();
        } );
    };
    CoverFlow.prototype._initGroup = function ( isFirst, callback, lastStartIndex, lastEndIndex, lastPosInfo, lastStyleArr, lastClasses ) {
        var self = this;
        self.posInfo = new Array(); // init posInfo whenever initialing  a new group
        self.endIndex = self.startIndex + self.nowStyleArr.length;
        self.endIndex = self.endIndex > self.items.length ? self.items.length : self.endIndex;

        self.nowSelected = self.startIndex + Math.floor( self.nowStyleArr.length / 2 );

        var showItems = null;
        function initGroupStyle ( showItems ) {
            var size = showItems.length;
            var zIndex = null;
            var offsetSlct = null;
            var item = null;
            for (var i = 0; i != size; i++ ) {
                offsetSlct = self.nowSelected - self.startIndex;
                zIndex = i > offsetSlct ? offsetSlct - ( i - offsetSlct ) : i;
                self.nowStyleArr[ i ][ "z-index" ] = zIndex;
                item=showItems.eq( i );
                item.css( self.nowStyleArr[ i ] );
                item.removeClass( self._classes );
                item.addClass( self.nowClasses[ i ] );

                //record pos info
                self.posInfo.push( i );
            }
        }
        function getItems ( startIndex, endIndex ) {
            if ( startIndex == 0 ) {
                return self.items.filter( ":lt(" + endIndex + ")" );
            }
            else {
                return self.items.filter( ":lt(" + endIndex + ")" ).filter( ":gt(" + ( startIndex - 1 ) + ")" );
            }
        }

        //render the items
        if ( isFirst || ! self.options.groupEffect ) {
            //show this group
            self.items.hide();
            showItems = getItems( self.startIndex, self.endIndex );
            showItems.show();

            //init this group's style
            initGroupStyle( showItems );

            //callback
            if ( callback )
                callback();
        } else {
            if ( "leftright" == self.options.groupEffect ) {

                //hide last group
                //(getItems(lastStartIndex,lastEndIndex)).hide();
                var i, j;
                for ( i = lastStartIndex; i != lastEndIndex; i++ ) {
                    var pos = lastPosInfo[ i - lastStartIndex ];
                    var $thisItem = self.items.eq( i );
                    for ( j = pos - 1; j != -1; j-- ) {
                        $thisItem.animate( lastStyleArr[j], self.options.groupSwitchSpeed, "linear" );
                        $thisItem.removeClass( self._classes );
                        $thisItem.addClass( lastClasses[ j ] );
                    }
                    if ( pos == self.nowStyleArr.length - 1 ) {
                        $thisItem.animate( { left : -( lastStyleArr[0].left + lastStyleArr[0].width + self.options.gap ) }, self.options.groupSwitchSpeed, "linear", function () {
                            (getItems(lastStartIndex, lastEndIndex)).hide();
                        } );
                        $thisItem.removeClass( self._classes );
                    }
                    else {
                        $thisItem.animate( { left : -( lastStyleArr[0].left + lastStyleArr[0].width + self.options.gap ) }, self.options.groupSwitchSpeed, "linear" );
                        $thisItem.removeClass( self._classes );
                    }
                }

                //show new group
                var lastStyle = self.nowStyleArr[ self.nowStyleArr.length - 1 ];
                function callNext ( index ) {
                    var $item = self.items.eq( self.startIndex + index );
                    for( var i = self.nowStyleArr.length - 1; i != index - 1; i-- ) {
                        if ( index == self.nowStyleArr.length - 1 ) {
                            $item.animate( self.nowStyleArr[i], self.options.groupSwitchSpeed, "linear", function () {
                                if ( callback )
                                    callback();
                            } );
                            $item.removeClass( self._classes );
                            $item.addClass( self.nowClasses[i] );
                        }
                        else {
                            $item.animate( self.nowStyleArr[i], self.options.groupSwitchSpeed, "linear" );
                            $item.removeClass( self._classes );
                            $item.addClass( self.nowClasses[i] );
                        }
                    }
                }
                ( getItems( self.startIndex, self.endIndex ) ).show().css( { left : lastStyle.left + lastStyle.width + self.options.gap } );
                var $firstItem = self.items.eq( self.startIndex );
                var indxEnd = self.nowStyleArr.length + 1;
                for ( var k = 1; k != indxEnd; k++ ) {
                    if ( k == self.nowStyleArr.length ) {
                        $firstItem.animate( self.nowStyleArr[ self.nowStyleArr.length - k ], self.options.groupSwitchSpeed, "linear" );
                        $firstItem.removeClass( self._classes );
                        $firstItem.addClass( self.nowClasses[ self.nowStyleArr.length - k ] );
                    } else {
                        (function (nextIndx) {
                            $firstItem.animate( self.nowStyleArr[ self.nowStyleArr.length - k ], self.options.groupSwitchSpeed, "linear", function () {
                                callNext(nextIndx);
                            } );
                            $firstItem.removeClass( self._classes );
                            $firstItem.addClass( self.nowClasses[ self.nowStyleArr.length - k ] );
                        })(k);

                    }
                }
                //record new group posInfo
                for ( i = 0; i != self.nowStyleArr.length; i++ )
                    self.posInfo.push(i);

            }
        }

    };
    CoverFlow.prototype.on = function ( event, cb ) {
        if ( "itemswitch" == event ) {
            this._itemSwitchCbs.push(cb);
        }
    };
    CoverFlow.prototype.nextItem = function () {

    };
    CoverFlow.prototype.prevItem = function () {

    };
    CoverFlow.prototype.nextGroup = function () {
        if ( this.items.length <= this.endIndex )
            return;
        var lastStartIndex = this.startIndex;
        this._isSwitchable = false;
        this.startIndex = this.endIndex;
        if( this.endIndex )
        var self = this;
        this._initGroup( false, function () {
            self._isSwitchable = true;

            if ( self.startIndex <= 0 )
                self.prevGroupBtn.addClass( self.options.groupSwitchDisableCls );
            else
                self.prevGroupBtn.removeClass( self.options.groupSwitchDisableCls );
            if( self.endIndex >= self.items.length )
                self.nextGroupBtn.addClass( self.options.groupSwitchDisableCls );
            else
                self.nextGroupBtn.removeClass( self.options.groupSwitchDisableCls );

        }, lastStartIndex, this.endIndex, this.posInfo, this.nowStyleArr, this.nowClasses );
    };
    CoverFlow.prototype.prevGroup = function () {
        if( this.startIndex <= 0 )
            return;
        var lastStartIndex = this.startIndex;
        this._isSwitchable = false;
        this.startIndex = this.startIndex - this.nowStyleArr.length;
        var self = this;
        this._initGroup( false, function () {
            self._isSwitchable = true;

            if ( self.startIndex <= 0 )
                self.prevGroupBtn.addClass( self.options.groupSwitchDisableCls );
            else
                self.prevGroupBtn.removeClass( self.options.groupSwitchDisableCls );
            if ( self.endIndex >= self.items.length )
                self.nextGroupBtn.addClass( self.options.groupSwitchDisableCls );
            else
                self.nextGroupBtn.removeClass( self.options.groupSwitchDisableCls );
        }, lastStartIndex, this.endIndex, this.posInfo, this.nowStyleArr, this.nowClasses );
    };
    CoverFlow.prototype.switchTo = function ( index ) {
        if ( ! this._isSwitchable )
            return;

        var self = this;

        if ( index != self.nowSelected && index < self.endIndex && index >= self.startIndex ) {
            var offset = self.posInfo[ self.nowSelected - self.startIndex ] - self.posInfo[ index - self.startIndex ];
            var styleArray = self.nowStyleArr, styleArraySize = styleArray.length;

            // loop each item
            for( var i = self.startIndex; i != self.endIndex; i++ ) {
                var $item = self.items.eq(i);
                var posInfoIndex = i - self.startIndex;
                var startPos = offset > 0 ? self.posInfo[ posInfoIndex ] + 1 : self.posInfo[ posInfoIndex ] - 1;
                var targetPos = self.posInfo[ posInfoIndex ] + offset;
                var endPos = offset > 0 ? targetPos + 1 : targetPos - 1;
                var step = offset > 0 ? 1 : -1;


                //animate
                //continue;
                var pos;
                // loop each status for this item
                for (var j = startPos; j != endPos; j += step ) {
                    if ( j >= styleArraySize ) {
                        pos = j - styleArraySize;
                    } else if ( j < 0 ) {
                        pos = j + styleArraySize;
                    } else {
                        pos = j;
                    }

                    $item.animate( styleArray[pos], self.options.itemSwitchSpeed, "linear" );
                    $item.removeClass( self._classes );
                    $item.addClass( self.nowClasses[pos] );
                }

                //update pos info
                if ( targetPos >= styleArraySize )
                    self.posInfo[posInfoIndex] = targetPos - styleArraySize;
                else if ( targetPos < 0 )
                    self.posInfo[posInfoIndex] = targetPos + styleArraySize;
                else
                    self.posInfo[posInfoIndex] = targetPos;
            }

            //update nowSelected
            self.nowSelected = index;

            // call item switch cbs
            for ( var i = 0; i != self._itemSwitchCbs.length; i++ ) {
                self._itemSwitchCbs[i]( self );
            }
        }
    };

    return CoverFlow;

});