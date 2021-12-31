jQuery(function($)
{
	 $('#sortBrand').bind('change', function () { // bind change event to select
		 console.log(url)
		  var url = $(this).val(); // get selected value

		  if (url != '') { // require a URL
				window.location = url; // redirect
		  }
		  return false;
	 });
})
