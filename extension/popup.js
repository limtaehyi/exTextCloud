let lastEvent = null;
document.addEventListener('DOMContentLoaded', (event) => {

	document.getElementById('saveTab').addEventListener('click', function(event) {
	  openTab(event, 'Savetab');
	});

	document.getElementById('loadTab').addEventListener('click', function(event) {
	  openTab(event, 'Loadtab');
	});

    $(document).on('click', '[id^="buttontab"]', function(event) {
        var tabName = this.id.substring('buttontab'.length);
        var appendname = "newtab" + tabName;
        openTab(event, appendname);
    });

    $(document).on('mouseenter', '[id^="buttontab"]', function() {
        $(this).find(".close").show();
    }).on('mouseleave', '[id^="buttontab"]', function() {
        $(this).find(".close").hide();
    });

    $(document).on('click', '[id^="deltab"]', function(event) {
        var Delnum = this.id.substring('deltab'.length);
        deletetab(Delnum);
    });

    $(document).on('mouseenter', '[id^="deltab"]', function() {
        $(this).css('color', 'red'); 
    }).on('mouseleave', '[id^="deltab"]', function() {
        $(this).css('color', ''); 
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

    window.addEventListener('blur', function() 
    {
        if(lastEvent !== 'blur')
        {
            var state = {
                wrtext: $('#wrtext').val(),
                wrdelete_at: $('input[name="wrdelete_at"]:checked').val(),
                ldcode: $('#ldcode').val(),
                ldtext: $('#ldtext').val(),
                activeTab: $('.tablinks.active').attr('id')
            };
            localStorage.setItem('state', JSON.stringify(state));

            var keys = Object.keys(localStorage);
            for(var i = 0; i < keys.length; i++) 
            { 
                var key = keys[i];
                
                if(key.startsWith('newtab')) 
                {
                    var tabId = key.replace('newtab', '');
                    var value = JSON.parse(localStorage.getItem(key));
                    
                    if(value.hasOwnProperty('newtext')) {
                        if( $('#newtext'+tabId).val() )
                        {
                            value.newtext = $('#newtext'+tabId).val();
                            localStorage.setItem(key, JSON.stringify(value));
                        }  
                    }
                }
            }


            lastEvent = 'blur';
        }
    });

    window.addEventListener('focus', function() 
    {
        if(lastEvent !== 'focus')
        {
            var state = JSON.parse(localStorage.getItem('state'));

            var keys = Object.keys(localStorage); 
            for(var i = 0; i < keys.length; i++) { 
                var key = keys[i];
                
                if(key.startsWith('newtab')) {
                    var tabId = key.replace('newtab', '');
                    if(!document.getElementById('newtab'+tabId)) {
                        var newTabData = JSON.parse(localStorage.getItem(key)); 

                        $('.tab').append("<button class='tablinks' style='position:relative; width:80px; padding-bottom:8px; padding-top:10px; margin-top:10px;' id='buttontab"+tabId+"'>" + newTabData.buttontab + "<span id='deltab"+tabId+"' class='close' style='position: absolute;top: 0;right: 0;padding: 0 5px;cursor: pointer; display:none;'>&times;</span></button>");
                        $('#contents').append("<div id='newtab" + tabId + "' class='tabcontent'><div style='width:300px;' class='newwrap" + tabId + "'><textarea rows='9' cols='75' id='newtext" + tabId + "' class='form-control' maxlength='3000'>" + newTabData.newtext + "</textarea></div></div>");
                    }
                }

            }

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
            lastEvent = 'focus';
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

    if(document.getElementById(cityName))
    {
        document.getElementById(cityName).style.display = "block";
    }
    
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
            url: 'http://aps.or.kr:8056/write/',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({'wrtext' : wrtext, 'wrpassword' : wrpassword, 'wrdelete_at' : wrdelete_at}),
            success: function(response) {
                var copyText = $('<p>', { text: 'Load Code : ' });
                var messageText = $('<span>', { text: response.message, css: { color: 'blue', textDecoration: 'underline' } });
                copyText.append(messageText);
                messageText.click(function() {
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
        url: 'http://aps.or.kr:8056/load/',
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
    $('#wrpassword').val('');
    $('#wrcounter').html('0/3000');
}

function deletetab(number)
{
    $('#buttontab'+number).remove();
    $('#newtab'+number).remove();
    localStorage.removeItem("newtab"+number);
}

function Newtab() 
{
    var ldcode = $('#ldcode').val();
    var ldtext = $('#ldtext').val();

    let maxNumber = 0; 
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i); 

        if (key.startsWith('newtab')) { 
            let number = parseInt(key.replace('newtab', '')); 

            if (number > maxNumber) { 
                maxNumber = number; 
            }
        }
    }
    var tabcounter = maxNumber+1;

    var newTabButton = $("<button class='tablinks' style='position:relative; width:80px; padding-bottom:8px; padding-top:10px; margin-top:10px;' id='buttontab"+tabcounter+"'>"+ldcode+"<span id='deltab"+tabcounter+"' class='close' style='position: absolute;top: 0;right: 0;padding: 0 5px;cursor: pointer; display:none;'>&times;</span></button>");

    newTabButton.on('click', function(event) {
        var tabName = this.id.substring('buttontab'.length);
        var appendname = "newtab" + tabName;
        openTab(event, appendname);
    });

    var newtab = { buttontab:ldcode, newtext:ldtext };
    localStorage.setItem('newtab'+tabcounter, JSON.stringify(newtab));

    alert("현재 탭이 새 탭에 복사되었습니다.");
    tabcounter = tabcounter + 1;
}
