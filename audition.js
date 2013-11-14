// AuditionText:
// A quick sketch of how auditioning of different variations of text fragments in your writing might look like.

jQuery.fn.nextOrFirst = function(selector){
  var next = this.next(selector);
  return (next.length) ? next : this.prevAll(selector).last();
}

function sanitizeInput(text){
  // remove HTML tags from input using a dummy div with DOM's built-in HTML removal
  return $('<div/>').html(text).text();
}

function renderAuditionText(textarea,delimiter)
{
  // Set default values for input textarea
  textarea = typeof textarea !== 'undefined' ? textarea : 'textarea#input';
  delimiter = typeof delimiter !== 'undefined' ? delimiter : '/';
  
  var text = sanitizeInput($(textarea).val());

  audition_array_input = text.match(/\{.*?\}/g);
  audition_array_output = audition_array_input;

  if (!audition_array_input)
  {
    modified_text = text;
  }

  else {
    for (i=0; i<audition_array_input.length; i++)
    {
      // Remove the { and } from the sentences.
      var a = audition_array_input[i].toString();
      a = a.substring(1, a.length - 1);

      // Split the different options by the / character.
      var audition_options = a.split(delimiter);

      // Convert this into an unordered list, and making the first option selected by default.
      for (j=0; j<audition_options.length; j++)
      {
        if (j==0) audition_options[j] = "<li class='selected'>" + audition_options[j] + "</li>";
        else audition_options[j] = "<li>" + audition_options[j] + "</li>";
      }
      audition_array_output[i] = "<span class='audition'><span class='text'></span><ul>" + audition_options.join('') + "</ul></span>";
    }

    var modified_text = text;
    while (audition_array_output.length > 0)
    {
      modified_text = modified_text.replace(/\{.*?\}/, audition_array_output[0]);
      audition_array_output.splice(0, 1);
    }
  }

  $('#output').html(modified_text);

}

function updateAudition()
{
  $('.audition .text').each(function( index ) {
    $(this).html($(this).parent().find('.selected').html());
  });
}

function addMouseEvents()
{
  $('.audition .text').hover(function() {
    $(this).css('cursor','pointer');
  }, function() {
    $(this).css('cursor','auto');
  });

  $('.audition .text').each(function( index ) {
    $(this).click(function() {
      var a = $(this).parent().find('.selected');
      $(a).nextOrFirst().addClass('selected');
      $(a).removeClass('selected');
      updateAudition();
    });
  });
}

$(document).ready(function () {
  renderAuditionText();
  updateAudition();
  addMouseEvents();

  $('#input').keyup(function () {
    renderAuditionText();
    updateAudition();
    addMouseEvents();
  })
});
