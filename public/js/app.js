// Diary Manager
// v1.0
// @ian_lamb
//
// TODO: Encapsualte this into an object.
//

var newNote, noteField, noteFieldVal, timeStamp, dateStamp, dateTimeStamp, noteData, now, todaysNotes, workingDate, isToday, animationDelay;

var diaryManager = {
	loadNotes: function() {
		workingDate = getDateStamp(new Date(0));
		$.get('/notes/all', '', function(notes) {
			$('#loading').hide();

			for(var i = 0; i < notes.length; i++) {
				dateTimeStamp = new Date(notes[i].timestamp + ' UTC');
				dateStamp = getDateStamp(dateTimeStamp);
				timeStamp = getTimeStamp(dateTimeStamp);

				if(workingDate != dateStamp) {
					workingDate = dateStamp;

					if(workingDate == getDateStamp(new Date()))
						isToday = true;
					else
						isToday = false;

					$('#diary').append('<label class="note-date">' + dateStamp + (isToday ? ' [Today]' : '') + '</label><ul class="note-history ' + (isToday ? 'today' : '') + '" style="display:none"></ul>');
				}

				newNote = '<li id="' + notes[i].id + '"><span class="timestamp">[' + timeStamp + ']</span> ' + notes[i].body + '<span class="mark-important">*</span><span class="delete">x</span></li>';
				animationDelay = $('.note-history').length * 100;
				$('.note-history').last().append(newNote).delay(animationDelay).slideDown(250);
			}

			$('#newNote').focus();
		});
	}
}

jQuery(document).ready(function ($) {

	// load notes
	diaryManager.loadNotes();

	// refocus the new note field any time a key is pressed
	$(document).on('keypress', null, '', function() {
		$('#newNote').focus();
	});

	// press enter to submit a new note line
	$('#newNote').on('keypress', null, 'return', function(){
		noteField = $(this);
		noteFieldVal = noteField.val();

		if(noteFieldVal == "")
			return false;

		// clean up the form now for responsiveness and user experience
		noteField.val('').focus();

		// create timestamp with proper zero padding
		now = new Date();
		timeStamp = getTimeStamp(now);
		dateStamp = getDateStamp(now);

		// create the data object
		noteData = 'body=' + noteFieldVal + '&timestamp=' + new Date().toUTCString(); // store timestamp in UTC

		// save the note
		$.ajax({
			url: '/notes/create',
			type: 'POST',
			data: noteData,
			success: function(result) {
				// display the note
				newNote = '<li id="' + result.id + '" style="display:none"><span class="timestamp">[' + timeStamp + ']</span> ' + noteFieldVal + '<span class="mark-important">*</span><span class="delete">x</span></li>';

				if(!$('.note-history').first().hasClass('today')) {
					$('#diary').prepend('<label class="note-date">' + dateStamp + ' [Today]</label><ul class="note-history today"></ul>');
				}
					
				todaysNotes = $('.note-history').first();

				todaysNotes.prepend(newNote).children().first().fadeIn(500);
			},
			error: function() {
				noteField.val(noteFieldVal); // restore their note to the input field
				alert('Save failed');
			}
		});
	});

	// click on note lines to star/unstar them
	$('#diary').on('click', 'ul > li > .mark-important', function() {
		if($(this).parent().hasClass('important')) {
			$(this).parent().removeClass('important');
			// ajax save here
		} else {
			$(this).parent().addClass('important');
			// ajax save here
		}
	});

	// click the 'x' to delete notes
	$('#diary').on('click', 'ul > li > .delete', function() {
		var noteItem = $(this).parent();

		// hide note now for responsiveness
		noteItem.fadeOut(500);

		$.ajax({
			url: '/notes/delete',
			type: 'POST',
			data: 'id=' + noteItem.attr('id'),
			success: function(result) {
				if(result.status == "success")
					noteItem.remove();
			},
			error: function() {
				noteItem.fadeIn(100);
				alert('Delete failed');
			}
		});
	});
});

Number.prototype.padLeft = function (n,str){
	return Array(n-String(this).length+1).join(str||'0')+this;
}

function getTimeStamp(dateObj) {
	return dateObj.getHours().padLeft(2) + ':' + dateObj.getMinutes().padLeft(2) + ':' + dateObj.getSeconds().padLeft(2);
}

function getDateStamp(dateObj) {
	return dateObj.getFullYear().padLeft(4) + '-' + (dateObj.getMonth()+1).padLeft(2) + '-' + dateObj.getDate().padLeft(2);
}