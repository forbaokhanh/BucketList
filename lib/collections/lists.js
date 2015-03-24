Lists = new Mongo.Collection('lists');

validateList = function(list) {
	var errors = {};
	// *** YOUR CODE HERE ***
	// check to see if all items on the bucket list are added


	return errors;
}

Lists.allow({
	update: function(userID, list) { return ownsDocument(userID, list); },
	remove: function(userID, list) { return ownsDocument(userID, list); },
});

Lists.deny({
	update: function(userID, list, fieldNames, modifier) {
		var errors = validateList(modifier.$set);
		// *** YOUR CODE HERE ***
		return errors.blahblah || errors.blahblah || .... // Finish this once you know how a list can be screwed up.
	}
})

Meteor.methods({
	listInsert: function(listAttributes) {
		check(Meteor.userId(), String);
		check(listAttributes, {
			title: String,
			items: // array of objects *** YOUR CODE HERE ***
		});

		var errors = validateList(listAttributes);
		// *** YOUR CODE HERE ***
		if (errors.blahblah || errors.blahblah) { // depending on what can go wron with the list
			throw new Meteor.Error('invalid-list', "You must set the correct list parameters");
		}
		// finding out what the current user is
		var user = Meteor.user();

		// *** DOES THIS WORK? ***
		var listSameTitleUser = Lists.findOne({tite: listAttributes.title, author: user.username}); // DOES THIS WORK?
		if (listSameTitleUser) {
			return {
				listExists: true,
				_id: listSameTitleUser._id
			}
		}

		var list = _.extend(listAttributes, {
			userID: user._id,
			author: user.username,
			submitted: new Date(),
			listItemsCount: 0,
			listItems: [],
			votes: 0,
			upvoters: [],
			type: 'standard' // can be standard or done. Every user has a done list
			// *** YOUR CODE HERE ***
			// any other additional attributes?
		});
		var listID = Lists.insert(list);
		return {
			_id: listID
		};
	},
	upvote: function(listID) {
		check(this.userID, String);
		check(listID, String);

		var affected = Lists.update({
			_id: listID,
			upvoters: {$ne: this.userID}
		}, {
			$addToSet: {upvoters: this.userID},
			$inc: {votes: 1}
		});
		if (! affected) {
			throw new Meteor.Error('invalid', "You weren't able to upvote that list");
		}
	}
});