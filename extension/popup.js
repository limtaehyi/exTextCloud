var tabcounter = 1;
document.addEventListener('DOMContentLoaded', (event) => {

	document.getElementById('saveTab').addEventListener('click', function(event) {
	  openTab(event, 'Savetab');
	});

	document.getElementById('loadTab').addEventListener('click', function(event) {
	  openTab(event, 'Loadtab');
	});

    document.querySelectorAll('[id^="buttontab"]').forEach(function(element) {
        element.addEventListener('click', function(event) {
            var tabName = element.id.substring('buttontab'.length);
            var appendname = "newtab"+tabName;
            openTab(event, appendname);
        });
    });


	document.getElementById('saveText').addEventListener('click', TextSave);
	document.getElementById('resetText').addEventListener('click', Reset);
	document.getElementById('loadText').addEventListener('click', TextLoad);
    document.getElementById('Newtab').addEventListener('click', Newtab);

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
            wrdelete_at: $('input[name="wrdelete_at"]:checked').val(),
            ldcode: $('#ldcode').val(),
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
            $('input[name="wrdelete_at"]').val(state.wrdelete_at);
            $('#ldcode').val(state.ldcode);
            $('#ldtext').val(state.ldtext);
            
            if (state.activeTab) 
            {
                document.getElementById(state.activeTab).click();
            }
        }
    });
});


function openTab(evt, cityName)
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

    if (wrtext.length < 7)
    {
        alert("최소 7글자는 넣어야합니다.");
        return;
    }
    else
    {
        $.ajax({
            url: 'http://127.0.0.1:5000/write/',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({'wrtext' : wrtext, 'wrpassword' : wrpassword, 'wrdelete_at' : wrdelete_at}),
            success: function(response) {
                var copyText = $('<p style="width:135px;">', { text: 'Load Code : ' });
                var messageText = $('<span>', { text: response.message, css: { color: 'blue', textDecoration: 'underline' } });
                copyText.append(messageText);
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
                $('#ldtext').val(response.message);
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

function Newtab() 
{
    var ldcode = $('#ldcode').val();
    var ldtext = $('#ldtext').val();

    var newTabButton = $("<button class=\"tablinks\" id=\"buttontab"+tabcounter+"\">"+ldcode+"</button>");

    newTabButton.on('click', function(event) {
        var tabName = this.id.substring('buttontab'.length);
        var appendname = "newtab" + tabName;
        openTab(event, appendname);
    });

    $('.tab').append(newTabButton);

    $('#contents').append("<div id=\"newtab"+tabcounter+"\" class=\"tabcontent\"><div style=\"width:300px;\" class=\"newwrap"+tabcounter+"\"><textarea rows=\"9\" cols=\"75\" id=\"newtext"+tabcounter+"\" class=\"form-control\" maxlength=\"3000\">"+ldtext+"</textarea><span id=\"newcounter"+tabcounter+"\" class=\"text-muted\">0/3000</span></div></div>");

    alert("새 탭에 복사되었습니다.");
    tabcounter = tabcounter + 1;
}
