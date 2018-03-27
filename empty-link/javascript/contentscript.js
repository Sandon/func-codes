
(function($) {
//关于缓存的方法
window.cache = (function() {

	var obj = {};
	var mythis = this;
	var getMD5 = function(href) {

		var hexcase = 0;

		function hex_md5(a) {
			return rstr2hex(rstr_md5(str2rstr_utf8(a)))
		}

		function hex_hmac_md5(a, b) {
			return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)))
		}

		function md5_vm_test() {
			return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
		}

		function rstr_md5(a) {
			return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
		}

		function rstr_hmac_md5(c, f) {
			var e = rstr2binl(c);
			if (e.length > 16) {
				e = binl_md5(e, c.length * 8)
			}
			var a = Array(16),
				d = Array(16);
			for (var b = 0; b < 16; b++) {
				a[b] = e[b] ^ 909522486;
				d[b] = e[b] ^ 1549556828
			}
			var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
			return binl2rstr(binl_md5(d.concat(g), 512 + 128))
		}

		function rstr2hex(c) {
			try {
				hexcase
			} catch (g) {
				hexcase = 0
			}
			var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var b = "";
			var a;
			for (var d = 0; d < c.length; d++) {
				a = c.charCodeAt(d);
				b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
			}
			return b
		}

		function str2rstr_utf8(c) {
			var b = "";
			var d = -1;
			var a,
				e;
			while (++d < c.length) {
				a = c.charCodeAt(d);
				e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
				if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
					a = 65536 + ((a & 1023) << 10) + (e & 1023);
					d++
				}
				if (a <= 127) {
					b += String.fromCharCode(a)
				} else {
					if (a <= 2047) {
						b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
					} else {
						if (a <= 65535) {
							b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
						} else {
							if (a <= 2097151) {
								b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
							}
						}
					}
				}
			}
			return b
		}

		function rstr2binl(b) {
			var a = Array(b.length >> 2);
			for (var c = 0; c < a.length; c++) {
				a[c] = 0
			}
			for (var c = 0; c < b.length * 8; c += 8) {
				a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
			}
			return a
		}

		function binl2rstr(b) {
			var a = "";
			for (var c = 0; c < b.length * 32; c += 8) {
				a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
			}
			return a
		}

		function binl_md5(p, k) {
			p[k >> 5] |= 128 << ((k) % 32);
			p[(((k + 64) >>> 9) << 4) + 14] = k;
			var o = 1732584193;
			var n = -271733879;
			var m = -1732584194;
			var l = 271733878;
			for (var g = 0; g < p.length; g += 16) {
				var j = o;
				var h = n;
				var f = m;
				var e = l;
				o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
				l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
				m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
				n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
				o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
				l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
				m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
				n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
				o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
				l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
				m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
				n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
				o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
				l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
				m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
				n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
				o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
				l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
				m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
				n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
				o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
				l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
				m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
				n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
				o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
				l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
				m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
				n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
				o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
				l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
				m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
				n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
				o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
				l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
				m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
				n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
				o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
				l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
				m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
				n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
				o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
				l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
				m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
				n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
				o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
				l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
				m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
				n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
				o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
				l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
				m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
				n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
				o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
				l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
				m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
				n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
				o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
				l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
				m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
				n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
				o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
				l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
				m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
				n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
				o = safe_add(o, j);
				n = safe_add(n, h);
				m = safe_add(m, f);
				l = safe_add(l, e)
			}
			return Array(o, n, m, l)
		}

		function md5_cmn(h, e, d, c, g, f) {
			return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d)
		}

		function md5_ff(g, f, k, j, e, i, h) {
			return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
		}

		function md5_gg(g, f, k, j, e, i, h) {
			return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
		}

		function md5_hh(g, f, k, j, e, i, h) {
			return md5_cmn(f ^ k ^ j, g, f, e, i, h)
		}

		function md5_ii(g, f, k, j, e, i, h) {
			return md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
		}

		function safe_add(a, d) {
			var c = (a & 65535) + (d & 65535);
			var b = (a >> 16) + (d >> 16) + (c >> 16);
			return (b << 16) | (c & 65535)
		}

		function bit_rol(a, b) {
			return (a << b) | (a >>> (32 - b))
		};
		return hex_md5(href)
	}
	return {
		setlink: function(href, type) {
			//首先MD5加密
			var para = getMD5(href);
			obj[para] = type;
		},
		getLink: function(href) {
			//首先MD5加密
			var para = getMD5(href);
			if (obj[para]) {
				return obj[para]
			} else {
				return "none"
			}
		}
	}
})();
var work = {
	init: function(type) {
		// window.abc="111";
		var self = this;
		//启动HTML渲染
		var $a = $("a"),
			href = [];
		this.hostIp = "10.20.158.33:3000";
		//标记是否工作
		this.workStatus = true;
		$a.each(function() {
			$(this).attr("href") ? href.push($(this).attr("href").replace( /(&)spm=[^&]+/,"" ).replace(/(^spm)=.+$&/,"").replace(/(\r\n)|(\n)/g,"")) : href.push("");
		})

		this.href = href;

		//得到HTML模板
		this.getHtml(type, href);

		//绑定拖动事件
		this.bindDragEvent(type,$("div.startsingle"),$("div.startsingle .topbar"));

		//定位链接的事件
		this.bindFindLink($a);

		//计数器
		window.showDate = (function(href) {
			var num = href.length;
			var done = 0;
			var error = 0;
			var valueDone = $("div.startsingle span.value-done"),
				valueError = $("div.startsingle span.value-error"),
				valueNum = $("div.startsingle span.value-num");
			return {
				success: function() {
					done++;
					valueDone.find("b").text(done);
				},
				error: function() {
					error++;
					done++;
					valueDone.find("b").text(done);
					valueError.find("b").text(error);
				},
				reset: function() {
					valueDone.find("b").text("0");
					valueNum.find("b").text(href.length);
					valueError.find("b").text("0")
				}
			}
		})(href);
		showDate.reset();
		//获取验证规则，并且开始检查
		this.getRegList(this.judgestatus);
		//开始检查
		// this.judgestatus(href);
	}
	,getRegList: function(){
		var self = this;
		$.ajax({url:'http://' + this.hostIp + "/reglist",type:"get"}).done(function(data){
			//拆解正则
			var regArr = data.data.juedui;
			var xdRegArr = data.data.xiangdui;

			$.each( regArr,function(i){
				regArr[i] = new RegExp(regArr[i]);
			});

			//生成一个绑定方法，如果他是一个正确的符合规范的链接返回true，如果不正确返回false;
			self.checkRegList = function( str ){
				var flag = true;
				for( var i = 0 ; i < regArr.length ; i++ ) {
					if( !regArr[i].test( str ) ) {
						flag = false;
						break;
					} 
				}
				return flag;
			};

			//相对路径的处理办法
			$.each( xdRegArr,function(i){
				xdRegArr[i] = new RegExp( xdRegArr[i] );
			} )
			self.checkxdReg = function(str){
				var flag = true;
				for( var i = 0 ; i < xdRegArr.length ; i++ ) {
					if( xdRegArr[i].test( str ) ) {
						flag = false;
						break;
					}
				}
				return flag;
			}
			self.judgestatus(self.href);
		});
	}
	//改变标志方法，需要传入elm改变标志的对象，type需要改变的标志类型
	,changeSign: function(elm, type) {
		var status = elm.find("div.status");
		if (type == "refresh") {
			// console.log(111)
			status.text("加载").css({
				"color": "blue"
			});
		}
		if (type == "ok-sign") {
			// console.log(222)
			status.text("正确").css({
				"color": "green"
			}).addClass("ok-sign");
		}
		if (type == "remove-sign") {
			// console.log(333)
			status.text("错误").css({
				"color": "red"
			}).addClass("remove-sign");
		}

		if( type == "xd-sign" ) {
			status.text("提醒").css({
				"color":"#c8b407"
			}).addClass("xd-sign");
			elm.find("div.info").text("勿使用相对路径")
		}

	},
	judgestatus: function(href) {
		var $li = $("div.startsingle").find("li"),
			self = this;

		//确保popup弹出后执行
		$(function() {
			var i = 0;
			function recursion() {

				var dtd = $.Deferred();
				$.when(dtd).done(function() {
					if (!self.workStatus) {
						return false;
					}
					i++;
					i < href.length && recursion();
				});
				//首先判断这个URL有没有发送过请求如果发送过就不沿用上次的判断
				var nCache = cache.getLink(href[i])
				if (nCache !== "none") {

					if (nCache == "ok") {
						self.changeSign($li.eq(i), "ok-sign");
						window.showDate.success();
					} else if( nCache == "error" ) {
						//死链
						self.changeSign($li.eq(i), "remove-sign");
						window.showDate.error();
					}
					dtd.resolve();
					return
				}
				//查看是否是相对路径，是相对路径的话拼接URL
				if( !self.checkxdReg( href[i] ) ) {
					// self.changeSign($li.eq(i),"xd-sign");
					// window.showDate.success();
					// dtd.resolve();
					// return
					//这里自己偷偷加个验证逻辑，不同的相对路径拼接地址的方式不一致
					if( href[i].slice( 0,1 ) == "/" ) {
						href[i] = window.location.protocol + window.location.host +  href[i];
					} else {
						href[i] = window.location.href +  href[i];
					}
					
				}
				//其次验证这个URL格式是否正确，如果正确就发送给服务器，不正确就返回为正确链接
				if( !self.checkRegList( href[i] ) ) {
					self.changeSign($li.eq(i), "ok-sign");
					window.showDate.success();
					dtd.resolve();
					return
				}

				//再判断是否是相对路径，如果是相对路径就

				var url = 'http://'+ self.hostIp +'/check?zhuliqiurl=' + encodeURIComponent(href[i]) + '&i=' + i;
				//编辑为正在发送数据状态
				self.changeSign($li.eq(i), "refresh");
				$.ajax({
					url: url,
					dataType: "json",
					tpye: "get",
					timeout: 2000000
				}).done(function(data) {

					if (data.succ == "false") {
						self.changeSign($li.eq(data.i), "ok-sign");
						cache.setlink(href[i], "ok");
						window.showDate.success();
					} else if (data.succ == "true") {
						self.changeSign($li.eq(data.i), "remove-sign");
						cache.setlink(href[i], "error");
						window.showDate.error();
					}
					dtd.resolve();
				});
			}
			recursion();
		});

	},
	bindFindLink: function($a) {
		var self = this;
		$("div.chromepop").on("click", "div.searchposition", function() {
			var index = $("div.searchposition").index($(this));
			var nowlink = $a.eq(index);
			var top = nowlink.offset().top;

			$('body,html').animate({
				scrollTop: top
			}, 800);
			nowlink.css("boxShadow", "0px 0px 20px #b8040e");
		});

		$("div.startsingle div.showerrorbutton").on("click", function() {
			$("div.startsingle").find(".ok-sign").parent().hide();
		});
	},
	bindDragEvent: function(type,$chromepop,$bar) {
		var dragging = false;
		var startmouse, nowmouse, el;
		$("div.chromepop div.close").on("click", function() {
			self.workStatus = false;
			$(this).parents("div.chromepop").remove();
		});
		$bar.bind("mousedown", function(e) {
			e.stopPropagation();
			dragging = true;
			//获取鼠标移动的距离
			startmouse = {
				left: parseInt(e.clientX),
				top: parseInt(e.clientY)
			};
			el = {
				top: $chromepop.offset().top - $(document).scrollTop(),
				left: $chromepop.offset().left - $(document).scrollLeft()
			};
			return false
		});
		$(document).bind("mousemove", function(e) {
			if (dragging) {
				e.stopPropagation()
				nowmouse = {
					left: e.clientX,
					top: e.clientY
				};

				$chromepop.css({
					"top": el.top + nowmouse.top - startmouse.top,
					"left": el.left + nowmouse.left - startmouse.left
				});
				return false
			}

		});
		$(document).bind("mouseup", function(e) {
			dragging = false
			e.cancelBubble = true;
		});

	},
	initmult: function(type,txt){
		this.getHtml( type,txt );
		this.bindDragEvent(type,$("div.startmult"),$("div.startmult .topbar"));
	},
	getHtml: function(type, linkObj) {
		switch (type) {
			case "startsingle":
				var htmlTemple = "";
				for (var i = 0; i < linkObj.length; i++) {
					var nowlink = linkObj[i];
					htmlTemple = htmlTemple +
						'<li class="fd-clr">' +
						'<div class="value fd-left">' +
						'<a href="' + nowlink + '">' + nowlink + '</a>' +
						'</div>' +
						'<div class="status fd-left">就绪</div>' +
						'<div class="searchposition fd-left"><a href="javascript:;" class="halflings search">查看</a></div>' +
						'<div class="info fd-left"></div>' +
						'</li>';
				}
				var header = '<div class="header">\
						    <div>\
						      <span class="label result-num">共需检查：</span><span class="value value-num" ><b></b>个链接</span>\
						    </div>\
						    <div>\
						      <span class="label result-done">已经完成：</span><span class="value value-done" ><b></b>个链接</span>\
						    </div>\
						    <div>\
						      <span class="label result-error">出错：</span><span class="value value-error" ><b></b>个链接</span>\
						    </div>\
						    <div class="showerrorbutton" style="color:#333">隐藏正确链接</div>\
						  </div>'
				htmlTemple = '<div id="' + type + '" class="' + type + ' chromepop"><div class="topbar"><div class="close"></div></div>' + header + '<div class="content"><ul class="link list" id="li">' + htmlTemple + '</ul></div></div>';
				$("body").append(htmlTemple);
				//初始定位
				$("div.startsingle").css({
					top: $(window).height() - 195,
					left: $(window).width() - 350
				})
				break;
			case "startmult":
				var htmlTemple = "";
				for(  i in linkObj ) {
					htmlTemple += "url" + i + ":" + linkObj[i].url + "<br/>";
					for( var j = 0 ; j <= linkObj[i].error.length - 1; j++ ) {
						htmlTemple += "<span style='color:red'>error" + j + ":" + linkObj[i].error[j] + "</span><br/>";
					}	
				}

				htmlTemple = '<div id="' + type + '" class="' + type + ' chromepop"><div class="topbar"><div class="close"></div></div><div>多页面检查结果</div><div class="content"><ul class="link list" id="li">' + htmlTemple + '</ul></div></div>';
				$("body").append(htmlTemple);
				$("div.startmult").css({
					top: $(window).height()/2 - 195/2,
					left: $(window).width()/2 - 350/2
				});
				break;
		}
	}
}
var checkEmptyLink=getCheckEmptyLink();
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	//如果是启动单页面
	if (request.status == "startsingle") {
		if ($("div.chromepop").size() > 0) {
			return
		}
		work.init("startsingle");
	}else if("empty-link-check"==request.status){
        checkEmptyLink.startChecking();
    }
	
});
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
	//如果状态是返回多页面的结果
	if( request.status == "multresult" ) {
		// if ($("div.chromepop").size() > 0) {
		// 	return
		// }
		work.initmult("startmult",request.data);
	}
});
})(jQuery);

