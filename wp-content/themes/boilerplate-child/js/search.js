jQuery(document).ready(function($) {
	$('#searchsubmit, #search_mob_submit').on('click',function(event) {
		var id = $(this).attr('id');
		//textbox values for both search forms -> desktop and mobile
		var text = id == 'searchsubmit' ? '#s' : '#mob_s';
		var search = $(text).val().trim();
		if (search != '') {
			return true;
		}
		else {
			$(text).val('');
			return false;
		}
	});
});
