var WD={};$(function(){Object.keys(WD).forEach(function(a){var b=WD[a];b.init&&$.isFunction(b.init)&&b.init()})}),WD.Main={init:function(){this._watchContact()},_watchContact:function(){$(".show-contact").click(this._showContactForm),$(".contact-form .overlay").click(this._hideContactForm),$(".contact-form .modal-close").click(this._hideContactForm),$(".contact-form form").submit(this,this._submitContactForm)},_showContactForm:function(){$(".contact-form:not(.in)").addClass("in"),setTimeout(function(){$(".contact-form:not(.visible)").addClass("visible")},1)},_hideContactForm:function(){$(".contact-form.visible").removeClass("visible"),setTimeout(function(){$(".contact-form.in").removeClass("in"),$(".contact-form.sent").removeClass("sent")},300)},_submitContactForm:function(a){a.preventDefault(),$(".contact-form:not(.loading)").addClass("loading").removeClass("failed"),$(".contact-form input, .contact-form textarea, .contact-form button").prop("disabled",!0);var b=$.post("http://wattydev.com/site/contact.php",{email:$("#contact-email").val(),subject:$("#contact-subject").val(),message:$("#contact-message").val()});b.always(function(){$(".contact-form.loading").removeClass("loading"),$(".contact-form input, .contact-form textarea, .contact-form button").prop("disabled",!1)}),b.done(function(){$(".contact-form input, .contact-form textarea, .contact-form button").val(""),$(".contact-form:not(.sent)").addClass("sent"),setTimeout(function(){a.data._hideContactForm()},3e3)}),b.fail(function(){$(".contact-form:not(.failed)").addClass("failed")})}},WD.Home={_maxPupilMovement:0,_pupilMovementRatio:0,_originalPupilPositions:{left:[0,0],right:[0,0]},init:function(){$(".home").length&&(this._calculatePupilMovement(),this._watchMouse(),this._watchResize(),this._twitchEye(),this._initializeTooltip(),this._followMouseWithTooltip())},_watchMouse:function(){$("body").mousemove(this,this._trackMouse)},_watchResize:function(){$(window).resize(this,this._calculatePupilMovement)},_calculatePupilMovement:function(a){var b=a?a.data:this,c=$(".left-eye"),d=$(".left-pupil"),e=c[0].getBoundingClientRect().width,f=d[0].getBoundingClientRect().width;this._maxPupilMovement=$(".left-eye")[0].getBoundingClientRect().width/3-f,this._pupilMovementRatio=e/1200;var g=["left","right"];g.forEach(function(a){var c=$("."+a+"-pupil");c.css("transform","");var d=c[0].getBoundingClientRect();b._originalPupilPositions[a]=[d.top,d.left]})},_trackMouse:function(a){var b=["left","right"],c=a.pageX,d=a.pageY,e=a.data;b.forEach(function(a){var b=$("."+a+"-pupil"),f=(d-e._originalPupilPositions[a][0])*e._pupilMovementRatio;f>e._maxPupilMovement&&(f=e._maxPupilMovement),-1*f>e._maxPupilMovement&&(f=-1*e._maxPupilMovement);var g=(c-e._originalPupilPositions[a][1])*e._pupilMovementRatio;g>e._maxPupilMovement&&(g=e._maxPupilMovement),-1*g>e._maxPupilMovement&&(g=-1*e._maxPupilMovement),b.css({transform:"translate("+g+"px,"+f+"px)"})})},_twitchEye:function(){var a=this;$(".eye-lid").css({transform:"translateY(8px)"}),setTimeout(function(){$(".eye-lid").css({transform:""})},100);var b=-2900*Math.random()+3e3;setTimeout(a._twitchEye.bind(a),b)},_initializeTooltip:function(){$("[data-tooltip]").mouseover(this,this._showTooltip),$("[data-tooltip]").mouseout(this,this._hideTooltip)},_showTooltip:function(a){var b=$(a.target),c=b.attr("data-tooltip"),d=(a.data,$('<div class="tooltip">'+c+"</div>"));$("body").append(d),d.css({transform:this._tooltipPosition}),d.fadeIn()},_hideTooltip:function(a){$(".tooltip").stop().fadeOut(function(){$(this).remove()})},_tooltipPosition:"",_calculateTooltipPosition:function(a){var b=a.data;b._tooltipPosition="translate("+(a.clientX+10)+"px,"+(a.clientY-15)+"px)",$(".tooltip").css({transform:b._tooltipPosition})},_followMouseWithTooltip:function(){$("body").on("mousemove",this,this._calculateTooltipPosition)}},WD.Post={init:function(){$(".post").length&&this._sizeEmbed()},_sizeEmbed:function(){if(!$(".video").length){var a=$("iframe");if(a.length&&!(a.width()<a.parent().width())){var b=a.parent().width()/a.width();a.css("transform","scale("+b+")")}}}};