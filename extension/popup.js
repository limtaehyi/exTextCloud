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
	    $('#wrcounter').html(text.length + '/3000');
	});

	$(document).on("keyup", "#ldtext", function(e) 
	{
	    var text = $(this).val();
	    $(this).height(((text.split('\n').length + 1) * 1.5) + 'em');
	    $('#ldcounter').html(text.length + '/3000');
	});

    window.addEventListener('blur', function() {
        var state = {
            wrtext: $('#wrtext').val(),
            wrpassword: $('#wrpassword').val(),
            wrdelete_at: $('input[name="wrdelete_at"]:checked').val(),
            ldcode: $('#ldcode').val(),
            ldpassword: $('#ldpassword').val(),
            ldtext: $('#ldtext').val(),
            activeTab: $('.tablinks.active').attr('id')
        };
        localStorage.setItem('state', JSON.stringify(state));
    });

    window.addEventListener('focus', function() 
    {
        var state = JSON.parse(localStorage.getItem('state'));
        if (state) 
        {
            $('#wrtext').val(state.wrtext);
            $('#wrpassword').val(state.wrpassword);
            $('input[name="wrdelete_at"]').val(state.wrdelete_at);
            $('#ldcode').val(state.ldcode);
            $('#ldpassword').val(state.ldpassword);
            $('#ldtext').val(state.ldtext);
            
            if (state.activeTab) 
            {
                document.getElementById(state.activeTab).click();
            }
        }
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
            var copyText = $('<p>', { text: 'Success!!! Load Code : ' + response.message });
            copyText.click(function() {
                window.navigator.clipboard.writeText(response.message).then(function() {
                    alert('복사되었습니다!!');
                });
            });
            $('#post_result').append(copyText);
        },

        error: function(error) {
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
    $('#wrcounter').html('0/3000');
}