(function(c){var a=c.fancybox;a.helpers.thumbs={wrap:null,list:null,width:0,source:function(b){var a;if(c.type(b)==="string")return b;a=c(b).find("img");return a.length?a.attr("src"):b.href},init:function(b){var k=this,d,f=b.width||50,g=b.height||50,l=b.source||this.source;d="";for(var j=0;j<a.group.length;j++)d+='<li><a style="width:'+f+"px;height:"+g+'px;" href="javascript:jQuery.fancybox.jumpto('+j+');"></a></li>';this.wrap=c('<div id="fancybox-thumbs"></div>').addClass(b.position||"bottom").appendTo("body");
this.list=c("<ul>"+d+"</ul>").appendTo(this.wrap);c.each(a.group,function(b){c("<img />").load(function(){var a=this.width,e=this.height,h,i,d;k.list&&a&&e&&(h=a/f,i=e/g,d=k.list.children().eq(b).find("a"),h>=1&&i>=1&&(h>i?(a=Math.floor(a/i),e=g):(a=f,e=Math.floor(e/h))),c(this).css({width:a,height:e,top:Math.floor(g/2-e/2),left:Math.floor(f/2-a/2)}),d.width(f).height(g),c(this).hide().appendTo(d).fadeIn(300))}).attr("src",l(a.group[b]))});this.width=this.list.children().eq(0).outerWidth(!0);this.list.width(this.width*
(a.group.length+1)).css("left",Math.floor(c(window).width()*0.5-(a.current.index*this.width+this.width*0.5)))},update:function(){this.list&&this.list.stop(!0).animate({left:Math.floor(c(window).width()*0.5-(a.current.index*this.width+this.width*0.5))},150)},beforeLoad:function(b){a.group.length<2?a.coming.helpers.thumbs=!1:a.coming.margin[b.position==="top"?0:2]=b.height+30},afterShow:function(b){this.list?this.update(b):this.init(b);this.list.children().removeClass("active").eq(a.current.index).addClass("active")},
onUpdate:function(){this.update()},beforeClose:function(){this.wrap&&this.wrap.remove();this.list=this.wrap=null;this.width=0}}})(jQuery);
