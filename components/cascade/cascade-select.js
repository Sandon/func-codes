/**
 * 级联选取组件
 *
 * @author sandon.lip
 * @date 2015-04-20
 * @version  1.0
 */

define('cascade-select', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget', 'jquery'], function(Class, Widget, $) {
    'use strict';

    var CascadeSelect = Class ( Widget, {
        /**
         * 默认配置参数
         */
        options : {

            /**
             * 值为id或class选择器字符串，基于已有DOM节点进行构建，表示要构建的组件的根DOM节点
             */
            tpl : '',

            /**
             * 值为id或class选择器字符串，表示弹出的候选区域的DOM节点
             */
            selectCandidateArea : ".cascade-select-area",

            /**
             * 候选区出现的方式
             */
            candidateAreaShowStyle : "normal",

            /**
             * 级联选取组件中，“级”对应的class，会在 selectCandidateArea 下面查找
             */
            cascadeLevelSlct : '.cascade-level',

            /**
             * “级”的数量
             */
            cascadeLevelNum : 1,

            /**
             * 组对应的选择器字符串，会在 cascadeLevelSlct 下面查找;一个”级“中可以有多个组，一个组里有多个候选条目，一个组对应上一级中的一个条目
             */
            cascadeGroupSlct : 'ul',
            
            /**
             * 选择器字符串，标识一个候选条目，会在 cascadeLevelSlct 下面查找
             */
            item : ".cascade-item",

            /**
             * 字符串，表示item被选中时的class
             */
            itemSelectedClass : "selected",

            /**
             * 选择器字符串，候选条目中触发选择的元素，会在 item 下面查找
             */
            trigger : '.check-icon',

            /**
             * 选择器字符串，候选条目中包含文本的元素，会在 item 下面查找
             */
            txt : '.txt',

            /**
             * 承载每个候选条目上存储对应标识信息的属性
             */
            itemIdAttr : 'data-cascade-item-id',

            /**
             * 承载每组候选条目的上一级条目的标识信息的属性
             */
            parentIdAttr : 'data-cascade-parent-id',

            /**
             * 为有子集条目的候选条目添加的class
             */
            clsWhenHasSub : 'cascade-has-sub',

            /**
             * 为不能选取的候选条目添加的class
             */
            disabledCls : 'cascade-disabled',

            /**
             * 值为id或class选择器字符串，表示选中区域的DOM节点
             */
            selectedArea : '.selected-area',

            /**
             * 选择器字符串，标识选中区域中触发删除的元素，会在 selectedArea 下面查找
             */
            selectedDeleteCls : '.cascade-delete',

            /**
             * 最多能选择的条目的数量，0表示没有限制
             */
            itemMaxNum : 0,

            /**
             * 出现后给根DOM元素添加的z-index 值
             */
            zIndex : 10,

            /**
             * 同级祖先限制：选择多个条目时，要求这些条目必须是特定一个级的同一个条目下的子孙条目，此参数用来设置此级的级数，从0开始，-1表示没有限制
             */
            limitLevel : -1,

            /**
             * 当有同级祖先限制，并初始时后端输出有默认选中条目时，此参数用来承载此同一祖先的ID 的属性，在根DOM节点上
             */
            limitAnceIdAttr : 'data-limit-ance-id'

        },

        _create : function () {
            var self = this;

            if ( "string" === typeof self.options.tpl.value ) {
                self.cascadeRoot = $( self.options.tpl.value );
            } else if ( self.options.tpl.value instanceof $ ) {
                self.cascadeRoot = self.options.tpl.value ;
            } else {
                //console.log( "tpl参数值不对" );
                self.trigger( "error", { msg : 'tpl' } );
                return;
            }

            self.candidateArea = self.cascadeRoot.find( self.options.selectCandidateArea.value );

            self.allLevels = self.cascadeRoot.find( self.options.selectCandidateArea.value + " " + self.options.cascadeLevelSlct.value );

            self.selectedArea = self.cascadeRoot.find( self.options.selectedArea.value );

            if ( self.allLevels.length != self.options.cascadeLevelNum.value ) {
                //console.log("级数设置不对");
                self.trigger( "error", { msg : 'level number' } );
                return;
            }

            self.selectedItems = [];

            self._initWriteBack();

            self._bind();
        },

        /**
         * init event listeners
         * @private
         */
        _bind : function () {

            this._initShow();

            this._initExtend();

            this._initCheckClick();

            this._initSelectedDelete();
        },

        /**
         * init the show of candidate area and every level in it
         * @private
         */
        _initShow : function () {
            var self = this;

            /*
             * the showing and hiding style of candidate area
             */
            if ( "normal" == self.options.candidateAreaShowStyle.value ){
                self.cascadeRoot.mouseenter( function( e ){
                    if ( self.candidateArea.is( ":hidden" ) ) {

                        self.originZIndex = self.cascadeRoot.css( "z-index" );
                        self.cascadeRoot.css ( "z-index", self.options.zIndex.value );

                        self.candidateArea.show();
                    }
                } );
                self.cascadeRoot.mouseleave( function( e ){

                    self.cascadeRoot.css ( "z-index", self.originZIndex );

                    self.candidateArea.hide();
                } );
            }

            /*
             * init every level
             */
            for ( var i = 1; i != self.options.cascadeLevelNum.value; i++ ) {
                self.allLevels.eq(i).find( self.options.cascadeGroupSlct.value ).hide();
            }


        },

        /**
         * data write back
         * @private
         */
        _initWriteBack : function () {
            var self = this;
            /*
             * init selected area write back
             */
            // self.selectedItems write back
            var initSelectedItems = self.candidateArea.find( "." + self.options.itemSelectedClass.value );
            initSelectedItems.each( function () {
                var $this = $(this);
                var id = $this.attr( self.options.itemIdAttr.value );
                self.selectedItems.push( id );
                self._instSelectedItem( $this );
            } );

            // self.limitAncestor write back

            var $ancestor = self._findMulLCA();
            if ( -1 !== self.options.limitLevel.value && 0 != initSelectedItems.length && $ancestor ) {

                var levNum = this.allLevels.index( $ancestor.closest( this.options.cascadeLevelSlct.value ) );
                var parentId = $ancestor.closest( this.options.cascadeGroupSlct.value ).attr( this.options.parentIdAttr.value );
                while ( levNum > self.options.limitLevel.value ) {
                    levNum--;

                    $ancestor = self._findItem( self.candidateArea, parentId );
                    parentId = $ancestor.closest( this.options.cascadeGroupSlct.value ).attr( this.options.parentIdAttr.value );
                }

                self.limitAncestor = $ancestor.attr( self.options.itemIdAttr.value );
            }
            console.log(self.limitAncestor);
        },

        /**
         * when choosing one item, extend its sub items
         * @private
         */
        _initExtend : function () {
            var self = this;

            self.cascadeRoot.on( "click", self.options.selectCandidateArea.value + " " + self.options.cascadeLevelSlct.value + " " + self.options.item.value, function (e) {
                var $this = $(this);

                if ( $this.hasClass( self.options.clsWhenHasSub.value ) ) {

                    var id = $this.attr( self.options.itemIdAttr.value );

                    var $myLevel = $this.closest( self.options.cascadeLevelSlct.value );

                    var index = $myLevel.length ? self.allLevels.index( $myLevel ) : -1;

                    var end = self.options.cascadeLevelNum.value - 2;
                    if ( -1 == index || end < index )
                        return;

                    // next level
                    var $nextLevelUl = self.allLevels.eq( ++index ).find( self.options.cascadeGroupSlct.value );
                    $nextLevelUl.hide();
                    $nextLevelUl.filter( "[" + self.options.parentIdAttr.value + "='" + id + "']").show();

                    // levels after next level
                    ++index;
                    while ( index < self.options.cascadeLevelNum.value ){

                        self.allLevels.eq( index ).find( self.options.cascadeGroupSlct.value).hide();

                        ++index;
                    }
                }
            });
        },

        _instSelectedItem : function ( $item ) {
            var self = this;

            var $level = $item.closest( self.options.cascadeLevelSlct.value );
            var index = self.allLevels.index( $level );
            var parentId = $item.closest( self.options.cascadeGroupSlct.value ).attr( self.options.parentIdAttr.value );
            var txt = $item.find( self.options.txt.value ).text();
            var id = $item.attr( self.options.itemIdAttr.value );

            for ( var i = index - 1; i > -1; i-- ) {
                var $tem = self._findItem( self.allLevels.eq(i), parentId );

                txt = $tem.find( self.options.txt.value).text() + "/" + txt;
                parentId = $tem.closest( self.options.cascadeGroupSlct.value ).attr( self.options.parentIdAttr.value );
            }
            var $newSelect = $( "<li " + self.options.itemIdAttr.value + "='" + id + "'><span>" + txt +"</span><a href='#' title='删除' class='" + self.options.selectedDeleteCls.value + "'></a></li>" );
            self.selectedArea.find( "ul" ).append( $newSelect );
        },

        /**
         * select or unselect an item in candidate area
         * @private
         */
        _initCheckClick : function () {
            var self = this;

            self.cascadeRoot.on( "click", self.options.selectCandidateArea.value + " " + self.options.cascadeLevelSlct.value + " " + self.options.trigger.value, function(e){

                var $this = $(this);
                var $item = $this.closest( self.options.item.value );
                var id = $item.attr( self.options.itemIdAttr.value );
                var txt = $item.find( self.options.txt.value ).text(), rawTxt = txt;

                if ( $item.hasClass( self.options.itemSelectedClass.value ) ) {
                    /*
                     * change the selectedItems array
                     */
                    var length = self.selectedItems.length;
                    for ( var i = 0; i != length; i++ ){
                        if ( id == self.selectedItems[i] ) {
                            self.selectedItems.splice( i, 1 );
                            break;
                        }
                    }

                    /*
                     * change the self.limitAncestor based on same level ancestor limit
                     */
                    if ( -1 !== self.options.limitLevel.value && 0 == self.selectedItems.length ){
                        self.limitAncestor = null;
                    }

                    /*
                     * change looking and mark
                     */
                    $item.removeClass( self.options.itemSelectedClass.value );

                    /*
                     * change the corresponding selected area
                     */
                    self.selectedArea.find( "li[" + self.options.itemIdAttr.value + "=" + "'" + id + "']").remove();

                    /*
                     * trigger event
                     */
                    self.trigger( "unselected", { "id" : id, "txt" : rawTxt } );

                } else {

                    /*
                     * exceed the itemMaxNum
                     */

                    if ( 0 != self.options.itemMaxNum.value && self.selectedItems.length >= self.options.itemMaxNum.value ) {
                        return;
                    }

                    /*
                     * exceed the same level ancestor limit
                     */
                    var $level = $this.closest( self.options.cascadeLevelSlct.value );
                    var index = self.allLevels.index( $level );
                    var searchIndex = index;
                    var searchMyId = null, searchParentId = null, $searchNowItem = null;
                    if ( -1 !== self.options.limitLevel.value && searchIndex >= self.options.limitLevel.value ){
                        $searchNowItem = $item;
                        searchMyId = id;
                        searchParentId = $searchNowItem.closest( self.options.cascadeGroupSlct.value).attr( self.options.parentIdAttr.value );

                        while ( searchIndex > self.options.limitLevel.value ) {
                            searchIndex--;

                            $searchNowItem = self.allLevels.eq(searchIndex).find( "li[" + self.options.itemIdAttr.value + "=" + "'" + searchParentId + "']" )
                            searchMyId = $searchNowItem.attr( self.options.itemIdAttr.value );
                            searchParentId = $searchNowItem.closest( self.options.cascadeGroupSlct.value).attr( self.options.parentIdAttr.value );
                        }

                        if ( !self.limitAncestor ) {
                            self.limitAncestor = searchMyId;
                        } else if ( self.limitAncestor != searchMyId ) {
                            self.trigger( "notsameance" );
                            return;
                        }
                    }


                    /*
                     * change the selectedItems array
                     */
                    self.selectedItems.push(id);


                    /*
                     * change looking and mark
                     */
                    $item.addClass( self.options.itemSelectedClass.value );

                    /*
                     * change the corresponding selected area
                     */
                    self._instSelectedItem( $item );

                    /*
                     * trigger event
                     */
                    self.trigger( "selected", { "id" : id, "txt" : rawTxt, "cascadeTxt" : txt } );
                }
            } );
        },

        /**
         * unselect an item in selected area
         * @private
         */
        _initSelectedDelete : function () {
            var self = this;

            self.cascadeRoot.on( "click", self.options.selectedArea.value, function(e) {
                var $target = $( e.target );

                if ( $target.hasClass( self.options.selectedDeleteCls.value ) ) {
                    e.preventDefault();

                    /*
                     * change the candidate area and selected area
                     */
                    var $deleteOne = $target.closest( "li" );
                    var id = $deleteOne.attr(self.options.itemIdAttr.value);
                    var rawTxt = $deleteOne.find( self.options.txt.value ).text();
                    var $corItem = self.candidateArea.find( "li[" + self.options.itemIdAttr.value + "=" + "'" + id + "']" );
                    $deleteOne.remove();
                    $corItem.removeClass(self.options.itemSelectedClass.value);


                    /*
                     * change the selectedItems array
                     */
                    var length = self.selectedItems.length;
                    for ( var i = 0; i != length; i++ ){
                        if ( id == self.selectedItems[i] ){
                            self.selectedItems.splice( i, 1 );
                            break;
                        }
                    }

                    /*
                     * change the self.limitAncestor based on same level ancestor limit
                     */
                    if ( -1 !== self.options.limitLevel.value && 0 == self.selectedItems.length ){
                        self.limitAncestor = null;
                    }

                    /*
                     * trigger event
                     */
                    self.trigger( "unselected", { "id" : id, "txt" : rawTxt } );
                }

            } );

        },

        /**
         * DOM Manager : find the item with the given id
         * @private
         */
        _findItem : function ( $obj, id ) {
            return $obj.find( "[" + this.options.itemIdAttr.value + "=" + "'" + id + "']" );
        },

        /**
         * find the lowest common ancestor of multiple items
         * @private
         */
        _findMulLCA : function () {
            var self = this;

            var length = self.selectedItems.length;
            if ( length < 2 )
                return null;
            var $temLCA = self._findItem( self.candidateArea, self.selectedItems[0] );

            for ( var i = 1; i != length; i++ ) {
                $temLCA = self._findPairLCA( $temLCA, self._findItem( self.candidateArea, self.selectedItems[i] ) );

                if ( !$temLCA )
                    return null;
            }

            return $temLCA;

        },

        /**
         * find the lowest common ancestor of two items
         * @private
         */
        _findPairLCA : function ( $Obj1, $Obj2 ) {
            var self = this;
            var limitLevel = self.options.limitLevel.value;

            var $level1 = $Obj1.closest( self.options.cascadeLevelSlct.value );
            var levNum1 = self.allLevels.index( $level1 );
            var parentId1 = $Obj1.closest( self.options.cascadeGroupSlct.value ).attr( self.options.parentIdAttr.value );

            var $level2 = $Obj2.closest( self.options.cascadeLevelSlct.value );
            var levNum2 = self.allLevels.index( $level2 );
            var parentId2 = $Obj2.closest( self.options.cascadeGroupSlct.value ).attr( self.options.parentIdAttr.value );

            // search upgrade
            while ( levNum1 >= limitLevel && levNum2 >= limitLevel && $Obj1.get(0) != $Obj2.get(0) ) {
                if ( levNum1 == levNum2 ) {
                    levNum1--;
                    $Obj1 = self._findItem( self.allLevels.eq( levNum1 ), parentId1 );
                    parentId1 = $Obj1.closest( self.options.cascadeGroupSlct.value ).attr( self.options.parentIdAttr.value );

                    levNum2--;
                    $Obj2 = self._findItem( self.allLevels.eq( levNum2 ), parentId2 );
                    parentId2 = $Obj2.closest( self.options.cascadeGroupSlct.value ).attr( self.options.parentIdAttr.value );

                } else if ( levNum1 > levNum2 ) {
                    levNum1--;
                    $Obj1 = self._findItem( self.allLevels.eq( levNum1 ), parentId1 );
                    parentId1 = $Obj1.closest( self.options.cascadeGroupSlct.value ).attr( self.options.parentIdAttr.value );

                } else {
                    levNum2--;
                    $Obj2 = self._findItem( self.allLevels.eq( levNum2 ), parentId2 );
                    parentId2 = $Obj2.closest( self.options.cascadeGroupSlct.value ).attr( self.options.parentIdAttr.value );
                }
            }

            // find the LCA if equal
            if ( $Obj1.get(0) == $Obj2.get(0) ) {
                return $Obj1;
            }
            return null;

        },

        /**
         * get selected items
         * @returns {Array} array of selected items' Id
         */
        getSelectedItem : function () {
            return this.selectedItems;
        },

        /**
         * get limit ancestor
         * @returns string/null Id
         */
        getLimitAncestor : function () {
            return this.limitAncestor;
        }
    });

    return CascadeSelect;
});