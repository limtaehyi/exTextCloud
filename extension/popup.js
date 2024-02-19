document.addEventListener('DOMContentLoaded', (event) => {
	document.getElementById('saveTab').addEventListener('click', function(event) {
	  openCity(event, 'Save');
	});

	document.getElementById('loadTab').addEventListener('click', function(event) {
	  openCity(event, 'Load');
	});

	document.getElementById('saveText').addEventListener('click', TextSave);
	document.getElementById('resetText').addEventListener('click', Reset);
	document.getElementById('loadText').addEventListener('click', TextLoad);

	$(document).on("keyup", "#wrtext", function(e) 
	{
	    var text = $(this).val();
	    $(this).height(((text.split('\n').length + 1) * 1.5) + 'em');
	    $('#wrcounter').html(text.length + '/500');
	});

	$(document).on("keyup", "#ldtext", function(e) 
	{
	    var text = $(this).val();
	    $(this).height(((text.split('\n').length + 1) * 1.5) + 'em');
	    $('#ldcounter').html(text.length + '/500');
	});
});

function openCity(evt, cityName) 
{
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) 
    {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) 
    {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}


function TextSave()
{
    var wrtext = $('#wrtext').val();
    var wrpassword = $('#wrpassword').val();
    var wrdelete_at = $('input[name="wrdelete_at"]:checked').val();

    $.ajax({
        url: 'http://127.0.0.1:5000/write/',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({'wrtext' : wrtext, 'wrpassword' : wrpassword, 'wrdelete_at' : wrdelete_at}),
        success: function(response) {
            $('#post_result').append('<p>Success!!! Load Code : <a href="#" onclick="window.navigator.clipboard.writeText(\'' + response.message + '\').then(() => {alert(\'복사되었습니다!!\');}); return false;">' + response.message + '</a></p>');
        },

        error: function(error) {
            alert(2);
            console.log(error);
        }
    });
}

function TextLoad()
{
    var ldcode = $('#ldcode').val();
    var ldpassword = $('#ldpassword').val();
    $.ajax({
        url: 'http://127.0.0.1:5000/load/',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({'ldcode' : ldcode, 'ldpassword' : ldpassword}),
        success: function(response) {
            if(response.status == 'error')
            {
                alert(response.message)
            }
            else if(response.status == 'success')
            {
                $('#ldtext').html(response.message);
            }
        },
        error: function(error) {
            alert(2);
            console.log(error);
        }
    });
}

function Reset()
{
    $('#wrtext').val('');
    $('#wrcounter').html('0/500');
}