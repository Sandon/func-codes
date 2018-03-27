/**
 * 请求JavaScript文件
 */
function loadScript(url, callback) {
  var config = seed.config,
    supportOnload = 'onload' in node;

  node.charset = config.charset || 'utf-8';
  node.setAttribute('data-module', url);

  // 绑定事件
  if (supportOnload) {
    node.onload = function () {
      onload();
    };
    node.onerror = function () {
      onload(true);
    }
  } else {
    node.onreadystatechange = function () {
      if (/loaded|complete/.test(node.readyState)) {
        onload();
      }
    }
  }

  node.async = true;
  node.src = url;

  // 在IE6-8浏览器中，某些缓存会导致结点一旦插入就立即执行脚本
  currentlyAddingScript = node;

  // ref: #185 & http://dev.jquery.com/ticket/2709
  baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);

  currentlyAddingScript = null;


  function onload(error) {
    // 保证执行一次
    node.onload = node.onerror = node.onreadystatechange = null;
    // 删除脚本节点
    head.removeChild(node);
    node = null;
    callback(error);
  }
}