Goals = new Mongo.Collection('goals');

validateGoal = function(goal) {
	var errors = {};
	// *** YOUR CODE HERE ***
	if (!goal.title)
    	errors.title = "Please fill in a headline";
    if (!goal.notes)
    	errors.notes =  "Please add a few comments about your goal";
	return errors;
}

Goals.allow({
	update: function(userID, goal) { return ownsDocument(userID, goal); },
	remove: function(userID, goal) { return ownsDocument(userID, goal); }
})

Goals.deny({
	update: function(userID, goal, fieldNames, modifier) {
		var errors = validateGoal(modifier.$set);
		// *** YOUR CODE HERE ***
		return errors.notes || errors.title;
	}
})

Meteor.methods({
	goalInsert: function(goalAttributes) {
		check(this.userID, String);
		check(goalAttributes, {
			title: String,
			dueDate: Object,
			notes: String,
			url: String,
			completed: boolean
		});

		var errors = validateGoal(goalAttributes);
		// *** YOUR CODE HERE ***
		if (errors.notes || errors.title) { // depending on what can go wrong with the goal
			throw new Meteor.Error('invalid-goal', "You must set the correct goal parameters");
		}

		var user = Meteor.user();

		// *** IF IT ALREADY EXISTS ***
		var goalSameTitle = Goals.findOne({title: goalAttributes.title});
		if (goalSameTitle) {
			return {
				goalExists: true,
				_id: goalSameTitle._id
			}
		}

		// *** IF DOES NOT EXIST YET ***
		// var list = Lists.findOne(goalAttributes.listID);
		// if (! list) {
		// 	throw new Meteor.Error('invalid-goal', "You must add an goal to a list");
		// }
		
		goal = _.extend(goalAttributes, {
			userID: user._id,
			author: user.username,
			submitted: new Date(), 
			goalListsCount: 0,
			goalLists: [],
			votes: 0,
			upvoters: [],
			// *** YOUR CODE HERE ***
			// OTHER goal ATTRIBUTES TO FILL???
		});

		var goalID = Goals.insert(goal);
		return {
			_id: goalID
		}
	},

	// *** DOES THIS WORK? ***
	upvote: function(goalID) {
		check(this.userID, String);
		check(goalID, String);

		var affected = Goals.update({
			_id: goalID,
			upvoters: {$ne: this.userID}
		}, {
			$addToSet: {upvoters: this.userID},
			$inc: {votes: 1}
		});
		if (! affected) {
			throw new Meteor.Error('invalid', "You weren't able to upvote that goal");
		}
	}
})