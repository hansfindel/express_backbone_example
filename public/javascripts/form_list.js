$(document).ready(function(){
	$("ul li").click(function(){
		var id = $(this).data("id");
		//console.log(id)
		$("#new_task_parent_tid").val(id);
	})	
})
