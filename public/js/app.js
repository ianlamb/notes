// Diary Manager
// v1.0
// @ian_lamb
//
// TODO: Encapsualte this into an object.
//

var newNote, noteField, noteFieldVal, timeStamp, dateStamp, dateTimeStamp, noteData, now, todaysNotes, workingDate, isToday, animationDelay;

var hashtagExp = new RegExp(/\s#\S+\s/);
var noteToolbar = '<span class="note-toolbar"><i class="fa fa-star-o mark-important"></i><i class="fa fa-pencil edit"></i><i class="fa fa-times delete"></i></span>';

var diaryManager = {
	filters: [],
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

				newNote = '<li id="' + notes[i].id + '">' + noteToolbar + '<span class="timestamp">[' + timeStamp + ']</span> <span class="body">' + diaryManager.parseTags(notes[i].body) + '</span></li>';
				animationDelay = $('.note-history').length * 100;
				$('.note-history').last().append(newNote).delay(animationDelay).slideDown(250);
			}

			$('#newNote').focus();
		});
	},
	parseTags: function(textBody) {
		var parsedText = '';
		var postHashtag = false;
		var openTag = '<span class="tag-link">';
		var closeTag = '</span>';

		for(var i = 0; i < textBody.length; i++) {
			if(textBody[i] == '#') {
				if(postHashtag) {
					parsedText += closeTag;
				}
				parsedText += openTag;
				postHashtag = true;
			}
			if(postHashtag && (textBody[i] == ' ' || i == textBody.length)) {
				parsedText += closeTag;
				postHashtag = false;
			}
			parsedText += textBody[i];
		}

		return parsedText;
	},
	addFilter: function(tagName) {
		if($.inArray(tagName, diaryManager.filters) < 0) {
			diaryManager.filters.push(tagName);
			$('#filters').append('<li class="tag"><span class="name">' + tagName + '</span><span class="remove"><i class="fa fa-times"></i></span></li>');

			$('#diary ul li span.body').each(function() {
				if($(this).html().indexOf(tagName) >= 0)
					$(this).parent().addClass('filter-match');
			});

			diaryManager.applyFilters();
		}
	},
	removeFilter: function(tagName) {
		if($.inArray(tagName, diaryManager.filters) >= 0) {
			var idx = diaryManager.filters.indexOf(tagName);
			if(idx >= 0)
				diaryManager.filters.splice(idx, 1);

			$('#filters li').each(function() {
				if($(this).html().indexOf(tagName) >= 0)
					$(this).remove();
			});

			$('#diary ul li span.body').each(function() {
				if($(this).html().indexOf(tagName) >= 0)
					$(this).parent().removeClass('filter-match');
			});

			diaryManager.applyFilters();
		}
	},
	applyFilters: function() {
		$('#diary ul li').each(function() {
			if($(this).hasClass('filter-match') || diaryManager.filters.length == 0)
				$(this).slideDown();
			else
				$(this).slideUp();
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
				newNote = '<li id="' + result.id + '" style="display:none">' + noteToolbar + '<span class="timestamp">[' + timeStamp + ']</span> <span class="body">' + diaryManager.parseTags(noteFieldVal) + '</span></li>';

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

	// click the star to star/unstar them
	$('#diary').on('click', 'ul > li .note-toolbar .mark-important', function() {
		var noteItem = $(this).parent().parent();

		if(noteItem.hasClass('important')) {
			noteItem.removeClass('important');
			// ajax save here
		} else {
			noteItem.addClass('important');
			// ajax save here
		}
	});

	// click the pencil to edit note line
	$('#diary').on('click', 'ul li .note-toolbar .mark-important', function() {
		var noteItem = $(this).parent().parent();
		
		alert('Not Yet Implemented');
	});

	// click the 'x' to delete notes
	$('#diary').on('click', 'ul li .note-toolbar .delete', function() {
		var noteItem = $(this).parent().parent();

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

	// add filter
	$('#diary').on('click', 'ul li .tag-link', function() {
		var tag = $(this).html();
		diaryManager.addFilter(tag);
	});

	// remove filter
	$('#filters').on('click', 'li .remove', function() {
		var tag = $(this).parent().children('.name').html();
		diaryManager.removeFilter(tag);
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