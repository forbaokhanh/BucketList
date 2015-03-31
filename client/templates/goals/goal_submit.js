Template.goalSubmit.created = function() {
  Session.set('goalSubmitErrors', {});
}
Template.goalSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('goalSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('goalSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.goalSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var goal = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    var errors = validategoal(goal);
    if (errors.title || errors.url)
      return Session.set('goalSubmitErrors', errors);
    
    Meteor.call('goalInsert', goal, function(error, result) { //Callback is the function(error, result)
    	// display the error to the user and abort
    	if (error) {
    		return throwError(error.reason);
    	}

      	// show this result but route anyway
    	if (result.goalExists) {
    		throwError('This link has already been goaled.');
    	}
    	
    	Router.go('goalPage', {_id:result._id});
    });
  }
});