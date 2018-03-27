(function($){
chrome.runtime.onMessage.addListener(function(response) {
	console.log(response);
	//发送请求
	var hostIp = "10.20.158.33:3000";
	if( response.type == "mult" ) {
		$.ajax({
			url: "http://" + hostIp + "/multcheck",
			data: {data:response},
			dataType:"json",
			type:"get"			
		}).done(function(data){
			if( data.info == "start" ){
				window.id = data.id;
				//轮询方法
					var checkSuccess = setInterval(function(){
						$.ajax({
							url:"http://" + hostIp + "/getResult",
							data:{id:window.id},
							dataType:"json",
							type:"get"
						}).done(function(data){
							if( data.status == "success" ) {
								console.log("成功得到结果啦");
								clearInterval(checkSuccess);

								chrome.tabs.query({active: true,currentWindow: true}, function(tabs){
								    chrome.tabs.sendMessage(tabs[0].id, { status: "multresult",data: data.data ,url: data}, function(response) {});  
								});

							} else {
								console.log("没有得到结果，继续请求");
							}
						}).fail(function(data){
							console.log("没有得到结果，继续请求");
						});
					},2000);
			}


		});
	}

});
})(jQuery)