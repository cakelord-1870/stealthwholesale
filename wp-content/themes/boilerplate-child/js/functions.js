/*  JQuery for this Website */
(function($) {
	
	$(document).foundation();
	
	$('.footable').footable({
		addRowToggle: false,
		breakpoints: {
			phone: 480,
			tablet: 720
		}
	});
	

	jQuery(document).ready(function(){
		$(".stock-row").on("click", function(event)
		{
			if ($(event.target).is("td") || $(event.target).is("span") || $(event.target).is("img")) {
				if ($(event.target).find("a, i, input").length == 0) {
					window.location = $(this).data("href");
				}
			}
		});
        function countChecked() {
            var n = $( ".check_box_compare:checked" ).length;
            return n;
        }

        $( ".check_box_compare" ).on( "click",  function (e) {
			if (countChecked() > 5) {
				alert("THe max you can compare is 5. Please deselect some items to select others.");
				$(this).attr('checked', false);
			}
        });
		/*  filtering functions for dropdowns */
		$("tbody, thead").css("visibility", "visible");
		/*  Comparison Button and Popup Functionality  */
		var check = 0;
		var items;
		$("#compare_button").on("modal-compare", function(){
			var triggered_click = false;
			var checked_compares = $(".check_box_compare:checked");
			if(checked_compares.length > 0 && checked_compares.length < 7) {
				triggered_click = triggered_click === true;
				$("#compare_button").data("open","compare-modal");
				$('#compare_table tr').remove();
				var class2 = $("#product_table").data("class2");
				var items_id = {};
				var i = 0;
				var items;
				var stock_records;
				$('.check_box_compare:visible:checked').each( function(){
					items_id[i++] = $(this).parent().parent().prop("id");
				});

				var opts = $("#comp_table_columns").html().split(",");
				$("#compare_table thead,#compare_table tbody").empty();
				//Ajax Call to get data from the database
				$.post(myAjax.ajaxurl, {'action' : 'comparison_stock', 'data':items_id, 'optional':opts, 'class2_id':class2.id}, function(data){
					items = $.parseJSON(data);
				})
				.done(function(){
					// $("#compare_table>thead").append("<th></th");

					var filtered_fields = items.fields.filter(function(field) {
						var ret = false;
						items.stock_records.some(function(stock_record) {
							if (typeof stock_record.attributes[field.column_name] != "undefined" && stock_record.attributes[field.column_name] != "" && stock_record.attributes[field.column_name] != null)
							{
								ret = true;
							}
						});
						return ret;
					});
					var banner_tr = $("<tr>"+
										"<td class='td-class2'colspan='"+ ( checked_compares.length + 1 ) +"'>Items selected to compare from <span class='c2-name'>"+class2+"</span></td>"+
									"</tr>").appendTo($("#compare_table>thead"));
					var initial_tr = $("<tr'><th></th></tr>").appendTo($("#compare_table>thead"));
					// var stock_tr   = $("<tr class='stock-th'><td></td></tr>").appendTo($("<tbody class='stock-thead'></tbody>").insertAfter("#compare_table>thead"));
					var stock_tr   = $("<tr class='stock-th'><th style='width: 10%'>Information</th></tr>").insertAfter(initial_tr);
					var filler_tbody = $("#compare_table>thead").after("<tbody class='filler-tbody'><tr></tr></tbody>");
					var max_image = 0;
					var width = 85 / items.stock_records.length;
					items.stock_records.forEach( function(stock_record) {
                        $(initial_tr).append("<th style='width: "+width+"%;'><img class='compare-img' src='" + stock_record.image_link + "'</th>");
                        $(stock_tr).append("<th scope='rowgroup'>" + stock_record.attributes["Stock"] + "</th>");
					});
					var i = 0;
					filtered_fields.forEach( function(field) {
						var current = field.column_name;
						var display = field.name;
						if (current == "Stock"){
							// $(stock_tr).find("td").eq(0).append(display);
						}
						else{
							var tr = $("<tr></tr>").appendTo($("#compare_table>.stock-tbody"));
							$(tr).append("<td><strong>"+display+"</strong></td>");
							items.stock_records.forEach( function(stock_record){
								$(tr).append("<td><div>"+stock_record.attributes[current]+"</div></td>");
							});
						}
					});
					$("#compare_button").data("open","");
					// $("#compare_table").find("img").css("max-width", "125px");
				});
			}
			else {
				if (triggered_click) {
					triggered_click = false;
					return;
				}
				var options = {
					tipText : 'Please select only up to 6 items for comparison!',
					positionClass : 'left',
					clickOpen : true,
					disableHover : false,
					templateClasses : 'added-tip',
					hOffset : 4,
					vOffset : 2
				};
				var element = $(this);
				var elem =new Foundation.Tooltip(element, options);
				$(document).foundation();
				triggered_click = true;
				$(this).trigger('click');
				// setTimeout(function(){
				// 	elem.destroy();
				// 	$(document).foundation();
				// }, 2500);
			}
		});
		$('#compare_button').click( function(event){
			var checked = $(".check_box_compare:checked").length;
			if(checked > 1) {
				$("#compare_button").trigger("modal-compare");
			}
		});

		$("ul#side-menu > li.page_item > a").click(function(event) {
			event.preventDefault();
			jQuery(this).toggleClass('expanded').next('ul.children').slideToggle();
		});

		$("#filter-mobile-button").click(function(event) {
			event.preventDefault();
			$("#filter-mobile-button i").toggleClass("fa-angle-up fa-angle-down");
			$("#filter-area").slideToggle();
		});

		$(window).resize(function(){

			var width = $(window).width();

			if (width > 640 && jQuery("#filter-area").is(':hidden')){
				jQuery("#filter-area").removeAttr('style');
			}

			if (width > 480) {
				var sort_selects = $(".sort-select").filter(function() {
					return this.id.match(/.+_select/);
				});

				$(sort_selects).each(function(k, v) {
					var width = $(v).css("width");
					$(v).css("width", width);
				});
			}
			else if (width < 480) {
				var sort_selects = $(".sort-select").filter(function() {
					return this.id.match(/.+_select/);
				});
				$(sort_selects).css("width","100%");
			}
		});

		$('#sidemenu-button').click(function() {
			 if($(this).css("margin-left") == "290px") {
				$('#sidebar-menu').animate({"margin-left": '-=290'});
				$('#sidemenu-button').animate({"margin-left": '-=290'});
			}
			 else {
				$('#sidebar-menu').animate({"margin-left": '+=290'});
				$('#sidemenu-button').animate({"margin-left": '+=290'});
			 }
		});
});
		$("#product_table th").on("click",function(event) {
			$(this).trigger("clicked-thead");
		});

		$("#product_table th").on("clicked-thead", function(event) {
			$(".sort").val("order");
		});

		$("#printOut").on("click", function() {
			// var class2_image = $(".class-2-image").find("img").clone();
			var class2 = $("#product_table").data("class2");
			$("#compare_table").css("background-color", "white");
			var checked_compares = $(".check_box_compare:checked").length;

			var printHeader = $("#print-header").clone();

			var compare = $("#compare_table").clone().css("width", "100%").css("max-width", "100%");
			// $(compare).find("img").css("max-height", "100%").css("max-width", "100%");
			// var compare_div = $("<div></div>").css("display", "block").css("width", "100%").css("max-width", "100%").append(compare);
			var compare_div = $(".div-compare").clone();
			$(compare_div).find("img").css('max-width', '125px').css('max-height', '125px');
			$(printHeader).append(compare_div);
			$(printHeader).printElement();
		});

	var copyComputedStyle = function(from,to){
    var computed_style_object = false;
    //trying to figure out which style object we need to use depense on the browser support
    //so we try until we have one
    computed_style_object = from.currentStyle || document.defaultView.getComputedStyle(from,null);

    //if the browser dose not support both methods we will return null
    if(!computed_style_object) return null;

        var stylePropertyValid = function(name,value){
                    //checking that the value is not a undefined
            return typeof value !== 'undefined' &&
                    //checking that the value is not a object
                    typeof value !== 'object' &&
                    //checking that the value is not a function
                    typeof value !== 'function' &&
                    //checking that we dosent have empty string
                    value.length > 0 &&
                    //checking that the property is not int index ( happens on some browser
                    value != parseInt(value)

        };
	    //we iterating the computed style object and compy the style props and the values
	    for(property in computed_style_object)
	    {
	        //checking if the property and value we get are valid sinse browser have different implementations
	            if(stylePropertyValid(property,computed_style_object[property]))
	            {
	                //applying the style property to the target element
	                    to.style[property] = computed_style_object[property];
	            }
	    }
	}



	/* ------------------------------------------------------------------------------------------
	Animate Anchors
	------------------------------------------------------------------------------------------ */
	$('a[href*="#"]:not([href="#"])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html, body').animate({
	          scrollTop: target.offset().top
	        }, 500);
	        return false;
	      }
	    }
	  });
	// browser window scroll (in pixels) after which the "back to top" link is shown
	var offset = 300,
		//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offset_opacity = 1200,
		//duration of the top scrolling animation (in ms)
		scroll_top_duration = 700,
		//grab the "back to top" link
		$back_to_top = $('.cd-top');

	//hide or show the "back to top" link
	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) {
			$back_to_top.addClass('cd-fade-out');
		}
	});

	//smooth scroll to top
	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		 	}, scroll_top_duration
		);
	});
	jQuery(document).bind('gform_confirmation_loaded', function(event, formId) {
		var reveal = $("#gform_confirmation_wrapper_"+formId).parents('.reveal');
		$(reveal).trigger('resize');
	});
})(jQuery);
