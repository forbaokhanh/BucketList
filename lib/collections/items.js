Items = new Mongo.Collection('items');

validateItem = function(item) {
	var errors = {};
	// *** YOUR CODE HERE ***
	// check to see if all items on the bucket list are added


	return errors;
}

Items.allow({
	update: function(userID, item) { return ownsDocument(userID, item); },
	remove: function(userID, item) { return ownsDocument(userID, item); }
})

Items.deny({
	update: function(userID, item, fieldNames, modifier) {
		var errors = validateItem(modifier.$set);
		// *** YOUR CODE HERE ***
		return errors.blahblah || errors.blahblah || .... // Finish this once you know how an item can be screwed up.
	}
})

Meteor.methods({
	itemInsert: function(itemAttributes) {
		check(this.userID, String);
		check(itemAttributes, {
			title: String,
			// figure out which list you are adding to
			listID: String,
			// *** YOUR CODE HERE ***
			// OTHER ITEM ATTRIBUTES CHECK
		});

		var errors = validateItem(itemAttributes);
		// *** YOUR CODE HERE ***
		if (errors.blahblah || errors.blahblah) { // depending on what can go wrong with the item
			throw new Meteor.Error('invalid-item', "You must set the correct item parameters");
		}

		var user = Meteor.user();

		// *** IF IT ALREADY EXISTS ***
		var itemSameTitle = Items.findOne({title: itemAttributes.title});
		if (itemSameTitle) {
			return {
				itemExists: true,
				_id: itemSameTitle._id
			}
		}

		// *** IF DOES NOT EXIST YET ***
		var list = Lists.findOne(itemAttributes.listID);
		if (! list) {
			throw new Meteor.Error('invalid-item', "You must add an item to a list");
		}
		
		item = _.extend(itemAttributes, {
			userID: user._id,
			author: user.username,
			submitted: new Date(), 
			itemListsCount: 0,
			itemLists: [],
			votes: 0,
			upvoters: [],
			// *** YOUR CODE HERE ***
			// OTHER ITEM ATTRIBUTES TO FILL???
		});

		var itemID = Items.insert(item);
		return {
			_id: itemID
		}

		// *** UPDATE THE LIST ACCORDING TO NEW DATA ***
		Lists.update(item.listID, {
			$inc: {listItemsCount: 1},
			$addToSet: {listItems: this._id}
		});
	},

	// *** DOES THIS WORK? ***
	upvote: function(itemID) {
		check(this.userID, String);
		check(itemID, String);

		var affected = Items.update({
			_id: itemID,
			upvoters: {$ne: this.userID}
		}, {
			$addToSet: {upvoters: this.userID},
			$inc: {votes: 1}
		});
		if (! affected) {
			throw new Meteor.Error('invalid', "You weren't able to upvote that item");
		}
	}
})