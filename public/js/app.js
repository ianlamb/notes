/**************************************************************************/
/* ##### ##### ## ## ##### #   #  ####     ##  # ##### ##### #####  ####  */
/*   #   #     # # # #   # #   # #         ##  # #   #   #   #     #      */
/*   #   ###   # # # ##### #   #  ###      # # # #   #   #   ###    ###   */
/*   #   #     #   # #     #   #     #     #  ## #   #   #   #         #  */
/*   #   ##### #   # #     ##### ####      #   # #####   #   ##### ####   */
/**************************************************************************/
// @version	v1.0
// @author	Ian Lamb
// @brief	front-end functionality for tempus notes


/********************/
/* VAR DECLARATIONS */
/********************/

// constants
var hashtagExp = new RegExp(/\s#\S+\s/);
var noteToolbar = '<span class="note-toolbar"><i class="fa fa-star-o mark-important"></i><i class="fa fa-pencil edit"></i><i class="fa fa-times delete"></i></span>';

// static jquery elements
var noteField, modePrefix, diaryContainer, filterContainer, loadFlash; 

// miscellaneous
var newNote, noteFieldVal, timeStamp, dateStamp, dateTimeStamp, noteData, now, todaysNotes, workingDate, isToday, animationDelay;



/***********************/
/* DIARY MANAGER CLASS */
/***********************/
var diaryManager = {
	changeData: '', // used by updateNote to change specified values of note lines
	filters: [], // list of currently applied tag filters
	loadNotes: function() {
		workingDate = getDateStamp(new Date(0));
		$.get('/notes/all', '', function(notes) {
			loadFlash.hide();

			for(var i = 0; i < notes.length; i++) {
				dateTimeStamp = new Date(notes[i].timestamp + ' UTC');
				dateStamp = getDateStamp(dateTimeStamp);
				timeStamp = getTimeStamp(dateTimeStamp);

				if(workingDate != dateStamp) {
					workingDate = dateStamp;

					(workingDate == getDateStamp(new Date())) ? isToday=true : isToday=false;

					$('#diary').append('<label class="note-date">' + dateStamp + (isToday ? ' [Today]' : '') + '</label><ul class="note-history ' + (isToday ? 'today' : '') + '" style="display:none"></ul>');
				}

				newNote = '<li id="' + notes[i].id + '" class="note-item ' + (notes[i].important == 1 ? 'important' : '') + '">' + noteToolbar + '<span class="timestamp">[' + timeStamp + ']</span> <span class="body">' + diaryManager.parseTags(notes[i].body) + '</span></li>';
				animationDelay = $('.note-history').length * 100;
				$('.note-history').last().append(newNote).delay(animationDelay).slideDown(250);
			}

			diaryManager.newMode();
		});
	},
	newNote: function() {
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
				newNote = '<li id="' + result.id + '" class="note-item" style="display:none">' + noteToolbar + '<span class="timestamp">[' + timeStamp + ']</span> <span class="body">' + diaryManager.parseTags(noteFieldVal) + '</span></li>';

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
	},
	deleteNote: function(noteId) {
		var noteItem = $('#' + noteId);

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
	},
	updateNote: function() {
		var retVal, editingNote;

		if(noteField.data('mode') == 1) { // edit mode
			diaryManager.changeData = 'id=' + noteField.data('noteid') + '&body=' + noteField.val();
			editingNote = $('#' + noteField.data('noteid'));
		}

		if(diaryManager.changeData.indexOf('id') < 0)
			throw "Must supply note id to update";

		$.ajax({
			url: '/notes/update',
			type: 'POST',
			data: diaryManager.changeData,
			success: function(result) {
				retVal = result;

				if(noteField.data('mode') == 1) { // edit mode
					editingNote.children('.body').html(diaryManager.parseTags(noteField.val())).removeClass('edit-context');
					diaryManager.newMode();
				}
			},
			error: function() {
				alert('Update failed');
			}
		});

		changeData = '';

		return retVal;
	},
	newMode: function() {
		modePrefix.html('New');
		noteField.data('mode', 0).focus();
		noteField.data('noteid', '');
		noteField.val('');

		// remove highlighting
		$('#diary ul li.edit-context').removeClass('edit-context');
	},
	editMode: function(noteId) {
		var editingNote = $('#' + noteId);
		modePrefix.html('Edit');
		noteField.data('mode', 1).focus();
		noteField.data('noteid', noteId);
		noteField.val(editingNote.children('.body').text());

		// highlight note line
		$('#diary ul li.edit-context').removeClass('edit-context');
		editingNote.addClass('edit-context');
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
		$('#diary ul').show();
		
		$('#diary ul li').each(function() {
			if($(this).hasClass('filter-match') || diaryManager.filters.length == 0)
				$(this).slideDown(300);
			else
				$(this).slideUp(300);
		});

		window.setTimeout('diaryManager.toggleDayVisibility()', 310);
	},
	toggleDayVisibility: function() {
		$('#diary ul').each(function() {
			if($(this).children().is(':visible'))
				$(this).slideDown(100).prev('.note-date').slideDown(100);
			else
				$(this).slideUp(100).prev('.note-date').slideUp(100);
		});
	}
}

jQuery(document).ready(function ($) {
	// static element preselectors
	modePrefix = $('#modePrefix');
	noteField = $('#noteField');
	diaryContainer = $('#diary');
	filterContainer = $('#filters');
	loadFlash = $('#loading');

	// initialize
	diaryManager.loadNotes();


	/******************/
	/* EVENT HANDLERS */
	/******************/

	// refocus the new note field any time a key is pressed
	$(document).on('keypress', null, '', function() {
		noteField.focus();
	});

	// press enter to submit a new note line
	noteField.on('keypress', null, 'return', function(){
		switch(noteField.data('mode')) {
			case 0:
				diaryManager.newNote();
				break;
			case 1:
				diaryManager.updateNote();
				break;
			default:
				throw "Error retrieving mode from note field.";
		}
	});

	// click the star to star/unstar them
	diaryContainer.on('click', 'ul > li .note-toolbar .mark-important', function() {
		var noteItem = $(this).parent().parent();
		var updateResult;
		if(noteItem.hasClass('important')) {
			diaryManager.changeData = 'id=' + noteItem.attr('id') + '&important=0';
			updateResult = diaryManager.updateNote();
			noteItem.removeClass('important');
		} else {
			diaryManager.changeData = 'id=' + noteItem.attr('id') + '&important=1';
			updateResult = diaryManager.updateNote();
			noteItem.addClass('important');
		}
	});

	// click the pencil to edit note line
	diaryContainer.on('click', 'ul li .note-toolbar .edit', function() {
		var noteItem = $(this).parent().parent();
		diaryManager.editMode(noteItem.attr('id'));
	});

	// click the 'x' to delete notes
	diaryContainer.on('click', 'ul li .note-toolbar .delete', function() {
		var noteItem = $(this).parent().parent();
		diaryManager.deleteNote(noteItem.attr('id'));
	});

	// add filter
	diaryContainer.on('click', 'ul li .tag-link', function() {
		var tag = $(this).html();
		diaryManager.addFilter(tag);
	});

	// remove filter
	filterContainer.on('click', 'li .remove', function() {
		var tag = $(this).parent().children('.name').html();
		diaryManager.removeFilter(tag);
	});
});



/********************/
/* HELPER FUNCTIONS */
/********************/

Number.prototype.padLeft = function (n,str){
	return Array(n-String(this).length+1).join(str||'0')+this;
}

function getTimeStamp(dateObj) {
	return dateObj.getHours().padLeft(2) + ':' + dateObj.getMinutes().padLeft(2) + ':' + dateObj.getSeconds().padLeft(2);
}

function getDateStamp(dateObj) {
	return dateObj.getFullYear().padLeft(4) + '-' + (dateObj.getMonth()+1).padLeft(2) + '-' + dateObj.getDate().padLeft(2);
}