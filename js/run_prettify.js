!function(){function e(e){function t(){try{a.doScroll("left")}catch(e){return void n.setTimeout(t,50)}l("poll")}function l(t){"readystatechange"==t.type&&"complete"!=r.readyState||(("load"==t.type?n:r)[u](d+t.type,l,!1),!o&&(o=!0)&&e.call(n,t.type||t))}var s=r.addEventListener,o=!1,i=!0,c=s?"addEventListener":"attachEvent",u=s?"removeEventListener":"detachEvent",d=s?"":"on";if("complete"==r.readyState)e.call(n,"lazy");else{if(r.createEventObject&&a.doScroll){try{i=!n.frameElement}catch(e){}i&&t()}r[c](d+"DOMContentLoaded",l,!1),r[c](d+"readystatechange",l,!1),n[c](d+"load",l,!1)}}function t(){u&&e(function(){var e=f.length;m(e?function(){for(var t=0;t<e;++t)!function(e){n.setTimeout(function(){n.exports[f[e]].apply(n,arguments)},0)}(t)}:void 0)})}for(var n=window,r=document,a=r.documentElement,l=r.head||r.getElementsByTagName("head")[0]||a,s="",o=(g=r.getElementsByTagName("script")).length;0<=--o;){var i=g[o],c=i.src.match(/^[^?#]*\/run_prettify\.js(\?[^#]*)?(?:#.*)?$/);if(c){s=c[1]||"",i.parentNode.removeChild(i);break}}var u=!0,d=[],p=[],f=[];for(s.replace(/[?&]([^&=]+)=([^&]+)/g,function(e,t,n){n=decodeURIComponent(n),"autorun"==(t=decodeURIComponent(t))?u=!/^[0fn]/i.test(n):"lang"==t?d.push(n):"skin"==t?p.push(n):"callback"==t&&f.push(n)}),o=0,s=d.length;o<s;++o)!function(){var e=r.createElement("script");e.onload=e.onerror=e.onreadystatechange=function(){!e||e.readyState&&!/loaded|complete/.test(e.readyState)||(e.onerror=e.onload=e.onreadystatechange=null,--h||n.setTimeout(t,0),e.parentNode&&e.parentNode.removeChild(e),e=null)},e.type="text/javascript",e.src="https://cdn.rawgit.com/google/code-prettify/master/loader/lang-"+encodeURIComponent(d[o])+".js",l.insertBefore(e,l.firstChild)}(d[o]);for(var h=d.length,g=[],o=0,s=p.length;o<s;++o)g.push("https://cdn.rawgit.com/google/code-prettify/master/loader/skins/"+encodeURIComponent(p[o])+".css");!function(e){function t(a){if(a!==n){var s=r.createElement("link");s.rel="stylesheet",s.type="text/css",a+1<n&&(s.error=s.onerror=function(){t(a+1)}),s.href=e[a],l.appendChild(s)}}var n=e.length;t(0)}(g);var m=function(){"undefined"!=typeof window&&(window.PR_SHOULD_USE_CONTINUATION=!0);var e;return function(){function t(e){function t(e){var t=e.charCodeAt(0);if(92!==t)return t;var n=e.charAt(1);return(t=u[n])?t:"0"<=n&&"7">=n?parseInt(e.substring(1),8):"u"===n||"x"===n?parseInt(e.substring(2),16):e.charCodeAt(1)}function n(e){return 32>e?(16>e?"\\x0":"\\x")+e.toString(16):"\\"===(e=String.fromCharCode(e))||"-"===e||"]"===e||"^"===e?"\\"+e:e}function r(e){var r=e.substring(1,e.length-1).match(RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]","g"));e=[];var a=["["];(l="^"===r[0])&&a.push("^");for(var l=l?1:0,s=r.length;l<s;++l){i=r[l];if(/\\[bdsw]/i.test(i))a.push(i);else{var o,i=t(i);l+2<s&&"-"===r[l+1]?(o=t(r[l+2]),l+=2):o=i,e.push([i,o]),65>o||122<i||(65>o||90<i||e.push([32|Math.max(65,i),32|Math.min(o,90)]),97>o||122<i||e.push([-33&Math.max(97,i),-33&Math.min(o,122)]))}}for(e.sort(function(e,t){return e[0]-t[0]||t[1]-e[1]}),r=[],s=[],l=0;l<e.length;++l)(i=e[l])[0]<=s[1]+1?s[1]=Math.max(s[1],i[1]):r.push(s=i);for(l=0;l<r.length;++l)i=r[l],a.push(n(i[0])),i[1]>i[0]&&(i[1]+1>i[0]&&a.push("-"),a.push(n(i[1])));return a.push("]"),a.join("")}for(var a=0,l=!1,s=!1,o=0,i=e.length;o<i;++o){var c=e[o];if(c.ignoreCase)s=!0;else if(/[a-z]/i.test(c.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,""))){l=!0,s=!1;break}}for(var u={b:8,t:9,n:10,v:11,f:12,r:13},d=[],o=0,i=e.length;o<i;++o){if((c=e[o]).global||c.multiline)throw Error(""+c);d.push("(?:"+function(e){for(var t=e.source.match(RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)","g")),s=t.length,o=[],i=0,c=0;i<s;++i){var u=t[i];"("===u?++c:"\\"===u.charAt(0)&&(u=+u.substring(1))&&(u<=c?o[u]=-1:t[i]=n(u))}for(i=1;i<o.length;++i)-1===o[i]&&(o[i]=++a);for(c=i=0;i<s;++i)"("===(u=t[i])?(++c,o[c]||(t[i]="(?:")):"\\"===u.charAt(0)&&(u=+u.substring(1))&&u<=c&&(t[i]="\\"+o[u]);for(i=0;i<s;++i)"^"===t[i]&&"^"!==t[i+1]&&(t[i]="");if(e.ignoreCase&&l)for(i=0;i<s;++i)u=t[i],e=u.charAt(0),2<=u.length&&"["===e?t[i]=r(u):"\\"!==e&&(t[i]=u.replace(/[a-zA-Z]/g,function(e){return e=e.charCodeAt(0),"["+String.fromCharCode(-33&e,32|e)+"]"}));return t.join("")}(c)+")")}return new RegExp(d.join("|"),s?"gi":"g")}function n(e,t){function n(e){var i=e.nodeType;if(1==i){if(!r.test(e.className)){for(i=e.firstChild;i;i=i.nextSibling)n(i);"br"!==(i=e.nodeName.toLowerCase())&&"li"!==i||(a[o]="\n",s[o<<1]=l++,s[o++<<1|1]=e)}}else 3!=i&&4!=i||(i=e.nodeValue).length&&(i=t?i.replace(/\r\n?/g,"\n"):i.replace(/[ \t\r\n]+/g," "),a[o]=i,s[o<<1]=l,l+=i.length,s[o++<<1|1]=e)}var r=/(?:^|\s)nocode(?:\s|$)/,a=[],l=0,s=[],o=0;return n(e),{a:a.join("").replace(/\n$/,""),c:s}}function r(e,t,n,r,a){n&&(e={h:e,l:1,j:null,m:null,a:n,c:null,i:t,g:null},r(e),a.push.apply(a,e.g))}function a(e){for(var t=void 0,n=e.firstChild;n;n=n.nextSibling)var r=n.nodeType,t=1===r?t?e:n:3===r&&w.test(n.nodeValue)?e:t;return t===e?void 0:t}function l(e,n){function a(e){for(var t=e.i,i=e.h,u=[t,"pln"],d=0,p=e.a.match(l)||[],f={},h=0,g=p.length;h<g;++h){var m,y=p[h],v=f[y],b=void 0;if("string"==typeof v)m=!1;else{var w=s[y.charAt(0)];if(w)b=y.match(w[1]),v=w[0];else{for(m=0;m<o;++m)if(w=n[m],b=y.match(w[1])){v=w[0];break}b||(v="pln")}!(m=5<=v.length&&"lang-"===v.substring(0,5))||b&&"string"==typeof b[1]||(m=!1,v="src"),m||(f[y]=v)}if(w=d,d+=y.length,m){m=b[1];var x=y.indexOf(m),S=x+m.length;b[2]&&(S=y.length-b[2].length,x=S-m.length),v=v.substring(5),r(i,t+w,y.substring(0,x),a,u),r(i,t+w+x,m,c(v,m),u),r(i,t+w+S,y.substring(S),a,u)}else u.push(t+w,v)}e.g=u}var l,s={};!function(){for(var r=e.concat(n),a=[],o={},i=0,c=r.length;i<c;++i){var u=r[i],d=u[3];if(d)for(var p=d.length;0<=--p;)s[d.charAt(p)]=u;d=""+(u=u[1]),o.hasOwnProperty(d)||(a.push(u),o[d]=null)}a.push(/[\0-\uffff]/),l=t(a)}();var o=n.length;return a}function s(e){var t=[],n=[];e.tripleQuotedStrings?t.push(["str",/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,null,"'\""]):e.multiLineStrings?t.push(["str",/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,null,"'\"`"]):t.push(["str",/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,null,"\"'"]),e.verbatimStrings&&n.push(["str",/^@\"(?:[^\"]|\"\")*(?:\"|$)/,null]);var r=e.hashComments;if(r&&(e.cStyleComments?(1<r?t.push(["com",/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,null,"#"]):t.push(["com",/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,null,"#"]),n.push(["str",/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,null])):t.push(["com",/^#[^\r\n]*/,null,"#"])),e.cStyleComments&&(n.push(["com",/^\/\/[^\r\n]*/,null]),n.push(["com",/^\/\*[\s\S]*?(?:\*\/|$)/,null])),r=e.regexLiterals){var a=(r=1<r?"":"\n\r")?".":"[\\S\\s]";n.push(["lang-regex",RegExp("^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*(/(?=[^/*"+r+"])(?:[^/\\x5B\\x5C"+r+"]|\\x5C"+a+"|\\x5B(?:[^\\x5C\\x5D"+r+"]|\\x5C"+a+")*(?:\\x5D|$))+/)")])}return(r=e.types)&&n.push(["typ",r]),(r=(""+e.keywords).replace(/^ | $/g,"")).length&&n.push(["kwd",new RegExp("^(?:"+r.replace(/[\s,]+/g,"|")+")\\b"),null]),t.push(["pln",/^\s+/,null," \r\n\t "]),r="^.[^\\s\\w.$@'\"`/\\\\]*",e.regexLiterals&&(r+="(?!s*/)"),n.push(["lit",/^@[a-z_$][a-z_$@0-9]*/i,null],["typ",/^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/,null],["pln",/^[a-z_$][a-z_$@0-9]*/i,null],["lit",/^(?:0x[a-f0-9]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+\-]?\d+)?)[a-z]*/i,null,"0123456789"],["pln",/^\\[\s\S]?/,null],["pun",new RegExp(r),null]),l(t,n)}function o(e,t,n){function r(e){var t=e.nodeType;if(1!=t||l.test(e.className)){if((3==t||4==t)&&n){var i=e.nodeValue,c=i.match(s);c&&(t=i.substring(0,c.index),e.nodeValue=t,(i=i.substring(c.index+c[0].length))&&e.parentNode.insertBefore(o.createTextNode(i),e.nextSibling),a(e),t||e.parentNode.removeChild(e))}}else if("br"===e.nodeName.toLowerCase())a(e),e.parentNode&&e.parentNode.removeChild(e);else for(e=e.firstChild;e;e=e.nextSibling)r(e)}function a(e){function t(e,n){var r=n?e.cloneNode(!1):e;if(a=e.parentNode){var a=t(a,1),l=e.nextSibling;a.appendChild(r);for(var s=l;s;s=l)l=s.nextSibling,a.appendChild(s)}return r}for(;!e.nextSibling;)if(!(e=e.parentNode))return;e=t(e.nextSibling,0);for(var n;(n=e.parentNode)&&1===n.nodeType;)e=n;c.push(e)}for(var l=/(?:^|\s)nocode(?:\s|$)/,s=/\r\n?|\n/,o=e.ownerDocument,i=o.createElement("li");e.firstChild;)i.appendChild(e.firstChild);for(var c=[i],u=0;u<c.length;++u)r(c[u]);t===(0|t)&&c[0].setAttribute("value",t);var d=o.createElement("ol");d.className="linenums",t=Math.max(0,t-1|0)||0;for(var u=0,p=c.length;u<p;++u)i=c[u],i.className="L"+(u+t)%10,i.firstChild||i.appendChild(o.createTextNode(" ")),d.appendChild(i);e.appendChild(d)}function i(e,t){for(var n=t.length;0<=--n;){var r=t[n];x.hasOwnProperty(r)?d.console&&console.warn("cannot override language handler %s",r):x[r]=e}}function c(e,t){return e&&x.hasOwnProperty(e)||(e=/^\s*</.test(t)?"default-markup":"default-code"),x[e]}function u(e){r=e.j;try{u=(s=n(e.h,e.l)).a;e.a=u,e.c=s.c,e.i=0,c(r,u)(e);var t=(t=/\bMSIE\s(\d+)/.exec(navigator.userAgent))&&8>=+t[1],r=/\n/g,a=e.a,l=a.length,s=0,o=e.c,i=o.length,u=0,p=e.g,f=p.length,h=0;p[f]=l;var g,m;for(m=g=0;m<f;)p[m]!==p[m+2]?(p[g++]=p[m++],p[g++]=p[m++]):m+=2;for(f=g,m=g=0;m<f;){for(var y=p[m],v=p[m+1],b=m+2;b+2<=f&&p[b+1]===v;)b+=2;p[g++]=y,p[g++]=v,m=b}p.length=g;var w=e.h;e="",w&&(e=w.style.display,w.style.display="none");try{for(;u<i;){var x,S=o[u+2]||l,C=p[h+2]||l,b=Math.min(S,C),N=o[u+1];if(1!==N.nodeType&&(x=a.substring(s,b))){t&&(x=x.replace(r,"\r")),N.nodeValue=x;var E=N.ownerDocument,_=E.createElement("span");_.className=p[h+1];var T=N.parentNode;T.replaceChild(_,N),_.appendChild(N),s<S&&(o[u+1]=N=E.createTextNode(a.substring(b,S)),T.insertBefore(N,_.nextSibling))}(s=b)>=S&&(u+=2),s>=C&&(h+=2)}}finally{w&&(w.style.display=e)}}catch(e){d.console&&console.log(e&&e.stack||e)}}var d="undefined"!=typeof window?window:{},p=["break,continue,do,else,for,if,return,while"],f=[[p,"auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,restrict,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],h=[f,"alignas,alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,noexcept,noreturn,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],g=[f,"abstract,assert,boolean,byte,extends,finally,final,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],m=[f,"abstract,add,alias,as,ascending,async,await,base,bool,by,byte,checked,decimal,delegate,descending,dynamic,event,finally,fixed,foreach,from,get,global,group,implicit,in,interface,internal,into,is,join,let,lock,null,object,out,override,orderby,params,partial,readonly,ref,remove,sbyte,sealed,select,set,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,value,var,virtual,where,yield"],y=[p,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],v=[p,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],b=/^(DIR|FILE|array|vector|(de|priority_)?queue|(forward_)?list|stack|(const_)?(reverse_)?iterator|(unordered_)?(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,w=/\S/,x={};i(s({keywords:[h,m,g,f=[f,"abstract,async,await,constructor,debugger,enum,eval,export,function,get,import,implements,instanceof,interface,let,null,of,set,undefined,var,with,yield,Infinity,NaN"],"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",y,v,p=[p,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"]],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),["default-code"]),i(l([],[["pln",/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],["com",/^<\!--[\s\S]*?(?:-\->|$)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],["pun",/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),"default-markup htm html mxml xhtml xml xsl".split(" ")),i(l([["pln",/^[\s]+/,null," \t\r\n"],["atv",/^(?:\"[^\"]*\"?|\'[^\']*\'?)/,null,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],["pun",/^[=<>\/]+/],["lang-js",/^on\w+\s*=\s*\"([^\"]+)\"/i],["lang-js",/^on\w+\s*=\s*\'([^\']+)\'/i],["lang-js",/^on\w+\s*=\s*([^\"\'>\s]+)/i],["lang-css",/^style\s*=\s*\"([^\"]+)\"/i],["lang-css",/^style\s*=\s*\'([^\']+)\'/i],["lang-css",/^style\s*=\s*([^\"\'>\s]+)/i]]),["in.tag"]),i(l([],[["atv",/^[\s\S]+/]]),["uq.val"]),i(s({keywords:h,hashComments:!0,cStyleComments:!0,types:b}),"c cc cpp cxx cyc m".split(" ")),i(s({keywords:"null,true,false"}),["json"]),i(s({keywords:m,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:b}),["cs"]),i(s({keywords:g,cStyleComments:!0}),["java"]),i(s({keywords:p,hashComments:!0,multiLineStrings:!0}),["bash","bsh","csh","sh"]),i(s({keywords:y,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py","python"]),i(s({keywords:"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",hashComments:!0,multiLineStrings:!0,regexLiterals:2}),["perl","pl","pm"]),i(s({keywords:v,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb","ruby"]),i(s({keywords:f,cStyleComments:!0,regexLiterals:!0}),["javascript","js","ts","typescript"]),i(s({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]),i(l([],[["str",/^[\s\S]+/]]),["regex"]);var S=d.PR={createSimpleLexer:l,registerLangHandler:i,sourceDecorator:s,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:"atv",PR_COMMENT:"com",PR_DECLARATION:"dec",PR_KEYWORD:"kwd",PR_LITERAL:"lit",PR_NOCODE:"nocode",PR_PLAIN:"pln",PR_PUNCTUATION:"pun",PR_SOURCE:"src",PR_STRING:"str",PR_TAG:"tag",PR_TYPE:"typ",prettyPrintOne:function(e,t,n){n=n||!1,t=t||null;var r=document.createElement("div");return r.innerHTML="<pre>"+e+"</pre>",r=r.firstChild,n&&o(r,n,!0),u({j:t,m:n,h:r,l:1,a:null,i:null,c:null,g:null}),r.innerHTML},prettyPrint:e=function(e,t){function n(){for(var t=d.PR_SHOULD_USE_CONTINUATION?f.now()+250:1/0;h<s.length&&f.now()<t;h++){for(var l=s[h],i=x,c=l;(c=c.previousSibling)&&((C=(7===(S=c.nodeType)||8===S)&&c.nodeValue)?/^\??prettify\b/.test(C):3===S&&!/\S/.test(c.nodeValue));)if(C){i={},C.replace(/\b(\w+)=([\w:.%+-]+)/g,function(e,t,n){i[t]=n});break}if(c=l.className,(i!==x||m.test(c))&&!y.test(c)){for(S=!1,C=l.parentNode;C;C=C.parentNode)if(w.test(C.tagName)&&C.className&&m.test(C.className)){S=!0;break}if(!S){if(l.className+=" prettyprinted",!(S=i.lang)){var p,S=c.match(g);!S&&(p=a(l))&&b.test(p.tagName)&&(S=p.className.match(g)),S&&(S=S[1])}if(v.test(l.tagName))C=1;else var C=l.currentStyle,N=r.defaultView,C=(C=C?C.whiteSpace:N&&N.getComputedStyle?N.getComputedStyle(l,null).getPropertyValue("white-space"):0)&&"pre"===C.substring(0,3);(N="true"===(N=i.linenums)||+N)||(N=!!(N=c.match(/\blinenums\b(?::(\d+))?/))&&(!N[1]||!N[1].length||+N[1])),N&&o(l,N,C),u({j:S,h:l,m:N,l:C,a:null,i:null,c:null,g:null})}}}h<s.length?d.setTimeout(n,250):"function"==typeof e&&e()}for(var r=(l=t||document.body).ownerDocument||document,l=[l.getElementsByTagName("pre"),l.getElementsByTagName("code"),l.getElementsByTagName("xmp")],s=[],i=0;i<l.length;++i)for(var c=0,p=l[i].length;c<p;++c)s.push(l[i][c]);var l=null,f=Date;f.now||(f={now:function(){return+new Date}});var h=0,g=/\blang(?:uage)?-([\w.]+)(?!\S)/,m=/\bprettyprint\b/,y=/\bprettyprinted\b/,v=/pre|xmp/i,b=/^code$/i,w=/^(?:pre|code|xmp)$/i,x={};n()}};"function"==typeof(h=d.define)&&h.amd&&h("google-code-prettify",[],function(){return S})}(),e}();h||n.setTimeout(t,0)}();