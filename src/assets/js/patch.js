/* 
	integrity、crossorigin 属性：
		为了提高可用性，在 CDN 资源被篡改而无法加载时，转为使用本站资源
	检测第三方 js 加载失败，只需要检测 js 注册到全局的变量是否存在就行了：
		if (!window.jQuery) document.write('<script src="js/lib/jquery.slim.min.js"><\/script>');
	也可以使用 onerror 属性
 */
// eslint-disable-next-line no-unused-vars
function fallbackJavascript(url) {
  document.write('<script src="' + url + '" type="text/javascript" charset="utf-8"></script>');
}

// eslint-disable-next-line no-unused-vars
function fallbackCss(url) {
  let link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
}
