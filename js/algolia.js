!function(){function a(){var e=function(e,i,t){return function(e,i,t,n){var l,o,s,r=+new Date,c=null,p=0,u=null,d=function(){u&&clearTimeout(u),u=null,p=r,c=null};a=function(){d(),e.apply(o,s)};var f=function(){r=+new Date,null==c&&(c=r),o=this,s=arguments,l=r-(n?c:p)-i,clearTimeout(u),n?t||l>=0?a():u=setTimeout(a,i):l>=0?a():t&&(u=setTimeout(a,-l)),c=r};return f.cancel=function(){d()},f.flush=function(){a()},f}(e,i,t,!0)},i=setInterval(function(){"undefined"!=typeof $&&($(document).ready(function(){var a={root:"/blog/",algolia:{applicationID:"XDG1C6ASA4",apiKey:"eebdd0f1174b77269d954813961815bc",indexName:"khiav-hexo-blog",hits:{per_page:10},labels:{input_placeholder:"輸入搜尋內容",hits_empty:"找不到「${query}」",hits_stats:"找到 ${hits} 條相關條目，花費 ${time} 亳秒"}}},i=a.algolia,t=i.applicationID&&i.apiKey&&i.indexName;if(t){var n=e(function(a){a.search()},500),l=instantsearch({appId:i.applicationID,apiKey:i.apiKey,indexName:i.indexName,searchFunction:function(a){var e=$("#algolia-search-input").find("input");e.val()?n(a):n.cancel()}});[instantsearch.widgets.searchBox({container:"#algolia-search-input",placeholder:i.labels.input_placeholder}),instantsearch.widgets.hits({container:"#algolia-hits",hitsPerPage:i.hits.per_page||10,templates:{item:function(e){return'<a href="'+a.root+e.path+'" class="algolia-hit-item-link">'+e._highlightResult.title.value+"</a>"},empty:function(a){return'<div id="algolia-hits-empty">'+i.labels.hits_empty.replace(/\$\{query}/,a.query)+"</div>"}},cssClasses:{item:"algolia-hit-item"}}),instantsearch.widgets.stats({container:"#algolia-stats",templates:{body:function(e){var t=i.labels.hits_stats.replace(/\$\{hits}/,e.nbHits).replace(/\$\{time}/,e.processingTimeMS);return t+'<span class="algolia-powered">  <img src="'+a.root+'imgs/algolia_logo.svg" alt="Algolia" /></span><hr />'}}}),instantsearch.widgets.pagination({container:"#algolia-pagination",scrollTo:!1,showFirstLast:!1,labels:{first:'<i class="fa fa-angle-double-left"></i>',last:'<i class="fa fa-angle-double-right"></i>',previous:'<i class="fa fa-angle-left"></i>',next:'<i class="fa fa-angle-right"></i>'},cssClasses:{root:"pagination",item:"pagination-item",link:"page-number",active:"current",disabled:"disabled-item"}})].forEach(l.addWidget,l),l.start(),$(".popup-trigger").on("click",function(a){a.stopPropagation(),$("body").append('<div class="popoverlay">').css("overflow","hidden"),$(".popoverlay").fadeIn(300),$(".popup").fadeIn(300),$("#algolia-search-input").find("input").focus()}),$(".popup-btn-close").click(function(){$(".popoverlay").fadeOut(300),$(".popup").fadeOut(300),$(".popoverlay").remove(),$("body").css("overflow","")})}else window.console.error("Algolia Settings are invalid.")}),clearInterval(i))},100)}var e=setInterval(function(){"undefined"!=typeof instantsearch&&(clearInterval(e),a())},200)}();